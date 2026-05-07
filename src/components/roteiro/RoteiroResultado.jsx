import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle2, Zap, MessageSquare, Target, Wand2, RefreshCw } from 'lucide-react';
import ValidacaoGauge from './ValidacaoGauge';
import TituloAnalise from './TituloAnalise';
import TempoCard from './TempoCard';
import PontosChecklist from './PontosChecklist';

const scoreColor = (s) => s >= 85 ? 'score-high' : s >= 65 ? 'score-mid' : 'score-low';
const barColor = (s) => s >= 85 ? 'bg-green-500' : s >= 65 ? 'bg-highlight' : 'bg-destructive';

function ScoreBar({ label, score }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-bold font-mono ${scoreColor(score)}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor(score)}`}
        />
      </div>
    </div>
  );
}

export default function RoteiroResultado({ resultado, onOtimizar, otimizando, onGerarSugestoes, gerandoSugestoes, sugestoesTitulo }) {
  if (!resultado) return null;

  const { title, score_geral, scores, resumo, pontos_fortes, pontos_fracos, sugestoes, gancho, cta, tempo_estimado_minutos, tempo_status, tempo_feedback, analise_titulo } = resultado;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Gauge de Validação */}
      <ValidacaoGauge scoreGeral={score_geral} tempoEstimado={tempo_estimado_minutos} tempoStatus={tempo_status} />

      {/* Análise do Título — logo após validação */}
      {analise_titulo && (
        <TituloAnalise
          analise={analise_titulo}
          onGerarSugestoes={onGerarSugestoes}
          gerandoSugestoes={gerandoSugestoes}
          sugestoes={sugestoesTitulo}
        />
      )}

      {/* Score Geral */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Score Geral</h3>
          </div>
          <div className={`text-3xl font-bold font-mono ${scoreColor(score_geral)}`}>{score_geral}</div>
        </div>

        {title && <p className="text-xs text-muted-foreground mb-4 font-medium">"{title}"</p>}

        <div className="space-y-3">
          {scores.map((s) => (
            <ScoreBar key={s.label} label={s.label} score={s.value} />
          ))}
        </div>
      </div>

      {/* Tempo do Vídeo */}
      {tempo_feedback && (
        <TempoCard
          tempoEstimado={tempo_estimado_minutos}
          tempoStatus={tempo_status}
          tempoFeedback={tempo_feedback}
        />
      )}

      {/* Resumo */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Resumo da IA</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{resumo}</p>
      </div>

      {/* Gancho */}
      {gancho && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Gancho Detectado</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">"{gancho}"</p>
        </div>
      )}

      {/* CTA */}
      {cta && (
        <div className="bg-highlight/5 border border-highlight/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-highlight" />
            <h3 className="text-sm font-semibold text-foreground">CTA Principal</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">"{cta}"</p>
        </div>
      )}

      {/* Pontos Fortes / Fracos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-semibold text-foreground">Pontos Fortes</h3>
          </div>
          <ul className="space-y-2">
            {pontos_fortes.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </div>

        <PontosChecklist pontos={pontos_fracos} />
      </div>

      {/* Sugestões */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Sugestões de Melhoria</h3>
        </div>
        <ul className="space-y-2">
          {sugestoes.map((s, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <span className="text-xs font-bold font-mono text-primary flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{s}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Botão Otimizar Todos os Pontos */}
      {onOtimizar && (
        <button
          onClick={onOtimizar}
          disabled={otimizando}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue-strong"
        >
          {otimizando ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Otimizando roteiro...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Otimizar Todos os Pontos com IA
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}