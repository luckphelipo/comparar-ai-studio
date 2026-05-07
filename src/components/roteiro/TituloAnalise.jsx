import { motion } from 'framer-motion';
import { Type, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, Copy, Check, Lightbulb } from 'lucide-react';
import { useState } from 'react';

const scoreColor = (s) => s >= 80 ? 'score-high' : s >= 55 ? 'score-mid' : 'score-low';
const barColor = (s) => s >= 80 ? 'bg-green-500' : s >= 55 ? 'bg-highlight' : 'bg-destructive';

export default function TituloAnalise({ analise, onGerarSugestoes, gerandoSugestoes, sugestoes }) {
  const [copiadoIdx, setCopiadoIdx] = useState(null);

  if (!analise) return null;

  const { score_alinhamento, feedback, erro_alinhamento, sugestao_correcao } = analise;

  const handleCopy = (texto, idx) => {
    navigator.clipboard.writeText(texto);
    setCopiadoIdx(idx);
    setTimeout(() => setCopiadoIdx(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Score do Título */}
      <div className={`border rounded-xl p-5 ${
        score_alinhamento >= 80 ? 'bg-green-500/5 border-green-500/20' :
        score_alinhamento >= 55 ? 'bg-highlight/5 border-highlight/20' :
        'bg-destructive/5 border-destructive/20'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Análise do Título</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold font-mono ${scoreColor(score_alinhamento)}`}>{score_alinhamento}</span>
            <span className="text-xs text-muted-foreground font-mono">/100</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score_alinhamento}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${barColor(score_alinhamento)}`}
          />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{feedback}</p>

        {/* Erro de alinhamento */}
        {erro_alinhamento && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-destructive mb-1">Erro de Alinhamento de Funil</p>
                <p className="text-xs text-muted-foreground">{erro_alinhamento}</p>
              </div>
            </div>
            {sugestao_correcao && (
              <div className="mt-2 flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-highlight flex-shrink-0" />
                <p className="text-xs text-highlight italic">"{sugestao_correcao}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botão Gerar Sugestões */}
      <button
        onClick={onGerarSugestoes}
        disabled={gerandoSugestoes}
        className="w-full flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-secondary/80 disabled:opacity-60 disabled:cursor-not-allowed border border-border hover:border-primary/40 text-foreground rounded-xl font-semibold text-sm transition-all"
      >
        {gerandoSugestoes ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Gerando sugestões de títulos...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-primary" />
            Gerar 5 Sugestões de Títulos com IA
          </>
        )}
      </button>

      {/* Sugestões de títulos */}
      {sugestoes && sugestoes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-highlight" />
            <h3 className="text-sm font-semibold text-foreground">Sugestões de Títulos</h3>
          </div>
          <ul className="space-y-2">
            {sugestoes.map((titulo, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 p-3 bg-secondary/30 border border-border hover:border-primary/30 rounded-lg group transition-all"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold font-mono text-primary flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-xs text-foreground leading-relaxed">{titulo}</p>
                </div>
                <button
                  onClick={() => handleCopy(titulo, i)}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  {copiadoIdx === i
                    ? <Check className="w-3.5 h-3.5 text-green-400" />
                    : <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                  }
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}