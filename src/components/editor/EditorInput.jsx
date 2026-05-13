import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardPaste as Paste, Send } from 'lucide-react';

export default function EditorInput({ onSubmit }) {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setLoading(true);
    onSubmit(texto);
    setTexto('');
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Paste className="w-4 h-4 text-highlight" />
        <h3 className="text-sm font-semibold text-foreground">Colar Roteiro</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole seu roteiro aqui..."
          className="w-full h-48 bg-secondary/30 border border-border rounded-lg p-3 text-xs text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={!texto.trim() || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-highlight hover:bg-highlight/90 disabled:opacity-60 disabled:cursor-not-allowed text-highlight-foreground rounded-lg font-semibold text-sm transition-all"
        >
          <Send className="w-4 h-4" />
          Gerar Sugestões
        </button>
      </form>
    </motion.div>
  );
}