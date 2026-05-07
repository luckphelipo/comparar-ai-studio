import { useState } from 'react';
import { FileText, Upload, Sparkles, RefreshCw, X } from 'lucide-react';

export default function RoteiroInput({ onAnalyze, loading }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAnalyze({ title, text });
  };

  const handleClear = () => {
    setText('');
    setTitle('');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Seu Roteiro</h3>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Título do Vídeo (opcional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: iPhone 16 Pro vs Samsung S25 Ultra"
          className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Text area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Texto do Roteiro</label>
          {text && (
            <button onClick={handleClear} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3 h-3" /> Limpar
            </button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole o texto do seu roteiro aqui... A IA irá analisar gancho, ritmo, CTAs, potencial de retenção e muito mais."
          rows={14}
          className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors leading-relaxed"
        />
        <p className="text-xs text-muted-foreground text-right">{text.split(/\s+/).filter(Boolean).length} palavras</p>
      </div>

      {/* Upload hint */}
      <div className="flex items-center gap-2 p-3 bg-secondary/30 border border-border rounded-lg">
        <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">Dica: cole diretamente o texto do roteiro para uma análise mais precisa da IA.</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Analisando com IA...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Analisar Roteiro
          </>
        )}
      </button>
    </div>
  );
}