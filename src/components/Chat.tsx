import { useState, useEffect, useRef, useCallback } from "react";
import type { Message } from "../types/chat";
import { flowConfig, type FlowData, type FlowOption } from "../data/flowConfig";
import { ChatHeader } from "./ChatHeader";
import { ChatBubble } from "./ChatBubble";
import { TextInput } from "./TextInput";

const createId = () => Math.random().toString(36).substring(2, 9);

const initialData: FlowData = {
  country: null,
  serviceType: null,
  bookingNumber: null,
  bookingName: null,
  issueDescription: null,
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [flowData, setFlowData] = useState<FlowData>(initialData);
  const [currentOptions, setCurrentOptions] = useState<FlowOption[]>([]);
  const [inputMode, setInputMode] = useState<string | null>(null);
  const [inputNextState, setInputNextState] = useState<string | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentOptions, scrollToBottom]);

  const addBotMessage = useCallback((content: string) => {
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        content,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        content,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const processState = useCallback(
    (stateName: string, data: FlowData) => {
      const node = flowConfig[stateName];
      if (!node) {
        console.error(`Unknown state: ${stateName}`);
        return;
      }

      // Clear previous options and input mode
      setCurrentOptions([]);
      setInputMode(null);
      setInputNextState(null);

      // Get message content
      const messageContent =
        typeof node.message === "function" ? node.message(data) : node.message;

      // Add bot message
      addBotMessage(messageContent);

      // Handle different node types
      if (node.endChat) {
        setChatEnded(true);
      } else if (node.options) {
        // Options can be static array or function
        const options =
          typeof node.options === "function" ? node.options(data) : node.options;
        setCurrentOptions(options);
      } else if (node.inputMode) {
        setInputMode(node.inputMode);
        setInputNextState(node.inputNextState || null);
      }
    },
    [addBotMessage]
  );

  // Initialize on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      processState("start", initialData);
    }
  }, [processState]);

  const handleOptionSelect = (option: FlowOption) => {
    // If option has external link, open it
    if (option.externalLink) {
      const link = option.externalLink(flowData);
      if (link) {
        window.open(link, "_blank");
      }
    }

    addUserMessage(option.label);
    setCurrentOptions([]);

    // Update flow data if needed
    let newData = { ...flowData };
    if (option.setData) {
      const { key, valueFromOption, staticValue } = option.setData;
      const value = valueFromOption ? option.value : staticValue;
      newData = { ...newData, [key]: value };
      setFlowData(newData);
    }

    // Transition to next state
    setTimeout(() => {
      processState(option.nextState, newData);
    }, 100);
  };

  const handleTextInput = (value: string) => {
    addUserMessage(value);

    // Update flow data based on input mode
    const newData = { ...flowData };
    if (inputMode === "booking_number") {
      newData.bookingNumber = value;
    } else if (inputMode === "booking_name") {
      newData.bookingName = value;
    } else if (inputMode === "booking_issue") {
      newData.issueDescription = value;
    }
    setFlowData(newData);

    // Transition to next state
    if (inputNextState) {
      setTimeout(() => {
        processState(inputNextState, newData);
      }, 100);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setFlowData(initialData);
    setCurrentOptions([]);
    setInputMode(null);
    setInputNextState(null);
    setChatEnded(false);
    setTimeout(() => {
      processState("start", initialData);
    }, 100);
  };

  return (
    <div className="chat-container">
      <ChatHeader onRestart={handleRestart} showRestart={messages.length > 0} />

      <div className="messages-container">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* WhatsApp-style interactive list buttons */}
        {currentOptions.length > 0 && (
          <div className="interactive-buttons">
            {currentOptions.map((option) => (
              <button
                key={option.id}
                className={`interactive-btn${option.externalLink ? " interactive-btn--primary" : ""}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        {chatEnded ? (
          <button className="restart-full-btn" onClick={handleRestart}>
            Restart Chatbot
          </button>
        ) : inputMode ? (
          <TextInput
            placeholder={
              inputMode === "booking_number"
                ? "Enter booking number..."
                : inputMode === "booking_name"
                  ? "Enter name on booking..."
                  : "Describe your issue..."
            }
            onSubmit={handleTextInput}
          />
        ) : (
          <div className="input-placeholder">
            <span>Select an option above</span>
          </div>
        )}
      </div>
    </div>
  );
}
