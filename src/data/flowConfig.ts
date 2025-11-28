import type { Country, ServiceType } from "../types/chat";

export interface FlowOption {
  id: string;
  label: string;
  value: string;
  nextState: string;
  setData?: { key: string; valueFromOption?: boolean; staticValue?: string };
  externalLink?: (data: FlowData) => string;
}

export interface FlowNode {
  message: string | ((data: FlowData) => string);
  options?: FlowOption[] | ((data: FlowData) => FlowOption[]);
  inputMode?: string;
  inputNextState?: string;
  endChat?: boolean;
}

export interface FlowData {
  country: Country | null;
  serviceType: ServiceType | null;
  bookingNumber: string | null;
  bookingName: string | null;
  issueDescription: string | null;
}

export const generateBookingLink = (
  country: Country,
  serviceType: ServiceType,
): string => {
  return `https://example.com/book?utm_source=whatsapp&utm_medium=chat&utm_campaign=bt_support_bot&utm_content=${country.toLowerCase()}_${serviceType}`;
};

export const getPricingInfo = (serviceType: ServiceType): string => {
  const pricing: Record<ServiceType, string> = {
    same_day: `**Same-Day Delivery Pricing**

Starting from $29.99 per bag
- Express pickup within 2 hours
- Same-day delivery guaranteed
- Real-time tracking included
- Insurance up to $500`,
    short_term: `**Short-Term Storage Pricing**

Starting from $9.99 per bag/day
- Secure climate-controlled storage
- Flexible pickup and delivery times
- Perfect for trips up to 2 weeks
- Insurance up to $1,000`,
    long_term: `**Long-Term Storage Pricing**

Starting from $49.99 per bag/month
- Best value for extended storage
- 24/7 security monitoring
- Climate-controlled facility
- Insurance up to $2,500`,
  };
  return pricing[serviceType];
};

export const flowConfig: Record<string, FlowNode> = {
  start: {
    message:
      "Hi! This is BaggageTAXI support.\n\nI can help with prices, services, or existing bookings.\n\nWhere are you located?",
    options: [
      {
        id: "1",
        label: "UAE",
        value: "UAE",
        nextState: "main_menu",
        setData: { key: "country", valueFromOption: true },
      },
      {
        id: "2",
        label: "UK",
        value: "UK",
        nextState: "main_menu",
        setData: { key: "country", valueFromOption: true },
      },
      {
        id: "3",
        label: "US",
        value: "US",
        nextState: "main_menu",
        setData: { key: "country", valueFromOption: true },
      },
    ],
  },

  main_menu: {
    message: "What do you need help with today?",
    options: [
      {
        id: "1",
        label: "Prices & new booking",
        value: "prices",
        nextState: "prices_service",
      },
      {
        id: "2",
        label: "I already have a booking",
        value: "existing",
        nextState: "existing_booking_number",
      },
      {
        id: "3",
        label: "How BaggageTAXI works",
        value: "how_it_works",
        nextState: "how_it_works",
      },
    ],
  },

  prices_service: {
    message: "Which service are you interested in?",
    options: [
      {
        id: "1",
        label: "Same-day delivery",
        value: "same_day",
        nextState: "prices_info",
        setData: { key: "serviceType", valueFromOption: true },
      },
      {
        id: "2",
        label: "Short-term storage",
        value: "short_term",
        nextState: "prices_info",
        setData: { key: "serviceType", valueFromOption: true },
      },
      {
        id: "3",
        label: "Long-term storage",
        value: "long_term",
        nextState: "prices_info",
        setData: { key: "serviceType", valueFromOption: true },
      },
      {
        id: "4",
        label: "Back to main menu",
        value: "menu",
        nextState: "main_menu",
      }
    ],
  },

  prices_info: {
    message: (data) =>
      data.serviceType ? getPricingInfo(data.serviceType) : "",
    options: () => [
      {
        id: "1",
        label: "Book Now",
        value: "book",
        nextState: "prices_end",
        externalLink: (d) =>
          d.country && d.serviceType
            ? generateBookingLink(d.country, d.serviceType)
            : "",
      },
      {
        id: "2",
        label: "Back to main menu",
        value: "menu",
        nextState: "main_menu",
      },
      {
        id: "3",
        label: "End chat",
        value: "end",
        nextState: "end",
      },
    ],
  },

  prices_end: {
    message: "Anything else I can help you with?",
    options: [
      {
        id: "1",
        label: "Back to main menu",
        value: "menu",
        nextState: "main_menu",
      },
      { id: "2", label: "End chat", value: "end", nextState: "end" },
    ],
  },

  existing_booking_number: {
    message:
      "I can help with an existing booking. I'll need a few details.\n\nWhat is your order number?",
    inputMode: "booking_number",
    inputNextState: "existing_booking_name",
  },

  existing_booking_name: {
    message: "What name is the booking under?",
    inputMode: "booking_name",
    inputNextState: "existing_booking_issue",
  },

  existing_booking_issue: {
    message: "Please describe the issue you need help with.",
    inputMode: "booking_issue",
    inputNextState: "existing_booking_end",
  },

  existing_booking_end: {
    message: (data) =>
      `Thanks! I've noted your details:\n\nBooking: ${data.bookingNumber}\nName: ${data.bookingName}\nIssue: ${data.issueDescription}\n\nAn agent will join this chat shortly. This is the end of the simulation.`,
    endChat: true,
  },

  how_it_works: {
    message: (data) =>
      `Here's how BaggageTAXI works in ${data.country}:\n\n1. **We pick up your bags** from your location\n2. **We store or deliver** to your destination\n3. **You track everything** in real-time\n\nWhat would you like to know more about?`,
    options: [
      {
        id: "1",
        label: "Pickup & Delivery",
        value: "pickup",
        nextState: "how_it_works_pickup",
      },
      {
        id: "2",
        label: "Storage & Safety",
        value: "storage",
        nextState: "how_it_works_storage",
      },
      {
        id: "3",
        label: "Prices & Booking",
        value: "prices",
        nextState: "prices_service",
      },
      {
        id: "4",
        label: "Back to main menu",
        value: "menu",
        nextState: "main_menu",
      }
    ],
  },

  how_it_works_pickup: {
    message: `**Pickup & Delivery**

- We collect bags from hotels, airports, or any address
- Flexible time slots from 7AM to 10PM
- Contactless handoff available
- SMS updates at every step`,
    options: [
      {
        id: "1",
        label: "Back to main menu",
        value: "menu",
        nextState: "main_menu",
      },
      { id: "2", label: "End chat", value: "end", nextState: "end" },
    ],
  },

  how_it_works_storage: {
    message: `**Storage & Safety**

- Climate-controlled facilities
- 24/7 CCTV monitoring
- Full insurance coverage
- Tamper-proof seals on all items`,
    options: [
      {
        id: "1",
        label: "Back to main menu",
        value: "menu",
        nextState: "main_menu",
      },
      { id: "2", label: "End chat", value: "end", nextState: "end" },
    ],
  },

  end: {
    message: "Thank you for using BaggageTAXI support! Have a great day!",
    endChat: true,
  },
};
