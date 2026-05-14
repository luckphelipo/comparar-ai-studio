import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Search, Loader2, ImageIcon, Tag, Palette, Users, LayoutGrid, RefreshCw, Sparkles } from 'lucide-react';
import TendenciaCard from '../components/tendencias/TendenciaCard';
import TendenciaFiltros from '../components/tendencias/TendenciaFiltros';

const CATEGORIAS = ['Todos', 'Estilo Visual', 'Elemento Comum', 'Formato de Conteúdo'];

const NICHE_KEYWORDS = [
  'seguro de viagem',
  'seguro viagem internacional',
  'destinos turísticos trending',
  'viagem barata',
  'cobertura médica viagem',
  'passagens aéreas em alta',
  'hotéis e hospedagem trending',
  'viagem de mochila',
  'turismo aventura',
  'seguro viagem europa'
];

export default function AnaliseTendencias() {
  const [keywords, setKeywords] = useState('seguro de viagem e destinos');
  const [loading, setLoading] = useState(false);
  const [tendencias, setTendencias] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [analisado, setAnalisado] = useState(false);

  const handleAnalisar = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setTendencias([]);
    setAnalisado(false);

    // Passo 1: Busca contexto sobre tendências de thumbnails na web
    const buscaResultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em YouTube e design de thumbnails virais para o nicho de SEGURO DE VIAGEM E VIAGENS.
Com base nas palavras-chave: "${keywords}", analise as TENDÊNCIAS ATUAIS de thumbnails que estão performando bem neste nicho específico no YouTube Brasil.

Para cada tendência identificada, gere um prompt detalhado para criar uma imagem ilustrativa dessa tendência e classifique-a.

Responda APENAS com um JSON válido:
{
  "tendencias": [
    {
      "titulo": "<nome curto da tendência>",
      "categoria": "<Estilo Visual | Elemento Comum | Formato de Conteúdo>",
      "descricao": "<descrição em 1-2 frases de como essa tendência se manifesta>",
      "exemplos": ["<exemplo 1>", "<exemplo 2>"],
      "prompt_imagem": "<prompt detalhado para gerar uma thumbnail exemplo desta tendência, estilo YouTube Brasil, 1280x720, alta saturação, impacto visual>",
      "tags": ["<tag1>", "<tag2>", "<tag3>"]
    }
  ]
}

Gere exatamente 6 tendências variadas cobrindo os 3 tipos de categoria.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          tendencias: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                titulo: { type: 'string' },
                categoria: { type: 'string' },
                descricao: { type: 'string' },
                exemplos: { type: 'array', items: { type: 'string' } },
                prompt_imagem: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    });

    const lista = buscaResultado?.tendencias || [];

    // Passo 2: Gera imagem para cada tendência em paralelo
    const comImagens = await Promise.all(
      lista.map(async (t) => {
        const { url } = await base44.integrations.Core.GenerateImage({ prompt: t.prompt_imagem });
        return { ...t, imagem_url: url };
      })
    );

    setTendencias(comImagens);
    setAnalisado(true);
    setLoading(false);
  };

  const tendenciasFiltradas = filtro === 'Todos'
    ? tendencias
    : tendencias.filter(t => t.categoria === filtro);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">Análise de Tendências</h1>
          <p className="text-xs text-muted-foreground">Descubra o que está em alta nas thumbnails do seu nicho</p>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Buscar Tendências</h2>
        </div>
        <div className="flex gap-3">
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalisar()}
            placeholder="Ex: seguro de viagem, finanças pessoais, culinária saudável..."
            className="flex-1 bg-secondary/40 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleAnalisar}
            disabled={loading || !keywords.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-semibold text-sm transition-all glow-blue"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analisando...</>
            ) : analisado ? (
              <><RefreshCw className="w-4 h-4" /> Nova Análise</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Analisar</>
            )}
          </button>
        </div>

        {/* Sugestões rápidas - Nicho Seguro de Viagem */}
         {!analisado && !loading && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Palavras-chave populares do nicho:</p>
            <div className="flex flex-wrap gap-2">
              {NICHE_KEYWORDS.map(s => (
                <button
                  key={s}
                  onClick={() => setKeywords(s)}
                  className="text-xs px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border rounded-full text-muted-foreground hover:text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 border border-border rounded-xl bg-card">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <TrendingUp className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Analisando tendências com IA...</p>
          <p className="text-xs text-muted-foreground mt-1">Buscando na web e gerando exemplos visuais</p>
        </div>
      )}

      {/* Resultados */}
      {analisado && !loading && tendencias.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Resumo */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {tendencias.length} tendências encontradas para <span className="text-primary">"{keywords}"</span>
            </p>
          </div>

          {/* Filtros */}
          <TendenciaFiltros categorias={CATEGORIAS} filtroAtivo={filtro} onFiltroChange={setFiltro} />

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {tendenciasFiltradas.map((t, i) => (
                <TendenciaCard key={i} tendencia={t} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Empty state inicial */}
      {!loading && !analisado && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
          <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Digite palavras-chave do seu nicho e clique em "Analisar"</p>
          <p className="text-xs text-muted-foreground/60 mt-1">A IA buscará tendências visuais em alta e gerará exemplos</p>
        </div>
      )}
    </div>
  );
}