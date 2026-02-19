
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Search, 
  Paperclip,
  Zap,
  Settings2,
  Terminal,
  AudioLines
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  command: string;
  category?: string;
}

const ACTION_ITEMS: ActionItem[] = [
  { icon: <Paperclip size={18} />, label: 'Ajouter photos/fichiers', command: '' },
  { icon: <Zap size={18} className="text-accent-blue" />, label: 'Mode Rapide', command: '/mode_rapide', category: 'VITESSE' },
  { icon: <Zap size={18} className="text-accent-amber" />, label: 'Mode Poussé', command: '/mode_pousse', category: 'VITESSE' },
  { icon: <Search size={18} />, label: 'Mode Profond', command: '/mode_profond', category: 'VITESSE' },
  { icon: <Settings2 size={18} />, label: 'Status Système', command: '/status', category: 'SYSTÈME' },
  { icon: <Terminal size={18} />, label: 'Usage & Coûts', command: '/usage', category: 'SYSTÈME' },
];

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isWelcomeState = messages.length <= 1;

  const getDayName = () => {
    const date = new Date();
    const day = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
    return day;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
    setShowActions(false);
  };

  const handleActionClick = (item: ActionItem) => {
    if (item.command === '') return;
    if (item.command.endsWith(' ')) {
      setInputValue(item.command);
      setShowActions(false);
    } else {
      onSendMessage(item.command);
      setShowActions(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary pt-[env(safe-area-inset-top)] overflow-hidden relative">
      
      {/* Main Content Area - Increased bottom padding to 340px to clear the stacked bars */}
      <div 
        className="flex-1 overflow-y-auto px-5 no-scrollbar pb-[340px]"
        onClick={() => setShowActions(false)}
      >
        {isWelcomeState ? (
          <div className="flex flex-col items-center pt-24 animate-fadeIn">
            
            {/* Orange Flower Icon */}
            <div className="mb-8">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4L26.5 14H21.5L24 4Z" fill="#D97757" />
                <path d="M24 44L21.5 34H26.5L24 44Z" fill="#D97757" />
                <path d="M44 24L34 26.5V21.5L44 24Z" fill="#D97757" />
                <path d="M4 24L14 21.5V26.5L4 24Z" fill="#D97757" />
                <path d="M38.1 38.1L31 32.5L32.5 31L38.1 38.1Z" fill="#D97757" />
                <path d="M9.9 9.9L17 15.5L15.5 17L9.9 9.9Z" fill="#D97757" />
                <path d="M38.1 9.9L32.5 17L31 15.5L38.1 9.9Z" fill="#D97757" />
                <path d="M9.9 38.1L15.5 31L17 32.5L9.9 38.1Z" fill="#D97757" />
                <circle cx="24" cy="24" r="3" fill="#D97757" />
              </svg>
            </div>

            <h2 className="text-[32px] font-serif font-semibold text-text-primary text-center">
              Bon {getDayName().toLowerCase()}, Camille.
            </h2>
          </div>
        ) : (
          <div className="space-y-6 pt-8 pb-12">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-[16px] leading-[1.5] ${
                  msg.role === 'user' 
                    ? 'bg-accent-blue text-white rounded-tr-none' 
                    : 'bg-white border border-border-subtle text-text-primary rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1.5 ml-1">
                <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Input Bar Container - Adjusted bottom to 180px to sit safely above the TabBar pill */}
      <div className="absolute bottom-[180px] left-0 right-0 px-5 z-40 pointer-events-none">
        
        {/* Action Menu (Vertical) */}
        {showActions && (
          <div className="pointer-events-auto mb-4 bg-white rounded-[24px] shadow-apple-deep border border-border-subtle animate-slideUp overflow-hidden max-h-[50vh] overflow-y-auto no-scrollbar">
            <div className="py-1.5">
              {ACTION_ITEMS.map((item, idx) => {
                const showCategory = idx > 0 && ACTION_ITEMS[idx].category !== ACTION_ITEMS[idx-1].category;
                return (
                  <React.Fragment key={idx}>
                    {showCategory && (
                      <div className="px-5 py-1 text-[9px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-elevated/30">
                        {item.category}
                      </div>
                    )}
                    <button
                      className={`w-full flex items-center gap-3.5 px-5 py-2.5 text-left active:bg-bg-elevated transition-colors ${
                        idx === 0 ? 'border-b border-border-subtle/30 mb-1 pb-3' : ''
                      }`}
                      onClick={() => handleActionClick(item)}
                    >
                      <span className="text-text-secondary flex-shrink-0">{item.icon}</span>
                      <span className="text-[13px] font-semibold text-text-primary">{item.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="pointer-events-auto bg-white/95 backdrop-blur-md border border-border-subtle rounded-[32px] shadow-apple pl-1.5 pr-1.5 py-1.5 flex items-center gap-1.5 transition-all duration-300"
        >
          <button 
            type="button" 
            onClick={() => setShowActions(!showActions)}
            className={`p-2.5 text-text-secondary active:bg-bg-elevated rounded-full transition-transform duration-300 ${showActions ? 'rotate-45' : ''}`}
          >
            <Plus size={22} strokeWidth={2} />
          </button>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowActions(false)}
            placeholder="Comment puis-je vous aider ?"
            className="flex-1 bg-transparent border-none text-[14px] font-medium text-text-primary focus:outline-none placeholder:text-text-tertiary resize-none h-auto min-h-[40px] max-h-[120px] py-2.5 no-scrollbar leading-tight text-center"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="flex items-center">
            {inputValue.trim() !== '' ? (
              <button 
                type="submit" 
                className="w-9 h-9 bg-accent-blue rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-md"
              >
                <Send size={16} strokeWidth={3} />
              </button>
            ) : (
              <button 
                type="button" 
                className="p-2.5 text-text-secondary active:opacity-60 transition-opacity"
              >
                <AudioLines size={22} strokeWidth={2} />
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  );
};

export default Chat;
