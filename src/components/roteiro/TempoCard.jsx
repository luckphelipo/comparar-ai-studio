import { Clock } from 'lucide-react';

export default function TempoCard({ tempoEstimado, tempoStatus, tempoFeedback }) {
  const isIdeal = tempoStatus === 'ideal';
  const isCurto = tempoStatus === 'curto';

  return (
    <div className={`border rounded-xl p-5 ${
      isIdeal ? 'bg-green-500/5 border-green-500/20' :
      isCurto ? 'bg-highlight/5 border-highlight/20' :
      'bg-destructive/5 border-destructive/20'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Tempo Estimado do Vídeo</h3>
        </div>
        <div className="flex items-center gap-2">
          {tempoEstimado && (
            <span className="text-xs font-bold font-mono text-foreground">~{tempoEstimado} min</span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono border ${
            isIdeal ? 'bg-green-500/15 text-green-400 border-green-500/30' :
            isCurto ? 'bg-highlight/15 text-highlight border-highlight/30' :
            'bg-destructive/15 text-destructive border-destructive/30'
          }`}>
            {isIdeal ? 'IDEAL' : isCurto ? 'CURTO' : 'LONGO'}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{tempoFeedback}</p>
    </div>
  );
}