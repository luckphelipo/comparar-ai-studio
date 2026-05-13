import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Download, Users, Check, X, ChevronRight, Loader2, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useRoteiro } from '@/lib/RoteiroContext';

const VARIACOES = [
  {
    id: 'com_texto',
    label: 'Com Texto Bold',
    badge: 'TEXTO',
    badgeColor: 'bg-yellow-500/20 text-yellow-400',
    buildPrompt: ({ title, subject, visual, personDesc }) =>
      `YouTube thumbnail 1280x720, estilo YouTube Brasil viral. ` +
      `Texto ENORME em negrito ocupando 40% da tela à esquerda, cor amarelo vibrante com contorno preto, tipografia impact/condensed. ` +
      `${personDesc ? `Pessoa ${personDesc} posicionada à direita, expressão intensa olhando para câmera.` : 'Pessoa em destaque à direita, expressão intensa.'} ` +
      `${visual ? `Elemento visual em destaque: ${visual}.` : ''} ` +
      `Fundo fotorrealista relacionado a "${subject}", iluminação dramática com leve desfoque. ` +
      `Borda azul elétrica fina ao redor da imagem. Alta saturação, alto contraste, impacto visual imediato. ` +
      `Referência de estilo: MrBeast Brasil. Proporção 16:9, qualidade fotorrealista.`,
  },
  {
    id: 'sem_texto',
    label: 'Sem Texto',
    badge: 'VISUAL',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    buildPrompt: ({ subject, visual, personDesc }) =>
      `YouTube thumbnail 1280x720, estilo MrBeast Brasil viral, SEM TEXTO, SEM LETRAS, SEM PALAVRAS. ` +
      `${personDesc ? `Pessoa ${personDesc}` : 'Homem jovem'} com expressão de CHOQUE EXTREMO — boca aberta, olhos arregalados, apontando para elemento na cena. ` +
      `${visual ? `Elemento principal: ${visual}.` : `Elemento relacionado a "${subject}".`} ` +
      `Fundo fotorrealista icônico relacionado a "${subject}", iluminação dourada dramática. ` +
      `Cores altamente saturadas, alto contraste, fotorrealismo profissional. Proporção 16:9.`,
  },
  {
    id: 'agressiva',
    label: 'Versão Agressiva',
    badge: 'VIRAL',
    badgeColor: 'bg-red-500/20 text-red-400',
    buildPrompt: ({ subject, visual, personDesc }) =>
      `YouTube thumbnail 1280x720, estilo MrBeast máximo impacto. ` +
      `Texto GIGANTESCO em amarelo com contorno preto, letras maiúsculas bold condensed. ` +
      `${personDesc ? `Pessoa ${personDesc} com expressão CHOCADA exagerada, boca aberta, olhos arregalados.` : 'Pessoa com expressão chocada exagerada.'} ` +
      `${visual ? `Elemento visual exagerado: ${visual}.` : ''} ` +
      `Seta vermelha apontando para elemento principal. Fundo com efeito de luz dramático relacionado a "${subject}". ` +
      `Cores extremamente saturadas. Borda azul brilhante. Máximo clickbait visual. Proporção 16:9, qualidade fotorrealista.`,
  },
];

