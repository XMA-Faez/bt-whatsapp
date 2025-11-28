export type Country = "UAE" | "UK" | "US";
export type ServiceType = "same_day" | "short_term" | "long_term";

export interface ChatState {
  country: Country | null;
  serviceType: ServiceType | null;
  bookingNumber: string | null;
  bookingName: string | null;
  issueDescription: string | null;
}

export interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: Date;
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
}

export interface InputPrompt {
  id: string;
  label: string;
  placeholder: string;
}

export type ConversationNode =
  | { type: "message"; content: string; next: string }
  | { type: "choice"; content: string; options: QuickReply[]; handler: string }
  | {
      type: "input";
      content: string;
      inputConfig: InputPrompt;
      handler: string;
    }
  | { type: "end"; content: string };
