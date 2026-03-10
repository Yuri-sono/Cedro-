import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
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

import ThemeToggle from './components/ThemeToggle.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';

import Home from './pages/Home.jsx';
import ChatEmergencia from './pages/ChatEmergencia.jsx';
import Contato from './pages/Contato.jsx';
import TerapiaIndividual from './pages/TerapiaIndividual.jsx';
import TerapiaGrupo from './pages/TerapiaGrupo.jsx';
import AtendimentoOnline from './pages/AtendimentoOnline.jsx';
import MeditacoesGuiadas from './pages/MeditacoesGuiadas.jsx';
import Ebooks from './pages/Ebooks.jsx';
import Webinars from './pages/Webinars.jsx';
import Perfil from './pages/Perfil.jsx';
import Login from './pages/Login.jsx';
import ListaPsicologos from './pages/ListaPsicologos.jsx';
import CadastroPsicologo from './pages/CadastroPsicologo.jsx';
import LoginPsicologo from './pages/LoginPsicologo.jsx';
import DashboardPsicologo from './pages/DashboardPsicologo.jsx';
import AgendaPsicologo from './pages/AgendaPsicologo.jsx';
import PacientesPsicologo from './pages/PacientesPsicologo.jsx';
import ConsultasPsicologo from './pages/ConsultasPsicologo.jsx';
import FinanceiroPsicologo from './pages/FinanceiroPsicologo.jsx';
import ConfiguracoesPsicologo from './pages/ConfiguracoesPsicologo.jsx';
import PerfilPsicologo from './pages/PerfilPsicologo.jsx';
import EstatisticasPsicologo from './pages/EstatisticasPsicologo.jsx';
import TermosUso from './pages/TermosUso.jsx';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade.jsx';
import Autoavaliacoes from './pages/Autoavaliacoes.jsx';
import LoginAdmin from './pages/LoginAdmin.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import AdminUsuarios from './pages/AdminUsuarios.jsx';
import AdminSessoes from './pages/AdminSessoes.jsx';
import MinhasSessoes from './pages/MinhasSessoes.jsx';
import AgendarSessao from './pages/AgendarSessao.jsx';
import Chat from './pages/Chat.jsx';
import Premium from './pages/Premium.jsx';
import PagamentoSessao from './pages/PagamentoSessao.jsx';
import AdBanner from './components/AdBanner.jsx';
import NotFound from './pages/NotFound.jsx';

function AppContent() {
  const location = useLocation();
  const isPsicologoRoute = location.pathname.startsWith('/psicologo/');
  const isAdminRoute = location.pathname.startsWith('/admin/');
  const shouldShowNavbar = !isPsicologoRoute && !isAdminRoute;

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat-emergencia" element={<ChatEmergencia />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/terapia-individual" element={<TerapiaIndividual />} />
            <Route path="/terapia-grupo" element={<TerapiaGrupo />} />
            <Route path="/atendimento-online" element={<AtendimentoOnline />} />
            <Route path="/meditacoes-guiadas" element={<MeditacoesGuiadas />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/webinars" element={<Webinars />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <BackToTop />
          <EmergencyButton />
          <ThemeToggle />
          <NotificationSystem />
          <AdBanner />
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