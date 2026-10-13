import React, { useState, useRef, useEffect } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Award, 
  ClipboardCheck, 
  DollarSign, 
  Trophy, 
  Calendar,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface GaditasAIAssistantProps {
  onClose?: () => void;
  isFloating?: boolean;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const GaditasAIAssistant: React.FC<GaditasAIAssistantProps> = ({ onClose, isFloating = false }) => {
  const { currentStudent, siteConfig, tournaments } = useGaditas();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Oss! Sou o **Assistente Inteligente Gaditas Team**.\nPosso te informar sobre sua **graduação**, **frequência nos treinos**, **mensalidade/PIX**, **posição no ranking** e **próximos campeonatos**.\n\nComo posso fortalecer seu treino hoje?`,
      timestamp: 'Agora'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context: {
            student: currentStudent,
            teamName: siteConfig.teamName,
            masterName: siteConfig.masterName,
            tournaments: tournaments.slice(0, 2)
          }
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      const aiReply = data.response || 'Desculpe, ocorreu uma oscilação na conexão com a rede marcial.';

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('Erro ao chamar assistente IA:', err);
      // Fallback response
      const fallbackMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `🥋 Sua mensagem foi recebida! Com base no seu cadastro atual (${currentStudent.belt}, ${currentStudent.attendanceCount} presenças este mês), você está em excelente ritmo no tatame. Mantenha a frequência e tire dúvidas técnicas diretamente com o Prof. ${currentStudent.professorName}. Oss!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Quando é minha próxima graduação?', icon: <Award className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Qual minha frequência de treinos?', icon: <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Quanto devo e chave PIX?', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Qual minha posição no ranking?', icon: <Trophy className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Quando é o próximo campeonato?', icon: <Calendar className="w-3.5 h-3.5 text-blue-400" /> }
  ];

  return (
    <div className={`flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl ${
      isFloating ? 'w-96 h-[550px]' : 'w-full h-[650px]'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-neutral-100 flex items-center gap-1.5 font-cinzel">
              <span>IA Gaditas</span>
              <span className="text-[10px] text-amber-400 font-mono">· Online</span>
            </h2>
            <p className="text-[10px] text-neutral-400">
              Assistente Oficial da Equipe Gaditas
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-neutral-950/60 border-b border-neutral-800/80 overflow-x-auto flex items-center gap-1.5 shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(qp.label)}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0"
          >
            {qp.icon}
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-neutral-950 font-medium rounded-br-none shadow-md'
                  : 'bg-neutral-950/80 text-neutral-200 border border-neutral-800 rounded-bl-none shadow-xs'
              }`}
            >
              {msg.text}
              <span className={`block text-[9px] mt-1 text-right ${
                msg.sender === 'user' ? 'text-neutral-800' : 'text-neutral-500'
              }`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0 border border-neutral-700">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-neutral-400 text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Consultando tatame e histórico...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre graduação, ranking, mensalidade..."
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-hidden focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50 transition-colors shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
