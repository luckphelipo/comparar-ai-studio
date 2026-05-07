import ComingSoon from '../components/ui/ComingSoon';
import { Scissors } from 'lucide-react';

export default function Shorts() {
  return (
    <ComingSoon
      title="Auto Shorts"
      description="Detecte automaticamente os melhores momentos do seu vídeo para criar Shorts virais com cortes perfeitos."
      icon={Scissors}
    />
  );
}