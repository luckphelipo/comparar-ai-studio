import ComingSoon from '../components/ui/ComingSoon';
import { Wand2 } from 'lucide-react';

export default function Editor() {
  return (
    <ComingSoon
      title="Assistente de Editor"
      description="Receba sugestões inteligentes de cortes, transições, música e ritmo de edição baseadas nos seus melhores vídeos."
      icon={Wand2}
    />
  );
}