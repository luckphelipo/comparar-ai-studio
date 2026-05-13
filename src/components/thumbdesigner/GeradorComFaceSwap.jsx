import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Download, Users, Check, X, Loader2, Upload, ImageIcon, BookImage } from 'lucide-react';
import { toast } from 'sonner';
import { useRoteiro } from '@/lib/RoteiroContext';

const buildPrompt = ({ title, subject, visual, personDesc }) =>
  `YouTube thumbnail 1280x720, estilo YouTube Brasil viral. ` +
  `${personDesc ? `Pessoa ${personDesc} em destaque, expressão intensa olhando para câmera.` : 'Pessoa em destaque, expressão intensa.'} ` +
  `${visual ? `Elemento visual em destaque: ${visual}.` : ''} ` +
  `Fundo fotorrealista relacionado a "${subject}", iluminação dramática com leve desfoque. ` +
  `Alta saturação, alto contraste, impacto visual imediato. ` +
  `Referência de estilo: MrBeast Brasil. Título do vídeo: "${title}". Proporção 16:9, qualidade fotorrealista.`;

export default function GeradorComFaceSwap() {
  const { roteiroOriginal } = useRoteiro();
  const [apresentadores, setApresentadores] = useState([]);
  const [apresentadorSelecionado, setApresentadorSelecionado] = useState(null);
  const [fotoAvulsa, setFotoAvulsa] = useState(null); // URL de foto enviada manualmente
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const [styleRefs, setStyleRefs] = useState([]);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [visual, setVisual] = useState('');

  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.entities.Apresentador.list('-created_date').then(setApresentadores);
    // Busca referências de estilo salvas na biblioteca
    base44.entities.ReferenciaThumb.list('-created_date').then((refs) => {
      setStyleRefs(refs.map(r => r.url).filter(Boolean));
    });
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

  const gerarUma = async () => {
    if (!title.trim() || !subject.trim()) {
      toast.error('Preencha o título e o assunto do vídeo.');
      return;
    }

    const faceImageUrl = apresentadorSelecionado?.foto_url || fotoAvulsa || null;
    const personDesc = apresentadorSelecionado
      ? apresentadorSelecionado.descricao || apresentadorSelecionado.nome
      : '';

    setLoading(true);
    const prompt = buildPrompt({ title, subject, visual, personDesc });

    const response = await base44.functions.invoke('gerarThumbLuma', {
      prompt,
      ...(faceImageUrl ? { image_refs: [faceImageUrl] } : {}),
      ...(styleRefs.length > 0 ? { style_refs: styleRefs.slice(0, 3) } : {}),
    });

    const url = response.data?.url;
    if (!url) {
      toast.error('Erro ao gerar thumbnail');
    } else {
      setThumbs(prev => [...prev, { url, faceSwapAplicado: !!faceImageUrl }]);
      toast.success('Thumbnail gerada!');
    }
    setLoading(false);
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

        {/* Indicador de referências de estilo */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${styleRefs.length > 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-secondary/30 border-border text-muted-foreground'}`}>
          <BookImage className="w-3.5 h-3.5 flex-shrink-0" />
          {styleRefs.length > 0
            ? <span><strong>{styleRefs.length}</strong> referência{styleRefs.length > 1 ? 's' : ''} de estilo detectada{styleRefs.length > 1 ? 's' : ''} — serão usadas na geração automaticamente</span>
            : <span>Nenhuma referência de estilo na biblioteca · <a href="/biblioteca" className="text-primary hover:underline">Adicionar referências →</a></span>
          }
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

        {/* Botões */}
        <div className="flex gap-2">
          <button
            onClick={gerarUma}
            disabled={loading || !title.trim() || !subject.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : thumbs.length > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Gerar Variação
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Thumbnail{faceRefName ? ' + Face Swap' : ''}
              </>
            )}
          </button>
          {thumbs.length > 0 && (
            <button
              onClick={() => setThumbs([])}
              disabled={loading}
              className="px-4 py-3 bg-secondary/60 hover:bg-secondary border border-border rounded-xl text-xs text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {(thumbs.length > 0 || loading) && (
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-foreground">
                {apresentadorSelecionado || fotoAvulsa ? 'Gerando e aplicando face swap...' : 'Gerando thumbnail com IA...'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {thumbs.map((thumb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
                >
                  <div className="w-full aspect-video relative overflow-hidden bg-secondary/30">
                    <img src={thumb.url} alt={`Variação ${i + 1}`} className="w-full h-full object-cover" />
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
                  <div className="p-3 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                    {thumb.faceSwapAplicado && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                        face swap ✓
                      </span>
                    )}
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
          <p className="text-xs text-muted-foreground/60 mt-1">Gera 1 por vez · clique novamente para adicionar variações</p>
        </div>
      )}
    </div>
  );
}