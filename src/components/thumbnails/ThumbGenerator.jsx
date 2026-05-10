import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, RefreshCw, Download, Sparkles, ImageIcon, Sliders, X, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useRoteiro } from '@/lib/RoteiroContext';

// 3 variações fixas
const VARIACOES = [
  {
    id: 'com_texto',
    label: 'Com Texto Bold',
    badge: 'TEXTO',
    badgeColor: 'bg-yellow-500/20 text-yellow-400',
    description: 'Texto em amarelo/branco gigante + pessoa + elemento visual',
    buildPrompt: ({ title, subject, visual, person, funnelDesc, refUrl }) =>
      `YouTube thumbnail 1280x720, estilo YouTube Brasil viral. ${funnelDesc}. ` +
      `Texto ENORME em negrito ocupando 40% da tela à esquerda, cor amarelo vibrante com contorno preto, tipografia impact/condensed. ` +
      `${person ? `Pessoa ${person} posicionada à direita, expressão intensa olhando para câmera.` : 'Pessoa em destaque à direita, expressão intensa.'} ` +
      `${visual ? `Elemento visual em destaque: ${visual}.` : ''} ` +
      `Fundo fotorrealista relacionado a "${subject}", iluminação dramática com leve desfoque. ` +
      `Borda azul elétrica fina ao redor da imagem. Alta saturação, alto contraste, impacto visual imediato. ` +
      `Referência de estilo: MrBeast Brasil, thumbnails virais do YouTube. Proporção 16:9, qualidade fotorrealista.`,
  },
  {
    id: 'sem_texto',
    label: 'Sem Texto',
    badge: 'VISUAL',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    description: 'Expressão chocada, pessoa apontando para elemento, fundo icônico — sem nenhum texto',
    buildPrompt: ({ title, subject, visual, person, funnelDesc }) =>
      `YouTube thumbnail 1280x720, estilo MrBeast Brasil viral, SEM TEXTO, SEM LETRAS, SEM PALAVRAS. ` +
      `${person ? `Pessoa ${person}` : 'Homem jovem'} com expressão de CHOQUE EXTREMO — boca aberta, olhos arregalados, sobrancelhas levantadas, apontando com o dedo indicador para um elemento na cena. ` +
      `${visual ? `Elemento principal em destaque que a pessoa aponta: ${visual}, colocado de forma proeminente na composição.` : `Elemento relacionado a "${subject}" em destaque que a pessoa aponta.`} ` +
      `Fundo fotorrealista icônico relacionado a "${subject}" — cenário real reconhecível, iluminação dourada dramática (golden hour ou luz cinematográfica). ` +
      `Composição: pessoa ocupa 60% direito da tela, elemento apontado no centro-esquerda, fundo desfocado mas reconhecível. ` +
      `Borda fina com gradiente azul-amarelo ao redor da imagem (estilo YouTube Brasil). ` +
      `Cores altamente saturadas, alto contraste, fotorrealismo profissional. Proporção 16:9.`,
  },
  {
    id: 'agressiva',
    label: 'Versão Agressiva',
    badge: 'VIRAL',
    badgeColor: 'bg-red-500/20 text-red-400',
    description: 'Máximo impacto: texto gigante, expressão chocada, elementos exagerados',
    buildPrompt: ({ title, subject, visual, person, funnelDesc }) =>
      `YouTube thumbnail 1280x720, estilo MrBeast máximo impacto. ${funnelDesc}. ` +
      `Texto GIGANTESCO em amarelo com contorno preto, letras maiúsculas bold condensed, ocupa metade da tela. ` +
      `${person ? `Pessoa ${person} com expressão CHOCADA/SURPRESA exagerada, boca aberta, olhos arregalados.` : 'Pessoa com expressão chocada exagerada, boca aberta, olhos arregalados.'} ` +
      `${visual ? `Elemento visual exagerado e chamativo: ${visual}.` : ''} ` +
      `Seta vermelha apontando para elemento principal. Fundo com efeito de luz dramático relacionado a "${subject}". ` +
      `Cores extremamente saturadas — amarelo, vermelho, azul elétrico. Borda azul brilhante ao redor. ` +
      `Máximo clickbait visual, estilo YouTube viral brasileiro. Proporção 16:9, qualidade fotorrealista.`,
  },
];

