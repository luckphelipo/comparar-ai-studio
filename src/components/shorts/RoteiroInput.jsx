import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Type } from 'lucide-react';

export default function RoteiroInput({ onRoteiroSelect }) {
  const [tab, setTab] = useState('existente');
  const [roteiros, setRoteiros] = useState([]);
  const [selectedRoteiro, setSelectedRoteiro] = useState('');
  const [manualText, setManualText] = useState('');

  useEffect(() => {
    const fetchRoteiros = async () => {
      const analises = await base44.entities.AnalisesRoteiro.list('-updated_date', 50);
      setRoteiros(analises);
    };
    fetchRoteiros();
  }, []);

  const handleSelectRoteiro = async () => {
    if (!selectedRoteiro) return;
    const roteiro = roteiros.find(r => r.id === selectedRoteiro);
    if (roteiro) {
      onRoteiroSelect(roteiro.texto_roteiro);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualText.trim()) return;
    onRoteiroSelect(manualText);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existente" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Análises Existentes
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Inserir Manualmente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existente" className="space-y-4 mt-4">
          <Select value={selectedRoteiro} onValueChange={setSelectedRoteiro}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma análise de roteiro" />
            </SelectTrigger>
            <SelectContent>
              {roteiros.map(roteiro => (
                <SelectItem key={roteiro.id} value={roteiro.id}>
                  {roteiro.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSelectRoteiro} 
            disabled={!selectedRoteiro}
            className="w-full"
          >
            Usar Roteiro
          </Button>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4 mt-4">
          <Textarea 
            placeholder="Cole ou digite o roteiro aqui..."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className="min-h-48"
          />
          <Button 
            onClick={handleManualSubmit}
            disabled={!manualText.trim()}
            className="w-full"
          >
            Analisar Roteiro
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}