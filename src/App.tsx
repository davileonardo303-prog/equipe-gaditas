import React, { useState, useEffect } from 'react';
import { GaditasProvider, useGaditas } from './context/GaditasContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { AdminControlPanel } from './components/Administration/AdminControlPanel';
import { MasterPortal } from './components/Dashboard/MasterPortal';
import { FinanceDashboard } from './components/Dashboard/FinanceDashboard';
import { StudentPortal } from './components/Dashboard/StudentPortal';
import { AthletesList } from './components/Athletes/AthletesList';
import { RankingView } from './components/Ranking/RankingView';
import { TournamentsView } from './components/Tournaments/TournamentsView';
import { FightsHistory } from './components/Tournaments/FightsHistory';
import { GraduationControl } from './components/Graduation/GraduationControl';
import { AttendanceView } from './components/Attendance/AttendanceView';
import { StoreView } from './components/Store/StoreView';
import { CertificateGenerator } from './components/Certificates/CertificateGenerator';
import { SiteCMSManager } from './components/CMS/SiteCMSManager';
import { MediaLibraryView } from './components/MediaLibrary/MediaLibraryView';
import { NewsManager } from './components/News/NewsManager';
import { CommunicationCenter } from './components/Communication/CommunicationCenter';
import { GaditasAIAssistant } from './components/AIAssistant/GaditasAIAssistant';
import { StudentsList } from './components/Students/StudentsList';
import { TrainingCentersList } from './components/TrainingCenters/TrainingCentersList';
import { ProfessorsList } from './components/Professors/ProfessorsList';
import { PublicHome } from './components/PublicWebsite/PublicHome';
import { ApprovalQueueModal } from './components/Dashboard/ApprovalQueueModal';
import { LoginModal } from './components/Auth/LoginModal';
import { Sparkles, ShieldAlert, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentRole, 
    viewMode, 
    setViewMode, 
    showApprovalModal, 
    closeApprovalModal,
    isAuthenticated,
    currentUserAccount,
    canAccessTab,
    openLoginModal
  } = useGaditas();

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFloatingAI, setShowFloatingAI] = useState(false);

  // When role changes, switch to appropriate default tab
  useEffect(() => {
    if (currentRole === 'admin') setCurrentTab('dashboard');
    else if (currentRole === 'subadmin') setCurrentTab('dashboard');
    else if (currentRole === 'coordenador') setCurrentTab('dashboard');
    else if (currentRole === 'mestre') setCurrentTab('mestre_portal');
    else if (currentRole === 'financeiro') setCurrentTab('financeiro');
    else if (currentRole === 'professor') setCurrentTab('chamada');
    else if (currentRole === 'aluno') setCurrentTab('aluno_portal');
    else if (currentRole === 'visitante') setCurrentTab('ranking');
  }, [currentRole]);

  // If user is previewing the Public Institutional Website
  if (viewMode === 'public_site') {
    return (
      <>
        <PublicHome 
          onGoToPanel={() => {
            if (!isAuthenticated || !currentUserAccount || currentUserAccount.status !== 'Aprovado') {
              openLoginModal();
            } else {
              setViewMode('admin_panel');
            }
          }} 
          onOpenAI={() => setShowFloatingAI(true)} 
        />

        {/* Global Approval Queue Modal */}
        <ApprovalQueueModal 
          isOpen={showApprovalModal} 
          onClose={closeApprovalModal} 
        />

        {/* Global Auth Modal */}
        <LoginModal />

        {/* Floating AI Modal */}
        {showFloatingAI && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
            <GaditasAIAssistant 
              onClose={() => setShowFloatingAI(false)} 
              isFloating={true} 
            />
          </div>
        )}
      </>
    );
  }

  // BLOQUEIO DE ACESSO DIRETO:
  // Nenhum usuário pode acessar o painel de gestão sem autenticação válida e aprovação do Administrador Geral.
  if (!isAuthenticated || !currentUserAccount || currentUserAccount.status !== 'Aprovado') {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-neutral-900 border border-red-900/60 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-700/60 flex items-center justify-center mx-auto text-red-500 shadow-inner">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-red-500 uppercase tracking-widest font-black">
              Segurança & Controle de Acesso
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-cinzel text-white">
              Acesso Bloqueado
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              O acesso a qualquer área interna do sistema requer autenticação válida e prévia homologação pelo <strong>Administrador Geral</strong>.
            </p>
          </div>

          {currentUserAccount && currentUserAccount.status === 'Pendente' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl text-amber-300 text-xs font-semibold space-y-1">
              <p className="font-bold text-amber-400">Status da Conta: Pendente</p>
              <p>Sua conta está aguardando aprovação do Administrador do Sistema.</p>
            </div>
          )}

          {currentUserAccount && currentUserAccount.status === 'Suspenso' && (
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-300 text-xs font-semibold space-y-1">
              <p className="font-bold text-red-400">Conta Suspensa</p>
              <p>Esta conta foi temporariamente suspensa pelo Administrador Geral.</p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setViewMode('public_site');
                openLoginModal();
              }}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-xl shadow-red-950/50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Fazer Login Obrigatório</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('public_site')}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Site Institucional</span>
            </button>
          </div>
        </div>

        {/* Global Auth Modal */}
        <LoginModal />
      </div>
    );
  }

  // Verifica se o usuário autenticado tem permissão para a aba selecionada (Route Guard)
  const isAuthorizedForTab = canAccessTab(currentTab);

  // Admin / Staff / Student Management Panel
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        onOpenAI={() => setShowFloatingAI(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={setCurrentTab} 
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Proteção Modular de Rotas */}
          {!isAuthorizedForTab ? (
            <div className="p-8 max-w-lg mx-auto my-16 bg-neutral-900 border border-red-900/40 rounded-3xl text-center space-y-5 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-red-950/70 border border-red-800 flex items-center justify-center mx-auto text-red-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Módulo Não Autorizado</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  O perfil <strong>{currentUserAccount.role}</strong> ({currentUserAccount.name}) não possui autorização concedida pelo <strong>Administrador Geral</strong> para visualizar este módulo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentUserAccount.role === 'admin' || currentUserAccount.role === 'subadmin') setCurrentTab('dashboard');
                  else if (currentUserAccount.role === 'mestre') setCurrentTab('mestre_portal');
                  else if (currentUserAccount.role === 'professor') setCurrentTab('chamada');
                  else if (currentUserAccount.role === 'financeiro') setCurrentTab('financeiro');
                  else setCurrentTab('aluno_portal');
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-colors shadow-lg"
              >
                Voltar ao Meu Painel Autorizado
              </button>
            </div>
          ) : (
            <>
              {/* Main views rendering */}
              {currentTab === 'administracao' && <AdminControlPanel initialTab="usuarios" />}
              {currentTab === 'auditoria' && <AdminControlPanel initialTab="auditoria" />}
              {currentTab === 'dashboard' && <AdminDashboard onNavigate={setCurrentTab} />}
              {currentTab === 'mestre_portal' && <MasterPortal />}
              {currentTab === 'alunos' && <StudentsList />}
              {currentTab === 'professores' && <ProfessorsList />}
              {currentTab === 'cts' && <TrainingCentersList />}
              {currentTab === 'atletas' && <AthletesList />}
              {currentTab === 'ranking' && <RankingView />}
              {currentTab === 'campeonatos' && <TournamentsView />}
              {currentTab === 'lutas' && <FightsHistory />}
              {currentTab === 'graduacoes' && <GraduationControl />}
              {currentTab === 'financeiro' && <FinanceDashboard />}
              {currentTab === 'comissoes' && <FinanceDashboard />}
              {currentTab === 'loja' && <StoreView />}
              {currentTab === 'chamada' && <AttendanceView />}
              {currentTab === 'turmas' && <AttendanceView />}
              {currentTab === 'certificados' && <CertificateGenerator />}
              {currentTab === 'site_cms' && <SiteCMSManager />}
              {currentTab === 'midia' && <MediaLibraryView />}
              {currentTab === 'noticias' && <NewsManager />}
              {currentTab === 'comunicacao' && <CommunicationCenter />}
              {currentTab === 'ia' && <GaditasAIAssistant />}
              {currentTab === 'aprovacoes' && (
                <ApprovalQueueModal isOpen={true} onClose={() => setCurrentTab('dashboard')} />
              )}
              {currentTab === 'aluno_portal' && (
                <StudentPortal 
                  onOpenAI={() => setShowFloatingAI(true)} 
                  onOpenCertificates={() => setCurrentTab('certificados')}
                  onOpenRanking={() => setCurrentTab('ranking')}
                />
              )}
              {currentTab === 'carteirinha' && (
                <StudentPortal 
                  onOpenAI={() => setShowFloatingAI(true)} 
                  onOpenCertificates={() => setCurrentTab('certificados')}
                  onOpenRanking={() => setCurrentTab('ranking')}
                />
              )}
              {currentTab === 'mensalidade_aluno' && (
                <StudentPortal 
                  onOpenAI={() => setShowFloatingAI(true)} 
                  onOpenCertificates={() => setCurrentTab('certificados')}
                  onOpenRanking={() => setCurrentTab('ranking')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Approval Queue Modal */}
      <ApprovalQueueModal 
        isOpen={showApprovalModal} 
        onClose={closeApprovalModal} 
      />

      {/* Global Auth Modal */}
      <LoginModal />

      {/* Floating AI Button & Modal */}
      {!showFloatingAI && (
        <button
          type="button"
          onClick={() => setShowFloatingAI(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-2xl transition-transform hover:scale-105 flex items-center gap-2 border border-white/20 shadow-red-950/50"
          title="Abrir Assistente IA Gaditas"
        >
          <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs font-black hidden sm:inline">IA Gaditas</span>
        </button>
      )}

      {showFloatingAI && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5">
          <GaditasAIAssistant 
            onClose={() => setShowFloatingAI(false)} 
            isFloating={true} 
          />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GaditasProvider>
      <AppContent />
    </GaditasProvider>
  );
}
