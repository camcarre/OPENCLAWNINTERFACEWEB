import React from 'react';
import { Agent, AgentStatus, PipelineStep } from './types';
import { 
  Brain, Code, ShieldCheck, Globe, BarChart3, Monitor, 
  PenTool, Send, Wrench, TrendingUp, Home, Briefcase, 
  HeartPulse, Cpu 
} from 'lucide-react';

export const INITIAL_AGENTS: Agent[] = [
  { id: 'main', name: 'Manager', role: 'Orchestrator', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'code-writer', name: 'Code-Writer', role: 'Dev', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'code-reviewer', name: 'Code-Reviewer', role: 'Audit', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'researcher', name: 'Researcher', role: 'Research', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'analyst', name: 'Analyst', role: 'Data', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'browser-agent', name: 'Browser-Agent', role: 'Automation', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'writer', name: 'Writer', role: 'Content', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'messenger', name: 'Messenger', role: 'Communication', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'foundry', name: 'Foundry', role: 'Meta', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'capability-evolver', name: 'Capability-Evolver', role: 'Optimization', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'smart-home', name: 'Smart-Home', role: 'IoT', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'clawwork', name: 'ClawWork', role: 'Professional', status: AgentStatus.IDLE, tokensConsumed: 0 },
  { id: 'heartbeat-agent', name: 'Heartbeat-Agent', role: 'Monitoring', status: AgentStatus.IDLE, tokensConsumed: 0 },
];

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'intake', label: 'INTAKE', status: 'past' },
  { id: 'triage', label: 'TRIAGE', status: 'past' },
  { id: 'plan', label: 'PLAN', status: 'past' },
  { id: 'execute', label: 'EXECUTE', status: 'active' },
  { id: 'verify', label: 'VERIFY', status: 'future' },
  { id: 'deliver', label: 'DELIVER', status: 'future' },
];

export const getAgentIcon = (id: string, className?: string, additionalProps?: any) => {
  const props = { className: className || "w-4 h-4", ...additionalProps };
  switch (id) {
    case 'main': return <Brain {...props} />;
    case 'code-writer': return <Code {...props} />;
    case 'code-reviewer': return <ShieldCheck {...props} />;
    case 'researcher': return <Globe {...props} />;
    case 'analyst': return <BarChart3 {...props} />;
    case 'browser-agent': return <Monitor {...props} />;
    case 'writer': return <PenTool {...props} />;
    case 'messenger': return <Send {...props} />;
    case 'foundry': return <Wrench {...props} />;
    case 'capability-evolver': return <TrendingUp {...props} />;
    case 'smart-home': return <Home {...props} />;
    case 'clawwork': return <Briefcase {...props} />;
    case 'heartbeat-agent': return <HeartPulse {...props} />;
    default: return <Cpu {...props} />;
  }
};
