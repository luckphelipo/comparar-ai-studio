import { Palette, Users, LayoutGrid, LayoutDashboard } from 'lucide-react';

const ICONS = {
  'Todos': LayoutDashboard,
  'Estilo Visual': Palette,
  'Elemento Comum': Users,
  'Formato de Conteúdo': LayoutGrid,
};

export default function TendenciaFiltros({ categorias, filtroAtivo, onFiltroChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categorias.map((cat) => {
        const Icon = ICONS[cat] || LayoutDashboard;
        const isActive = filtroAtivo === cat;
        return (
          <button
            key={cat}
            onClick={() => onFiltroChange(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat}
          </button>
        );
      })}
    </div>
  );
}