import { motion } from 'framer-motion';
import { ShieldCheck, ShieldX, Info } from 'lucide-react';

const SCORE_MINIMO = 80;

export default function ValidacaoGauge({ scoreGeral }) {
  const validado = scoreGeral >= SCORE_MINIMO;
  const pct = Math.min(scoreGeral / 100, 1);

  // SVG gauge params
  const r = 52;
  const cx = 70;
  const cy = 70;
  const strokeWidth = 10;
  // Semicircle arc: 180°
  const arcLength = Math.PI * r;
  const dashOffset = arcLength * (1 - pct);

  const colorStroke = scoreGeral >= 85 ? '#22c55e' : scoreGeral >= SCORE_MINIMO ? '#eab308' : '#ef4444';

  return (
    <div className={`border rounded-xl p-5 ${validado ? 'bg-green-500/5 border-green-500/20' : 'bg-destructive/5 border-destructive/20'}`}>
      <div className="flex items-center gap-2 mb-4">
        {validado
          ? <ShieldCheck className="w-4 h-4 text-green-500" />
          : <ShieldX className="w-4 h-4 text-destructive" />
        }
        <h3 className="text-sm font-semibold text-foreground">Validação do Roteiro</h3>
      </div>

      <div className="flex flex-col items-center">
        {/* Gauge SVG */}
        <div className="relative" style={{ width: 140, height: 80 }}>
          <svg width={140} height={90} viewBox="0 0 140 90">
            {/* Track */}
            <path
              d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress */}
            <motion.path
              d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
              fill="none"
              stroke={colorStroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={arcLength}
              initial={{ strokeDashoffset: arcLength }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {/* Marker de validação (80%) */}
            {(() => {
              const angle = Math.PI * (1 - SCORE_MINIMO / 100);
              const mx = cx - r * Math.cos(angle);
              const my = cy - r * Math.sin(angle);
              return (
                <circle cx={mx} cy={my} r={4} fill="hsl(var(--highlight))" stroke="hsl(var(--background))" strokeWidth={2} />
              );
            })()}
          </svg>
          {/* Score no centro */}
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: colorStroke }}
            >
              {scoreGeral}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className={`mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono ${
          validado
            ? 'bg-green-500/15 text-green-400 border-green-500/30'
            : 'bg-destructive/15 text-destructive border-destructive/30'
        }`}>
          {validado ? '✓ ROTEIRO VALIDADO' : '✗ ABAIXO DO MÍNIMO'}
        </div>

        {/* Legenda */}
        <div className="mt-3 flex items-start gap-1.5 text-center">
          <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Pontuação mínima para validação: <span className="text-highlight font-bold font-mono">{SCORE_MINIMO}</span>.{' '}
            {validado
              ? 'Seu roteiro está pronto para produção.'
              : `Faltam ${SCORE_MINIMO - scoreGeral} pontos. Aplique as sugestões de melhoria.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}