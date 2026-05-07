import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';

function highlightTrechos(texto, trechos) {
  if (!trechos || trechos.length === 0) return [{ type: 'text', content: texto }];

  let partes = [{ type: 'text', content: texto }];

  trechos.forEach((item, idx) => {
    const trecho = item.trecho?.trim();
    if (!trecho) return;

    const novasPartes = [];
    partes.forEach((parte) => {
      if (parte.type !== 'text') {
        novasPartes.push(parte);
        return;
      }
      const pos = parte.content.indexOf(trecho);
      if (pos === -1) {
        novasPartes.push(parte);
        return;
      }
      if (pos > 0) novasPartes.push({ type: 'text', content: parte.content.slice(0, pos) });
      novasPartes.push({ type: 'highlight', content: trecho, idx, motivo: item.motivo });
      const after = parte.content.slice(pos + trecho.length);
      if (after) novasPartes.push({ type: 'text', content: after });
    });
    partes = novasPartes;
  });

  return partes;
}

export default function ShortsDestaque({ texto, shortssugeridos }) {
  const [expanded, setExpanded] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);

  if (!shortssugeridos || shortssugeridos.length === 0) return null;

  const partes = highlightTrechos(texto, shortssugeridos);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-border bg-primary/5 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Auto Shorts — Trechos Identificados</h3>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
            {shortssugeridos.length} short{shortssugeridos.length > 1 ? 's' : ''}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="p-5 space-y-4">
          {/* Legenda dos shorts */}
          <div className="flex flex-wrap gap-2">
            {shortssugeridos.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  activeIdx === idx
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
              >
                <Zap className="w-3 h-3" />
                Short {idx + 1}
              </button>
            ))}
          </div>

          {/* Motivo do short ativo */}
          {activeIdx !== null && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-semibold">Short {activeIdx + 1}:</span>{' '}
                {shortssugeridos[activeIdx]?.motivo}
              </p>
            </div>
          )}

          {/* Texto com trechos destacados */}
          <div className="bg-secondary/20 border border-border rounded-lg p-4 max-h-80 overflow-y-auto">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
              {partes.map((parte, i) => {
                if (parte.type === 'text') return <span key={i}>{parte.content}</span>;
                const isActive = activeIdx === parte.idx;
                return (
                  <mark
                    key={i}
                    onClick={() => setActiveIdx(isActive ? null : parte.idx)}
                    title={`Short ${parte.idx + 1}: ${parte.motivo}`}
                    className={`cursor-pointer rounded px-0.5 transition-all ${
                      isActive
                        ? 'bg-primary/40 text-foreground ring-1 ring-primary/60'
                        : 'bg-primary/20 text-foreground hover:bg-primary/35'
                    }`}
                  >
                    {parte.content}
                  </mark>
                );
              })}
            </p>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Clique em um trecho destacado ou nos botões acima para ver o motivo da sugestão.
          </p>
        </div>
      )}
    </div>
  );
}