import ComingSoon from '../components/ui/ComingSoon';
import { FileText } from 'lucide-react';

export default function Roteiro() {
  return (
    <ComingSoon
      title="Análise de Roteiro"
      description="Faça upload do seu roteiro e a IA irá analisar gancho, ritmo, CTAs e potencial de retenção com scores detalhados."
      icon={FileText}
    />
  );
}