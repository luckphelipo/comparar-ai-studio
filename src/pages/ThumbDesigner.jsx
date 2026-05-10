import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Plus, ImageIcon, Wand2, Loader2, BookImage } from 'lucide-react';
import MessageBubble from '../components/thumbdesigner/MessageBubble';
import ReferenciaGaleria from '../components/thumbdesigner/ReferenciaGaleria';
import { useRoteiro } from '@/lib/RoteiroContext';

export default function ThumbDesigner() {
  const { roteiroOriginal } = useRoteiro();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [refs, setRefs] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'referencias'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    const unsub = base44.agents.subscribeToConversation(activeConv.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    const list = await base44.agents.listConversations({ agent_name: 'thumb_designer' });
    setConversations(list || []);
  };

  const handleNewConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'thumb_designer',
      metadata: { name: `Sessão ${new Date().toLocaleDateString('pt-BR')}` },
    });
    setActiveConv(conv);
    setMessages([]);
    setConversations(prev => [conv, ...prev]);
  };

  const handleSelectConversation = async (conv) => {
    const full = await base44.agents.getConversation(conv.id);
    setActiveConv(full);
    setMessages(full.messages || []);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    let conv = activeConv;
    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: 'thumb_designer',
        metadata: { name: input.slice(0, 40) },
      });
      setActiveConv(conv);
      setConversations(prev => [conv, ...prev]);
    }
    const text = input;
    setInput('');
    setSending(true);

    // Anexa URLs das referências visuais à mensagem se existirem
    const fileUrls = refs.map(r => r.url).filter(Boolean);
    const refNotas = refs.filter(r => r.notas).map(r => `• ${r.nome || 'Ref'}: ${r.notas}`).join('\n');
    const contentWithContext = refs.length > 0
      ? `${text}\n\n[REFERÊNCIAS VISUAIS DO MEU ESTILO — ${refs.length} imagem(ns) anexada(s)${refNotas ? `:\n${refNotas}` : ''}]`
      : text;

    await base44.agents.addMessage(conv, {
      role: 'user',
      content: contentWithContext,
      ...(fileUrls.length > 0 ? { file_urls: fileUrls } : {}),
    });
    setSending(false);
  };

  const handleUseRoteiro = () => {
    if (!roteiroOriginal) return;
    setInput(`Crie 3 variações de thumbnail para este vídeo:\n\nTítulo: ${roteiroOriginal.title || 'Sem título'}\n\nContexto do roteiro:\n${roteiroOriginal.text.slice(0, 600)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isTyping = messages.length > 0 && messages[messages.length - 1]?.role === 'user' && sending === false && activeConv;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden animate-fade-in">
      {/* Sidebar de conversas */}
      <div className="hidden md:flex flex-col w-56 border-r border-border bg-card/50 flex-shrink-0">
        <div className="p-3 border-b border-border">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Sessão
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-[11px] text-muted-foreground text-center py-4">Nenhuma sessão ainda</p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all truncate ${
                activeConv?.id === conv.id
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              {conv.metadata?.name || 'Sessão'}
            </button>
          ))}
        </div>
        {/* Galeria de referências */}
        <div className="p-2 border-t border-border">
          <ReferenciaGaleria onRefsChange={setRefs} />
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header + Tabs */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/30 to-primary/30 border border-primary/20 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Thumb Designer</p>
              <p className="text-[11px] text-muted-foreground">Especialista MrBeast · 3 variações · 1280×720px</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {roteiroOriginal && (
              <button
                onClick={handleUseRoteiro}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/15 border border-primary/30 rounded-lg text-xs text-primary font-medium transition-all"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Usar último roteiro
              </button>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card/30 flex-shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chat' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Chat IA
          </button>
          <button
            onClick={() => setActiveTab('referencias')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'referencias' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <BookImage className="w-3.5 h-3.5" />
            Referências
            {refs.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${activeTab === 'referencias' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
                {refs.length}
              </span>
            )}
          </button>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-5 space-y-4 ${activeTab !== 'chat' ? 'hidden' : ''}`}>
          {!activeConv && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-primary/20 border border-primary/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground mb-2">Thumb Designer IA</h2>
              <p className="text-sm text-muted-foreground mb-1">Especialista no estilo MrBeast</p>
              <p className="text-xs text-muted-foreground/70 max-w-xs">
                Diga o título e contexto do vídeo. O agente gera 3 prompts prontos — Com Texto Bold, Sem Texto Visual e Versão Agressiva — sempre em 1280×720px.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {[
                  'Crie thumbs para um vídeo sobre seguro viagem',
                  'Thumbnail para vídeo de comparação de seguros',
                  'Quero uma versão fundo de funil com autoridade',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 bg-secondary/60 hover:bg-secondary border border-border rounded-full text-muted-foreground hover:text-foreground transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-yellow-500/20 to-primary/20 border border-primary/20 flex items-center justify-center mt-0.5">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-2.5">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Painel de Referências */}
        {activeTab === 'referencias' && (
          <div className="flex-1 overflow-y-auto p-4">
            <ReferenciaGaleria onRefsChange={setRefs} alwaysExpanded />
          </div>
        )}

        {/* Input — só aparece no chat */}
        <div className={`p-4 border-t border-border bg-card/30 flex-shrink-0 ${activeTab !== 'chat' ? 'hidden' : ''}`}>
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descreva o vídeo para gerar as 3 variações de thumbnail..."
              rows={2}
              className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-11 h-11 flex items-center justify-center bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl transition-all glow-blue flex-shrink-0"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">Enter para enviar · Shift+Enter para nova linha</p>
        </div>
      </div>
    </div>
  );
}