export default function GeradorComFaceSwap() {
  const { roteiroOriginal } = useRoteiro();
  const [apresentadores, setApresentadores] = useState([]);
  const [apresentadorSelecionado, setApresentadorSelecionado] = useState(null);
  const [fotoAvulsa, setFotoAvulsa] = useState(null); // URL de foto enviada manualmente
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [visual, setVisual] = useState('');

  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(0);

  useEffect(() => {
    base44.entities.Apresentador.list('-created_date').then(setApresentadores);
  }, []);

  useEffect(() => {
    if (roteiroOriginal) {
      setTitle(roteiroOriginal.title || '');
    }
  }, [roteiroOriginal]);

  const handleUploadFotoAvulsa = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFotoAvulsa(file_url);
    setApresentadorSelecionado(null); // deseleciona da biblioteca ao usar foto avulsa
    setUploadingFoto(false);
    e.target.value = '';
  };

  const handleGerar = async () => {
    if (!title.trim() || !subject.trim()) {
      toast.error('Preencha o título e o assunto do vídeo.');
      return;
    }

    // Determina a foto de referência para o face swap
    const faceImageUrl = apresentadorSelecionado?.foto_url || fotoAvulsa || null;
    const personDesc = apresentadorSelecionado
      ? apresentadorSelecionado.descricao || apresentadorSelecionado.nome
      : '';

    setLoading(true);
    setThumbs([]);
    const results = [];

    for (let i = 0; i < VARIACOES.length; i++) {
      setLoadingIdx(i + 1);
      const v = VARIACOES[i];
      const prompt = v.buildPrompt({ title, subject, visual, personDesc });

      const response = await base44.functions.invoke('gerarThumbLuma', {
        prompt,
        ...(faceImageUrl ? { image_refs: [faceImageUrl] } : {}),
      });

      const url = response.data?.url;
      if (!url) {
        toast.error(`Erro ao gerar variação ${i + 1}`);
        continue;
      }

      results.push({
        url,
        label: v.label,
        badge: v.badge,
        badgeColor: v.badgeColor,
        faceSwapAplicado: !!faceImageUrl,
      });
      setThumbs([...results]);
    }

    setLoading(false);
    if (results.length > 0) toast.success('Thumbnails geradas com sucesso!');
  };

  const faceRefName = apresentadorSelecionado?.nome || (fotoAvulsa ? 'Foto enviada' : null);

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Gerador com Face Swap</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Wavespeed</span>
        </div>

        {/* Título e Assunto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Título do Vídeo <span className="text-destructive">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Seguro Viagem Vale a Pena?"
              className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Assunto / Contexto <span className="text-destructive">*</span>
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: reembolso em aeroporto internacional"
              className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Elemento Visual <span className="text-[10px] text-muted-foreground/60 normal-case">(opcional)</span>
          </label>
          <input
            value={visual}
            onChange={(e) => setVisual(e.target.value)}
            placeholder="Ex: print de app com reembolso aprovado, mala de viagem"
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Seleção de Apresentador para Face Swap */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Apresentador para Face Swap
            </label>
            {faceRefName && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                ✓ {faceRefName}
              </span>
            )}
          </div>

          {/* Biblioteca de apresentadores */}
          {apresentadores.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {apresentadores.map((a) => {
                const sel = apresentadorSelecionado?.id === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setApresentadorSelecionado(sel ? null : a);
                      if (!sel) setFotoAvulsa(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      sel
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : 'bg-secondary/30 border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                    }`}
                  >
                    <img src={a.foto_url} alt={a.nome} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    {a.nome}
                    {sel && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Nenhum apresentador na biblioteca.{' '}
              <a href="/biblioteca-pessoas" className="text-primary hover:underline">Adicionar agora →</a>
            </p>
          )}

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-[11px] text-muted-foreground">ou envie uma foto</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Upload de foto avulsa */}
          <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
            fotoAvulsa
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-secondary/20 border-dashed border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
          }`}>
            {uploadingFoto ? (
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            ) : fotoAvulsa ? (
              <img src={fotoAvulsa} alt="ref" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
            ) : (
              <Upload className="w-4 h-4 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">
                {uploadingFoto ? 'Enviando...' : fotoAvulsa ? 'Foto de referência enviada' : 'Enviar foto de referência'}
              </p>
              {!fotoAvulsa && !uploadingFoto && (
                <p className="text-[10px] text-muted-foreground/70">O rosto desta foto será aplicado na thumbnail gerada</p>
              )}
            </div>
            {fotoAvulsa && (
              <button
                onClick={(e) => { e.preventDefault(); setFotoAvulsa(null); }}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadFotoAvulsa} />
          </label>
        </div>

        {/* Aviso sobre face swap */}
        {(apresentadorSelecionado || fotoAvulsa) && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              O rosto de <strong className="text-foreground">{faceRefName}</strong> será aplicado automaticamente em cada thumbnail via Wavespeed Face Swap.
            </p>
          </div>
        )}

        {/* Botão Gerar */}
        <button
          onClick={handleGerar}
          disabled={loading || !title.trim() || !subject.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
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
              Gerar 3 Thumbnails{faceRefName ? ' + Face Swap' : ''}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Resultados */}
      {(thumbs.length > 0 || loading) && (
        <div className="space-y-4">
          {loading && thumbs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 border border-border rounded-xl bg-card">
              <div className="relative w-14 h-14 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Gerando variação {loadingIdx} de 3...</p>
              <p className="text-xs text-muted-foreground mt-1">
                {apresentadorSelecionado || fotoAvulsa ? 'Gerando imagem e aplicando face swap...' : 'Gerando thumbnail com IA...'}
              </p>
            </div>
          )}

          {loading && thumbs.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-foreground">Gerando variação {loadingIdx} de 3...</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {thumbs.map((thumb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
                >
                  <div className="w-full aspect-video relative overflow-hidden bg-secondary/30">
                    <img src={thumb.url} alt={thumb.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                      {thumb.faceSwapAplicado && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          face swap ✓
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty state */}
      {thumbs.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl text-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Preencha o briefing acima e clique em Gerar</p>
          <p className="text-xs text-muted-foreground/60 mt-1">A IA criará 3 variações · com face swap se um apresentador for selecionado</p>
        </div>
      )}
    </div>
  );
}