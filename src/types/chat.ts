export type MessageSender = 'user' | 'client' | 'system';

export type UserIntent =
  | 'greeting'
  | 'scope_creep_resistance' // "that is out of scope", "requires extra budget"
  | 'scope_creep_acceptance' // "sure I will add that for free"
  | 'price_negotiation'      // asking for deposit, raising prices, explaining fees
  | 'price_concession'       // discounting, lowering rates
  | 'urgency_handling'       // reassurance, adjusting timeline
  | 'submission'             // sending drafts/completed deliverables
  | 'compliment'             // "your company is great", "you are very nice"
  | 'criticism'              // "this is delay", "why is it like this"
  | 'question'               // asking details about requirements
  | 'confrontation'          // demanding payment, standing ground
  | 'unknown';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  detectedIntent?: UserIntent;
  emotionalShift?: {
    satisfactionChange: number;
    patienceChange: number;
  };
  isVoiceNote?: boolean;
  voiceNoteDuration?: number; // in seconds
}

export interface ChatSession {
  clientId: string;
  messages: ChatMessage[];
  isTyping: boolean;
  scoreCard?: {
    professionalism: number; // 0-100
    scopeManagement: number;  // 0-100
    negotiationSkill: number; // 0-100
    overallRating: number;    // 0-100
    feedbackText: string;
  };
}
