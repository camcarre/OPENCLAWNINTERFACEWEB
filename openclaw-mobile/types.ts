export enum Tab {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  ARENA = 'arena',
}

export enum AgentStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SENDING = 'SENDING',
  ERROR = 'ERROR',
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask?: string;
  lastActive?: number;
  tokensConsumed: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'EXECUTE' | 'PLAN' | 'TRIAGE' | 'ERROR' | 'DELIVER';
  agent: string;
  message: string;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'PDF' | 'HTML' | 'IMG' | 'LOG';
  size: string;
  agent: string;
  timestamp: string;
  path: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  status: 'past' | 'active' | 'future';
}

export interface WalletStats {
  todayTokens: number;
  monthTokens: number;
  todayCost: number;
  monthCost: number;
  lastThreeMonthsCost: number;
  projectedCost: number;
}

export interface SystemStatus {
  online: boolean;
  ip: string;
  ram: string;
  disk: string;
  uptime: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface DashboardWidgets {
  systemBanner: boolean;
  consumption: boolean;
  history: boolean;
  detailedStats: boolean;
  pipeline: boolean;
  agentPerf: boolean;
}