import React, { useRef, useEffect } from 'react';
import { Terminal, Download, Search, Filter } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsProps {
  logs: LogEntry[];
}

const Logs: React.FC<LogsProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new logs
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-screen bg-bg-primary pt-[47px] pb-[83px]">
      
      {/* Header */}
      <header className="flex justify-between items-center h-14 px-5 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-[20px] font-bold text-text-primary tracking-tight font-mono">System Logs</h1>
          <p className="text-[11px] font-mono text-text-secondary">/var/log/openclaw/live.log</p>
        </div>
        <div className="flex gap-2">
            <button className="w-8 h-8 rounded bg-bg-surface border border-border-visible flex items-center justify-center text-text-secondary">
                <Search size={14} />
            </button>
            <button className="w-8 h-8 rounded bg-bg-surface border border-border-visible flex items-center justify-center text-text-secondary">
                <Filter size={14} />
            </button>
        </div>
      </header>

      {/* Terminal View */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px] space-y-3 bg-[#050505]">
         {/* Simulated Header of Terminal */}
         <div className="text-text-tertiary pb-2 mb-2 border-b border-border-subtle border-dashed">
            OpenClaw v2.1.0-beta initialized.<br/>
            Connected to node: sg-1 [10.0.4.2]<br/>
            Logging level: VERBOSE
         </div>

         {logs.map((log) => (
            <div key={log.id} className="flex gap-3 group">
                <div className="text-text-tertiary flex-shrink-0 w-[60px]">{log.timestamp}</div>
                
                <div className="flex-1 break-all">
                    <span className={`inline-block px-1 rounded-[2px] text-[10px] font-bold mr-2 w-[55px] text-center ${
                        log.level === 'EXECUTE' ? 'text-[#00FFB2] bg-[#00FFB2]/10' :
                        log.level === 'ERROR' ? 'text-[#FF4545] bg-[#FF4545]/10' :
                        log.level === 'PLAN' ? 'text-[#4D9FFF] bg-[#4D9FFF]/10' :
                        log.level === 'TRIAGE' ? 'text-[#FFB800] bg-[#FFB800]/10' :
                        'text-text-secondary bg-bg-elevated'
                    }`}>
                        {log.level}
                    </span>
                    <span className="text-text-secondary font-bold mr-2">[{log.agent}]</span>
                    <span className={`text-text-primary ${
                        log.level === 'ERROR' ? 'text-[#FF4545]' : ''
                    }`}>
                        {log.message}
                    </span>
                </div>
            </div>
         ))}
         
         {/* Anchor for auto-scroll */}
         <div ref={bottomRef} className="h-4" />
      </div>

      {/* Sticky Bottom Actions */}
      <div className="h-10 border-t border-border-subtle bg-bg-surface px-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[10px] font-mono text-accent-green">LIVE STREAMING</span>
         </div>
         <button className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary hover:text-text-primary transition-colors">
            <Download size={12} />
            <span>Export .log</span>
         </button>
      </div>

    </div>
  );
};

export default Logs;