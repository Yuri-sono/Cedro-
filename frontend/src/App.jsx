import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PageTransition from './components/PageTransition.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';
import EmergencyButton from './components/EmergencyButton.jsx';
import './styles/emergency-button.css';

import './styles/dashboard-psicologo.css';
import './styles/navbar-spacing.css';
import './styles/theme.css';
import './styles/notifications.css';
import './styles/cedro-colors.css';
import './styles/page-transitions.css';

import NotificationSystem from './components/NotificationSystem.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import LoginPsicologo from './pages/LoginPsicologo.jsx';
import ListaPsicologos from './pages/ListaPsicologos.jsx';
import NotFound from './pages/NotFound.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Lazy loaded pages/components
const ChatEmergencia = lazy(() => import('./pages/ChatEmergencia.jsx'));
const Contato = lazy(() => import('./pages/Contato.jsx'));
const AtendimentoOnline = lazy(() => import('./pages/AtendimentoOnline.jsx'));
const Perfil = lazy(() => import('./pages/Perfil.jsx'));
const CadastroPsicologo = lazy(() => import('./pages/CadastroPsicologo.jsx'));
const DashboardPsicologo = lazy(() => import('./pages/DashboardPsicologo.jsx'));
const AgendaPsicologo = lazy(() => import('./pages/AgendaPsicologo.jsx'));
const PacientesPsicologo = lazy(() => import('./pages/PacientesPsicologo.jsx'));
const ConsultasPsicologo = lazy(() => import('./pages/ConsultasPsicologo.jsx'));
const FinanceiroPsicologo = lazy(() => import('./pages/FinanceiroPsicologo.jsx'));
const ConfiguracoesPsicologo = lazy(() => import('./pages/ConfiguracoesPsicologo.jsx'));
const PerfilPsicologo = lazy(() => import('./pages/PerfilPsicologo.jsx'));
const EstatisticasPsicologo = lazy(() => import('./pages/EstatisticasPsicologo.jsx'));
const ChatsPsicologo = lazy(() => import('./pages/ChatsPsicologo.jsx'));
const TermosUso = lazy(() => import('./pages/TermosUso.jsx'));
const PoliticaPrivacidade = lazy(() => import('./pages/PoliticaPrivacidade.jsx'));
const Autoavaliacoes = lazy(() => import('./pages/Autoavaliacoes.jsx'));
const LoginAdmin = lazy(() => import('./pages/LoginAdmin.jsx'));
const DashboardAdmin = lazy(() => import('./pages/DashboardAdmin.jsx'));
const AdminUsuarios = lazy(() => import('./pages/AdminUsuarios.jsx'));
const AdminSessoes = lazy(() => import('./pages/AdminSessoes.jsx'));
const MinhasSessoes = lazy(() => import('./pages/MinhasSessoes.jsx'));
const AgendarSessao = lazy(() => import('./pages/AgendarSessao.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const Premium = lazy(() => import('./pages/Premium.jsx'));
const PagamentoSessao = lazy(() => import('./pages/PagamentoSessao.jsx'));
const AdBanner = lazy(() => import('./components/AdBanner.jsx'));
const JogosRelaxamento = lazy(() => import('./pages/JogosRelaxamento.jsx'));
const CursorGlow = lazy(() => import('./components/CursorGlow.jsx'));
const SaudeMental = lazy(() => import('./pages/SaudeMental.jsx'));

/**
 * Wrapper que re-monta o PageTransition em cada mudança de rota,
 * garantindo que a animação de entrada seja disparada.
 */
function AnimatedRoute({ children }) {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      {children}
    </PageTransition>
  );
}

function AppContent() {
  const location = useLocation();
  const isPsicologoRoute = location.pathname.startsWith('/psicologo/');
  const isAdminRoute = location.pathname.startsWith('/admin/');
  const shouldShowNavbar = !isPsicologoRoute && !isAdminRoute;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedColorMode = localStorage.getItem('colorMode');
    const savedDyslexiaFont = localStorage.getItem('dyslexiaFont');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (savedColorMode && savedColorMode !== 'padrao') {
      document.documentElement.setAttribute('data-daltonismo', savedColorMode);
    }

    if (savedDyslexiaFont === 'true') {
      document.documentElement.setAttribute('data-font', 'dislexia');
    }
  }, []);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatedRoute>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat-emergencia" element={<ChatEmergencia />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/atendimento-online" element={<AtendimentoOnline />} />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/psicologos" element={<ListaPsicologos />} />
            <Route path="/cadastro-psicologo" element={<CadastroPsicologo />} />
            <Route path="/login-psicologo" element={<LoginPsicologo />} />
            <Route path="/psicologo/dashboard" element={
              <ProtectedRoute requiredUserType="psicologo">
                <DashboardPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/agenda" element={
              <ProtectedRoute requiredUserType="psicologo">
                <AgendaPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/pacientes" element={
              <ProtectedRoute requiredUserType="psicologo">
                <PacientesPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/consultas" element={
              <ProtectedRoute requiredUserType="psicologo">
                <ConsultasPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/financeiro" element={
              <ProtectedRoute requiredUserType="psicologo">
                <FinanceiroPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/perfil" element={
              <ProtectedRoute requiredUserType="psicologo">
                <PerfilPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/configuracoes" element={
              <ProtectedRoute requiredUserType="psicologo">
                <ConfiguracoesPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/estatisticas" element={
              <ProtectedRoute requiredUserType="psicologo">
                <EstatisticasPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/psicologo/chats" element={
              <ProtectedRoute requiredUserType="psicologo">
                <ChatsPsicologo />
              </ProtectedRoute>
            } />
            <Route path="/termos-uso" element={<TermosUso />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/autoavaliacoes" element={<Autoavaliacoes />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredUserType="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminUsuarios />
              </ProtectedRoute>
            } />
            <Route path="/admin/sessoes" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminSessoes />
              </ProtectedRoute>
            } />
            <Route path="/minhas-sessoes" element={
              <ProtectedRoute>
                <MinhasSessoes />
              </ProtectedRoute>
            } />
            <Route path="/agendar-sessao/:psicologoId" element={
              <ProtectedRoute>
                <AgendarSessao />
              </ProtectedRoute>
            } />
            <Route path="/chat/:userId" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/premium" element={<Premium />} />
            <Route path="/pagamento/sessao/:sessaoId" element={
              <ProtectedRoute>
                <PagamentoSessao />
              </ProtectedRoute>
            } />
            <Route path="/relaxar" element={<JogosRelaxamento />} />
            <Route path="/saude-mental" element={<SaudeMental />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatedRoute>
        <Footer />
        <BackToTop />
        <EmergencyButton />
        <NotificationSystem />
        <AdBanner />
        <CursorGlow />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;