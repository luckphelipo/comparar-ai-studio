import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { History, ImageIcon, BookImage, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function extrairImagensDoChat(messages) {
  const imagens = [];
  messages.forEach((msg) => {
    if (msg.role === 'assistant' && msg.content) {
      // Extrai URLs de imagem do markdown: ![...](url) ou links diretos
      const mdImgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
      const urlRegex = /https?:\/\/[^\s"')]+\.(?:png|jpg|jpeg|webp|gif)[^\s"')"]*/gi;
      let match;
      while ((match = mdImgRegex.exec(msg.content)) !== null) {
        imagens.push(match[1]);
      }
      while ((match = urlRegex.exec(msg.content)) !== null) {
        if (!imagens.includes(match[0])) imagens.push(match[0]);
      }
    }
  });
  return [...new Set(imagens)];
}

function extrairRefs(messages) {
  for (const msg of messages) {
    if (msg.role === 'user' && msg.content?.includes('REFERÊNCIAS VISUAIS')) {
      const match = msg.content.match(/(\d+) imagem\(ns\) anexada/);
      const count = match ? parseInt(match[1]) : 0;
      const notasMatch = msg.content.match(/:\n([\s\S]*?)\]/);
      const notas = notasMatch ? notasMatch[1].trim() : '';
      return { count, notas, fileUrls: msg.file_urls || [] };
    }
  }
  return null;
}

function SessaoCard({ conv }) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded && messages === null) {
      setLoading(true);
      const full = await base44.agents.getConversation(conv.id);
      setMessages(full.messages || []);
      setLoading(false);
    }
    setExpanded(v => !v);
  };

  const imagens = messages ? extrairImagensDoChat(messages) : [];
  const refs = messages ? extrairRefs(messages) : null;
  const data = conv.created_date
    ? format(new Date(conv.created_date), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })
    : '';

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={handleExpand}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{conv.metadata?.name || 'Sessão'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground">{data}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {loading && <div className="w-3.5 h-3.5 border border-primary border-t-transparent rounded-full animate-spin" />}
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && messages !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border px-4 pb-4 pt-3 space-y-3"
        >
          {/* Referências usadas */}
          {refs && refs.count > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <BookImage className="w-3 h-3 text-primary" />
                <p className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                  {refs.count} referência(s) usada(s)
                </p>
              </div>
              {refs.fileUrls.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {refs.fileUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`ref-${i}`}
                      className="w-14 h-10 object-cover rounded-md border border-border"
                    />
                  ))}
                </div>
              )}
              {refs.notas && (
                <p className="text-[10px] text-muted-foreground bg-secondary/40 rounded-lg px-2 py-1.5 whitespace-pre-wrap">
                  {refs.notas}
                </p>
              )}
            </div>
          )}

          {/* Imagens geradas */}
          {imagens.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {imagens.length} imagem(ns) gerada(s)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {imagens.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="group relative rounded-lg overflow-hidden border border-border">
                    <img src={url} alt={`gerada-${i}`} className="w-full aspect-video object-cover group-hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic">Nenhuma imagem encontrada nesta sessão.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function HistoricoGeracoes({ conversations }) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <History className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Nenhuma geração ainda</p>
        <p className="text-xs text-muted-foreground/60 mt-1">As sessões aparecerão aqui com as imagens e referências usadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
        {conversations.length} sessão(ões) encontrada(s)
      </p>
      {conversations.map((conv) => (
        <SessaoCard key={conv.id} conv={conv} />
      ))}
    </div>
  );
}