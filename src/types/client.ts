export interface BigFiveTraits {
  openness: number;         // 0 - 100
  conscientiousness: number; // 0 - 100
  extraversion: number;      // 0 - 100
  agreeableness: number;     // 0 - 100
  neuroticism: number;       // 0 - 100
}

export interface ClientEmotionalState {
  satisfaction: number; // 0 - 100
  patience: number;     // 0 - 100
  urgency: number;      // 0 - 100
  activeMood: 'neutral' | 'pleased' | 'anxious' | 'annoyed' | 'furious' | 'ghosting';
}

export interface ClientPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  bio: string;
  companyBackground: string;
  traits: BigFiveTraits;
  quirks: string[];
  redFlags: string[];
  hiddenAgendas: string[];
  communicationStyle: {
    baseTone: string;
    preferredLanguage: 'id' | 'en' | 'mixed';
    emojiFrequency: 'none' | 'low' | 'high';
    favoriteEmojis: string[];
    imperfections: {
      typoChance: number;       // 0 - 1
      doubleTextChance: number; // 0 - 1
      voiceNoteChance: number;  // 0 - 1
      averageResponseDelay: number; // in ms
    };
  };
  initialState: ClientEmotionalState;
}

export interface ActiveClientState extends ClientPersona {
  currentState: ClientEmotionalState;
  healthScore: number; // 0-100 calculated dynamically
  memory: Record<string, string | boolean | number>;
  projectPipelineStage: 'onboarding' | 'briefing' | 'negotiation' | 'execution' | 'feedback' | 'payment' | 'completed' | 'terminated';
}
