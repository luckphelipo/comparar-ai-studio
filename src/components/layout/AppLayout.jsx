import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
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
};

export default function AppLayout() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: 'Comparar AI Studio', subtitle: '' };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 overflow-hidden">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}