import { useState } from 'react';
import { Library } from 'lucide-react';
import ReferenciaGaleria from '../components/thumbdesigner/ReferenciaGaleria';
import BibliotecaPessoas from './BibliotecaPessoas';

export default function Biblioteca() {
  const [aba, setAba] = useState('referencias');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Library className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">Biblioteca</h1>
          <p className="text-xs text-muted-foreground">Gerencie referências e pessoas do seu estúdio</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setAba('referencias')}
          className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
            aba === 'referencias'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Galeria de Referências
        </button>
        <button
          onClick={() => setAba('pessoas')}
          className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
            aba === 'pessoas'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Biblioteca de Pessoas
        </button>
      </div>

      {/* Conteúdo */}
      <div className="bg-card border border-border rounded-xl p-5">
        {aba === 'referencias' && <ReferenciaGaleria alwaysExpanded />}
        {aba === 'pessoas' && <BibliotecaPessoas isEmbedded />}
      </div>
    </div>
  );
}