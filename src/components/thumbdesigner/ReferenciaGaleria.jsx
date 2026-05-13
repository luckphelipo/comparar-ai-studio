import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, BookImage, Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ReferenciaGaleria({ onRefsChange, alwaysExpanded = false }) {
  const [refs, setRefs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [editingTags, setEditingTags] = useState(null);
  const fileInputRef = useRef(null);
  const isOpen = alwaysExpanded || expanded;

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

  const handleSaveTags = async (id, tags) => {
    await base44.entities.ReferenciaThumb.update(id, { tags });
    setEditingTags(null);
    await loadRefs();
  };

  return (
    <div className="overflow-hidden">
      {/* Header colapsável — só aparece quando não é alwaysExpanded */}
      {!alwaysExpanded && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors border border-border rounded-xl bg-card/50"
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
              <span className="text-[11px] text-green-400 font-medium">✓ Guiando o agente</span>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={alwaysExpanded ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={alwaysExpanded ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`space-y-3 ${!alwaysExpanded ? 'px-4 pb-4 border-t border-border pt-3' : ''}`}>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                    {/* Tags */}
                    <div className="px-2 pt-1.5 pb-0">
                      {editingTags === ref.id ? (
                        <TagsEditor
                          initial={ref.tags || []}
                          onSave={(v) => handleSaveTags(ref.id, v)}
                          onCancel={() => setEditingTags(null)}
                        />
                      ) : (
                        <button
                          onClick={() => setEditingTags(ref.id)}
                          className="w-full text-left"
                        >
                          {(ref.tags || []).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {ref.tags.map((tag, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] italic text-muted-foreground/60 block">+ adicionar tags</span>
                          )}
                        </button>
                      )}
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

function TagsEditor({ initial = [], onSave, onCancel }) {
  const predefinedTags = [
    'Topo de Funil', 'Fundo de Funil',
    'Personagem', 'Sem Personagem', 'Com Texto', 'Sem Texto',
    'Informativa', 'Curiosidade', 'Chamativa', 'Contraste Alto',
    'Antes e Depois', 'Expressão Facial', 'Lista', 'Minimalista', 'Urgência'
  ];

  const [selectedTags, setSelectedTags] = useState(initial);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customInput.trim() && !selectedTags.includes(customInput.trim())) {
      setSelectedTags(prev => [...prev, customInput.trim()]);
      setCustomInput('');
      setShowCustom(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Tags predefinidas */}
      <div className="flex flex-wrap gap-1">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-[9px] px-2 py-1 rounded border transition-all ${
              selectedTags.includes(tag)
                ? 'bg-primary/30 border-primary/50 text-primary font-medium'
                : 'bg-secondary/30 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Custom tag input */}
      {showCustom ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder="Nova tag..."
            autoFocus
            className="flex-1 bg-secondary/60 border border-primary/30 rounded px-2 py-1 text-[9px] text-foreground focus:outline-none"
          />
          <button
            onClick={addCustomTag}
            disabled={!customInput.trim()}
            className="text-[9px] px-2 py-1 bg-primary/20 text-primary rounded border border-primary/30 font-medium disabled:opacity-50"
          >
            Adicionar
          </button>
          <button
            onClick={() => { setShowCustom(false); setCustomInput(''); }}
            className="text-[9px] px-2 py-1 bg-secondary/30 text-muted-foreground rounded"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCustom(true)}
          className="text-[9px] px-2 py-1 rounded border border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          + Criar nova tag
        </button>
      )}

      {/* Selected tags preview */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="text-[8px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                className="hover:text-destructive transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Save/Cancel buttons */}
      <div className="flex gap-1 pt-1">
        <button
          onClick={() => onSave(selectedTags)}
          className="text-[10px] px-2 py-0.5 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground rounded hover:bg-secondary/80 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}