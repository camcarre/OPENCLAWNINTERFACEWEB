
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Agent, AgentStatus, LogEntry } from '../types';
import { getAgentIcon } from '../constants';
import { Activity, Cpu, Zap, Maximize2, X, ChevronRight } from 'lucide-react';

interface ArenaProps {
  agents: Agent[];
  currentThought: string;
  logs: LogEntry[];
}

const Arena: React.FC<ArenaProps> = ({ agents, currentThought, logs }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'status' | 'logs'>('status');
  const [isTransformed, setIsTransformed] = useState(false);

  const INITIAL_TRANSFORM = { x: 0, y: 0, scale: 1.1 };
  const transformRef = useRef({ ...INITIAL_TRANSFORM });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false); // Pour distinguer clic et drag
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const RADIUS = 130; 
  const CENTER_X = 200; 
  const CENTER_Y = 300; 

  const updateDOMTransforms = useCallback(() => {
    const { x, y, scale } = transformRef.current;
    if (gRef.current) {
      gRef.current.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
    }
    if (gridRef.current) {
      gridRef.current.style.transform = `translate(${x * scale}px, ${y * scale}px) scale(${scale})`;
    }

    const transformed = 
      Math.abs(x - INITIAL_TRANSFORM.x) > 1 || 
      Math.abs(y - INITIAL_TRANSFORM.y) > 1 || 
      Math.abs(scale - INITIAL_TRANSFORM.scale) > 0.05;
    
    if (transformed !== isTransformed) {
      setIsTransformed(transformed);
    }
  }, [isTransformed, INITIAL_TRANSFORM.x, INITIAL_TRANSFORM.y, INITIAL_TRANSFORM.scale]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    
    if (selectedAgentId && target.closest('.detail-card')) return;
    if (target.closest('button:not(.agent-node button)')) return;
    
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    if (gRef.current) gRef.current.style.transition = 'none';
    if (gridRef.current) gridRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMovedRef.current = true;
    }
    
    transformRef.current.x += dx / transformRef.current.scale;
    transformRef.current.y += dy / transformRef.current.scale;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    
    updateDOMTransforms();
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    if (gRef.current) gRef.current.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
    if (gridRef.current) gridRef.current.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
  };

  const handleWheel = (e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest('.logs-scroll-area')) return;

    const zoomIntensity = 0.05;
    const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    const newScale = Math.min(Math.max(transformRef.current.scale + delta, 0.5), 3);
    transformRef.current.scale = newScale;
    updateDOMTransforms();
  };

  const resetTransform = () => {
    transformRef.current = { ...INITIAL_TRANSFORM };
    if (gRef.current) gRef.current.style.transition = 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)';
    if (gridRef.current) gridRef.current.style.transition = 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)';
    updateDOMTransforms();
  };

  const getAgentPosition = (agentId: string) => {
    if (agentId === 'manager') return { x: CENTER_X, y: CENTER_Y };
    const peripheralAgents = agents.filter(a => a.id !== 'manager');
    const pIndex = peripheralAgents.findIndex(a => a.id === agentId);
    const pTotal = peripheralAgents.length;
    const angleStep = (2 * Math.PI) / pTotal;
    const angle = angleStep * pIndex - Math.PI / 2;
    return {
      x: CENTER_X + RADIUS * Math.cos(angle),
      y: CENTER_Y + RADIUS * Math.sin(angle)
    };
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const managerPos = getAgentPosition('manager');

  useEffect(() => {
    updateDOMTransforms();
  }, [updateDOMTransforms]);

  return (
    <div 
      className="relative w-full h-full bg-bg-primary overflow-hidden flex flex-col pt-[env(safe-area-inset-top)] touch-none select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[50%] bg-accent-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-5%] w-[50%] h-[50%] bg-accent-green/5 blur-[120px] rounded-full" />
      </div>
      
      <div 
        ref={gridRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: 'radial-gradient(circle, #1D1D1F 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            willChange: 'transform',
            transform: `translate(${INITIAL_TRANSFORM.x * INITIAL_TRANSFORM.scale}px, ${INITIAL_TRANSFORM.y * INITIAL_TRANSFORM.scale}px) scale(${INITIAL_TRANSFORM.scale})`
        }}
      />

      <div className={`absolute top-6 right-6 z-40 transition-all duration-500 ${isTransformed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={resetTransform}
          className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 shadow-apple flex items-center justify-center text-text-secondary active:scale-90 transition-all"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      <div className="flex-1 w-full h-full relative z-10">
        <svg 
          className="w-full h-full cursor-grab active:cursor-grabbing" 
          viewBox="0 0 400 600" 
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="auto"
        >
            <g 
              ref={gRef} 
              style={{ 
                transformOrigin: 'center', 
                willChange: 'transform',
                transform: `scale(${INITIAL_TRANSFORM.scale}) translate(${INITIAL_TRANSFORM.x}px, ${INITIAL_TRANSFORM.y}px)`
              }}
            >
                {agents.map((agent) => {
                    if (agent.id === 'manager') return null;
                    const aPos = getAgentPosition(agent.id);
                    const isActive = agent.status === AgentStatus.SENDING || agent.status === AgentStatus.THINKING;
                    
                    return (
                        <g key={`link-${agent.id}`}>
                            <line 
                              x1={managerPos.x} y1={managerPos.y} 
                              x2={aPos.x} y2={aPos.y} 
                              stroke={isActive ? "#D97757" : "#E5E5E7"} 
                              strokeWidth={isActive ? 2 : 1} 
                              strokeOpacity={isActive ? 0.6 : 0.2}
                              className="transition-all duration-700"
                            />
                            {isActive && (
                                <circle r="1.5" fill="#D97757">
                                  <animateMotion 
                                    dur="2s" 
                                    repeatCount="indefinite" 
                                    path={`M ${managerPos.x} ${managerPos.y} L ${aPos.x} ${aPos.y}`} 
                                  />
                                </circle>
                            )}
                        </g>
                    );
                })}

                {agents.map((agent) => {
                    const isM = agent.id === 'manager';
                    const pos = getAgentPosition(agent.id);
                    const r = isM ? 34 : 26;
                    const selected = selectedAgentId === agent.id;
                    
                    let accentColor = '#E5E5E7';
                    let glowColor = 'transparent';
                    
                    if (agent.status === AgentStatus.THINKING) { accentColor = '#D97757'; glowColor = 'rgba(217,119,87,0.1)'; }
                    else if (agent.status === AgentStatus.SENDING) { accentColor = '#D97757'; glowColor = 'rgba(217,119,87,0.1)'; }
                    else if (agent.status === AgentStatus.ERROR) { accentColor = '#FF3B30'; glowColor = 'rgba(255,59,48,0.1)'; }
                    
                    // Si sélectionné, le manager devient orange vif, les autres noir intense
                    if (selected) accentColor = isM ? '#D97757' : '#1D1D1F';

                    return (
                        <g 
                          key={agent.id} 
                          transform={`translate(${pos.x}, ${pos.y})`} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!hasMovedRef.current) {
                              setSelectedAgentId(agent.id);
                            }
                          }} 
                          className="agent-node cursor-pointer group"
                        >
                            <circle r={r + 6} fill={glowColor} className="transition-all duration-500" />
                            <circle 
                              r={r} 
                              fill="white" 
                              stroke={accentColor} 
                              strokeWidth={selected ? 3 : 1.2} 
                              className="transition-all duration-300 shadow-sm"
                            />
                            <foreignObject x={-11} y={-11} width={22} height={22} className="pointer-events-none">
                                <div className={`w-full h-full flex items-center justify-center transition-colors ${selected ? (isM ? 'text-accent-claude' : 'text-text-primary') : 'text-text-secondary'}`}>
                                    {getAgentIcon(agent.id, "w-5.5 h-5.5")}
                                </div>
                            </foreignObject>
                            <text 
                              y={r + 20} 
                              textAnchor="middle" 
                              className={`text-[10px] font-bold tracking-widest uppercase transition-colors pointer-events-none ${selected ? (isM ? 'fill-accent-claude' : 'fill-text-primary') : 'fill-text-tertiary'}`}
                            >
                              {agent.name}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
      </div>

      {selectedAgent && (
        <div className="modal-container absolute inset-0 z-50 flex items-center justify-center p-6 animate-fadeIn pointer-events-none">
            <div 
              className="absolute inset-0 bg-black/15 backdrop-blur-[3px] pointer-events-auto" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAgentId(null);
              }}
              onPointerDown={(e) => e.stopPropagation()}
            />
            
            <div 
                className="detail-card relative w-full max-w-sm bg-white/95 backdrop-blur-3xl rounded-[42px] shadow-apple-deep border border-white/40 overflow-hidden animate-slideUp flex flex-col pointer-events-auto touch-auto"
                onPointerDown={(e) => e.stopPropagation()} 
                onWheel={(e) => e.stopPropagation()} 
                style={{ overscrollBehavior: 'contain' }} 
            >
                <button 
                    onClick={() => setSelectedAgentId(null)}
                    className="absolute top-6 right-6 w-9 h-9 rounded-full bg-bg-elevated/50 flex items-center justify-center text-text-secondary active:scale-90 transition-all z-10"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div className="p-9 pt-10">
                    <div className="flex items-center gap-5 mb-9">
                        <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center shadow-sm">
                            {getAgentIcon(selectedAgent.id, "w-9 h-9 text-text-primary")}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[24px] font-serif font-semibold text-text-primary tracking-tight leading-tight">{selectedAgent.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                    selectedAgent.status === AgentStatus.THINKING || selectedAgent.status === AgentStatus.SENDING ? 'bg-accent-claude animate-pulse shadow-[0_0_8px_rgba(217,119,87,0.4)]' :
                                    'bg-text-tertiary'
                                }`} />
                                <span className="text-[12px] font-bold text-text-secondary uppercase tracking-widest">{selectedAgent.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-7 mb-8">
                        <button 
                            onClick={() => setViewMode('status')}
                            className={`text-[15px] font-bold transition-all relative ${viewMode === 'status' ? 'text-text-primary' : 'text-text-tertiary'}`}
                        >
                            Diagnostic
                            {viewMode === 'status' && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-accent-claude rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setViewMode('logs')}
                            className={`text-[15px] font-bold transition-all relative ${viewMode === 'logs' ? 'text-text-primary' : 'text-text-tertiary'}`}
                        >
                            Activités
                            {viewMode === 'logs' && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-accent-claude rounded-full" />}
                        </button>
                    </div>

                    <div className="logs-scroll-area max-h-[300px] overflow-y-auto pb-4 touch-pan-y scroll-smooth no-scrollbar overscroll-contain">
                        {viewMode === 'status' ? (
                            <div className="space-y-5">
                                <div className="bg-bg-elevated/40 rounded-[28px] p-6 border border-border-subtle/50">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Activity size={14} className="text-accent-claude" />
                                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.15em]">Flux Cognitif</span>
                                    </div>
                                    <p className="text-[15px] font-medium text-text-primary italic leading-relaxed">
                                        "{selectedAgent.currentTask || "Traitement des flux entrants..."}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-bg-elevated/40 rounded-[24px] border border-border-subtle/50">
                                        <div className="text-[10px] font-bold text-text-tertiary uppercase mb-1.5 tracking-wider">Rôle</div>
                                        <div className="text-[14px] font-bold text-text-primary">{selectedAgent.role}</div>
                                    </div>
                                    <div className="p-5 bg-bg-elevated/40 rounded-[24px] border border-border-subtle/50">
                                        <div className="text-[10px] font-bold text-text-tertiary uppercase mb-1.5 tracking-wider">Réponse</div>
                                        <div className="text-[14px] font-bold text-accent-green">{(Math.random() * 15 + 2).toFixed(0)}ms</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {logs.filter(l => l.agent === selectedAgent.name || selectedAgent.id === 'manager').slice(0, 15).map((log) => {
                                    const levelColor = 
                                        log.level === 'ERROR' ? 'bg-accent-red' : 
                                        log.level === 'PLAN' ? 'bg-accent-claude' : 
                                        log.level === 'EXECUTE' ? 'bg-accent-green' : 'bg-accent-amber';
                                    return (
                                        <div key={log.id} className="flex items-start gap-4 py-3 border-b border-border-subtle/10 last:border-0 active:bg-bg-elevated/50 transition-colors rounded-lg px-1">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${levelColor} shadow-sm`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] font-medium text-text-primary leading-snug">{log.message}</div>
                                                <div className="text-[10px] font-mono text-text-tertiary opacity-70 mt-1">{log.timestamp}</div>
                                            </div>
                                            <ChevronRight size={12} className="text-text-tertiary opacity-30 mt-1" />
                                        </div>
                                    );
                                })}
                                {logs.length === 0 && (
                                    <div className="text-[13px] font-medium text-text-tertiary text-center py-12">Aucune activité récente</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
