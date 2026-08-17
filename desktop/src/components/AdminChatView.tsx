import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Search,
} from 'lucide-react';

export interface ChatSessionData {
  session: {
    id: string;
    sessionId: string;
    userName: string | null;
    userEmail: string | null;
    createdAt: string;
    updatedAt: string;
  };
  lastMessage: {
    id: string;
    content: string;
    sender: 'user' | 'admin';
    createdAt: string;
  } | null;
  unreadCount: number;
}

export interface ChatMessageItem {
  id: string;
  sessionId: string;
  sender: 'user' | 'admin';
  content: string;
  readByAdmin: boolean;
  createdAt: string;
}

export default function AdminChatView() {
  const [sessions, setSessions] = useState<ChatSessionData[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
        headers: {
          'x-api-key': ADMIN_API_KEY,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Acceso no autorizado: API Key de Admin no válida.');
        }
        throw new Error(`Error en el servidor (${res.status}) al obtener sesiones de chat.`);
      }

      const data: ChatSessionData[] = await res.json();
      setSessions(data);

      if (!selectedSessionId && data.length > 0) {
        setSelectedSessionId(data[0].session.sessionId);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor de chat.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/chat/messages?sessionId=${sessionId}&markReadBy=admin`,
      );
      if (res.ok) {
        const data: ChatMessageItem[] = await res.json();
        setMessages(data);
      }
    } catch (e) {
      // Ignorar fallos de polling
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
      const interval = setInterval(() => fetchMessages(selectedSessionId), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedSessionId || isSending) return;

    setIsSending(true);
    setInputText('');

    const tempMsg: ChatMessageItem = {
      id: 'temp-' + Date.now(),
      sessionId: selectedSessionId,
      sender: 'admin',
      content: text,
      readByAdmin: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          sender: 'admin',
          content: text,
        }),
      });
      fetchMessages(selectedSessionId);
      fetchSessions();
    } catch (err) {
      // Ignorar error de red silenciosamente
    } finally {
      setIsSending(false);
    }
  };

  const getClientDisplayName = (session: ChatSessionData['session']) => {
    if (session.userName) return session.userName;
    const shortId = session.sessionId.substring(0, 8);
    return `Cliente #${shortId}`;
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const name = getClientDisplayName(s.session).toLowerCase();
    const sid = s.session.sessionId.toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || sid.includes(q);
  });

  const selectedSessionData = sessions.find((s) => s.session.sessionId === selectedSessionId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-3 text-slate-400 py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
          <span className="text-sm font-medium">Cargando centro de mensajes de soporte...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl h-[calc(100vh-180px)] min-h-[550px] flex flex-col md:flex-row">
        
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Conversaciones Activas
              </h2>
              <button
                onClick={fetchSessions}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title="Actualizar lista"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar conversación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 custom-scrollbar">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No se encontraron conversaciones activas.
              </div>
            ) : (
              filteredSessions.map((item) => {
                const isSelected = item.session.sessionId === selectedSessionId;
                const displayName = getClientDisplayName(item.session);
                return (
                  <button
                    key={item.session.id}
                    onClick={() => setSelectedSessionId(item.session.sessionId)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/15 border-l-4 border-purple-500'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400 font-bold text-xs">
                        <User className="w-5 h-5" />
                      </div>
                      {item.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-950">
                          {item.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate">
                          {displayName}
                        </span>
                        {item.lastMessage && (
                          <span className="text-[10px] text-slate-500">
                            {formatTime(item.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.lastMessage
                          ? item.lastMessage.content
                          : 'Sin mensajes aún'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Thread Area */}
        <div className="flex-1 flex flex-col bg-slate-900/40">
          {selectedSessionData ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {getClientDisplayName(selectedSessionData.session)}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Session ID: {selectedSessionData.session.sessionId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                    No hay mensajes en esta conversación.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-end gap-2 max-w-[75%]">
                          {isAdmin && (
                            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-[10px] order-2">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isAdmin
                                ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-600/20 order-1'
                                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">
                          {isAdmin ? 'Administrador' : 'Cliente'} • {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Escribe una respuesta como administrador..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Responder
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-700 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-400">Selecciona una conversación</p>
              <p className="text-xs text-slate-600 mt-1">
                Elige un cliente de la lista de la izquierda para responder a sus mensajes.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
