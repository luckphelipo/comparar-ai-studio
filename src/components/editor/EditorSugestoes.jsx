import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Copy, CheckCircle2, Clock, AlertCircle, MessageSquare, Zap } from 'lucide-react';
import { toast } from 'sonner';
import EditorSugestaoCard from './EditorSugestaoCard';

export default function EditorSugestoes({ sugestoes, roteiro, titulo }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Cabeçalho com Info */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Sugestões de Edição
            </h2>
            <p className="text-sm text-muted-foreground mt-1">"{titulo}"</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Duração</span>
            </div>
            <p className="text-lg font-bold text-foreground">{sugestoes.duration_total_minutes}m</p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-highlight" />
              <span className="text-xs text-muted-foreground">Inserções</span>
            </div>
            <p className="text-lg font-bold text-foreground">{sugestoes.momentos_criticos?.length || 0}</p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs text-muted-foreground">Quebras</span>
            </div>
            <p className="text-lg font-bold text-foreground">{sugestoes.quebras_visuais_90s?.length || 0}</p>
          </div>
        </div>

        {/* Notas Gerais */}
        {sugestoes.notas_gerais && (
          <div className="bg-highlight/5 border border-highlight/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-highlight flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{sugestoes.notas_gerais}</p>
            </div>
          </div>
        )}
      </div>

      {/* Momentos Críticos */}
      {sugestoes.momentos_criticos && sugestoes.momentos_criticos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Momentos Críticos de Edição
          </h3>

          <AnimatePresence>
            {sugestoes.momentos_criticos.map((momento, idx) => (
              <EditorSugestaoCard
                key={idx}
                momento={momento}
                index={idx}
                roteiro={roteiro}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Quebras Visuais 90s */}
      {sugestoes.quebras_visuais_90s && sugestoes.quebras_visuais_90s.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Quebras Visuais (90s)</h3>
          <div className="space-y-2">
            {sugestoes.quebras_visuais_90s.map((quebra, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
              >
                <span className="text-xs font-bold font-mono text-primary flex-shrink-0">
                  {quebra.minuto_aprox}m
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{quebra.sugestao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Final */}
      {sugestoes.cta_final && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">CTA Final</h3>
          </div>
          {sugestoes.cta_final.trecho_roteiro && (
            <div className="bg-primary/10 rounded-lg p-3 border-l-2 border-primary">
              <p className="text-[11px] text-muted-foreground font-mono leading-relaxed italic">
                "{sugestoes.cta_final.trecho_roteiro}"
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{sugestoes.cta_final.sugestao}</p>
        </div>
      )}
    </motion.div>
  );
}