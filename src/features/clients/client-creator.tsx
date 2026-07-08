'use client';

import * as React from 'react';
import { useClientStore, calculateHealthScore } from '@/store/useClientStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useChatStore } from '@/store/useChatStore';
import { audioService } from '@/utils/audioService';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { ActiveClientState } from '@/types/client';

interface ClientCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientCreator = ({ isOpen, onClose }: ClientCreatorProps) => {
  const addCustomClient = useClientStore((state) => state.addCustomClient);
  const initializeProject = useProjectStore((state) => state.initializeProject);
  const soundEnabled = useChatStore((state) => state.soundEnabled);

  // Form states
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('CEO');
  const [company, setCompany] = React.useState('');
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard' | 'nightmare'>('medium');
  const [bio, setBio] = React.useState('');
  const [companyBackground, setCompanyBackground] = React.useState('');
  const [language, setLanguage] = React.useState<'id' | 'en' | 'mixed'>('en');
  
  // Traits
  const [openness, setOpenness] = React.useState(70);
  const [conscientiousness, setConscientiousness] = React.useState(60);
  const [extraversion, setExtraversion] = React.useState(50);
  const [agreeableness, setAgreeableness] = React.useState(50);
  const [neuroticism, setNeuroticism] = React.useState(60);

  // Red flags, quirks, and hidden agendas
  const [quirk, setQuirk] = React.useState('');
  const [redFlag, setRedFlag] = React.useState('');
  const [hiddenAgenda, setHiddenAgenda] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    const id = `custom_${Date.now()}`;

    // Select dynamic avatar color and graphic based on difficulty
    const avatarUrl = `/avatars/${difficulty}.svg`;

    // Imperfections scaling based on traits/difficulty
    const doubleTextChance = neuroticism > 75 ? 0.6 : 0.2;
    const typoChance = extraversion > 80 ? 0.25 : 0.05;
    const voiceNoteChance = agreeableness < 40 ? 0.4 : 0.1;
    const averageResponseDelay = conscientiousness < 40 ? 6000 : 2500;

    const baseTone = difficulty === 'nightmare' 
      ? 'Extremely chaotic, hyperactive, demands instant pivot.' 
      : 'Professional, slightly demanding.';

    const favoriteEmojis = language === 'id' ? ['🙏', '👍'] : ['🚀', '✨', '😅'];

    const newClient: ActiveClientState = {
      id,
      name,
      role,
      company,
      avatarUrl,
      difficulty,
      bio: bio || `Custom simulation client. A ${role} who operates with ${difficulty} requirements.`,
      companyBackground: companyBackground || `${company} is a fast-growing business unit.`,
      traits: {
        openness,
        conscientiousness,
        extraversion,
        agreeableness,
        neuroticism,
      },
      quirks: quirk ? [quirk] : ['Calls out of hours', 'Sends "Quick question..." messages'],
      redFlags: redFlag ? [redFlag] : ['Changes requirements mid-sprint', 'Refuses to sign detailed contracts'],
      hiddenAgendas: hiddenAgenda ? [hiddenAgenda] : ['Wants full web app designs for a budget price'],
      communicationStyle: {
        baseTone,
        preferredLanguage: language,
        emojiFrequency: difficulty === 'easy' ? 'low' : 'high',
        favoriteEmojis,
        imperfections: {
          typoChance,
          doubleTextChance,
          voiceNoteChance,
          averageResponseDelay,
        },
      },
      initialState: {
        satisfaction: 70,
        patience: 80,
        urgency: difficulty === 'nightmare' ? 90 : 60,
        activeMood: 'neutral',
      },
      currentState: {
        satisfaction: 70,
        patience: 80,
        urgency: difficulty === 'nightmare' ? 90 : 60,
        activeMood: 'neutral',
      },
      healthScore: calculateHealthScore({
        satisfaction: 70,
        patience: 80,
        urgency: difficulty === 'nightmare' ? 90 : 60,
        activeMood: 'neutral',
      }),
      memory: {},
      projectPipelineStage: 'onboarding',
    };

    addCustomClient(newClient);
    initializeProject(id, { name, company, difficulty });

    if (soundEnabled) {
      audioService.playSuccess();
    }

