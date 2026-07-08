import { parseUserIntent } from './intentParser';
import { generateClientResponse } from './dialogTree';
import { useClientStore } from '@/store/useClientStore';
import { useChatStore } from '@/store/useChatStore';
import { useProjectStore } from '@/store/useProjectStore';
import { ActiveClientState } from '@/types/client';
import { audioService } from '@/utils/audioService';

export const handleUserMessage = async (clientId: string, text: string) => {
  const clientStore = useClientStore.getState();
  const chatStore = useChatStore.getState();
  const projectStore = useProjectStore.getState();

  const client = clientStore.clients.find((c) => c.id === clientId);
  if (!client) return;

  const brief = projectStore.briefs[clientId];

  // Sanitize user text input to prevent XSS / HTML injections
  const sanitizedText = text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  if (!sanitizedText) return;

  // 1. Detect user intent
  const intent = parseUserIntent(sanitizedText);

  // 2. Add user message to chat history
  chatStore.addMessage(clientId, {
    sender: 'user',
    text: sanitizedText,
    detectedIntent: intent,
  });

  if (chatStore.soundEnabled) {
    audioService.playClick();
  }

  // 3. Set typing state
  chatStore.setTyping(clientId, true);

  // Calculate typing delay based on response length and client traits
  const style = client.communicationStyle;
  const baseDelay = style.imperfections.averageResponseDelay;
  
  // Ghosting simulation check
  let isGhostingActive = false;
  
  // 4. Generate client response details
  let result;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        userIntent: intent,
        userMessage: sanitizedText,
        clientState: client,
        brief,
        history: chatStore.sessions[clientId]?.messages || []
      })
    });
    if (!response.ok) throw new Error('API request failed');
    result = await response.json();
  } catch (err) {
    console.warn('API error, falling back to offline dialogue tree:', err);
    result = generateClientResponse(clientId, intent, sanitizedText, client);
  }

  // Fallback guards
  if (!result || !result.reply) {
    result = generateClientResponse(clientId, intent, sanitizedText, client);
  }
  if (!result.emotionalShift) {
    result.emotionalShift = { satisfaction: 0, patience: 0, urgency: 0 };
  }

  if (result.reply.includes("GHOSTING SIMULATION")) {
    isGhostingActive = true;
  }

  // Adjust delay: if ghosting, make it very short so the system message pops,
  // otherwise scale with response text length
  const finalDelay = isGhostingActive ? 1000 : Math.max(1000, baseDelay + (result.reply.length * 12));

  // Run async response delivery
  setTimeout(() => {
    // Turn off typing indicator
    chatStore.setTyping(clientId, false);

    // If ghosting, we add a system notification and update client to 'ghosting' mood
    if (isGhostingActive) {
      chatStore.addMessage(clientId, {
        sender: 'system',
        text: 'Sistem: Klien tidak membalas selama beberapa hari. Coba kirim pesan lagi untuk menanyakan kabar.',
      });
      clientStore.updateClientState(clientId, { activeMood: 'ghosting', patience: Math.max(10, client.currentState.patience - 15) });
      clientStore.updateClientMemory(clientId, 'is_ghosting_active', true);
      clientStore.updateClientMemory(clientId, 'ghosted_triggered', true);
      return;
    }

    // Add client reply
    chatStore.addMessage(clientId, {
      sender: 'client',
      text: result.reply,
      isVoiceNote: Math.random() < style.imperfections.voiceNoteChance && client.currentState.activeMood === 'furious',
      voiceNoteDuration: Math.floor(Math.random() * 45) + 15, // 15-60 secs
      emotionalShift: {
        satisfactionChange: result.emotionalShift.satisfaction,
        patienceChange: result.emotionalShift.patience,
      },
    });

    if (chatStore.soundEnabled) {
      if (isGhostingActive) {
        audioService.playAlert();
      } else {
        audioService.playNotification();
      }
    }

    // 5. Update client state metrics
    clientStore.updateClientState(clientId, {
      satisfaction: client.currentState.satisfaction + result.emotionalShift.satisfaction,
      patience: client.currentState.patience + result.emotionalShift.patience,
      urgency: client.currentState.urgency + result.emotionalShift.urgency,
    });

    // 6. Update pipeline stage if it changed
    if (result.pipelineShift) {
      clientStore.updatePipelineStage(clientId, result.pipelineShift);
      projectStore.initializeProject(clientId, {
        name: client.name,
        company: client.company,
        difficulty: client.difficulty
      }); // Init project brief if shifting from onboarding
    }

    // 7. Save key memories
    if (result.memoryUpdates) {
      Object.entries(result.memoryUpdates).forEach(([key, val]) => {
        clientStore.updateClientMemory(clientId, key, val as string | boolean | number);
      });
    }

    // 8. Trigger risk indicators
    if (result.riskTriggered) {
      projectStore.triggerRiskIndicator(clientId, result.riskTriggered);
      if (chatStore.soundEnabled) {
        audioService.playAlert();
      }
    }

    // 9. Update Project Budget if creep was accepted
    if (result.memoryUpdates?.accepted_code_creep && brief) {
      projectStore.updateBriefBudget(clientId, brief.originalBudget + 500); // Charged extra budget!
    }

    // 10. Check if double-text triggers (imperfect texting)
    const doubleTextChance = style.imperfections.doubleTextChance;
    if (Math.random() < doubleTextChance && !result.pipelineShift && !isGhostingActive) {
      setTimeout(() => {
        chatStore.setTyping(clientId, true);
        setTimeout(() => {
          chatStore.setTyping(clientId, false);
          
          let doubleText = "Let me know when you can look into this.";
          if (clientId === 'linda_chen') {
            doubleText = "We really want to hit our targets this sprint! 😅";
          } else if (clientId === 'budi_hartono') {
            doubleText = "JANGAN LAMA-LAMA YA.";
          } else if (clientId === 'sarah_jenkins') {
            doubleText = "LFG! 🚀 Vibe check is key!";
          } else if (clientId === 'anton_wijaya') {
            doubleText = "CEPAT BRO!!! 🚨";
          }

          chatStore.addMessage(clientId, {
            sender: 'client',
            text: doubleText,
          });
        }, 1200);
      }, 1000);
    }

    // 11. Evaluate Scorecard if final completed stage reached
    const freshClient = useClientStore.getState().clients.find((c) => c.id === clientId);
    if (freshClient?.projectPipelineStage === 'completed') {
      const evaluation = evaluateFreelancerPerformance(clientId, freshClient);
      chatStore.setScoreCard(clientId, evaluation);
      if (chatStore.soundEnabled) {
        audioService.playSuccess();
      }
    }

  }, finalDelay);
};

