import { motion } from 'framer-motion';
import { Wand2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function RoteiroOtimizado({ texto, loading }) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-primary/30 rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Roteiro Otimizado pela IA</h3>
        </div>
        {texto && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-secondary/40 text-muted-foreground hover:text-foreground transition-all"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiado ? 'Copiado!' : 'Copiar'}
          </button>
        )}
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <Wand2 className="absolute inset-0 m-auto w-5 h-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Otimizando roteiro...</p>
              <p className="text-xs text-muted-foreground mt-1">O Auditor está corrigindo os pontos fracos</p>
            </div>
          </div>
        ) : (
          <pre className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
            {texto}
          </pre>
        )}
      </div>
    </motion.div>
  );
}