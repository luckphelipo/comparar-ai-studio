import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Upload, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import EditorAnalisesList from '../components/editor/EditorAnalisesList';
import EditorInput from '../components/editor/EditorInput';
import EditorSugestoes from '../components/editor/EditorSugestoes';

export default function Editor() {
  const [analises, setAnalises] = useState([]);
  const [loadingAnalises, setLoadingAnalises] = useState(true);
  const [roteiroSelecionado, setRoteiroSelecionado] = useState(null);
  const [roteiroText, setRoteiroText] = useState('');
  const [gerandoSugestoes, setGerandoSugestoes] = useState(false);
  const [sugestoes, setSugestoes] = useState(null);
  const [passo, setPasso] = useState('selecionar'); // selecionar, colar, gerando, resultado

  useEffect(() => {
    carregarAnalises();
  }, []);

  const carregarAnalises = async () => {
    try {
      const dados = await base44.entities.AnalisesRoteiro.list('-updated_date', 50);
      setAnalises(dados);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
      toast.error('Erro ao carregar análises');
    } finally {
      setLoadingAnalises(false);
    }
  };

  const handleSelectAnalise = (analise) => {
    setRoteiroSelecionado(analise);
    setRoteiroText(analise.texto_roteiro);
    setPasso('gerando');
    gerarSugestoes(analise.texto_roteiro, analise.titulo);
  };

  const handleColadoroteiro = (texto) => {
    setRoteiroSelecionado(null);
    setRoteiroText(texto);
    setPasso('gerando');
    gerarSugestoes(texto, 'Roteiro Colado');
  };

  const gerarSugestoes = async (texto, titulo) => {
    setGerandoSugestoes(true);

    const conversation = await base44.agents.createConversation({
      agent_name: 'assistente_editor',
      metadata: { name: `Edição: ${titulo}` }
    });

    await base44.agents.addMessage(conversation, {
      role: 'user',
      content: `Analisa este roteiro otimizado e sugere inserções de edição para maximizar retenção:

ROTEIRO:
${texto}

Responde APENAS com um JSON válido, seguindo EXATAMENTE este schema:
{
  "duration_total_minutes": <número>,
  "momentos_criticos": [
    {
      "trecho_roteiro": "<TRECHO EXATO do roteiro — copie palavra por palavra>",
      "tipo_insercao": "<tipo>",
      "descricao": "<descrição>",
      "duracao_insercao_segundos": <número>,
      "prompt_ia": "<prompt editável para gerar com IA>"
    }
  ],
  "quebras_visuais_90s": [
    {
      "minuto_aprox": <número>,
      "sugestao": "<tipo de quebra recomendada>"
    }
  ],
  "cta_final": {
    "trecho_roteiro": "<TRECHO EXATO do roteiro do CTA>",
    "sugestao": "<detalhe do CTA visual>"
  },
  "notas_gerais": "<observações sobre ritmo e retenção>"
}`
    });

    let resposta = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const conv = await base44.agents.getConversation(conversation.id);
      const lastMsg = conv.messages?.[conv.messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg?.content) {
        resposta = lastMsg.content;
        break;
      }
    }

    if (!resposta) {
      toast.error('O agente não respondeu a tempo');
      setGerandoSugestoes(false);
      setPasso('selecionar');
      return;
    }

    const jsonMatch = resposta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      toast.error('Resposta da IA inválida');
      setGerandoSugestoes(false);
      setPasso('selecionar');
      return;
    }

    const result = JSON.parse(jsonMatch[0]);
    setSugestoes(result);
    setPasso('resultado');
    setGerandoSugestoes(false);
  };

  const handleVoltar = () => {
    setSugestoes(null);
    setRoteiroSelecionado(null);
    setRoteiroText('');
    setPasso('selecionar');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AnimatePresence mode="wait">
        {passo === 'selecionar' && (
          <motion.div
            key="selecionar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de Análises */}
              <div className="lg:col-span-2">
                <EditorAnalisesList
                  analises={analises}
                  loading={loadingAnalises}
                  onSelect={handleSelectAnalise}
                />
              </div>

              {/* Colar Roteiro */}
              <div>
                <EditorInput onSubmit={handleColadoroteiro} />
              </div>
            </div>
          </motion.div>
        )}

        {passo === 'gerando' && (
          <motion.div
            key="gerando"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Gerando sugestões de edição...</p>
                <p className="text-xs text-muted-foreground mt-1">A IA está analisando o roteiro</p>
              </div>
            </div>
          </motion.div>
        )}

        {passo === 'resultado' && sugestoes && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <button
              onClick={handleVoltar}
              className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium transition-colors"
            >
              ← Voltar
            </button>
            <EditorSugestoes
              sugestoes={sugestoes}
              roteiro={roteiroText}
              titulo={roteiroSelecionado?.titulo || 'Roteiro Colado'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}