export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  dueDate: string;
  payoutAmount: number;
}

export interface ProjectBrief {
  id: string;
  title: string;
  companyName: string;
  overview: string;
  scopeOfWork: string[];
  deliverables: string[];
  originalBudget: number;
  currentBudget: number;
  deadline: string;
  milestones: Milestone[];
  riskIndicators: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    triggeredAt: string;
  }[];
}
