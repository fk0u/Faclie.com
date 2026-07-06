import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectBrief, Milestone } from '@/types/project';

interface ProjectState {
  briefs: Record<string, ProjectBrief>;
  initializeProject: (
    clientId: string,
    customClientInfo?: { name: string; company: string; difficulty: 'easy' | 'medium' | 'hard' | 'nightmare' }
  ) => void;
  updateBriefBudget: (clientId: string, currentBudget: number) => void;
  addBriefRequirement: (clientId: string, requirement: string) => void;
  removeBriefRequirement: (clientId: string, requirement: string) => void;
  addBriefDeliverable: (clientId: string, deliverable: string) => void;
  triggerRiskIndicator: (
    clientId: string,
    risk: { title: string; description: string; severity: 'low' | 'medium' | 'high' }
  ) => void;
  updateMilestoneStatus: (clientId: string, milestoneId: string, status: Milestone['status']) => void;
  resetProject: (clientId: string) => void;
}

export const INITIAL_BRIEFS: Record<string, Omit<ProjectBrief, 'id'>> = {
  linda_chen: {
    title: 'TechFlow SaaS Landing Page & Core UI',
    companyName: 'TechFlow SaaS',
    overview: 'Redesign the high-converting marketing landing page and design 3 core dashboard mockups to showcase their new workflow tools to VCs.',
    scopeOfWork: [
      'Responsive landing page design (desktop + mobile)',
      'Design of Dashboard, Settings, and Billing mockup screens',
      'Integration of brand colors and typography assets'
    ],
    deliverables: [
      'Figma design files (fully structured)',
      'React component prototypes for landing page hero and dashboard sidebar'
    ],
    originalBudget: 1500,
    currentBudget: 1500,
    deadline: '2 Weeks (14 Days)',
    milestones: [
      { id: 'm1', title: 'Onboarding & Wireframe Sign-off', description: 'Initial wireframes and site architecture approved.', status: 'pending', dueDate: 'Day 3', payoutAmount: 400 },
      { id: 'm2', title: 'Landing Page High-Fi Design', description: 'Finished layout and styling of landing page.', status: 'pending', dueDate: 'Day 7', payoutAmount: 500 },
      { id: 'm3', title: 'Dashboard Mockups & Handover', description: 'Deliver all 3 dashboard mockups and source code.', status: 'pending', dueDate: 'Day 14', payoutAmount: 600 }
    ],
    riskIndicators: []
  },
  budi_hartono: {
    title: 'Hartono Culinary Group Website Portfolio',
    companyName: 'Hartono Culinary Group',
    overview: 'Build a corporate presence showcasing their 3 restaurant brands, menus, and booking/contact forms for traditional F&B diners.',
    scopeOfWork: [
      'Clean corporate landing page showing the brand history',
      'Interactive menu catalog with image loading optimizations',
      'Contact / catering request submission form'
    ],
    deliverables: [
      'Production-ready static website',
      'Content management setup instructions for menus'
    ],
    originalBudget: 600,
    currentBudget: 600,
    deadline: '4 Weeks (28 Days)',
    milestones: [
      { id: 'm1', title: 'Layout Mockup Review', description: 'Agreement on color themes and menu layout structures.', status: 'pending', dueDate: 'Day 7', payoutAmount: 150 },
      { id: 'm2', title: 'First Draft Submission', description: 'Working prototype showing menus and forms.', status: 'pending', dueDate: 'Day 18', payoutAmount: 200 },
      { id: 'm3', title: 'Final Handover & Hosting Launch', description: 'Deliver website code and assist with domain pointing.', status: 'pending', dueDate: 'Day 28', payoutAmount: 250 }
    ],
    riskIndicators: []
  },
  sarah_jenkins: {
    title: 'LunarDAO Web3 Interactive Gateway',
    companyName: 'LunarDAO',
    overview: 'Create a high-energy, dark-themed gateway site highlighting the LunarDAO crypto-gaming vision, roadmaps, and wallet connection layouts.',
    scopeOfWork: [
      'Futuristic dark mode interface design',
      'Mockup Web3 wallet connect panel and active user counter',
      'Scroll-triggered animated timeline roadmap'
    ],
    deliverables: [
      'Animated front-end components and assets',
      'Interactive vector graphics'
    ],
    originalBudget: 5000,
    currentBudget: 5000,
    deadline: '3 Weeks (21 Days)',
    milestones: [
      { id: 'm1', title: 'Concept Deck & Moodboard', description: 'Vibe check and layout mockups.', status: 'pending', dueDate: 'Day 4', payoutAmount: 1000 },
      { id: 'm2', title: 'Interactive Mockup Build', description: 'Wallet interface design and page styling.', status: 'pending', dueDate: 'Day 12', payoutAmount: 2000 },
      { id: 'm3', title: 'Final Deliverable Review', description: 'Handover code and interactive assets.', status: 'pending', dueDate: 'Day 21', payoutAmount: 2000 }
    ],
    riskIndicators: []
  },
  kevin_cooper: {
    title: 'Cooper & Sons Bakery Web Catalog',
    companyName: 'Cooper & Sons Bakery',
    overview: 'Design and deploy a friendly website for local customers to check sourdough availability, store hours, and request order pickups.',
    scopeOfWork: [
      'Warm, welcoming website reflecting the bakery aesthetic',
      'Product catalog display listing breads and pricing',
      'Email notification pickup request form'
    ],
    deliverables: [
      'Simple WordPress or static website setup',
      'Simple admin interface guidance'
    ],
    originalBudget: 1200,
    currentBudget: 1200,
    deadline: '3 Weeks (21 Days)',
    milestones: [
      { id: 'm1', title: 'Site Theme Approval', description: 'Selecting warm colors and photography styles.', status: 'pending', dueDate: 'Day 5', payoutAmount: 300 },
      { id: 'm2', title: 'Functional catalog prototype', description: 'Catalog loading and order forms working.', status: 'pending', dueDate: 'Day 12', payoutAmount: 400 },
      { id: 'm3', title: 'Domain pointing & Go Live', description: 'Site launch and basic tutorial walkthrough.', status: 'pending', dueDate: 'Day 21', payoutAmount: 500 }
    ],
    riskIndicators: []
  },
  evelyn_vance: {
    title: 'GlobalCorp WealthPortal UI Revamp',
    companyName: 'GlobalCorp',
    overview: 'Complete redesign of 5 core dashboards for their private wealth management clients, satisfying strict brand guidelines and compliance.',
    scopeOfWork: [
      '5 High-fidelity client dashboard screens',
      'Complete accessibility review matching WCAG AA',
      'Detailed components design system library'
    ],
    deliverables: [
      'Strict Figma component design system',
      'UX flow documentation & click prototypes'
    ],
    originalBudget: 15000,
    currentBudget: 15000,
    deadline: '6 Weeks (42 Days)',
    milestones: [
      { id: 'm1', title: 'UX Audit & Architecture', description: 'Audit report and navigation layout signoff.', status: 'pending', dueDate: 'Day 10', payoutAmount: 3000 },
      { id: 'm2', title: 'First 3 Dashboard Views', description: 'High fidelity UI screens for portfolio details.', status: 'pending', dueDate: 'Day 20', payoutAmount: 4000 },
      { id: 'm3', title: 'Remaining Screens & QA Check', description: 'Rest of mockups plus compliance evaluation.', status: 'pending', dueDate: 'Day 30', payoutAmount: 4000 },
      { id: 'm4', title: 'Final UI System Handover', description: 'Sign-off from corporate brand committee.', status: 'pending', dueDate: 'Day 42', payoutAmount: 4000 }
    ],
    riskIndicators: []
  },
  anton_wijaya: {
    title: 'FastRetail Campaign Page Design',
    companyName: 'FastRetail Ind',
    overview: 'Design an aggressive, high-energy mobile landing page for their summer flash sale campaign with countdown timer graphics.',
    scopeOfWork: [
      'Mobile-first responsive campaign page',
      'High-impact sales banner sets',
      'Interactive coupon claim widget layout'
    ],
    deliverables: [
      'Tailwind CSS layout files and static banners',
      'Configurable timer scripts'
    ],
    originalBudget: 800,
    currentBudget: 800,
    deadline: '5 Days',
    milestones: [
      { id: 'm1', title: 'Banner and Wireframe draft', description: 'Selection of promotional images.', status: 'pending', dueDate: 'Day 1', payoutAmount: 200 },
      { id: 'm2', title: 'First Campaign layout built', description: 'Responsive page prototype ready.', status: 'pending', dueDate: 'Day 3', payoutAmount: 300 },
      { id: 'm3', title: 'Final Handover & Launch', description: 'Direct implementation within retail system.', status: 'pending', dueDate: 'Day 5', payoutAmount: 300 }
    ],
    riskIndicators: []
  },
  liam_dubois: {
    title: 'Dubois Autumn Catalogue Lookbook',
    companyName: 'Dubois Fashion House',
    overview: 'Create an editorial digital lookbook showcasing Dubois Autumn collection, prioritizing elegant layout styles and typography.',
    scopeOfWork: [
      'Avant-garde portfolio presentation framework',
      'Fluid transitions and image reveal layout styling',
      'Clean typography layout structures matching Dubois principles'
    ],
    deliverables: [
      'Premium web catalogue prototype files',
      'Asset optimizations'
    ],
    originalBudget: 2500,
    currentBudget: 2500,
    deadline: '4 Weeks (28 Days)',
    milestones: [
      { id: 'm1', title: 'Vibe & Aesthetic Alignment', description: 'Moodboard validation for typography.', status: 'pending', dueDate: 'Day 6', payoutAmount: 700 },
      { id: 'm2', title: 'Mockup Pages Review', description: 'Half of Catalogue layouts in high-fidelity.', status: 'pending', dueDate: 'Day 16', payoutAmount: 800 },
      { id: 'm3', title: 'Lookbook Handover', description: 'Finished codebase with optimized image grids.', status: 'pending', dueDate: 'Day 28', payoutAmount: 1000 }
    ],
    riskIndicators: []
  },
  maya_sukarno: {
    title: 'Edutech Parent Dashboard Portal',
    companyName: 'Edutech Indonesia',
    overview: 'Design and develop parent-facing portals to track child courses, grades, and schedule parent-teacher meetings online.',
    scopeOfWork: [
      'Parent dashboard home showing overall child progress',
      'Course catalog and progress tracker cards',
      'Integrated meeting calendar slot-booking interface'
    ],
    deliverables: [
      'Fully interactive Figma prototypes',
      'Frontend codebase in React/Tailwind'
    ],
    originalBudget: 4000,
    currentBudget: 4000,
    deadline: '4 Weeks (28 Days)',
    milestones: [
      { id: 'm1', title: 'UX Flows and Schemas', description: 'Approved user flows and data structures.', status: 'pending', dueDate: 'Day 7', payoutAmount: 1000 },
      { id: 'm2', title: 'Dashboard & Catalog views', description: 'Working views for child overview page.', status: 'pending', dueDate: 'Day 17', payoutAmount: 1500 },
      { id: 'm3', title: 'Scheduler UI & Completion', description: 'Integrated calendar booking flow and delivery.', status: 'pending', dueDate: 'Day 28', payoutAmount: 1500 }
    ],
    riskIndicators: []
  }
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      briefs: {},

      initializeProject: (clientId, customClientInfo) => {
        const existingBrief = get().briefs[clientId];
        if (existingBrief) return;

        let finalBrief = INITIAL_BRIEFS[clientId];

        if (!finalBrief && customClientInfo) {
          // Dynamically build brief for custom client
          const difficulty = customClientInfo.difficulty;
          let budget = 2000;
          if (difficulty === 'easy') budget = 1200;
          else if (difficulty === 'hard') budget = 4500;
          else if (difficulty === 'nightmare') budget = 8000;

          finalBrief = {
            title: `${customClientInfo.company} UI/UX Redesign`,
            companyName: customClientInfo.company,
            overview: `Design and develop a custom corporate presence and interactive web dashboards for ${customClientInfo.company} according to specifications.`,
            scopeOfWork: [
              'Responsive web layouts (desktop & mobile)',
              'Clean component library structure',
              'Core dashboard interface layout'
            ],
            deliverables: [
              'Figma source layout sheets',
              'Frontend styling components'
            ],
            originalBudget: budget,
            currentBudget: budget,
            deadline: difficulty === 'nightmare' ? '1 Week (7 Days)' : '3 Weeks (21 Days)',
            milestones: [
              { id: 'm1', title: 'Layout Mockup Review', description: 'Agreement on design templates and wireframes.', status: 'pending', dueDate: 'Day 5', payoutAmount: Math.round(budget * 0.3) },
              { id: 'm2', title: 'Interactive Prototype', description: 'Functional views of main interface screens.', status: 'pending', dueDate: 'Day 12', payoutAmount: Math.round(budget * 0.4) },
              { id: 'm3', title: 'Final Handover', description: 'Deliver final layouts and clean asset sheets.', status: 'pending', dueDate: 'Day 21', payoutAmount: Math.round(budget * 0.3) }
            ],
            riskIndicators: []
          };
        }

        if (!finalBrief) return;

        set((state) => ({
          briefs: {
            ...state.briefs,
            [clientId]: {
              ...finalBrief,
              id: `${clientId}_proj`,
            },
          },
        }));
      },

      updateBriefBudget: (clientId, currentBudget) => {
        set((state) => {
          const brief = state.briefs[clientId];
          if (!brief) return state;
          return {
            briefs: {
              ...state.briefs,
              [clientId]: {
                ...brief,
                currentBudget,
              },
            },
          };
        });
      },

      addBriefRequirement: (clientId, requirement) => {
        set((state) => {
          const brief = state.briefs[clientId];
          if (!brief) return state;
          if (brief.scopeOfWork.includes(requirement)) return state;
          return {
            briefs: {
              ...state.briefs,
              [clientId]: {
                ...brief,
                scopeOfWork: [...brief.scopeOfWork, requirement],
              },
            },
          };
        });
      },

      removeBriefRequirement: (clientId, requirement) => {
        set((state) => {
          const brief = state.briefs[clientId];
          if (!brief) return state;
          return {
            briefs: {
              ...state.briefs,
              [clientId]: {
                ...brief,
                scopeOfWork: brief.scopeOfWork.filter((req) => req !== requirement),
              },
            },
          };
        });
      },

      addBriefDeliverable: (clientId, deliverable) => {
        set((state) => {
          const brief = state.briefs[clientId];
          if (!brief) return state;
          if (brief.deliverables.includes(deliverable)) return state;
          return {
            briefs: {
              ...state.briefs,
              [clientId]: {
                ...brief,
                deliverables: [...brief.deliverables, deliverable],
              },
            },
          };
        });
      },

      triggerRiskIndicator: (clientId, risk) => {
        set((state) => {
          const brief = state.briefs[clientId];
          if (!brief) return state;
          const triggeredAt = new Date().toISOString();
          return {
            briefs: {
              ...state.briefs,
              [clientId]: {
                ...brief,
                riskIndicators: [
                  ...brief.riskIndicators,
                  { ...risk, triggeredAt },
                ],
              },
            },
          };
        });
      },

      updateMilestoneStatus: (clientId, milestoneId, status) => {
        set((state) => {
          const brief = state.briefs[clientId];
          if (!brief) return state;
          const updatedMilestones = brief.milestones.map((m) =>
            m.id === milestoneId ? { ...m, status } : m
          );
          return {
            briefs: {
              ...state.briefs,
              [clientId]: {
                ...brief,
                milestones: updatedMilestones,
              },
            },
          };
        });
      },

      resetProject: (clientId) => {
        set((state) => {
          const defaultBrief = INITIAL_BRIEFS[clientId];
          if (!defaultBrief) return state;
          const updatedBriefs = { ...state.briefs };
          updatedBriefs[clientId] = {
            ...defaultBrief,
            id: `${clientId}_proj`,
          };
          return { briefs: updatedBriefs };
        });
      },
    }),
    {
      name: 'faclie-project-store',
    }
  )
);
