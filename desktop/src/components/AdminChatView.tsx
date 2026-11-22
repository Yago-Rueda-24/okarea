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
    } catch {
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
      const interval = setInterval(() => fetchMessages(selectedSessionId), 2500);
      return () => clearInterval(interval);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedSessionId || isSending) return;

    const text = inputText.trim();
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
    } catch {
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
    } catch {
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
        <div className="flex items-center justify-center gap-3 text-[#88726c] py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Cargando centro de mensajes de soporte...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-4 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-2xl p-4 flex items-center gap-3 text-[#93000a] text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="bg-white border border-[#eee7e3] rounded-3xl overflow-hidden shadow-xs h-[calc(100vh-180px)] min-h-[550px] flex flex-col md:flex-row">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-[#eee7e3] flex flex-col bg-[#faf2ee]/70">
          {/* Header & Search */}
          <div className="p-4 border-b border-[#eee7e3] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1e1b19] flex items-center gap-2 font-serif">
                <MessageSquare className="w-4 h-4 text-primary" />
                Conversaciones Activas
              </h2>
              <button
                onClick={fetchSessions}
                className="p-1.5 rounded-lg bg-white border border-[#eee7e3] text-[#55433e] hover:text-[#1e1b19] cursor-pointer shadow-2xs"
                title="Actualizar lista"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#88726c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar conversación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#eee7e3] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1e1b19] placeholder:text-[#88726c] focus:outline-hidden focus:border-primary shadow-2xs"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#eee7e3]/60">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-[#88726c] text-xs">
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
                        ? 'bg-[#fff8f5] border-l-4 border-primary shadow-2xs'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#eee7e3] flex items-center justify-center text-primary font-bold text-xs shadow-2xs">
                        <User className="w-5 h-5" />
                      </div>
                      {item.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                          {item.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1e1b19] truncate">
                          {displayName}
                        </span>
                        {item.lastMessage && (
                          <span className="text-[10px] text-[#88726c]">
                            {formatTime(item.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#55433e] truncate">
                        {item.lastMessage ? item.lastMessage.content : 'Sin mensajes aún'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Thread Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedSessionData ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 bg-[#faf2ee] border-b border-[#eee7e3] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1e1b19]">
                      {getClientDisplayName(selectedSessionData.session)}
                    </h3>
                    <p className="text-[11px] text-[#88726c] font-mono">
                      Session ID: {selectedSessionData.session.sessionId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#88726c] text-xs">
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
                            <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] order-2 shadow-2xs">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isAdmin
                                ? 'bg-primary text-white rounded-br-none shadow-xs order-1'
                                : 'bg-[#faf2ee] border border-[#eee7e3] text-[#1e1b19] rounded-bl-none shadow-2xs'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#88726c] mt-1 px-1">
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
                className="p-4 bg-[#faf2ee] border-t border-[#eee7e3] flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Escribe una respuesta como administrador..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-white border border-[#eee7e3] rounded-xl px-4 py-2.5 text-xs text-[#1e1b19] placeholder:text-[#88726c] focus:outline-hidden focus:border-primary shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-5 py-2.5 bg-primary hover:bg-[#793019] disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Responder
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#88726c] p-8 text-center">
              <MessageSquare className="w-12 h-12 mb-3 text-[#88726c]/40 stroke-[1.5]" />
              <p className="text-sm font-semibold text-[#1e1b19]">Selecciona una conversación</p>
              <p className="text-xs text-[#88726c] mt-1">
                Elige un cliente de la lista de la izquierda para responder a sus mensajes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
