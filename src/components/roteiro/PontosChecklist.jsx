import { AlertTriangle, Check, X } from 'lucide-react';
import { useState } from 'react';

function PontoItem({ ponto }) {
  const [status, setStatus] = useState(null); // null | 'manter' | 'otimizar'

  return (
    <li className={`rounded-lg border p-3 transition-all ${
      status === 'manter' ? 'bg-secondary/20 border-border opacity-60' :
      status === 'otimizar' ? 'bg-primary/5 border-primary/30' :
      'bg-secondary/30 border-border'
    }`}>
      <div className="flex items-start gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-highlight mt-1.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{ponto}</p>
      </div>
      {status === null && (
        <div className="flex gap-2 mt-1 pl-3.5">
          <button
            onClick={() => setStatus('manter')}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
          >
            <X className="w-3 h-3" />
            Deixar como está
          </button>
          <button
            onClick={() => setStatus('otimizar')}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all font-medium"
          >
            <Check className="w-3 h-3" />
            Marcar para otimizar
          </button>
        </div>
      )}
      {status === 'manter' && (
        <p className="text-[11px] text-muted-foreground/60 pl-3.5 italic">Mantendo como está</p>
      )}
      {status === 'otimizar' && (
        <p className="text-[11px] text-primary pl-3.5 font-medium">✓ Marcado para otimizar</p>
      )}
    </li>
  );
}

export default function PontosChecklist({ pontos }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-highlight" />
        <h3 className="text-sm font-semibold text-foreground">Pontos a Melhorar</h3>
        <span className="text-[10px] text-muted-foreground font-mono ml-auto">clique para decidir</span>
      </div>
      <ul className="space-y-2">
        {pontos.map((p, i) => (
          <PontoItem key={i} ponto={p} />
        ))}
      </ul>
    </div>
  );
}