import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession } from '@/types/chat';

interface ChatState {
  sessions: Record<string, ChatSession>;
  activeReplaySessionId: string | null;
  soundEnabled: boolean;
  addMessage: (clientId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  setTyping: (clientId: string, isTyping: boolean) => void;
  setScoreCard: (clientId: string, scoreCard: ChatSession['scoreCard']) => void;
  clearSession: (clientId: string) => void;
  setActiveReplaySession: (clientId: string | null) => void;
  toggleSound: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessions: {},
      activeReplaySessionId: null,
      soundEnabled: true,

      addMessage: (clientId, messageData) => {
        const id = Math.random().toString(36).substring(2, 9);
        const timestamp = new Date().toISOString();
        const newMessage: ChatMessage = {
          id,
          timestamp,
          ...messageData,
        };

        set((state) => {
          const session = state.sessions[clientId] || {
            clientId,
            messages: [],
            isTyping: false,
          };

          return {
            sessions: {
              ...state.sessions,
              [clientId]: {
                ...session,
                messages: [...session.messages, newMessage],
              },
            },
          };
        });

        return newMessage;
      },

      setTyping: (clientId, isTyping) => {
        set((state) => {
          const session = state.sessions[clientId] || {
            clientId,
            messages: [],
            isTyping: false,
          };
          return {
            sessions: {
              ...state.sessions,
              [clientId]: {
                ...session,
                isTyping,
              },
            },
          };
        });
      },

      setScoreCard: (clientId, scoreCard) => {
        set((state) => {
          const session = state.sessions[clientId] || {
            clientId,
            messages: [],
            isTyping: false,
          };
          return {
            sessions: {
              ...state.sessions,
              [clientId]: {
                ...session,
                scoreCard,
              },
            },
          };
        });
      },

      clearSession: (clientId) => {
        set((state) => {
          const updatedSessions = { ...state.sessions };
          delete updatedSessions[clientId];
          return { sessions: updatedSessions };
        });
      },

      setActiveReplaySession: (clientId) => {
        set({ activeReplaySessionId: clientId });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
    }),
    {
      name: 'faclie-chat-store',
    }
  )
);
