---
config:
  theme: redux
  layout: fixed
  look: neo
---
flowchart TB
    A0(["Incoming WhatsApp Message"]) --> A1{"Active Support Session?"}
    A1 -- Yes --> A2["Send to Human / No Bot Replies"]
    A1 -- No --> B0["Opening Message: Select Country"]
    B0 --> B1{"Country?"}
    B1 -- UAE --> B1A["Set bt_country = UAE"]
    B1 -- UK --> B1B["Set bt_country = UK"]
    B1 -- US --> B1C["Set bt_country = US"]
    B1A --> C0["Main Menu"]
    B1B --> C0
    B1C --> C0
    C0 --> C1{"Choose Option"}
    C1 == "1. Prices &amp; New Booking" ==> D0["Ask Service Type"]
    C1 L_C1_E0_0@== "2. Existing Booking" ==> E0["Existing Booking Intro"]
    C1 == "3. How It Works" ==> F0["How It Works Overview"]
    C1 == "4. Airport Support" ==> G0["Airport Support Intro"]
    D0 --> D1{"Service?"}
    D1 -- "Same-day" --> D1A["Set bt_service_type = same_day"]
    D1 -- "Short-term" --> D1B["Set bt_service_type = short_term"]
    D1 -- "Long-term" --> D1C["Set bt_service_type = long_term"]
    D1A --> D2["Send Pricing Explainer"]
    D1B --> D2
    D1C --> D2
    D2 --> D3["Send Booking Link w/ UTM"]
    D3 --> D4{"Anything else?"}
    D4 -- Back to Menu --> C0
    D4 -- End --> Z0(["END"])
    E0 --> E1["Ask Order Number"]
    E1 --> E2["Ask Name on Booking"]
    E2 --> E3["Ask Issue Description"]
    E3 --> E4["Tag: bt_needs_agent"]
    E4 --> E5["Set bt_active_session = true"]
    E5 --> E6["Notify Support Team + Create Task"]
    E6 --> E7["Tell Customer Agent Will Join Chat"]
    E7 --> Z0
    F0 --> F1{"Pick Subtopic"}
    F1 -- Pickup & Delivery --> F1A["Send Pickup Info"]
    F1 -- Storage & Safety --> F1B["Send Storage Info"]
    F1 -- Prices & Booking --> F1C["Send Booking Link"]
    F1 -- Airport Support --> G0
    F1A --> F2{"Menu or End?"}
    F1B --> F2
    F1C --> F2
    F2 -- Back to Menu --> C0
    F2 -- End --> Z0
    G0 --> G1{"Airport Needs?"}
    G1 -- Arrange Delivery --> G1A["Tag bt_context = airport"]
    G1A --> D0
    G1 -- Existing Booking --> G1B["Route to Existing Booking"]
    G1B --> E0
    G1 -- See Prices & Book --> G1C["Airport Pricing + Link"]
    G1C --> D4

    style C0 fill:#2962FF,color:#FFFFFF
    style C1 fill:#2962FF,color:#FFFFFF
    linkStyle 11 stroke:#2962FF,fill:none
    linkStyle 12 stroke:#2962FF,fill:none
    linkStyle 13 stroke:#2962FF,fill:none
    linkStyle 14 stroke:#2962FF,fill:none

    L_C1_E0_0@{ animation: none }
