import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Zap, MessageSquare, Target, Clock } from 'lucide-react';

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

export default function RoteiroResultado({ resultado }) {
  if (!resultado) return null;

  const { title, score_geral, scores, resumo, pontos_fortes, pontos_fracos, sugestoes, gancho, cta, tempo_estimado_minutos, tempo_status, tempo_feedback } = resultado;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
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
        <div className={`border rounded-xl p-5 ${
          tempo_status === 'ideal' ? 'bg-green-500/5 border-green-500/20' :
          'bg-highlight/5 border-highlight/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Tempo Estimado do Vídeo</h3>
            </div>
            <div className="flex items-center gap-2">
              {tempo_estimado_minutos && (
                <span className="text-xs font-bold font-mono text-foreground">~{tempo_estimado_minutos} min</span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono border ${
                tempo_status === 'ideal' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                tempo_status === 'curto' ? 'bg-highlight/15 text-highlight border-highlight/30' :
                'bg-destructive/15 text-destructive border-destructive/30'
              }`}>
                {tempo_status === 'ideal' ? 'IDEAL' : tempo_status === 'curto' ? 'CURTO' : 'LONGO'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{tempo_feedback}</p>
        </div>
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

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-highlight" />
            <h3 className="text-sm font-semibold text-foreground">Pontos a Melhorar</h3>
          </div>
          <ul className="space-y-2">
            {pontos_fracos.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-highlight mt-1.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </div>
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
    </motion.div>
  );
}