import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { FunnelProvider } from '@/lib/FunnelContext';
import { RoteiroProvider } from '@/lib/RoteiroContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Roteiro from './pages/Roteiro.jsx';
import Shorts from './pages/Shorts';
import Thumbnails from './pages/Thumbnails';
import Biblioteca from './pages/Biblioteca';
import Editor from './pages/Editor';
import Configuracoes from './pages/Configuracoes';
import ThumbDesigner from './pages/ThumbDesigner';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xs text-muted-foreground font-mono">Carregando estúdio...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/roteiro" element={<Roteiro />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/thumbnails" element={<Thumbnails />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/thumb-designer" element={<ThumbDesigner />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <FunnelProvider>
        <RoteiroProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
        </RoteiroProvider>
      </FunnelProvider>
    </AuthProvider>
  );
}

export default App;