import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export interface ChatMessageItem {
  id: string;
  sessionId: string;
  sender: 'user' | 'admin';
  content: string;
  readByUser: boolean;
  createdAt: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSessionId = (): string => {
    let sid = localStorage.getItem('okarea_chat_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('okarea_chat_session_id', sid);
    }
    return sid;
  };

  const fetchMessages = async () => {
    const sessionId = getSessionId();
    try {
      const markParam = isOpen ? '&markReadBy=user' : '';
      const res = await fetch(`${API_BASE_URL}/chat/messages?sessionId=${sessionId}${markParam}`);
      if (res.ok) {
        const data: ChatMessageItem[] = await res.json();
        setMessages(data);

        if (!isOpen) {
          const unread = data.filter((m) => m.sender === 'admin' && !m.readByUser).length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }
      }
    } catch (e) {
      // Ignorar fallos de red en polling
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending) return;

    const sessionId = getSessionId();
    setIsSending(true);
    setInputText('');

    // Optimistic UI update
    const tempMsg: ChatMessageItem = {
      id: 'temp-' + Date.now(),
      sessionId,
      sender: 'user',
      content: text,
      readByUser: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sender: 'user',
          content: text,
        }),
      });
      fetchMessages();
    } catch (error) {
      // Ignorar error de envío silenciosamente
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[460px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Atención y Consultas
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                    En línea
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Consultas de catálogo, moda y eventos</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <MessageSquare className="w-10 h-10 mb-2 text-purple-400 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-300">¡Hola! ¿En qué te podemos asesorar?</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Haznos cualquier consulta sobre prendas, tallas, calzado, eventos o tiendas de OkArea.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {!isUser && (
                        <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center text-[10px] flex-shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-600/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Haz tu consulta sobre ropa, eventos, tiendas..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className="group relative p-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
