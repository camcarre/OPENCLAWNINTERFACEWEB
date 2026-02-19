
import React from 'react';
import { LayoutGrid, Zap, MessageSquare } from 'lucide-react';
import { Tab } from '../types';

interface TabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  online: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ currentTab, onTabChange, online }) => {
  const tabs = [
    { id: Tab.DASHBOARD, label: 'Overview', icon: LayoutGrid },
    { id: Tab.CHAT, label: 'Intelligence', icon: MessageSquare },
    { id: Tab.ARENA, label: 'Arène', icon: Zap },
  ];

  const getActiveIndex = () => tabs.findIndex(t => t.id === currentTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-[env(safe-area-inset-bottom)] pointer-events-none flex flex-col items-center">
      {/* Container spacing from bottom indicator */}
      <div className="h-4 pointer-events-none" />
      
      <nav className="pointer-events-auto relative flex items-center bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] p-1.5 min-w-[240px] max-w-sm transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] mb-6">
        
        {/* Morphing Background Pill */}
        <div 
          className="absolute h-[calc(100%-12px)] top-[6px] rounded-[26px] bg-white shadow-sm border border-black/5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            width: `calc((100% - 12px) / 3)`,
            transform: `translateX(calc(${getActiveIndex()} * 100%))`
          }}
        />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-3.5 transition-all duration-300 active:scale-90"
              aria-label={tab.label}
            >
              <div className={`transition-all duration-500 ${isActive ? 'text-accent-claude scale-125' : 'text-text-tertiary'}`}>
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={tab.id === Tab.ARENA && isActive ? 'fill-accent-claude/10' : ''}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabBar;
