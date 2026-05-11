import { motion } from 'framer-motion';
import { Palette, Users, LayoutGrid, Tag } from 'lucide-react';

const CATEGORIA_CONFIG = {
  'Estilo Visual': { icon: Palette, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  'Elemento Comum': { icon: Users, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  'Formato de Conteúdo': { icon: LayoutGrid, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
};

export default function TendenciaCard({ tendencia, index }) {
  const cfg = CATEGORIA_CONFIG[tendencia.categoria] || CATEGORIA_CONFIG['Estilo Visual'];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.07 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all group"
    >
      {/* Imagem */}
      <div className="w-full aspect-video relative overflow-hidden bg-secondary/30">
        <img
          src={tendencia.imagem_url}
          alt={tendencia.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge de categoria */}
        <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
          <Icon className="w-3 h-3" />
          {tendencia.categoria}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">{tendencia.titulo}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tendencia.descricao}</p>
        </div>

        {/* Exemplos */}
        {tendencia.exemplos?.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Exemplos</p>
            <ul className="space-y-0.5">
              {tendencia.exemplos.map((ex, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {tendencia.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tendencia.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-secondary/60 border border-border rounded-full text-muted-foreground">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}