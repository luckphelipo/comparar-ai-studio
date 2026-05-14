import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, CheckCircle2, Edit2, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function EditorSugestaoCard({ momento, index, roteiro }) {
  const [editandoPrompt, setEditandoPrompt] = useState(false);
  const [promptEditado, setPromptEditado] = useState(momento.prompt_ia || '');
  const [gerandoImagem, setGerandoImagem] = useState(false);
  const [imagemGerada, setImagemGerada] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(promptEditado);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleGerarComIA = async () => {
    if (!promptEditado.trim()) {
      toast.error('Digite um prompt para gerar');
      return;
    }

    setGerandoImagem(true);
    try {
      const resultado = await base44.functions.invoke('gerarImagemWavespeed', {
        prompt: promptEditado
      });
      setImagemGerada(resultado.data.url);
      toast.success('Imagem gerada com sucesso!');
      setEditandoPrompt(false);
    } catch (error) {
      toast.error('Erro ao gerar imagem');
      console.error(error);
    } finally {
      setGerandoImagem(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span className="px-2 py-1 bg-highlight/10 text-highlight rounded text-[10px] font-semibold">
              {momento.tipo_insercao}
            </span>
          </div>
          {momento.trecho_roteiro && (
            <div className="bg-secondary/40 rounded-lg p-3 mb-3 border-l-2 border-primary/50">
              <p className="text-[11px] text-muted-foreground font-mono leading-relaxed italic">
                "{momento.trecho_roteiro}"
              </p>
            </div>
          )}
          <p className="text-sm text-foreground font-medium">{momento.descricao}</p>
          <p className="text-xs text-muted-foreground mt-1">Duração: {momento.duracao_insercao_segundos}s</p>
        </div>
        <Wand2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
      </div>

      {/* Prompt Section */}
      <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">Prompt para IA</p>
          {!editandoPrompt && (
            <button
              onClick={() => setEditandoPrompt(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              Editar
            </button>
          )}
        </div>

        {editandoPrompt ? (
          <div className="space-y-2">
            <textarea
              value={promptEditado}
              onChange={(e) => setPromptEditado(e.target.value)}
              className="w-full h-20 bg-background border border-border rounded-lg p-2 text-xs text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Descreva a imagem/vídeo que quer gerar..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleGerarComIA}
                disabled={gerandoImagem}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-highlight hover:bg-highlight/90 disabled:opacity-60 text-highlight-foreground rounded-lg font-semibold text-xs transition-all"
              >
                {gerandoImagem ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3" />
                    Gerar Imagem
                  </>
                )}
              </button>
              <button
                onClick={() => setEditandoPrompt(false)}
                className="flex-1 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-semibold text-xs transition-all text-foreground"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs text-muted-foreground italic flex-1">{promptEditado}</p>
            <button
              onClick={copyPromptToClipboard}
              className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors flex-shrink-0"
            >
              {copiedPrompt ? (
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Imagem Gerada */}
      {imagemGerada && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg overflow-hidden border border-border"
        >
          <img
            src={imagemGerada}
            alt="Gerada"
            className="w-full h-auto"
          />
        </motion.div>
      )}
    </motion.div>
  );
}