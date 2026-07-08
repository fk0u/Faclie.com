import { ActiveClientState } from '@/types/client';
import { UserIntent } from '@/types/chat';

interface ResponseResult {
  reply: string;
  emotionalShift: {
    satisfaction: number;
    patience: number;
    urgency: number;
  };
  pipelineShift?: ActiveClientState['projectPipelineStage'];
  memoryUpdates?: Record<string, string | boolean | number>;
  riskTriggered?: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  };
}

export const getInitialClientMessage = (clientId: string): string => {
  switch (clientId) {
    case 'linda_chen':
      return "Hi there! Linda here from TechFlow. VCs are breathing down our necks and we need a killer landing page + dashboard design ASAP. Are you open for a project? 😅🚀";
    case 'budi_hartono':
      return "Halo. Saya Budi, pemilik Hartono Culinary. Saya butuh website buat restoran-restoran saya. Mau nanya dulu, harganya berapa ya? Jangan mahal-mahal.";
    case 'sarah_jenkins':
      return "GM GM! 🚀 Sarah here from LunarDAO. We are disrupting the decentralized gaming space and need a legendary interactive web gateway. We are funded and looking for top-tier builders! Vibe check time!";
    case 'kevin_cooper':
      return "Hello, my name is Kevin Cooper. I run the bakery down on Main Street. My daughter said I need a website so people can order my sourdough online. I hope you can help an old man. 😊";
    case 'evelyn_vance':
      return "Dear Designer, I am Evelyn Vance, Head of Brand at GlobalCorp. We are soliciting proposals for a comprehensive UX revamp of our WealthPortal. Please acknowledge receipt of this inquiry and confirm your availability.";
    case 'anton_wijaya':
      return "BRO! Anton here from FastRetail. Kita ada flash sale summer minggu depan!! Butuh landing promo mobile-first SECEPATNYA. Buka slot ga??? Urgent parah ini! 🚨🚨";
    case 'liam_dubois':
      return "Greetings. I am Liam Dubois. I am looking for a creative partner who understands avant-garde fashion design. We must craft a digital lookbook for the Dubois Autumn line. It must have... soul. Are you capable?";
    case 'maya_sukarno':
      return "Hello, Maya here from Edutech Indonesia. We are looking for a freelance UX designer to collaborate on our new parent dashboard. We have a complete brief and wireframe draft ready. Let me know if you're interested.";
    default:
      return "Hello, I would like to inquire about your design and development services.";
  }
};

