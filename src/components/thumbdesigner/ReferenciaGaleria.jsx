import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, BookImage, Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ReferenciaGaleria({ onRefsChange }) {
  const [refs, setRefs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadRefs();
  }, []);

  const loadRefs = async () => {
    const list = await base44.entities.ReferenciaThumb.list('-created_date', 20);
    setRefs(list);
    onRefsChange?.(list);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.ReferenciaThumb.create({
        url: file_url,
        nome: file.name.replace(/\.[^.]+$/, ''),
        notas: '',
      });
    }
    await loadRefs();
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (id) => {
    await base44.entities.ReferenciaThumb.delete(id);
    const updated = refs.filter(r => r.id !== id);
    setRefs(updated);
    onRefsChange?.(updated);
  };

  const handleSaveNota = async (id, notas) => {
    await base44.entities.ReferenciaThumb.update(id, { notas });
    setEditingNota(null);
    await loadRefs();
  };

  return (
    <div className="border border-border rounded-xl bg-card/50 overflow-hidden">
      {/* Header colapsável */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookImage className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Galeria de Referências</span>
          {refs.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono">
              {refs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {refs.length > 0 && (
            <span className="text-[11px] text-green-400 font-medium">
              ✓ Guiando o agente
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              {/* Upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border hover:border-primary/40 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all disabled:opacity-60"
              >
                {uploading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enviando...</>
                ) : (
                  <><Upload className="w-3.5 h-3.5" /> Subir thumbnails de referência</>
                )}
              </button>

              {refs.length === 0 && (
                <p className="text-[11px] text-muted-foreground text-center py-2">
                  Suba thumbnails que você gosta — o agente usará como guia visual.
                </p>
              )}

              {/* Grid de referências */}
              <div className="grid grid-cols-2 gap-2">
                {refs.map((ref) => (
                  <div key={ref.id} className="group relative rounded-lg overflow-hidden border border-border bg-secondary/30">
                    <div className="aspect-video relative">
                      <img src={ref.url} alt={ref.nome} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDelete(ref.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-destructive rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    {/* Nota editável */}
                    <div className="p-2">
                      {editingNota === ref.id ? (
                        <NotaEditor
                          initial={ref.notas}
                          onSave={(v) => handleSaveNota(ref.id, v)}
                          onCancel={() => setEditingNota(null)}
                        />
                      ) : (
                        <button
                          onClick={() => setEditingNota(ref.id)}
                          className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground transition-colors line-clamp-2"
                        >
                          {ref.notas || <span className="italic opacity-50">+ adicionar nota de estilo</span>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotaEditor({ initial, onSave, onCancel }) {
  const [value, setValue] = useState(initial || '');
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ex: texto amarelo bold, composição à direita..."
        rows={2}
        autoFocus
        className="w-full bg-secondary/60 border border-primary/30 rounded px-2 py-1 text-[10px] text-foreground resize-none focus:outline-none"
      />
      <div className="flex gap-1">
        <button onClick={() => onSave(value)} className="text-[10px] px-2 py-0.5 bg-primary text-primary-foreground rounded font-medium">Salvar</button>
        <button onClick={onCancel} className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground rounded">Cancelar</button>
      </div>
    </div>
  );
}