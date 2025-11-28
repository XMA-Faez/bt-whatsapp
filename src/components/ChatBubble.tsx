import type { Message } from '../types/chat'

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.sender === 'bot'

  return (
    <div className={`chat-bubble-container ${isBot ? 'bot' : 'user'}`}>
      <div className={`chat-bubble ${isBot ? 'bot' : 'user'}`}>
        <div className="message-content">{message.content}</div>
        <div className="message-time">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
