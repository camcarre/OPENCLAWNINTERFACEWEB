import React, { useState, useEffect } from 'react';
import TabBar from './components/TabBar';
import Dashboard from './screens/Dashboard';
import Arena from './screens/Arena';
import Chat from './screens/Chat';
import { Tab, Agent, AgentStatus, LogEntry, WalletStats, SystemStatus, ChatMessage, DashboardWidgets } from './types';
import { INITIAL_AGENTS } from './constants';
import { Share, PlusSquare, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  
  const [widgets, setWidgets] = useState<DashboardWidgets>({
      systemBanner: true,
      consumption: true,
      history: true,
      detailedStats: true,
      pipeline: true,
      agentPerf: true
  });

  const toggleWidget = (key: keyof DashboardWidgets) => {
    setWidgets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [wallet, setWallet] = useState<WalletStats>({
      todayTokens: 0,
      monthTokens: 0,
      todayCost: 0,
      monthCost: 0,
      lastThreeMonthsCost: 0,
      projectedCost: 0
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
      online: false,
      ip: '76.13.32.171',
      ram: '--',
      disk: '--',
      uptime: '--'
  });
  
  const [currentThought, setCurrentThought] = useState("Waiting for connection...");
  
  // Real-time Sync via WebSocket
  useEffect(() => {
    const ws = new WebSocket('wss://ws-76.13.32.171.sslip.io');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'init' || data.type === 'status_update') {
        if (data.wallet && data.wallet.today && data.wallet.current_month) {
          setWallet({
            todayTokens: data.wallet.today.tokens || 0,
            monthTokens: data.wallet.current_month.tokens || 0,
            todayCost: data.wallet.today.cost || 0,
            monthCost: data.wallet.current_month.cost || 0,
            lastThreeMonthsCost: (data.wallet.averages_last_3_months?.monthly_cost_usd || 0) * 3,
            projectedCost: data.wallet.month_end_projection?.cost_usd || 0
          });
        }
        if (data.system) {
          setSystemStatus(prev => ({ ...prev, ...data.system, online: true }));
        }
      }

      if (data.type === 'activity') {
        setCurrentThought(data.thought);
        
        const newLog: LogEntry = {
            id: Date.now().toString(),
            agent: data.agent,
            message: data.thought,
            timestamp: new Date().toLocaleTimeString(),
            level: 'EXECUTE'
        };
        setLogs(prev => [newLog, ...prev]);

        setAgents(prev => prev.map(a => 
          a.id === data.agent ? { ...a, status: AgentStatus.THINKING } : { ...a, status: AgentStatus.IDLE }
        ));
      }
    };

    ws.onerror = () => setSystemStatus(prev => ({ ...prev, online: false }));
    ws.onclose = () => setSystemStatus(prev => ({ ...prev, online: false }));

    return () => ws.close();
  }, []);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { id: 'init-1', role: 'assistant', content: 'Hello. I am OpenClaw v2.1. How can I assist with your autonomous pipeline today?', timestamp: Date.now() }
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  // PWA iOS Check
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isIOS && !isStandalone) {
      const hasSeenPrompt = localStorage.getItem('pwa_prompt_seen');
      if (!hasSeenPrompt) {
        setShowPwaPrompt(true);
      }
    }
  }, []);

  const closePwaPrompt = () => {
    setShowPwaPrompt(false);
    localStorage.setItem('pwa_prompt_seen', 'true');
  };

  const handleSendMessage = async (text: string) => {
      const newUserMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: text,
          timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, newUserMsg]);
      setIsChatTyping(true);

      try {
        // Direct connection to VPS API (bypassing local proxy which doesn't exist on Vercel)
        // Using the OpenAI compatible endpoint enabled in OpenClaw gateway
        const response = await fetch('https://76.13.32.171.sslip.io/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer rfmvVk9cmyQ7YcxbIE8lnlhBF5MoIwyL'
          },
          body: JSON.stringify({
            model: "moonshot/kimi-k2-0905",
            messages: [{ role: "user", content: text }]
          })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "Message received but no text returned.";
        
        const newAiMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: content,
            timestamp: Date.now()
        };
        setChatMessages(prev => [...prev, newAiMsg]);
      } catch (error) {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Erreur de connexion avec le VPS.",
          timestamp: Date.now()
        }]);
      } finally {
        setIsChatTyping(false);
      }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return (
          <Dashboard 
            systemStatus={systemStatus} 
            wallet={wallet} 
            logs={logs} 
            agents={agents}
            currentThought={currentThought} 
            widgets={widgets}
            onToggleWidget={toggleWidget}
          />
        );
      case Tab.CHAT:
        return <Chat messages={chatMessages} onSendMessage={handleSendMessage} isTyping={isChatTyping} />;
      case Tab.ARENA:
        return <Arena agents={agents} currentThought={currentThought} logs={logs} />;
      default:
        return (
          <Dashboard 
            systemStatus={systemStatus} 
            wallet={wallet} 
            logs={logs} 
            agents={agents}
            currentThought={currentThought} 
            widgets={widgets}
            onToggleWidget={toggleWidget}
          />
        );
    }
  };

  return (
    <div className="font-sans text-text-primary bg-bg-primary h-screen flex flex-col selection:bg-accent-claude selection:text-white overflow-hidden relative">
      
      {/* PWA iOS Prompt */}
      {showPwaPrompt && (
        <div className="fixed bottom-[110px] left-6 right-6 z-[200] animate-slideUp">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[28px] p-5 shadow-apple-deep border border-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-claude flex items-center justify-center text-white shadow-lg">
                  <PlusSquare size={24} />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-text-primary">Installer OpenClaw</h4>
                  <p className="text-[13px] text-text-secondary leading-tight">Installez cette application sur votre iPhone pour une expérience plein écran.</p>
                </div>
              </div>
              <button onClick={closePwaPrompt} className="text-text-tertiary p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 bg-bg-elevated/50 p-3 rounded-xl border border-black/5">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
                Appuyez sur <Share size={16} className="text-accent-blue" />
                puis sur <span className="font-bold">"Sur l'écran d'accueil"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>

      <TabBar 
        currentTab={activeTab} 
        onTabChange={setActiveTab} 
        online={systemStatus.online} 
      />
    </div>
  );
};

export default App;
