import React, { useState } from 'react';
import { RefreshCw, FileText, Globe, Terminal, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { LogEntry, Artifact } from '../types';

interface ArtifactsProps {
  logs: LogEntry[];
  artifacts: Artifact[];
}

const Artifacts: React.FC<ArtifactsProps> = ({ logs, artifacts }) => {
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={20} className="text-accent-red" />;
      case 'HTML': return <Globe size={20} className="text-accent-blue" />;
      case 'IMG': return <ImageIcon size={20} className="text-accent-amber" />;
      case 'LOG': return <Terminal size={20} className="text-text-secondary" />;
      default: return <FileText size={20} className="text-text-secondary" />;
    }
  };

  const filteredArtifacts = filter === 'All' ? artifacts : artifacts.filter(a => a.type === filter.toUpperCase());

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary pt-[47px] pb-[83px]">
      
      {/* Header */}
      <header className="flex justify-between items-center h-16 px-5 flex-shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-tighter">Artefacts</h1>
          <p className="text-[12px] font-mono text-text-secondary">{artifacts.length} fichiers · /shared/</p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`w-9 h-9 rounded-full bg-bg-surface border border-border-visible flex items-center justify-center active:scale-95 transition-transform ${refreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={16} className="text-text-secondary" />
        </button>
      </header>

      {/* Filters */}
      <div className="h-11 px-5 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
        {['All', 'PDF', 'HTML', 'IMG', 'Logs'].map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                isActive 
                  ? 'bg-accent-green-dim border-accent-green text-accent-green' 
                  : 'bg-bg-surface border-border-visible text-text-secondary'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto pb-[180px]"> 
        {filteredArtifacts.map((file, idx) => (
          <div key={file.id}>
            <div className={`px-5 py-3.5 flex items-center gap-3.5 active:bg-bg-surface transition-colors ${idx === 0 ? 'bg-accent-green/5' : ''}`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-[10px] bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                {idx === 0 && (
                   <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_6px_#00FFB2] animate-pulse" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium text-text-primary truncate">{file.name}</div>
                <div className="flex items-center gap-1.5 text-[12px] font-mono text-text-secondary mt-0.5">
                  <span>{file.type}</span>
                  <span className="text-border-visible">|</span>
                  <span>{file.size}</span>
                  <span className="text-border-visible">|</span>
                  <span>{file.agent}</span>
                </div>
                <div className="text-[11px] text-text-tertiary mt-0.5">{file.timestamp}</div>
              </div>

              <ChevronRight size={14} className="text-text-tertiary flex-shrink-0" />
            </div>
            <div className="h-px bg-border-subtle ml-20" />
          </div>
        ))}
      </div>

      {/* Live Logs Section (Fixed Bottom) */}
      <div className="fixed bottom-[83px] left-0 right-0 h-[180px] bg-bg-surface border-t border-border-subtle rounded-t-[20px] overflow-hidden flex flex-col z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Logs Header */}
        <div className="h-9 px-4 flex items-center justify-between border-b border-border-subtle bg-bg-surface">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest">Logs Live</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            </div>
            <button className="text-[11px] font-medium text-accent-green active:opacity-70">Tout voir</button>
        </div>

        {/* Logs Content */}
        <div className="flex-1 overflow-hidden relative bg-bg-primary/50">
            <div className="absolute inset-0 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-baseline gap-2 text-[11px] font-mono leading-relaxed">
                        <span className="text-text-tertiary flex-shrink-0">{log.timestamp}</span>
                        <span className={`flex-shrink-0 px-1 rounded-[2px] text-[9px] font-bold ${
                            log.level === 'EXECUTE' ? 'text-accent-green bg-accent-green/10' :
                            log.level === 'ERROR' ? 'text-accent-red bg-accent-red/10' :
                            log.level === 'PLAN' ? 'text-accent-blue bg-accent-blue/10' :
                            'text-accent-amber bg-accent-amber/10'
                        }`}>
                            {log.level}
                        </span>
                        <span className="text-text-secondary font-semibold">{log.agent} ›</span>
                        <span className="text-text-primary truncate">{log.message}</span>
                    </div>
                ))}
            </div>
            {/* Fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none" />
        </div>
      </div>

    </div>
  );
};

export default Artifacts;