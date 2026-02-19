
import React, { useState, useMemo } from 'react';
import { Settings, X, ChevronRight, Activity } from 'lucide-react';
import { LogEntry, WalletStats, SystemStatus, DashboardWidgets, Agent } from '../types';
import { PIPELINE_STEPS, getAgentIcon } from '../constants';

interface DashboardProps {
  systemStatus: SystemStatus;
  wallet: WalletStats;
  logs: LogEntry[];
  agents: Agent[];
  currentThought: string;
  widgets: DashboardWidgets;
  onToggleWidget: (key: keyof DashboardWidgets) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ systemStatus, wallet, widgets, onToggleWidget, agents }) => {
  const [showSettings, setShowSettings] = useState(false);

  // Définition des points pour un serpentin "S" horizontal classique (G -> D, D -> G, G -> D)
  const points = [
    { x: 25, y: 20 }, 
    { x: 75, y: 20 }, 
    { x: 75, y: 50 }, 
    { x: 25, y: 50 }, 
    { x: 25, y: 80 }, 
    { x: 75, y: 80 }, 
  ];

  const pathD = "M 25 20 L 75 20 C 95 20, 95 50, 75 50 L 25 50 C 5 50, 5 80, 25 80 L 75 80";

  const maxTokens = useMemo(() => Math.max(...agents.map(a => a.tokensConsumed), 1000), [agents]);

  const Toggle = ({ active, onToggle, label }: { active: boolean, onToggle: () => void, label: string }) => (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0 cursor-pointer active:bg-bg-elevated transition-colors px-2 -mx-2 rounded-xl"
    >
      <span className="text-[15px] font-semibold text-text-primary select-none">{label}</span>
      <div 
        className={`w-12 h-7 rounded-full transition-all duration-300 relative shadow-inner ${active ? 'bg-accent-green' : 'bg-border-visible'}`}
      >
        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-[140px] bg-bg-primary pt-[env(safe-area-inset-top)] relative overflow-x-hidden">
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[4px]" onClick={() => setShowSettings(false)} />
          <div className="relative bg-white rounded-t-[42px] p-8 shadow-apple-deep animate-slideUp max-h-[85vh] flex flex-col pb-12">
            <div className="w-12 h-1.5 bg-border-subtle rounded-full mx-auto mb-8 opacity-50" />
            
            <div className="flex justify-between items-center mb-8 px-2">
              <h2 className="text-[24px] font-serif font-semibold text-text-primary tracking-tight">Paramètres</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center active:scale-90 transition-all"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1">
              <Toggle active={widgets.pipeline} onToggle={() => onToggleWidget('pipeline')} label="Pipeline Temps Réel" />
              <Toggle active={widgets.consumption} onToggle={() => onToggleWidget('consumption')} label="Consommation & Coûts" />
              <Toggle active={widgets.agentPerf} onToggle={() => onToggleWidget('agentPerf')} label="Allocation Ressources" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-12 pb-8 animate-fadeIn">
        <div className="flex-1">
          <h1 className="text-[34px] font-serif font-semibold text-text-primary tracking-tight leading-none">
            Overview
          </h1>
          <div className="flex items-center gap-2 mt-2">
             <div className={`w-1.5 h-1.5 rounded-full ${systemStatus.online ? 'bg-accent-green' : 'bg-accent-red'}`} />
             <p className="text-[13px] font-semibold text-text-secondary tracking-tight">
                {systemStatus.online ? 'Stagiaire connecté' : 'Stagiaire pas connecté'}
             </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="w-11 h-11 rounded-full bg-white shadow-apple border border-border-subtle flex items-center justify-center active:scale-90 transition-all"
        >
          <Settings size={22} className="text-text-primary" />
        </button>
      </header>

      <div className="space-y-6">
        
        {/* Pipeline Serpentin Affiné */}
        {widgets.pipeline && (
          <section className="px-6 animate-fadeIn">
             <div className="bg-white rounded-[38px] p-6 pb-8 shadow-apple border border-white overflow-hidden relative">
                <h3 className="text-[10px] font-bold text-text-tertiary mb-6 uppercase tracking-[0.25em] text-center">
                   Cognitive Stream
                </h3>
                
                <div className="relative h-[160px] w-full max-w-[280px] mx-auto">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <filter id="pathGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="serpentineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D97757" /> 
                        <stop offset="50%" stopColor="#D97757" />
                        <stop offset="50%" stopColor="#007AFF" /> 
                        <stop offset="100%" stopColor="#007AFF" />
                      </linearGradient>
                    </defs>
                    
                    <path d={pathD} fill="none" stroke="#F2F2F7" strokeWidth="2.5" strokeLinecap="round" />
                    <path d={pathD} fill="none" stroke="url(#serpentineGradient)" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-1000" filter="url(#pathGlow)" />
                    <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeDasharray="1, 12" className="animate-dash opacity-40" />
                    
                    {PIPELINE_STEPS.map((step, i) => {
                      const pos = points[i];
                      if (!pos) return null;
                      const isActive = step.status === 'active';
                      const isPast = step.status === 'past';
                      const isOrange = isPast || isActive;
                      
                      return (
                        <g key={step.id}>
                          {isActive && <circle cx={pos.x} cy={pos.y} r="6" fill="#D97757" className="opacity-20 animate-pulse-fast" />}
                          <circle cx={pos.x} cy={pos.y} r={isActive ? "3.5" : "2.5"} fill={isOrange ? "#D97757" : "white"} stroke={isOrange ? "transparent" : "#007AFF"} strokeWidth={isOrange ? 0 : 0.8} className="transition-all duration-700 shadow-sm" />
                          <text x={pos.x} y={pos.y + (pos.y < 30 ? -10 : (pos.y > 70 ? 14 : 0))} dy={pos.y === 50 ? "0.35em" : "0"} dx={pos.y === 50 ? (pos.x < 50 ? -8 : 8) : "0"} textAnchor={pos.y === 50 ? (pos.x < 50 ? "end" : "start") : "middle"} className={`text-[4.5px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${isOrange ? 'fill-accent-claude' : 'fill-accent-blue'}`}>{step.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
             </div>
          </section>
        )}

        {/* Statistiques Financières */}
        {widgets.consumption && (
          <section className="px-6 animate-fadeIn">
            <h3 className="text-[20px] font-serif font-semibold text-text-primary tracking-tight mb-4 ml-1">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-white rounded-[32px] p-7 shadow-apple border border-white">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Coût Journalier</span>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-[38px] font-serif font-semibold text-text-primary tracking-tighter">${wallet.todayCost.toFixed(2)}</span>
                    <span className="text-[13px] font-bold text-text-tertiary">/ tokens</span>
                 </div>
              </div>

              <div className="bg-white rounded-[32px] p-5 shadow-apple border border-white h-[110px] flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Mois</span>
                  <div className="text-[20px] font-serif font-semibold text-text-primary tracking-tight">${wallet.monthCost.toFixed(0)}</div>
              </div>
              
              <div className="bg-white rounded-[32px] p-5 shadow-apple border border-white h-[110px] flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Prévu</span>
                  <div className="text-[20px] font-serif font-semibold text-text-primary tracking-tight">${wallet.projectedCost.toFixed(0)}</div>
              </div>
            </div>
          </section>
        )}

        {/* Allocation des Ressources par Agent */}
        {widgets.agentPerf && (
          <section className="px-6 animate-fadeIn pb-10">
             <div className="bg-white rounded-[36px] p-8 shadow-apple border border-white">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[12px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
                    Allocation des Ressources
                  </h3>
                  <Activity size={16} className="text-accent-claude animate-pulse" />
                </div>
                
                <div className="space-y-8">
                   {agents.slice(0, 5).sort((a,b) => b.tokensConsumed - a.tokensConsumed).map((agent) => {
                      const percentage = (agent.tokensConsumed / maxTokens) * 100;
                      return (
                        <div key={agent.id} className="group">
                           <div className="flex items-center justify-between mb-3 px-1">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-bg-elevated rounded-lg group-hover:bg-accent-claude/10 transition-colors">
                                  {getAgentIcon(agent.id, "w-4 h-4 text-text-secondary group-hover:text-accent-claude")}
                                </div>
                                <div>
                                  <div className="text-[14px] font-bold text-text-primary leading-none mb-1">{agent.name}</div>
                                  <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{agent.role}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[14px] font-mono font-bold text-text-primary leading-none mb-1">
                                  {(agent.tokensConsumed / 1000).toFixed(1)}k
                                </div>
                                <div className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Tokens</div>
                              </div>
                           </div>
                           
                           <div className="w-full h-2.5 bg-bg-elevated rounded-full overflow-hidden relative border border-black/[0.02]">
                              <div 
                                 className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-accent-claude to-[#f3a085] shadow-[0_0_12px_rgba(217,119,87,0.3)]" 
                                 style={{ width: `${Math.max(percentage, 2)}%` }} 
                              />
                              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-dash opacity-30" />
                           </div>
                        </div>
                      );
                   })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border-subtle flex justify-between items-center opacity-60">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Total distribué</span>
                  <span className="text-[12px] font-mono font-bold text-text-primary">
                    {(agents.reduce((acc, curr) => acc + curr.tokensConsumed, 0) / 1000).toFixed(1)}k tokens
                  </span>
                </div>
             </div>
          </section>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
