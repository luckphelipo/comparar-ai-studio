import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function EditorSugestaoCard({ momento, index, roteiro }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(momento.prompt_ia);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span className="px-2 py-1 bg-highlight/10 text-highlight rounded text-[10px] font-semibold">
              {momento.tipo_insercao}
            </span>
          </div>
          {momento.trecho_roteiro && (
            <div className="bg-secondary/40 rounded-lg p-3 mb-3 border-l-2 border-primary/50">
              <p className="text-[11px] text-muted-foreground font-mono leading-relaxed italic">
                "{momento.trecho_roteiro}"
              </p>
            </div>
          )}
          <p className="text-sm text-foreground font-medium">{momento.descricao}</p>
          <p className="text-xs text-muted-foreground mt-1">Duração: {momento.duracao_insercao_segundos}s</p>
        </div>
        <Wand2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
      </div>

      {/* Prompt Section */}
      <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground">Prompt para IA</p>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-muted-foreground italic flex-1">{momento.prompt_ia}</p>
          <button
            onClick={copyPromptToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors flex-shrink-0"
          >
            {copiedPrompt ? (
              <CheckCircle2 className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}