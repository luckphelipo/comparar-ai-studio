import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do seu estúdio de conteúdo' },
  '/roteiro': { title: 'Análise de Roteiro', subtitle: 'Analise e otimize seus roteiros com IA' },
  '/shorts': { title: 'Auto Shorts', subtitle: 'Identifique os melhores momentos para Shorts virais' },
  '/thumbnails': { title: 'Thumb Battle', subtitle: 'Gere e compare thumbnails com IA' },
  '/biblioteca': { title: 'Biblioteca', subtitle: 'Seus projetos e arquivos de produção' },
  '/editor': { title: 'Assistente de Editor', subtitle: 'Assistência inteligente para edição de vídeo' },
  '/configuracoes': { title: 'Configurações', subtitle: 'Gerencie suas preferências e integrações' },
  '/thumb-designer': { title: 'Thumb Designer IA', subtitle: 'Agente especialista no estilo MrBeast · 3 variações · 1280×720px' },
  '/biblioteca-pessoas': { title: 'Biblioteca de Pessoas', subtitle: 'Apresentadores disponíveis para usar nas thumbnails' },
};

export default function AppLayout() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: 'Comparar AI Studio', subtitle: '' };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col md:ml-60 overflow-hidden">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}