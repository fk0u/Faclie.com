import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActiveClientState, ClientEmotionalState } from '@/types/client';
import { CLIENT_PERSONAS } from '@/features/clients/personas';

interface ClientState {
  clients: ActiveClientState[];
  activeClientId: string | null;
  initializeClients: () => void;
  selectClient: (clientId: string | null) => void;
  updateClientState: (clientId: string, state: Partial<ClientEmotionalState>) => void;
  updateClientMemory: (clientId: string, key: string, value: string | boolean | number) => void;
  updatePipelineStage: (clientId: string, stage: ActiveClientState['projectPipelineStage']) => void;
  adjustDifficulty: (clientId: string, difficulty: ActiveClientState['difficulty']) => void;
  resetClient: (clientId: string) => void;
  addCustomClient: (client: ActiveClientState) => void;
}

// Helper to calculate dynamic health score based on satisfaction, patience, and urgency
export const calculateHealthScore = (state: ClientEmotionalState): number => {
  const { satisfaction, patience, urgency } = state;
  // Urgency shouldn't completely destroy health but high urgency + low patience is bad
  const urgencyImpact = urgency > 80 ? (100 - patience) * 0.3 : 0;
  const score = (satisfaction * 0.6 + patience * 0.4) - urgencyImpact;
  return Math.max(0, Math.min(100, Math.round(score)));
};

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: [],
      activeClientId: null,

      initializeClients: () => {
        const existingClients = get().clients;
        if (existingClients.length > 0) return;

        const initialClients = CLIENT_PERSONAS.map((persona) => ({
          ...persona,
          currentState: { ...persona.initialState },
          healthScore: calculateHealthScore(persona.initialState),
          memory: {},
          projectPipelineStage: 'onboarding' as const,
        }));
        set({ clients: initialClients });
      },

      selectClient: (clientId) => {
        set({ activeClientId: clientId });
      },

      updateClientState: (clientId, partialState) => {
        set((state) => {
          const updatedClients = state.clients.map((client) => {
            if (client.id !== clientId) return client;

            const newState = {
              ...client.currentState,
              ...partialState,
            };

            // Keep bounds between 0 and 100
            newState.satisfaction = Math.max(0, Math.min(100, newState.satisfaction));
            newState.patience = Math.max(0, Math.min(100, newState.patience));
            newState.urgency = Math.max(0, Math.min(100, newState.urgency));

            // Determine activeMood based on updated state
            let activeMood: ClientEmotionalState['activeMood'] = 'neutral';
            if (newState.satisfaction > 85) activeMood = 'pleased';
            else if (newState.patience < 20) activeMood = 'furious';
            else if (newState.patience < 50) activeMood = 'annoyed';
            else if (newState.urgency > 85) activeMood = 'anxious';

            newState.activeMood = activeMood;

            return {
              ...client,
              currentState: newState,
              healthScore: calculateHealthScore(newState),
            };
          });
          return { clients: updatedClients };
        });
      },

      updateClientMemory: (clientId, key, value) => {
        set((state) => {
          const updatedClients = state.clients.map((client) => {
            if (client.id !== clientId) return client;
            return {
              ...client,
              memory: {
                ...client.memory,
                [key]: value,
              },
            };
          });
          return { clients: updatedClients };
        });
      },

      updatePipelineStage: (clientId, stage) => {
        set((state) => {
          const updatedClients = state.clients.map((client) => {
            if (client.id !== clientId) return client;
            return {
              ...client,
              projectPipelineStage: stage,
            };
          });
          return { clients: updatedClients };
        });
      },

      adjustDifficulty: (clientId, difficulty) => {
        set((state) => {
          const updatedClients = state.clients.map((client) => {
            if (client.id !== clientId) return client;

            // Modify client traits based on difficulty level
            const originalPersona = CLIENT_PERSONAS.find((p) => p.id === clientId) || client;
            const updatedTraits = { ...originalPersona.traits };

            if (difficulty === 'easy') {
              updatedTraits.agreeableness = Math.min(100, updatedTraits.agreeableness + 20);
              updatedTraits.neuroticism = Math.max(0, updatedTraits.neuroticism - 20);
            } else if (difficulty === 'hard') {
              updatedTraits.agreeableness = Math.max(0, updatedTraits.agreeableness - 15);
              updatedTraits.neuroticism = Math.min(100, updatedTraits.neuroticism + 15);
            } else if (difficulty === 'nightmare') {
              updatedTraits.agreeableness = Math.max(0, updatedTraits.agreeableness - 30);
              updatedTraits.neuroticism = Math.min(100, updatedTraits.neuroticism + 30);
            }

            return {
              ...client,
              difficulty,
              traits: updatedTraits,
            };
          });
          return { clients: updatedClients };
        });
      },

      resetClient: (clientId) => {
        set((state) => {
          const originalPersona = CLIENT_PERSONAS.find((p) => p.id === clientId);
          if (!originalPersona) return state;

          const updatedClients = state.clients.map((client) => {
            if (client.id !== clientId) return client;
            return {
              ...originalPersona,
              currentState: { ...originalPersona.initialState },
              healthScore: calculateHealthScore(originalPersona.initialState),
              memory: {},
              projectPipelineStage: 'onboarding' as const,
            };
          });
          return { clients: updatedClients };
        });
      },

      addCustomClient: (newClient) => {
        set((state) => ({
          clients: [...state.clients, newClient],
        }));
      },
    }),
    {
      name: 'faclie-clients-store',
    }
  )
);