// Custom grading script based on client state and memory keys
const evaluateFreelancerPerformance = (
  clientId: string,
  client: ActiveClientState
) => {
  let professionalism = 85;
  let scopeManagement = 75;
  let negotiationSkill = 70;
  let feedbackText = "";

  const memory = client.memory;

  if (clientId === 'linda_chen') {
    if (memory.denied_code_creep) {
      scopeManagement += 20;
      feedbackText += "Anda berhasil menolak 'scope creep' gratis untuk coding React. Ini melindungi waktu kerja Anda. ";
    } else if (memory.accepted_code_creep) {
      scopeManagement -= 20;
      feedbackText += "Anda menerima penambahan scope coding React secara cuma-cuma dari Linda. Hal ini merusak margin keuntungan proyek Anda. ";
    }
    if (memory.scope_creep_resisted) {
      scopeManagement += 10;
      feedbackText += "Anda menolak modifikasi popup sosial Linda, melatih negosiasi Anda. ";
    }
    if (client.currentState.satisfaction > 80) {
      professionalism += 10;
      feedbackText += "Linda sangat senang dengan hasil akhir desain Anda. ";
    }
  }

  if (clientId === 'budi_hartono') {
    if (memory.respected_boundaries) {
      negotiationSkill += 25;
      feedbackText += "Bagus! Anda menolak bekerja tanpa uang muka (DP). Ini menunjukkan ketegasan profesional. ";
    } else if (memory.easy_target) {
      negotiationSkill -= 25;
      feedbackText += "Anda setuju membuat draf gratis sebelum ada DP atau kontrak. Budi menganggap Anda target yang mudah ditekan. ";
    }
    if (memory.lost_payout_money) {
      negotiationSkill -= 15;
      feedbackText += "Anda menyerah pada ancaman diskon Budi dan memberikan potongan 15% pada invoice final. ";
    } else {
      negotiationSkill += 10;
      feedbackText += "Anda mempertahankan invoice penuh terhadap tuntutan diskon tidak beralasan dari Budi. ";
    }
  }

  if (clientId === 'sarah_jenkins') {
    if (memory.demanded_usdc) {
      negotiationSkill += 20;
      feedbackText += "Pilihan cerdas menuntut pembayaran USDC (stablecoin) daripada 100% token proyek yang tidak bernilai pasti. ";
    } else if (memory.accepted_token_gamble) {
      negotiationSkill -= 20;
      feedbackText += "Anda setuju dibayar 100% menggunakan token utilitas. Risiko sangat tinggi jika token tersebut tidak bernilai. ";
    }
    if (memory.resisted_pivot_creep) {
      scopeManagement += 15;
      feedbackText += "Anda menolak merombak 100% desain menjadi model 3D tanpa biaya tambahan. ";
    }
  }

  // Bounds
  professionalism = Math.max(20, Math.min(100, professionalism));
  scopeManagement = Math.max(20, Math.min(100, scopeManagement));
  negotiationSkill = Math.max(20, Math.min(100, negotiationSkill));
  const overallRating = Math.round((professionalism + scopeManagement + negotiationSkill) / 3);

  if (overallRating >= 85) {
    feedbackText += " Luar biasa! Anda memiliki ketegasan profesional yang sangat baik dan mampu memuaskan klien tanpa dieksploitasi.";
  } else if (overallRating >= 65) {
    feedbackText += " Cukup baik, namun Anda masih perlu memperketat batasan scope kerja dan menegosiasikan DP secara konsisten.";
  } else {
    feedbackText += " Anda terlalu mudah disetir oleh klien. Selalu buat kontrak, minta DP, dan tolak pekerjaan di luar kesepakatan awal tanpa biaya tambahan!";
  }

  return {
    professionalism,
    scopeManagement,
    negotiationSkill,
    overallRating,
    feedbackText,
  };
};
