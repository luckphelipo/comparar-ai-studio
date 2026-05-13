import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, ImageIcon, Wand2, Loader2, Check, X, Upload } from 'lucide-react';
import ReferenciaGaleria from '../components/thumbdesigner/ReferenciaGaleria';
import { useRoteiro } from '@/lib/RoteiroContext';
import { useJobs } from '@/lib/JobContext';
import { useJobProgress } from '@/hooks/useJobProgress';
import { toast } from 'sonner';

export default function ThumbCreator() {
  const { roteiroOriginal } = useRoteiro();
  const { registerJob, getJob, activeJobs } = useJobs();
  const [refs, setRefs] = useState([]);
  
  // Gerador
  const [funnel, setFunnel] = useState('topo'); // 'topo' | 'fundo'
  const [textType, setTextType] = useState('com'); // 'com' | 'sem'
  const [comPersonagem, setComPersonagem] = useState(true); // com ou sem face swap
  const [apresentadores, setApresentadores] = useState([]);
  const [apresentadorSelecionado, setApresentadorSelecionado] = useState(null);
  const [fotoAvulsa, setFotoAvulsa] = useState(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [visual, setVisual] = useState('');
  
  const [thumbs, setThumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resumindoRoteiro, setResumindoRoteiro] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const { job: monitoredJob } = useJobProgress(currentJobId);

  useEffect(() => {
    base44.entities.Apresentador.list('-created_date').then(setApresentadores);
    base44.entities.ReferenciaThumb.list('-created_date').then((allRefs) => {
      setRefs(allRefs);
    });
    
    // Restaura jobs ativos do localStorage
    Object.entries(activeJobs).forEach(([jobId, job]) => {
      if (job.tipo === 'thumbnail' && job.status !== 'concluido' && job.status !== 'erro') {
        setCurrentJobId(jobId);
      }
    });
  }, []);

  useEffect(() => {
    if (roteiroOriginal) {
      setTitle(roteiroOriginal.title || '');
    }
  }, [roteiroOriginal]);

  // Monitora o job em tempo real
  useEffect(() => {
    if (monitoredJob) {
      setProgress(monitoredJob.progresso || 0);
      setLoading(monitoredJob.status === 'processando' || monitoredJob.status === 'iniciado');
      
      if (monitoredJob.status === 'concluido' && monitoredJob.resultado?.url) {
        setThumbs(prev => {
          const exists = prev.some(t => t.url === monitoredJob.resultado.url);
          if (exists) return prev;
          return [...prev, { url: monitoredJob.resultado.url, faceSwapAplicado: monitoredJob.resultado.faceSwap }];
        });
        setCurrentJobId(null);
        toast.success('Thumbnail gerada!');
      }
      
      if (monitoredJob.status === 'erro') {
        setLoading(false);
        setCurrentJobId(null);
        toast.error(monitoredJob.erro || 'Erro ao gerar thumbnail');
      }
    }
  }, [monitoredJob]);

  const handleImportarRoteiro = async () => {
    if (!roteiroOriginal?.text) {
      toast.error('Nenhum roteiro analisado. Primeiro analise um roteiro na aba Roteiro.');
      return;
    }

    setResumindoRoteiro(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Resuma o seguinte roteiro de vídeo em uma frase CURTA (máximo 15 palavras) focada APENAS nos elementos visuais, cenários e contexto visual relevante para criar uma thumbnail de YouTube. Não mencione a ação do apresentador, apenas o contexto visual.

ROTEIRO:
${roteiroOriginal.text}

Responda APENAS com a frase de resumo, sem aspas, sem explicações.`,
      });

      const resumo = response.data?.trim() || '';
      if (resumo) {
        setSubject(resumo);
        toast.success('Contexto visual importado do roteiro!');
      }
    } catch (error) {
      toast.error('Erro ao resumir o roteiro');
    } finally {
      setResumindoRoteiro(false);
    }
  };

  const handleUploadFotoAvulsa = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFotoAvulsa(file_url);
    setApresentadorSelecionado(null);
    setUploadingFoto(false);
    e.target.value = '';
  };

  // Filtrar referências pelo funil selecionado
  const refsParaFunnel = refs.filter(r => !r.funil || r.funil === 'ambos' || r.funil === funnel).map(r => r.url).filter(Boolean);

  const buildPrompt = ({ title, subject, visual, personDesc }) => {
    const funnelDesc = funnel === 'topo' 
      ? 'thumbnail viral de topo de funil, emoção, curiosidade e alto CTR'
      : 'thumbnail de fundo de funil, autoridade, confiança e prova social';
    
    if (textType === 'com') {
      return `YouTube thumbnail 1280x720, estilo YouTube Brasil viral. ${funnelDesc}. ` +
        `Texto ENORME em negrito ocupando 40% da tela à esquerda, cor amarelo vibrante com contorno preto. ` +
        `${comPersonagem && personDesc ? `Pessoa ${personDesc} posicionada à direita, expressão intensa olhando para câmera.` : comPersonagem ? 'Pessoa em destaque à direita, expressão intensa.' : ''} ` +
        `${visual ? `Elemento visual em destaque: ${visual}.` : ''} ` +
        `Fundo fotorrealista relacionado a "${subject}", iluminação dramática com leve desfoque. ` +
        `Alta saturação, alto contraste, impacto visual imediato. Proporção 16:9, qualidade fotorrealista.`;
    } else {
      return `YouTube thumbnail 1280x720, estilo MrBeast Brasil viral, SEM TEXTO, SEM LETRAS. ` +
        `${comPersonagem && personDesc ? `Pessoa ${personDesc}` : comPersonagem ? 'Homem jovem' : ''} ${comPersonagem ? 'com expressão de CHOQUE EXTREMO — boca aberta, olhos arregalados, apontando com o dedo indicador.' : ''} ` +
        `${visual ? `Elemento principal: ${visual}, colocado de forma proeminente.` : `Elemento relacionado a "${subject}" em destaque.`} ` +
        `Fundo fotorrealista icônico relacionado a "${subject}", iluminação dourada dramática. ` +
        `Cores altamente saturadas, alto contraste, fotorrealismo profissional. Proporção 16:9.`;
    }
  };

  const handleGerarUma = async () => {
    if (!title.trim() || !subject.trim()) {
      toast.error('Preencha o título e o assunto do vídeo.');
      return;
    }

    const jobId = `thumb_${Date.now()}`;
    
    // Cria o job no banco de dados
    await base44.entities.Job.create({
      job_id: jobId,
      tipo: 'thumbnail',
      status: 'iniciado',
      progresso: 0,
      parametros: { title, subject, visual, comPersonagem }
    });
    
    registerJob(jobId, 'thumbnail', { title, subject, visual, comPersonagem });
    setCurrentJobId(jobId);
    setLoading(true);
    setProgress(10);

    const faceImageUrl = comPersonagem ? (apresentadorSelecionado?.foto_url || fotoAvulsa || null) : null;
    const personDesc = comPersonagem && apresentadorSelecionado
      ? apresentadorSelecionado.descricao || apresentadorSelecionado.nome
      : '';

    const prompt = buildPrompt({ title, subject, visual, personDesc });

    // Simula aumento gradual de progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 20, 90));
    }, 1000);

    const response = await base44.functions.invoke('gerarThumbLuma', {
      prompt,
      jobId, // Passa o jobId para o backend rastrear
      ...(faceImageUrl ? { image_refs: [faceImageUrl] } : {}),
      ...(refsParaFunnel.length > 0 ? { style_refs: refsParaFunnel.slice(0, 3) } : {}),
    });

    clearInterval(progressInterval);

    const url = response.data?.url;
    if (!url) {
      toast.error('Erro ao gerar thumbnail');
      setLoading(false);
      setCurrentJobId(null);
    } else {
      setThumbs([{ url, faceSwapAplicado: !!faceImageUrl }]);
      setProgress(100);
      setLoading(false);
    }
    setProgress(0);
  };

  const handleGerarVariacoes = async () => {
    if (!title.trim() || !subject.trim()) {
      toast.error('Preencha o título e o assunto do vídeo.');
      return;
    }

    const jobId = `thumb_variations_${Date.now()}`;
    
    // Cria o job no banco de dados
    await base44.entities.Job.create({
      job_id: jobId,
      tipo: 'thumbnail',
      status: 'iniciado',
      progresso: 0,
      parametros: { title, subject, visual, comPersonagem }
    });
    
    registerJob(jobId, 'thumbnail', { title, subject, visual, comPersonagem });
    setCurrentJobId(jobId);
    setLoading(true);
    setProgress(10);

    const faceImageUrl = comPersonagem ? (apresentadorSelecionado?.foto_url || fotoAvulsa || null) : null;
    const personDesc = comPersonagem && apresentadorSelecionado
      ? apresentadorSelecionado.descricao || apresentadorSelecionado.nome
      : '';

    const types = [
      { type: 'com', label: 'Com Texto' },
      { type: 'sem', label: 'Sem Texto' },
    ];

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 1000);

    const newThumbs = [];
    for (const { type, label } of types) {
      const oldTextType = textType;
      const typePrompt = buildPrompt({ title, subject, visual, personDesc }).replace(/COM TEXTO|SEM TEXTO/gi, label);
      
      const response = await base44.functions.invoke('gerarThumbLuma', {
        prompt: typePrompt,
        jobId,
        ...(faceImageUrl ? { image_refs: [faceImageUrl] } : {}),
        ...(refsParaFunnel.length > 0 ? { style_refs: refsParaFunnel.slice(0, 3) } : {}),
      });

      const url = response.data?.url;
      if (url) {
        newThumbs.push({ url, faceSwapAplicado: !!faceImageUrl, label });
      }
    }

    clearInterval(progressInterval);
    setProgress(100);
    setThumbs(prev => [...prev, ...newThumbs]);
    setLoading(false);
    setProgress(0);
    if (newThumbs.length > 0) toast.success('Variações geradas!');
  };

  const faceRefName = comPersonagem ? (apresentadorSelecionado?.nome || (fotoAvulsa ? 'Foto enviada' : null)) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Thumb Creator</h1>
            <p className="text-xs text-muted-foreground">Gerador com Face Swap · 1280×720px</p>
          </div>
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        {/* Funil, Tipo de Texto e Personagem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Tipo de Funil</label>
            <div className="flex gap-2">
              {[
                { value: 'topo', label: '🚀 Topo' },
                { value: 'fundo', label: '🎯 Fundo' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFunnel(opt.value)}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    funnel === opt.value
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-secondary/30 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Tipo de Texto</label>
            <div className="flex gap-2">
              {[
                { value: 'com', label: '📝 Com' },
                { value: 'sem', label: '📸 Sem' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTextType(opt.value)}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    textType === opt.value
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-secondary/30 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Personagem</label>
            <div className="flex gap-2">
              {[
                { value: true, label: '👤 Com' },
                { value: false, label: '🎨 Sem' },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setComPersonagem(opt.value)}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    comPersonagem === opt.value
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-secondary/30 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Briefing */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Título do Vídeo <span className="text-destructive">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Seguro Viagem Vale a Pena?"
                className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Assunto / Contexto <span className="text-destructive">*</span></label>
                {roteiroOriginal && (
                  <button
                    onClick={handleImportarRoteiro}
                    disabled={resumindoRoteiro}
                    className="text-[10px] px-2 py-1 rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-medium transition-all disabled:opacity-50"
                  >
                    {resumindoRoteiro ? '⏳ Resumindo...' : '📋 Importar'}
                  </button>
                )}
              </div>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: reembolso de bagagem extraviada"
                className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Elemento Visual <span className="text-[10px] text-muted-foreground/60 normal-case">(opcional)</span></label>
            <input
              value={visual}
              onChange={(e) => setVisual(e.target.value)}
              placeholder="Ex: mala de viagem, print de app com reembolso"
              className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Face Swap — aparece só se comPersonagem = true */}
        {comPersonagem && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Apresentador para Face Swap</span>
              {faceRefName && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  ✓ {faceRefName}
                </span>
              )}
            </div>

            {apresentadores.length > 0 && (
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
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-[11px] text-muted-foreground">ou envie uma foto</span>
              <div className="flex-1 border-t border-border" />
            </div>

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
        )}

        {/* Botões */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <button
            onClick={handleGerarUma}
            disabled={loading || !title.trim() || !subject.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl font-semibold text-sm transition-all glow-blue"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Thumbnail
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
          {loading && !thumbs.length && (
            <div className="flex items-center justify-center py-16 border border-border rounded-xl bg-card">
              <div className="flex flex-col items-center gap-4 w-full px-8">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-medium text-foreground">Gerando sua thumbnail...</p>
                  <p className="text-xs text-muted-foreground mt-2">Isto pode levar alguns segundos</p>
                </div>
                <div className="w-full max-w-xs">
                  <div className="bg-secondary/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/50"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 text-center font-mono">{progress}%</p>
                </div>
              </div>
            </div>
          )}

          {thumbs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{thumbs.length} imagem(ns) gerada(s)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thumbs.map((thumb, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-secondary/30">
                      <img src={thumb.url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={thumb.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium"
                        >
                          <Wand2 className="w-4 h-4" />
                          Baixar
                        </a>
                      </div>
                    </div>
                    <div className="p-3 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                      {thumb.label && <span className="text-[10px] font-mono text-primary">{thumb.label}</span>}
                      {thumb.faceSwapAplicado && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          face swap ✓
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {!loading && (
                <button
                  onClick={handleGerarVariacoes}
                  className="w-full py-3 bg-secondary/60 hover:bg-secondary border border-border rounded-xl text-sm font-semibold text-foreground transition-all"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Gerar Variações
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {thumbs.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl text-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Preencha as informações acima e clique em "Gerar Thumbnail"</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Será gerada 1 imagem · clique em "Gerar Variações" para mais opções</p>
        </div>
      )}

      {/* Referências na lateral */}
      <div className="bg-card border border-border rounded-xl p-5">
        <ReferenciaGaleria onRefsChange={setRefs} alwaysExpanded />
      </div>
    </div>
  );
}