    // Reset Form
    setName('');
    setCompany('');
    setBio('');
    setCompanyBackground('');
    setQuirk('');
    setRedFlag('');
    setHiddenAgenda('');

    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={<span className="flex items-center gap-2 font-bold"><UserPlus className="h-5 w-5 text-primary" /> Create Custom Client</span>}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 text-foreground">
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Company Name</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Tech"
              className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1 col-span-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder"
              className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>
          <div className="space-y-1 col-span-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'nightmare')}
              className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-2 py-2 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="nightmare">Nightmare</option>
            </select>
          </div>
          <div className="space-y-1 col-span-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Preferred Lang</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'id' | 'en' | 'mixed')}
              className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-2 py-2 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="en">English Only</option>
              <option value="id">Indonesian Only</option>
              <option value="mixed">Mixed (Jaksel)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-muted-foreground">Short Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short profile bio reflecting client personality..."
            className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-ring focus:outline-none h-16 resize-none"
          />
        </div>

        {/* Psychological Traits Sliders */}
        <div className="space-y-2 border border-border/60 rounded-xl p-3 bg-slate-900/5 dark:bg-slate-900/30">
          <span className="text-[10px] uppercase font-extrabold text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Psychological Traits (0 - 100)
          </span>
          <div className="grid grid-cols-2 gap-4 text-[10px] font-semibold text-muted-foreground">
            {/* Agreeableness */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Agreeableness</span>
                <span className="text-foreground">{agreeableness}</span>
              </div>
              <input
                type="range" min="0" max="100" value={agreeableness}
                onChange={(e) => setAgreeableness(Number(e.target.value))}
                className="w-full accent-primary h-1 rounded-lg bg-border cursor-pointer"
              />
            </div>
            {/* Neuroticism */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Neuroticism (Tension)</span>
                <span className="text-foreground">{neuroticism}</span>
              </div>
              <input
                type="range" min="0" max="100" value={neuroticism}
                onChange={(e) => setNeuroticism(Number(e.target.value))}
                className="w-full accent-primary h-1 rounded-lg bg-border cursor-pointer"
              />
            </div>
            {/* Conscientiousness */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Conscientiousness</span>
                <span className="text-foreground">{conscientiousness}</span>
              </div>
              <input
                type="range" min="0" max="100" value={conscientiousness}
                onChange={(e) => setConscientiousness(Number(e.target.value))}
                className="w-full accent-primary h-1 rounded-lg bg-border cursor-pointer"
              />
            </div>
            {/* Openness */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Openness</span>
                <span className="text-foreground">{openness}</span>
              </div>
              <input
                type="range" min="0" max="100" value={openness}
                onChange={(e) => setOpenness(Number(e.target.value))}
                className="w-full accent-primary h-1 rounded-lg bg-border cursor-pointer"
              />
            </div>
            {/* Extraversion */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Extraversion</span>
                <span className="text-foreground">{extraversion}</span>
              </div>
              <input
                type="range" min="0" max="100" value={extraversion}
                onChange={(e) => setExtraversion(Number(e.target.value))}
                className="w-full accent-primary h-1 rounded-lg bg-border cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Agenda / Risk parameters */}
        <div className="space-y-2 border border-border/60 rounded-xl p-3 bg-slate-900/5 dark:bg-slate-900/30">
          <span className="text-[10px] uppercase font-extrabold text-amber-500 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> Client Red Flags & Quirks
          </span>
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground">Notable Red Flag</label>
              <input
                type="text"
                value={redFlag}
                onChange={(e) => setRedFlag(e.target.value)}
                placeholder="e.g. Demands free mockups before paying any deposit"
                className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground">Unique Quirk</label>
              <input
                type="text"
                value={quirk}
                onChange={(e) => setQuirk(e.target.value)}
                placeholder="e.g. Text bombards at 2 AM on Sunday mornings"
                className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-muted-foreground">Hidden Agenda</label>
              <input
                type="text"
                value={hiddenAgenda}
                onChange={(e) => setHiddenAgenda(e.target.value)}
                placeholder="e.g. Tries to slip in coding requirements as design revisions"
                className="w-full bg-slate-900/10 dark:bg-slate-900 border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!name || !company} className="bg-primary text-primary-foreground font-semibold">
            Create & Add Klien
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
export default ClientCreator;
