import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Upload, RefreshCw, Download, Sparkles, ImageIcon, Plus, Sliders } from 'lucide-react';

const styles = ['Cinematográfico', 'Minimalista', 'Bold & Colorido', 'Dark Premium', 'Neon Tech'];
const emotions = ['Surpresa', 'Curiosidade', 'Urgência', 'Empolgação', 'Medo de perder'];

const mockThumbs = [
  { id: 1, score: 94, ctr: '8.2%', label: 'Variação A — Contraste Alto' },
  { id: 2, score: 87, ctr: '6.9%', label: 'Variação B — Rosto em Destaque' },
  { id: 3, score: 91, ctr: '7.5%', label: 'Variação C — Texto Impactante' },
  { id: 4, score: 78, ctr: '5.8%', label: 'Variação D — Layout Limpo' },
];

const thumbColors = [
  'from-blue-900 via-blue-800 to-slate-900',
  'from-slate-900 via-purple-900 to-slate-900',
  'from-orange-900 via-red-900 to-slate-900',
  'from-slate-900 via-slate-800 to-blue-950',
];

export default function ThumbGenerator() {
  const [title, setTitle] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cinematográfico');
  const [selectedEmotion, setSelectedEmotion] = useState('Surpresa');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Left — Config Panel */}
      <div className="xl:col-span-2 space-y-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sliders className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Configurações</h3>
          </div>

          {/* Title input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Título do Vídeo</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: iPhone 16 Pro vs Samsung S25 Ultra — Qual o Melhor?"
              rows={3}
              className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estilo Visual</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStyle(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedStyle === s
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Emotion */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Emoção Alvo</label>
            <div className="flex flex-wrap gap-2">
              {emotions.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEmotion(e)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedEmotion === e
                      ? 'bg-highlight/15 border-highlight/40 text-highlight'
                      : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Upload reference */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Imagem de Referência (opcional)</label>
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-xl hover:border-primary/40 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-xs text-muted-foreground">Arraste ou clique para enviar</p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Gerando com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Thumbnails
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right — Results */}
      <div className="xl:col-span-3">
        {!generated && !loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-border rounded-xl">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Configure e gere suas thumbnails</p>
            <p className="text-xs text-muted-foreground/60 mt-1">A IA criará 4 variações únicas</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-border rounded-xl bg-card">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Gerando thumbnails...</p>
                <p className="text-xs text-muted-foreground mt-1">A IA está criando 4 variações únicas</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">4 variações geradas</p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regerar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mockThumbs.map((thumb, i) => (
                <motion.div
                  key={thumb.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all"
                >
                  {/* Mock thumbnail image */}
                  <div className={`w-full aspect-video bg-gradient-to-br ${thumbColors[i]} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white blur-3xl" />
                    </div>
                    <div className="relative z-10 text-center px-4">
                      <p className="text-white text-xs font-bold leading-tight line-clamp-2">
                        {title || 'iPhone 16 Pro vs Samsung S25 Ultra'}
                      </p>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-primary/80 flex items-center justify-center hover:bg-primary transition-colors">
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground mb-2">{thumb.label}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className={`text-xs font-bold font-mono ${thumb.score >= 90 ? 'score-high' : 'score-mid'}`}>{thumb.score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">CTR est.</span>
                          <span className="text-xs font-bold text-highlight">{thumb.ctr}</span>
                        </div>
                      </div>
                      {i === 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlight/20 text-highlight font-mono">MELHOR</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}