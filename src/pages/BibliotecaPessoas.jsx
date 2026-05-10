import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Upload, Loader2, Trash2, Pencil, X, Check, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

function ApresentadorModal({ apresentador, onSave, onClose }) {
  const [nome, setNome] = useState(apresentador?.nome || '');
  const [descricao, setDescricao] = useState(apresentador?.descricao || '');
  const [fotoUrl, setFotoUrl] = useState(apresentador?.foto_url || '');
  const [fotosExtras, setFotosExtras] = useState(apresentador?.fotos_extras || []);
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const fileRef = useRef(null);
  const extraRef = useRef(null);

  const handleUploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFotoUrl(file_url);
    setUploading(false);
    e.target.value = '';
  };

  const handleUploadExtra = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingExtra(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setFotosExtras(prev => [...prev, ...urls]);
    setUploadingExtra(false);
    e.target.value = '';
  };

  const handleRemoveExtra = (idx) => {
    setFotosExtras(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!nome.trim() || !fotoUrl) return;
    await onSave({ nome, descricao, foto_url: fotoUrl, fotos_extras: fotosExtras });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">{apresentador ? 'Editar Apresentador' : 'Novo Apresentador'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Foto principal */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 overflow-hidden cursor-pointer flex-shrink-0 bg-secondary/30 flex items-center justify-center transition-colors"
          >
            {fotoUrl ? (
              <img src={fotoUrl} alt="foto" className="w-full h-full object-cover" />
            ) : uploading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUploadFoto} />
          <div className="flex-1 space-y-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Nome *</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full mt-1 bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Descrição visual */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Descrição visual (para o prompt)</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: homem branco, cabelo preto curto, camiseta escura, expressão séria..."
            rows={2}
            className="w-full bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        {/* Fotos extras */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Fotos extras de referência</label>
            <button
              onClick={() => extraRef.current?.click()}
              disabled={uploadingExtra}
              className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {uploadingExtra ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImagePlus className="w-3 h-3" />}
              Adicionar
            </button>
          </div>
          <input ref={extraRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUploadExtra} />
          {fotosExtras.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fotosExtras.map((url, i) => (
                <div key={i} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-border">
                  <img src={url} alt={`extra-${i}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveExtra(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!nome.trim() || !fotoUrl}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold transition-all"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BibliotecaPessoas() {
  const [apresentadores, setApresentadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'novo' | apresentador

  const loadApresentadores = async () => {
    const list = await base44.entities.Apresentador.list('-created_date');
    setApresentadores(list);
    setLoading(false);
  };

  useEffect(() => {
    loadApresentadores();
  }, []);

  const handleSave = async (data) => {
    if (modal && modal !== 'novo') {
      await base44.entities.Apresentador.update(modal.id, data);
      toast.success('Apresentador atualizado!');
    } else {
      await base44.entities.Apresentador.create(data);
      toast.success('Apresentador adicionado!');
    }
    setModal(null);
    loadApresentadores();
  };

  const handleDelete = async (id) => {
    await base44.entities.Apresentador.delete(id);
    setApresentadores(prev => prev.filter(a => a.id !== id));
    toast.success('Removido!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Biblioteca de Pessoas</h1>
            <p className="text-xs text-muted-foreground">Apresentadores disponíveis para usar nas thumbnails</p>
          </div>
        </div>
        <button
          onClick={() => setModal('novo')}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-semibold transition-all glow-blue"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          As fotos cadastradas aqui ficam disponíveis para seleção no <strong className="text-foreground">Thumb Designer IA</strong>. Quando você escolher um apresentador, o agente usará a foto como referência visual para gerar a thumbnail.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : apresentadores.length === 0 ? (
        <div
          onClick={() => setModal('novo')}
          className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors group"
        >
          <Users className="w-12 h-12 text-muted-foreground/30 mb-3 group-hover:text-primary/40 transition-colors" />
          <p className="text-sm text-muted-foreground">Nenhum apresentador cadastrado</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Clique para adicionar o primeiro</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apresentadores.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-secondary/30">
                <img src={a.foto_url} alt={a.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setModal(a)}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="w-8 h-8 rounded-lg bg-destructive/60 hover:bg-destructive flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-foreground truncate">{a.nome}</p>
                {a.descricao && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{a.descricao}</p>
                )}
                {a.fotos_extras?.length > 0 && (
                  <p className="text-[10px] text-primary mt-1">+{a.fotos_extras.length} foto(s) extra</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ApresentadorModal
            apresentador={modal !== 'novo' ? modal : null}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}