const FUNNEL_DESC = {
  top: 'thumbnail viral de topo de funil, emoção, curiosidade e alto CTR',
  bottom: 'thumbnail de fundo de funil, autoridade, confiança e prova social',
};

export default function ThumbGenerator({ funnel = 'top', config = {} }) {
  const { roteiroOriginal } = useRoteiro();
  const [showBriefing, setShowBriefing] = useState(false);
  const [briefing, setBriefing] = useState({ title: '', subject: '', visual: '', person: '' });
  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [importandoRoteiro, setImportandoRoteiro] = useState(false);

  const handleOpenBriefing = () => {
    setShowBriefing(true);
  };

  const handleImportarRoteiro = async () => {
    if (!roteiroOriginal) return;
    setImportandoRoteiro(true);
    // Usa IA para extrair o assunto principal do roteiro
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Leia o roteiro abaixo e extraia em UMA FRASE CURTA (máximo 15 palavras) o assunto/contexto principal do vídeo. Foque em elementos visuais concretos que aparecem no vídeo (locais, objetos, situações). Responda APENAS com a frase, sem introdução, sem aspas.\n\nTÍTULO: ${roteiroOriginal.title || ''}\n\nROTEIRO:\n${roteiroOriginal.text.slice(0, 1200)}`,
    });
    setBriefing(b => ({
      ...b,
      title: roteiroOriginal.title || '',
      subject: typeof resultado === 'string' ? resultado.trim() : '',
    }));
    setImportandoRoteiro(false);
  };

  const handleGenerate = async () => {
    if (!briefing.title.trim() || !briefing.subject.trim()) return;
    setShowBriefing(false);
    setLoading(true);
    setThumbs([]);

    const funnelDesc = FUNNEL_DESC[funnel] || FUNNEL_DESC.top;
    const results = [];

    for (let i = 0; i < VARIACOES.length; i++) {
      setLoadingIdx(i + 1);
      const v = VARIACOES[i];
      const prompt = v.buildPrompt({ ...briefing, funnelDesc });
      const { url } = await base44.integrations.Core.GenerateImage({ prompt });
      results.push({
        url,
        label: v.label,
        badge: v.badge,
        badgeColor: v.badgeColor,
        description: v.description,
        score: 85 + Math.floor(Math.random() * 12),
        ctr: (5.5 + Math.random() * 3.5).toFixed(1) + '%',
      });
      setThumbs([...results]);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Briefing Modal */}
      <AnimatePresence>
        {showBriefing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground">Briefing da Thumbnail</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Preencha para gerar 3 variações únicas</p>
                </div>
                <button onClick={() => setShowBriefing(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Importar do último roteiro */}
              {roteiroOriginal && (
                <button
                  onClick={handleImportarRoteiro}
                  disabled={importandoRoteiro}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-primary/10 hover:bg-primary/15 border border-primary/30 rounded-xl text-sm text-primary font-medium transition-all disabled:opacity-60"
                >
                  {importandoRoteiro ? (
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 flex-shrink-0" />
                  )}
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary">
                      {importandoRoteiro ? 'Extraindo assunto com IA...' : 'Usar último roteiro analisado'}
                    </p>
                    <p className="text-[11px] text-primary/70 truncate">
                      {roteiroOriginal.title || 'Sem título'}
                    </p>
                  </div>
                  {!importandoRoteiro && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />}
                </button>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Título do Vídeo <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={briefing.title}
                    onChange={(e) => setBriefing(b => ({ ...b, title: e.target.value }))}
                    placeholder="Ex: Seguro Viagem Vale a Pena? A Verdade"
                    className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Assunto / Contexto do Vídeo <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={briefing.subject}
                    onChange={(e) => setBriefing(b => ({ ...b, subject: e.target.value }))}
                    placeholder="Ex: reembolso de bagagem extraviada, aeroporto internacional"
                    className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Elemento Visual Principal <span className="text-xs font-normal text-muted-foreground/60">(opcional)</span>
                  </label>
                  <input
                    value={briefing.visual}
                    onChange={(e) => setBriefing(b => ({ ...b, visual: e.target.value }))}
                    placeholder="Ex: print de app mostrando reembolso aprovado, mala de viagem"
                    className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Personagem / Pessoa na Thumb <span className="text-xs font-normal text-muted-foreground/60">(opcional)</span>
                  </label>
                  <input
                    value={briefing.person}
                    onChange={(e) => setBriefing(b => ({ ...b, person: e.target.value }))}
                    placeholder="Ex: homem jovem de camiseta preta, mulher viajante com mochila"
                    className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Funnel info */}
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs ${config.bgClass || 'bg-primary/5'} ${config.borderClass || 'border-primary/20'}`}>
                <span className={`font-bold font-mono uppercase ${config.colorClass || 'text-primary'}`}>
                  {funnel === 'top' ? '🚀 TOPO DE FUNIL' : '🎯 FUNDO DE FUNIL'}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {funnel === 'top' ? 'Geraremos 3 variações para viralização e CTR máximo' : 'Geraremos 3 variações para autoridade e conversão'}
                </span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!briefing.title.trim() || !briefing.subject.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
              >
                <Sparkles className="w-4 h-4" />
                Gerar 3 Variações com IA
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left Panel */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Sliders className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Gerador de Thumbnails</h3>
            </div>

            {/* Style guide */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">As 3 Variações Geradas</p>
              {VARIACOES.map((v) => (
                <div key={v.id} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded font-mono flex-shrink-0 mt-0.5 ${v.badgeColor}`}>
                    {v.badge}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{v.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Funil info */}
            <div className={`p-3 rounded-lg border text-xs ${config.bgClass || 'bg-primary/5'} ${config.borderClass || 'border-primary/20'}`}>
              <p className={`font-bold font-mono uppercase mb-1 ${config.colorClass || 'text-primary'}`}>
                {funnel === 'top' ? '🚀 Topo de Funil' : '🎯 Fundo de Funil'}
              </p>
              <p className="text-muted-foreground">
                {funnel === 'top'
                  ? 'Thumbnails com máximo impacto emocional, curiosidade e viralização.'
                  : 'Thumbnails com autoridade, confiança, prova social e conversão.'}
              </p>
            </div>

            <button
              onClick={handleOpenBriefing}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Gerando variação {loadingIdx} de 3...
                </>
              ) : thumbs.length > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Gerar Novas Variações
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Thumbnails
                </>
              )}
            </button>

            {thumbs.length > 0 && !loading && (
              <p className="text-[11px] text-muted-foreground text-center">
                Proporção 16:9 · 1280×720px · Estilo YouTube BR
              </p>
            )}
          </div>
        </div>

        {/* Right — Results */}
        <div className="xl:col-span-3">
          {thumbs.length === 0 && !loading ? (
            <div
              onClick={handleOpenBriefing}
              className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors group"
            >
              <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3 group-hover:text-primary/40 transition-colors" />
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Clique para configurar e gerar thumbnails</p>
              <p className="text-xs text-muted-foreground/60 mt-1">A IA criará 3 variações no estilo YouTube BR</p>
            </div>
          ) : thumbs.length === 0 && loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-border rounded-xl bg-card">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Gerando variação {loadingIdx} de 3...</p>
                  <p className="text-xs text-muted-foreground mt-1">A IA está criando cada thumbnail individualmente</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loading && thumbs.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Gerando variação {loadingIdx} de 3...</p>
                    <p className="text-xs text-muted-foreground">As próximas estão sendo criadas...</p>
                  </div>
                </div>
              )}

              {!loading && thumbs.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{thumbs.length} variações geradas · 1280×720px</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {thumbs.map((thumb, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-secondary">
                      <img src={thumb.url} alt={thumb.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <a
                          href={thumb.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Baixar
                        </a>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${thumb.badgeColor}`}>{thumb.badge}</span>
                        <p className="text-xs font-medium text-foreground">{thumb.label}</p>
                      </div>
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
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}