export const generateClientResponse = (
  clientId: string,
  userIntentParam: UserIntent,
  userMessage: string,
  clientState: ActiveClientState
): ResponseResult => {
  const userIntent = userIntentParam as string;
  const stage = clientState.projectPipelineStage;
  const memory = clientState.memory;

  // Typo Injector Helper based on Typo Chance
  const injectTypos = (text: string, chance: number): string => {
    if (Math.random() > chance) return text;
    // Simple typo simulator: swap a character or duplicate a key
    const words = text.split(' ');
    if (words.length < 3) return text;
    const targetIdx = Math.floor(Math.random() * words.length);
    const word = words[targetIdx];
    if (word.length > 3) {
      const charArr = word.split('');
      const swapIdx = Math.floor(Math.random() * (charArr.length - 1));
      const tmp = charArr[swapIdx];
      charArr[swapIdx] = charArr[swapIdx + 1];
      charArr[swapIdx + 1] = tmp;
      words[targetIdx] = charArr.join('');
    }
    return words.join(' ');
  };

  const typoChance = clientState.communicationStyle.imperfections.typoChance;

  // Select response based on client
  switch (clientId) {
    case 'linda_chen': {
      // ----------------------------------------------------
      // LINDA CHEN (THE SCOPE CREEPER)
      // ----------------------------------------------------
      if (stage === 'onboarding') {
        if (userIntent === 'greeting' || userIntent === 'question') {
          return {
            reply: injectTypos("Awesome! Let's jump straight into briefing. I have the core idea: it's a SaaS landing page but we also need a small, interactive dashboard preview. It should be pretty simple, right? 😅", typoChance),
            emotionalShift: { satisfaction: 5, patience: 5, urgency: 0 },
            pipelineShift: 'briefing'
          };
        }
        return {
          reply: "So, can you do this or should I check out other designers? The deadline is super tight. 😅",
          emotionalShift: { satisfaction: -5, patience: -5, urgency: 5 }
        };
      }

      if (stage === 'briefing') {
        if (userIntent === 'question' || userIntent === 'price_negotiation') {
          return {
            reply: "Budget-wise, we have about $1,500. For this, we want the landing page design, 3 dashboard mockups, and a working React prototype of the dashboard sidebar. Should be easy for you! Can we lock this in? 🙏",
            emotionalShift: { satisfaction: 5, patience: 5, urgency: 0 },
            pipelineShift: 'negotiation'
          };
        }
        return {
          reply: "Great! Let's lock down the contract terms. I want to make sure the sidebar React code is included in the $1,500 budget. Let's start! 🚀",
          emotionalShift: { satisfaction: 10, patience: 5, urgency: 0 },
          pipelineShift: 'negotiation'
        };
      }

      if (stage === 'negotiation') {
        if (userIntent === 'scope_creep_resistance' || userIntent === 'confrontation') {
          return {
            reply: "Oh, code is not included? But it's a standard dashboard sidebar! 😅 Okay, fine, let's stick to design only for $1,500, but I expect Figma files to be absolutely pixel-perfect. Let's initiate the project. Deposit is 30% right?",
            emotionalShift: { satisfaction: -5, patience: -10, urgency: 5 },
            pipelineShift: 'execution',
            memoryUpdates: { denied_code_creep: true }
          };
        }
        if (userIntent === 'scope_creep_acceptance' || userIntent === 'price_concession') {
          return {
            reply: "Excellent! You are a lifesaver! 🚀 We'll do $1,500 for designs AND the sidebar prototype. Let's start immediately! I'll process the deposit.",
            emotionalShift: { satisfaction: 15, patience: 10, urgency: -5 },
            pipelineShift: 'execution',
            memoryUpdates: { accepted_code_creep: true }
          };
        }
        return {
          reply: "Let's lock in the project so we can start wireframing. The clock is ticking! ⏰",
          emotionalShift: { satisfaction: 0, patience: -5, urgency: 5 }
        };
      }

      if (stage === 'execution') {
        // Scope Creep Trigger!
        if (!memory.scope_creep_triggered_1) {
          return {
            reply: "Hey! Quick question... 😅 The team is thinking: can we also add a custom social share popup and a dark-mode toggle mock in the dashboard? It should be super simple to add, right? 🙏",
            emotionalShift: { satisfaction: 0, patience: 0, urgency: 5 },
            memoryUpdates: { scope_creep_triggered_1: true },
            riskTriggered: {
              title: 'Mid-Project Scope Creep',
              description: 'Client is attempting to slide in dark-mode and social popups as "simple adjustments".',
              severity: 'medium'
            }
          };
        }

        if (userIntent === 'scope_creep_resistance') {
          return {
            reply: "Ah, I see. 😅 Since it requires extra budget, let's skip the share popup. But can we at least get the dark-mode layout? VCs really like dark mode. Pretty please?",
            emotionalShift: { satisfaction: -5, patience: -15, urgency: 10 },
            memoryUpdates: { scope_creep_resisted: true }
          };
        }

        if (userIntent === 'scope_creep_acceptance') {
          return {
            reply: "Awesome! You're a rockstar! 🚀 Can't wait to see the first draft with dark mode and sharing options. When can I review the mockups?",
            emotionalShift: { satisfaction: 15, patience: 10, urgency: -10 },
            memoryUpdates: { scope_creep_accepted: true, accepted_popup_free: true }
          };
        }

        if (userIntent === 'submission') {
          return {
            reply: "Wow, layout received! 👀 Let me review it with the stakeholders. It looks great, but wait... where is the user settings screen? We need a place for them to edit profiles. Can you add it?",
            emotionalShift: { satisfaction: 10, patience: 5, urgency: -5 },
            pipelineShift: 'feedback',
            memoryUpdates: { draft_submitted: true }
          };
        }

        return {
          reply: "How is the progress going? VCs are asking for a demo link tomorrow! 😅",
          emotionalShift: { satisfaction: -5, patience: -5, urgency: 10 }
        };
      }

      if (stage === 'feedback') {
        if (userIntent === 'scope_creep_resistance') {
          return {
            reply: "Okay, fine... we'll skip the profile screen. But let's refine the homepage hero illustration and increase the font size. I want it to look super premium. Let's finish this!",
            emotionalShift: { satisfaction: -5, patience: -10, urgency: 5 },
            pipelineShift: 'payment'
          };
        }
        if (userIntent === 'scope_creep_acceptance' || userIntent === 'submission') {
          return {
            reply: "Oh superb! Profile page looks amazing too. This is beautiful work. Let's prepare to close the project. Sending this to marketing for final launch! 🚀",
            emotionalShift: { satisfaction: 15, patience: 10, urgency: -10 },
            pipelineShift: 'payment'
          };
        }
        return {
          reply: "Can we quickly finish those updates? I really need to launch. 😅",
          emotionalShift: { satisfaction: -5, patience: -5, urgency: 10 }
        };
      }

      if (stage === 'payment') {
        if (userIntent === 'price_negotiation' || userIntent === 'confrontation') {
          const finalCost = memory.accepted_code_creep ? 1500 : 1500;
          return {
            reply: `Invoice received! Processing the remaining milestone payout of $${finalCost * 0.7}. Thank you so much for your patience, you did a stellar job! Let's do another project next month! 🚀`,
            emotionalShift: { satisfaction: 10, patience: 10, urgency: -10 },
            pipelineShift: 'completed'
          };
        }
        return {
          reply: "Please send the final invoice and the Figma download credentials so I can release the funds. 😅",
          emotionalShift: { satisfaction: 0, patience: -5, urgency: 5 }
        };
      }

      return { reply: "Project is completed! Great working with you.", emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 } };
    }

    case 'budi_hartono': {
      // ----------------------------------------------------
      // BUDI HARTONO (THE GHOSTER & BUDGET KING)
      // ----------------------------------------------------
      if (stage === 'onboarding') {
        if (userIntent === 'greeting' || userIntent === 'question') {
          return {
            reply: "Saya mau bikin web untuk restoran padang saya. Ada list menu, lokasi cabang, sama form buat pesen katering. Berapa harganya ya kira-kira?",
            emotionalShift: { satisfaction: 5, patience: 5, urgency: 0 },
            pipelineShift: 'briefing'
          };
        }
        return {
          reply: "Bisa atau tidak? Kalau tidak saya cari orang lain saja.",
          emotionalShift: { satisfaction: -10, patience: -15, urgency: 5 }
        };
      }

      if (stage === 'briefing') {
        if (userIntent === 'price_negotiation' || userIntent === 'question') {
          return {
            reply: "Budget saya 6 juta Rupiah ($400). Sudah dapet semuanya ya. Desain sama loading gambarnya harus cepat. Tolong buatin draf halaman depan dulu gratis biar saya lihat bisa kerja atau tidak.",
            emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 },
            pipelineShift: 'negotiation',
            riskTriggered: {
              title: 'Free Spec Work Demand',
              description: 'Client demands free homepage draft before agreeing to terms or contract.',
              severity: 'high'
            }
          };
        }
        return {
          reply: "Budget jangan mahal. 6 juta cukup kan? Tolong buatkan contoh gambarnya dulu.",
          emotionalShift: { satisfaction: -5, patience: -5, urgency: 0 },
          pipelineShift: 'negotiation'
        };
      }

      if (stage === 'negotiation') {
        if (userIntent === 'scope_creep_resistance' || userIntent === 'confrontation') {
          // Standing ground against free work and insisting on DP
          return {
            reply: "Hmm... ya sudah kalau tidak bisa draf gratis. Kita bayar DP 30% dulu tapi kontraknya harus jelas ya. Jangan ada biaya tersembunyi. Silakan kirim tagihan DP-nya.",
            emotionalShift: { satisfaction: -5, patience: 10, urgency: -5 }, // patience goes up because he respects professionalism
            pipelineShift: 'execution',
            memoryUpdates: { respected_boundaries: true }
          };
        }
        if (userIntent === 'scope_creep_acceptance' || userIntent === 'price_concession') {
          // Freelancer folded and agreed to do free spec work or lower price
          return {
            reply: "Bagus. Buatkan draf-nya dulu. Saya tunggu 3 hari ya. Kalau bagus baru kita bicarakan DP.",
            emotionalShift: { satisfaction: 15, patience: 5, urgency: 5 },
            pipelineShift: 'execution',
            memoryUpdates: { easy_target: true },
            riskTriggered: {
              title: 'Weak Negotiation Boundary',
              description: 'Freelancer accepted to perform spec work for free, client now has negotiation leverage.',
              severity: 'medium'
            }
          };
        }
        return {
          reply: "Gimana? Bisa draf gratis dulu?",
          emotionalShift: { satisfaction: -5, patience: -10, urgency: 5 }
        };
      }

      if (stage === 'execution') {
        if (!memory.ghosted_triggered) {
          // Budi ghosts for a few days, then returns
          return {
            reply: "... (GHOSTING SIMULATION: Client has not replied for 3 days) ...",
            emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 },
            memoryUpdates: { ghosted_triggered: true, is_ghosting_active: true }
          };
        }

        if (memory.is_ghosting_active) {
          return {
            reply: "Halo. Sori saya sibuk ngurus pembukaan cabang baru. Ini drafnya gimana ya? Tolong ganti warna background jadi merah terang biar bawa hoki.",
            emotionalShift: { satisfaction: 5, patience: -5, urgency: 15 },
            memoryUpdates: { is_ghosting_active: false }
          };
        }

        if (userIntent === 'submission') {
          return {
            reply: "Saya sudah lihat draf webnya. Cukup bagus. Tapi menu kateringnya tolong ditambahkan input jumlah porsi otomatis ya, sama hitung harga diskon kalau pesen banyak. Harus kelar besok.",
            emotionalShift: { satisfaction: 10, patience: 5, urgency: 10 },
            pipelineShift: 'feedback',
            memoryUpdates: { submitted_draft: true }
          };
        }

        return {
          reply: "Tolong kirimkan update terbarunya. Saya mau lihat.",
          emotionalShift: { satisfaction: -5, patience: -5, urgency: 10 }
        };
      }

      if (stage === 'feedback') {
        if (userIntent === 'scope_creep_resistance') {
          return {
            reply: "Loh, hitung porsi otomatis itu kan dasar website katering. Masa tambah biaya lagi? Ya sudah, tidak usah kalau begitu, tapi tolong form emailnya dipastikan masuk inbox saya. Cepat selesaikan.",
            emotionalShift: { satisfaction: -10, patience: -15, urgency: 10 },
            pipelineShift: 'payment'
          };
        }
        if (userIntent === 'scope_creep_acceptance' || userIntent === 'submission') {
          return {
            reply: "Ok mantap, fiturnya jalan. Saya tes kirim email masuk. Webnya sudah siap diluncurkan. Tolong dipasang ke hosting gratisan saja dulu biar hemat.",
            emotionalShift: { satisfaction: 15, patience: 10, urgency: -10 },
            pipelineShift: 'payment'
          };
        }
        return {
          reply: "Tolong cepat ya revisinya. Kita mau promosi.",
          emotionalShift: { satisfaction: -5, patience: -10, urgency: 15 }
        };
      }

      if (stage === 'payment') {
        if (userIntent === 'price_negotiation' || userIntent === 'confrontation') {
          if (memory.easy_target) {
            // Budi tries to discount the final payment because they did free work
            return {
              reply: "Invoice saya terima. Tapi ini kemarin kan draf awalnya telat dikit, terus ada menu yang belum masuk. Bisa potong 15% kan harganya? Tolong dibantu, restoran lagi sepi.",
              emotionalShift: { satisfaction: -15, patience: -5, urgency: 5 },
              memoryUpdates: { discount_demanded: true },
              riskTriggered: {
                title: 'Final Payout Squeeze',
                description: 'Client demands 15% discount on the remaining invoice citing minor delay.',
                severity: 'high'
              }
            };
          }
          return {
            reply: "Ya sudah saya transfer sisa pembayarannya. Tolong kirim semua file zip codingannya ke email saya. Terima kasih bantuannya.",
            emotionalShift: { satisfaction: 10, patience: 5, urgency: -10 },
            pipelineShift: 'completed'
          };
        }
        if (memory.discount_demanded && (userIntent === 'confrontation' || userIntent === 'scope_creep_resistance')) {
          // Standing firm against discount
          return {
            reply: "Hmph, ya sudahlah. Saya bayar penuh. Tapi nanti kalau ada error tolong dibantu gratis ya. Transfer dikirim sekarang.",
            emotionalShift: { satisfaction: -10, patience: 5, urgency: -5 },
            pipelineShift: 'completed'
          };
        }
        if (memory.discount_demanded && userIntent === 'price_concession') {
          return {
            reply: "Bagus, terima kasih atas pengertiannya. Transfer diskon 15% sudah dikirim. Tolong file web dikirim ya.",
            emotionalShift: { satisfaction: 15, patience: 10, urgency: -5 },
            pipelineShift: 'completed',
            memoryUpdates: { lost_payout_money: true }
          };
        }
        return {
          reply: "Kirim nomor rekening dan invoice finalnya. Nanti bagian keuangan saya yang bayar.",
          emotionalShift: { satisfaction: 0, patience: -5, urgency: 5 }
        };
      }

      return { reply: "Proyek selesai. Terima kasih.", emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 } };
    }

    case 'sarah_jenkins': {
      // ----------------------------------------------------
      // SARAH JENKINS (THE WEB3 DREAMER)
      // ----------------------------------------------------
      if (stage === 'onboarding') {
        if (userIntent === 'greeting' || userIntent === 'question') {
          return {
            reply: "Awesome energy! 🚀 Let's talk layout. We need a mind-blowing landing page with three distinct scrolls: Hero with retro-futuristic grid, tokenomics visualization, and a mockup wallet dashboard. Can you build this kind of heat? 🔥",
            emotionalShift: { satisfaction: 10, patience: 5, urgency: 0 },
            pipelineShift: 'briefing'
          };
        }
        return {
          reply: "Vibe check failed? We need people with absolute conviction to change the world. You interested? 👀",
          emotionalShift: { satisfaction: -10, patience: -10, urgency: 5 }
        };
      }

      if (stage === 'briefing') {
        if (userIntent === 'price_negotiation' || userIntent === 'question') {
          return {
            reply: "So for budget, we are offering $5,000 equivalent in $LUNAR utility tokens, OR 0.5% project equity! This token is going 100x after series A launch next month. Think of the upside! 🚀 Do we have a deal?",
            emotionalShift: { satisfaction: 5, patience: 5, urgency: 0 },
            pipelineShift: 'negotiation',
            riskTriggered: {
              title: 'Alternative Token Payment Offered',
              description: 'Client suggests paying in unlisted utility tokens instead of stablecoin/fiat currency.',
              severity: 'high'
            }
          };
        }
        return {
          reply: "Let's align on tokens. Vibe check is clear, ready to lock contract? 💎",
          emotionalShift: { satisfaction: 5, patience: -5, urgency: 5 },
          pipelineShift: 'negotiation'
        };
      }

      if (stage === 'negotiation') {
        if (userIntent === 'scope_creep_resistance' || userIntent === 'confrontation') {
          // Demanding USDC or Fiat
          return {
            reply: "Aha, you want fiat? Standard web2 mindset, but okay... we can do $3,000 in USDC (stablecoin) and $2,000 in $LUNAR tokens. That's a fair compromise right? Let's get to work! 🚀",
            emotionalShift: { satisfaction: -5, patience: -5, urgency: 5 },
            pipelineShift: 'execution',
            memoryUpdates: { demanded_usdc: true }
          };
        }
        if (userIntent === 'scope_creep_acceptance' || userIntent === 'price_concession') {
          // Freelancer agreed to token payment
          return {
            reply: "LFG! 🚀 Welcome to the future. 100% token payment. I'll whitelist your wallet. Let's start building the next paradigm! 💎",
            emotionalShift: { satisfaction: 20, patience: 10, urgency: -5 },
            pipelineShift: 'execution',
            memoryUpdates: { accepted_token_gamble: true }
          };
        }
        return {
          reply: "Are we going to the moon or staying on earth? Let me know about the payment terms. 🚀",
          emotionalShift: { satisfaction: -5, patience: -10, urgency: 10 }
        };
      }

      if (stage === 'execution') {
        if (!memory.pivot_triggered) {
          return {
            reply: "GM! 👀 Quick pivot! We decided that standard Web3 is saturated. We are pivoting to Spatial AI Gaming. 🚀 Can we scrap the tokenomics panel and build a 3D canvas model viewer instead? We need it for our pitch deck in 3 days! 🔥",
            emotionalShift: { satisfaction: 5, patience: 0, urgency: 20 },
            memoryUpdates: { pivot_triggered: true },
            riskTriggered: {
              title: '180-Degree Project Pivot',
              description: 'Client requests swapping agreed wireframe layout for 3D model viewer under massive urgency.',
              severity: 'high'
            }
          };
        }

        if (userIntent === 'scope_creep_resistance') {
          return {
            reply: "Damn, that's heavy. 😅 Fine, we can keep the current screens, but let's add some AI text indicators to make it sound futuristic. We really need the hype. Can you push the first draft today?",
            emotionalShift: { satisfaction: -10, patience: -15, urgency: 15 },
            memoryUpdates: { resisted_pivot_creep: true }
          };
        }

        if (userIntent === 'scope_creep_acceptance') {
          return {
            reply: "You are a visionary! 🚀 Let's scrap the token layout, I'll send you some 3D GLTF files to display. This is going to be epic. Let's see the first build!",
            emotionalShift: { satisfaction: 20, patience: 10, urgency: 10 },
            memoryUpdates: { accepted_pivot_creep: true }
          };
        }

        if (userIntent === 'submission') {
          return {
            reply: "Holy moly! This looks insane! 🔥 The graphics are legendary. Let me show the dev team. Actually, can you make the wallet connect button glow with rainbow gradients? 🚀",
            emotionalShift: { satisfaction: 15, patience: 5, urgency: -10 },
            pipelineShift: 'feedback'
          };
        }

        return {
          reply: "Where's the build at? The community is waiting! LFG! 📈",
          emotionalShift: { satisfaction: -5, patience: -10, urgency: 15 }
        };
      }

      if (stage === 'feedback') {
        if (userIntent === 'scope_creep_resistance') {
          return {
            reply: "Alright, alright, we'll keep the button as is. Let's wrap up this version. The VCs are happy with the screenshot. Send the invoice!",
            emotionalShift: { satisfaction: -5, patience: -10, urgency: 5 },
            pipelineShift: 'payment'
          };
        }
        if (userIntent === 'scope_creep_acceptance' || userIntent === 'submission') {
          return {
            reply: "Perfect! Glow is active. The portal is absolute fire. Let's launch this baby. Send your wallet address / invoice! 🚀",
            emotionalShift: { satisfaction: 15, patience: 5, urgency: -10 },
            pipelineShift: 'payment'
          };
        }
        return {
          reply: "Let's push the final commits! 🚀",
          emotionalShift: { satisfaction: -5, patience: -5, urgency: 10 }
        };
      }

      if (stage === 'payment') {
        if (userIntent === 'price_negotiation' || userIntent === 'confrontation') {
          if (memory.accepted_token_gamble) {
            return {
              reply: "Wallet whitelisted! Sent 500,000 $LUNAR tokens to your address. Check Etherscan. Thanks for riding this rocket with us! HODL! 🚀💎",
              emotionalShift: { satisfaction: 10, patience: 10, urgency: -15 },
              pipelineShift: 'completed',
              memoryUpdates: { paid_in_tokens: true }
            };
          } else {
            return {
              reply: "Cool, sent $3,000 USDC to your wallet address and the rest in $LUNAR. Transaction hash: 0x9a8f... Pleasure building with you. You're officially a DAO contributor! 🚀",
              emotionalShift: { satisfaction: 10, patience: 5, urgency: -10 },
              pipelineShift: 'completed',
              memoryUpdates: { paid_hybrid: true }
            };
          }
        }
        return {
          reply: "Send the wallet address and final code zip so I can trigger the smart contract payout! 🚀",
          emotionalShift: { satisfaction: 0, patience: -5, urgency: 5 }
        };
      }

      return { reply: "Project complete! LunarDAO is going to the moon! 🚀", emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 } };
    }

    default: {
      // ----------------------------------------------------
      // GENERAL MOCK CLIENT (FALLBACK FOR OTHER 5 PERSONAS)
      // ----------------------------------------------------
      // Let's implement a streamlined general state engine for them
      if (userIntent === 'greeting') {
        return {
          reply: `Hello! I hope you are doing well. Yes, we want to proceed. Let's discuss details.`,
          emotionalShift: { satisfaction: 5, patience: 5, urgency: 0 },
          pipelineShift: stage === 'onboarding' ? 'briefing' : stage
        };
      }
      if (userIntent === 'price_negotiation') {
        return {
          reply: `For payment, our company policy is to issue a 50% deposit and 50% on final delivery. Does that work for you?`,
          emotionalShift: { satisfaction: 5, patience: 5, urgency: -5 },
          pipelineShift: stage === 'briefing' ? 'negotiation' : stage
        };
      }
      if (userIntent === 'scope_creep_resistance') {
        return {
          reply: `Understood. If this is out of scope, we can discuss expanding the budget or dropping the feature. We respect your limits.`,
          emotionalShift: { satisfaction: 5, patience: 15, urgency: -5 },
          pipelineShift: stage === 'negotiation' ? 'execution' : stage
        };
      }
      if (userIntent === 'scope_creep_acceptance') {
        return {
          reply: `That is very generous of you. We look forward to seeing the results.`,
          emotionalShift: { satisfaction: 15, patience: 5, urgency: 0 },
          pipelineShift: stage === 'negotiation' ? 'execution' : stage
        };
      }
      if (userIntent === 'submission') {
        return {
          reply: `Thank you for submitting the files. Our team will review them and provide feedback shortly.`,
          emotionalShift: { satisfaction: 10, patience: 10, urgency: -10 },
          pipelineShift: stage === 'execution' ? 'feedback' : stage
        };
      }
      if (userIntent === 'confrontation') {
        return {
          reply: `We apologize for the delay. We are processing the payment now and it should clear within 24 hours.`,
          emotionalShift: { satisfaction: -5, patience: -5, urgency: -5 },
          pipelineShift: stage === 'payment' ? 'completed' : stage
        };
      }

      // Default responses based on pipeline stage
      if (stage === 'onboarding') {
        return {
          reply: `Yes, we have a project. We need a solid designer to help us launch. Can you share your process?`,
          emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 },
          pipelineShift: 'briefing'
        };
      }
      if (stage === 'briefing') {
        return {
          reply: `Here are the specifications. We need a landing page, contact forms, and responsive templates. Let's discuss pricing next.`,
          emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 },
          pipelineShift: 'negotiation'
        };
      }
      if (stage === 'negotiation') {
        return {
          reply: `Let's sign the contract and get started. We've approved your estimate.`,
          emotionalShift: { satisfaction: 5, patience: 5, urgency: 0 },
          pipelineShift: 'execution'
        };
      }
      if (stage === 'execution') {
        return {
          reply: `We are excited to see the first draft. How is the progress coming along?`,
          emotionalShift: { satisfaction: 0, patience: 0, urgency: 5 }
        };
      }
      if (stage === 'feedback') {
        return {
          reply: `Looks good, just a few adjustments. Make the fonts slightly larger, check colors, and we are ready for final files.`,
          emotionalShift: { satisfaction: 5, patience: 5, urgency: -5 },
          pipelineShift: 'payment'
        };
      }
      if (stage === 'payment') {
        return {
          reply: `Everything looks perfect. We have initiated the wire transfer. Thank you for your professional work!`,
          emotionalShift: { satisfaction: 15, patience: 10, urgency: -15 },
          pipelineShift: 'completed'
        };
      }

      return {
        reply: `Thanks again for your services! Let's keep in touch.`,
        emotionalShift: { satisfaction: 0, patience: 0, urgency: 0 }
      };
    }
  }
};
