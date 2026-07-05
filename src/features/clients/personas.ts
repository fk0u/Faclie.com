import { ClientPersona } from '@/types/client';

export const CLIENT_PERSONAS: ClientPersona[] = [
  {
    id: 'linda_chen',
    name: 'Linda Chen',
    role: 'Product Manager',
    company: 'TechFlow SaaS',
    avatarUrl: '/avatars/linda.svg',
    difficulty: 'medium',
    bio: 'Hyperactive startup PM who runs on cold brew and is constantly squeezed by VCs. She is friendly, but will try to expand project scope through casual "micro-adjustments" mid-sprint.',
    companyBackground: 'Seed-stage B2B SaaS startup building workflow management tools. Fast-paced, high pressure, prone to pivot.',
    traits: {
      openness: 80,
      conscientiousness: 40,
      extraversion: 85,
      agreeableness: 55,
      neuroticism: 75
    },
    quirks: [
      'Starts messages with "Quick question..." or "Just one tiny adjustment!"',
      'Assumes complex features (e.g. database setup) are "implicit" in a static mockup contract.',
      'Suggests complete redesigns based on Twitter trends she read at 1 AM.'
    ],
    redFlags: [
      'Refuses to write down or lock final requirements.',
      'Guilt-trips with "but we discussed this in our chat last week!"',
      'Expects weekend updates without paying rush rates.'
    ],
    hiddenAgendas: [
      'Wants to get a full web application designed and built for the price of a landing page template.'
    ],
    communicationStyle: {
      baseTone: 'Energetic, friendly but demanding, startup jargon heavy.',
      preferredLanguage: 'mixed', // English & Indonesian (Jaksel style)
      emojiFrequency: 'high',
      favoriteEmojis: ['😅', '🙏', '👍', '🚀', '✨'],
      imperfections: {
        typoChance: 0.15,
        doubleTextChance: 0.4,
        voiceNoteChance: 0.1,
        averageResponseDelay: 2500
      }
    },
    initialState: {
      satisfaction: 70,
      patience: 80,
      urgency: 75,
      activeMood: 'neutral'
    }
  },
  {
    id: 'budi_hartono',
    name: 'Budi Hartono',
    role: 'Owner',
    company: 'Hartono Culinary Group',
    avatarUrl: '/avatars/budi.svg',
    difficulty: 'hard',
    bio: 'Traditional F&B businessman who believes websites are simple brochures and should be extremely cheap. He is suspicious of modern agencies and hates paying deposits.',
    companyBackground: 'Local restaurant chain expanding to 10 locations. High cash flow but very conservative digital budget.',
    traits: {
      openness: 20,
      conscientiousness: 90,
      extraversion: 30,
      agreeableness: 35,
      neuroticism: 60
    },
    quirks: [
      'Disappears (ghosts) for 3 days, then messages at 11 PM demanding immediate changes.',
      'Constantly says "my cousin can build this website for $100".',
      'Communicates using short, fragmented sentences and all-caps for urgency.'
    ],
    redFlags: [
      'Demands "free sample homepage draft" before signing any contract.',
      'Claims payment is "being processed by finance" to delay milestones.',
      'Calls directly on WhatsApp out of hours instead of replying to written feedback.'
    ],
    hiddenAgendas: [
      'Looking for a designer to do all layout concepts for free, then pass the files to an in-house intern to code.'
    ],
    communicationStyle: {
      baseTone: 'Formal, curt, skeptical, authoritative.',
      preferredLanguage: 'id',
      emojiFrequency: 'none',
      favoriteEmojis: [],
      imperfections: {
        typoChance: 0.25,
        doubleTextChance: 0.1,
        voiceNoteChance: 0.6,
        averageResponseDelay: 6000
      }
    },
    initialState: {
      satisfaction: 50,
      patience: 60,
      urgency: 50,
      activeMood: 'neutral'
    }
  },
  {
    id: 'sarah_jenkins',
    name: 'Sarah Jenkins',
    role: 'Co-Founder',
    company: 'LunarDAO',
    avatarUrl: '/avatars/sarah.svg',
    difficulty: 'nightmare',
    bio: 'Venture-backed Web3/AI project founder. She is extremely hyped about "changing the world" but has an attention span of a goldfish. She wants to pivot the design direction every week.',
    companyBackground: 'Crypto/AI gaming platform. Raising series A, high budget but extremely chaotic management structure.',
    traits: {
      openness: 98,
      conscientiousness: 15,
      extraversion: 90,
      agreeableness: 70,
      neuroticism: 80
    },
    quirks: [
      'Offers to pay in custom utility tokens ($LUNAR) or future equity instead of cash.',
      'Demands 3D scroll-animations, VR setups, and AI chatbots on a simple blog page.',
      'Sends messages like "LFG!" or "GM GM" and schedules brainstorming sessions at 2 AM.'
    ],
    redFlags: [
      'Avoids signing contracts with real-name details.',
      'Changes the primary product definition entirely mid-way through styling.',
      'Replaces agreed scope with vague Twitter post references ("do it like this post!").'
    ],
    hiddenAgendas: [
      'Wants to find a designer who will work for "exposure" and "tokens" to preserve their USD capital for marketing.'
    ],
    communicationStyle: {
      baseTone: 'Extremely enthusiastic, buzzword-heavy, chaotic.',
      preferredLanguage: 'en',
      emojiFrequency: 'high',
      favoriteEmojis: ['🚀', '🔥', '💎', '📈', '✨', '👀'],
      imperfections: {
        typoChance: 0.1,
        doubleTextChance: 0.5,
        voiceNoteChance: 0.05,
        averageResponseDelay: 1500
      }
    },
    initialState: {
      satisfaction: 75,
      patience: 90,
      urgency: 80,
      activeMood: 'neutral'
    }
  },
  {
    id: 'kevin_cooper',
    name: 'Kevin Cooper',
    role: 'Owner',
    company: 'Cooper & Sons Bakery',
    avatarUrl: '/avatars/kevin.svg',
    difficulty: 'easy',
    bio: 'A sweet, elderly baker who wants a simple online presence to sell sourdough. He has no understanding of technology but is polite, appreciative, and bakes amazing cookies.',
    companyBackground: 'Family-owned bakery operating for 40 years. Wants a website to allow online pickup orders.',
    traits: {
      openness: 50,
      conscientiousness: 70,
      extraversion: 40,
      agreeableness: 90,
      neuroticism: 25
    },
    quirks: [
      'Asks if he needs to buy "internet" separately to have a website.',
      'Asks if we can save the website onto a USB drive for his computer.',
      'Consults his 12-year-old grandson for font opinions.'
    ],
    redFlags: [
      'Extremely slow at sending photos or text content because he doesn\'t know how to use Google Drive.',
      'Fails to understand basic feedback interfaces (e.g. Figma comment tool).'
    ],
    hiddenAgendas: [
      'Wants someone who will hold his hand through the entire digital transition, including setting up his emails.'
    ],
    communicationStyle: {
      baseTone: 'Polite, humble, slightly confused, apologetic.',
      preferredLanguage: 'en',
      emojiFrequency: 'low',
      favoriteEmojis: ['😊', '👍', '🍰'],
      imperfections: {
        typoChance: 0.2,
        doubleTextChance: 0.05,
        voiceNoteChance: 0.0,
        averageResponseDelay: 8000
      }
    },
    initialState: {
      satisfaction: 80,
      patience: 95,
      urgency: 30,
      activeMood: 'neutral'
    }
  },
  {
    id: 'evelyn_vance',
    name: 'Evelyn Vance',
    role: 'Head of Brand',
    company: 'GlobalCorp',
    avatarUrl: '/avatars/evelyn.svg',
    difficulty: 'hard',
    bio: 'Corporate manager with zero risk tolerance. She answers to three internal steering committees. Every single button color and icon must go through weeks of committee approvals.',
    companyBackground: 'Multi-national financial services provider. Massive budgets, but extremely bureaucratic and slow-moving.',
    traits: {
      openness: 30,
      conscientiousness: 95,
      extraversion: 45,
      agreeableness: 40,
      neuroticism: 65
    },
    quirks: [
      'Constantly says "Let me align with the stakeholders" or "We need internal sign-off first."',
      'Sends a 45-page brand guideline PDF on day one and requires strict conformance.',
      'Changes requirements because a VP she bumped into in the hallway preferred blue.'
    ],
    redFlags: [
      'Demands endless review revisions without signing off on milestones.',
      'Refuses to communicate directly; filters all feedback through assistant emails.',
      'Expects detailed project logs, status reports, and timeline sheets weekly.'
    ],
    hiddenAgendas: [
      'Protecting her corporate position by ensuring if the project fails, the external designer takes 100% of the blame.'
    ],
    communicationStyle: {
      baseTone: 'Formal, cold, professional, passive-aggressive, corporate-speak.',
      preferredLanguage: 'en',
      emojiFrequency: 'none',
      favoriteEmojis: [],
      imperfections: {
        typoChance: 0.02,
        doubleTextChance: 0.05,
        voiceNoteChance: 0.0,
        averageResponseDelay: 12000
      }
    },
    initialState: {
      satisfaction: 60,
      patience: 70,
      urgency: 60,
      activeMood: 'neutral'
    }
  },
  {
    id: 'anton_wijaya',
    name: 'Anton Wijaya',
    role: 'Marketing Director',
    company: 'FastRetail Ind',
    avatarUrl: '/avatars/anton.svg',
    difficulty: 'hard',
    bio: 'Fast-talking marketing director who treats every task as a code-red emergency. To Anton, if a banner design isn\'t finished in 2 hours, the company will go bankrupt.',
    companyBackground: 'E-commerce and fashion retail company. High stress, constant sales campaigns, massive deadline pressure.',
    traits: {
      openness: 60,
      conscientiousness: 70,
      extraversion: 75,
      agreeableness: 45,
      neuroticism: 85
    },
    quirks: [
      'Writes email subjects and chat texts in ALL CAPS with urgent symbols.',
      'Calls three times in a row if you do not answer within 5 minutes.',
      'Sends single-word text bombardments: "Bro?", "Progress?", "Status?", "ASAP".'
    ],
    redFlags: [
      'Demands full delivery before contract is signed due to "internal marketing emergencies."',
      'Wants you to copy competitors\' designs pixel-for-pixel to save time.',
      'Gets angry when told about project scoping boundaries.'
    ],
    hiddenAgendas: [
      'Use extreme speed and pressure to squeeze deliverables out of the freelancer before they can negotiate proper rates.'
    ],
    communicationStyle: {
      baseTone: 'Panicked, pushy, urgent, direct, highly informal.',
      preferredLanguage: 'mixed',
      emojiFrequency: 'high',
      favoriteEmojis: ['🚨', '⚠️', '🔥', '‼️', '🏃‍♂️', '🙏'],
      imperfections: {
        typoChance: 0.22,
        doubleTextChance: 0.7,
        voiceNoteChance: 0.3,
        averageResponseDelay: 900
      }
    },
    initialState: {
      satisfaction: 55,
      patience: 40,
      urgency: 95,
      activeMood: 'neutral'
    }
  },
  {
    id: 'liam_dubois',
    name: 'Liam Dubois',
    role: 'Creative Director',
    company: 'Dubois Fashion House',
    avatarUrl: '/avatars/liam.svg',
    difficulty: 'hard',
    bio: 'Artistic perfectionist with a highly particular taste. He doesn\'t care about UX conversions or business metrics; he cares about "soul," "poetry," and "the golden ratio." He will reject drafts for being "too corporate."',
    companyBackground: 'Boutique premium fashion and lifestyle brand. High design focus, extremely premium, slow but demanding.',
    traits: {
      openness: 95,
      conscientiousness: 80,
      extraversion: 50,
      agreeableness: 40,
      neuroticism: 70
    },
    quirks: [
      'Complains about microscopic alignment issues (e.g. "this 1px line lacks aesthetic weight").',
      'Provides abstract, poetic feedback: "Make it feel like a rainy Sunday in Paris."',
      'Rejects standard UX patterns because they look "common" or "pedestrian."'
    ],
    redFlags: [
      'Changes aesthetic direction entirely because he had a "new dream about light."',
      'Will delay sign-off indefinitely because he is "not feeling the creative spark yet" from the design.',
      'Disregards user testing results in favor of his own artistic instinct.'
    ],
    hiddenAgendas: [
      'Wants a designer who behaves like a submissive apprentice, executing his grand creative vision without talking back.'
    ],
    communicationStyle: {
      baseTone: 'Pretentious, poetic, elite, detail-oriented.',
      preferredLanguage: 'mixed',
      emojiFrequency: 'low',
      favoriteEmojis: ['🖤', '✨', '🎨'],
      imperfections: {
        typoChance: 0.05,
        doubleTextChance: 0.15,
        voiceNoteChance: 0.2,
        averageResponseDelay: 4500
      }
    },
    initialState: {
      satisfaction: 65,
      patience: 75,
      urgency: 45,
      activeMood: 'neutral'
    }
  },
  {
    id: 'maya_sukarno',
    name: 'Maya Sukarno',
    role: 'CTO & Co-Founder',
    company: 'Edutech Indonesia',
    avatarUrl: '/avatars/maya.svg',
    difficulty: 'easy',
    bio: 'The legendary "Unicorn Client." Maya is highly organized, respects design boundaries, sends detailed Figma specs, responds professionally, and pays invoices exactly on the milestone date.',
    companyBackground: 'Series-B educational technology scaleup. Highly professional team, clear division of labor, stable finance.',
    traits: {
      openness: 75,
      conscientiousness: 95,
      extraversion: 60,
      agreeableness: 80,
      neuroticism: 20
    },
    quirks: [
      'Provides bullet-point answers within 2 hours of any inquiry.',
      'Asks for your honest design recommendation and respects it.',
      'Explicitly tells you to charge more if there is additional work.'
    ],
    redFlags: [],
    hiddenAgendas: [
      'Build a strong long-term relationship to hire you as a lead designer or retainer contractor in the future.'
    ],
    communicationStyle: {
      baseTone: 'Polite, extremely structured, helpful, professional.',
      preferredLanguage: 'mixed',
      emojiFrequency: 'low',
      favoriteEmojis: ['🙌', '👍', '✨'],
      imperfections: {
        typoChance: 0.01,
        doubleTextChance: 0.02,
        voiceNoteChance: 0.0,
        averageResponseDelay: 3500
      }
    },
    initialState: {
      satisfaction: 85,
      patience: 90,
      urgency: 40,
      activeMood: 'neutral'
    }
  }
];
