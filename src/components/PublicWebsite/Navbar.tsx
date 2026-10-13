import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { TeamBadge } from '../Common/TeamBadge';
import { 
  User, 
  Crown, 
  BookOpen, 
  FileText, 
  Trophy, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X,
  Sparkles,
  Building2,
  ShieldCheck,
  Shield,
  Flame
} from 'lucide-react';

interface NavbarProps {
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAI }) => {
  const { 
    publicPage, 
    setPublicPage, 
    openLoginModal, 
    isAuthenticated, 
    logout, 
    currentRole, 
    currentStudent, 
    siteConfig,
    setViewMode,
    students
  } = useGaditas();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'biografia' | 'biblioteca' | 'ranking') => {
    setPublicPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToLoggedPanel = () => {
    setViewMode('admin_panel');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
      {/* Top Banner Ribbon - Vermelho e Branco Oficial com o Lema da Equipe */}
      <div className="bg-red-600 text-white text-[11px] font-black py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-2 shadow-inner uppercase">
        <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
        <span className="font-mono text-white/90">LEMA DA EQUIPE:</span>
        <span className="bg-black text-white px-2.5 py-0.5 rounded font-black tracking-widest border border-white/30 shadow-sm">
          "A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"
        </span>
        <span className="hidden md:inline font-mono text-white/80">· GADITAS FIGHT TEAM RJ</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="cursor-pointer"
        >
          <TeamBadge size="lg" />
        </div>

        {/* Desktop Main Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-neutral-300">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`transition-colors py-1.5 px-1 relative ${
              publicPage === 'home' 
                ? 'text-white border-b-2 border-red-600 font-black' 
                : 'hover:text-red-500'
            }`}
          >
            Início
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('biografia')}
            className={`transition-colors py-1.5 px-1 relative ${
              publicPage === 'biografia' 
                ? 'text-white border-b-2 border-red-600 font-black' 
                : 'hover:text-red-500'
            }`}
          >
            Biografia
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('biblioteca')}
            className={`transition-colors py-1.5 px-1 relative ${
              publicPage === 'biblioteca' 
                ? 'text-white border-b-2 border-red-600 font-black' 
                : 'hover:text-red-500'
            }`}
          >
            Biblioteca
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('ranking')}
            className={`transition-colors py-1.5 px-1 relative ${
              publicPage === 'ranking' 
                ? 'text-white border-b-2 border-red-600 font-black' 
                : 'hover:text-red-500'
            }`}
          >
            Atletas & Ranking
          </button>

          <a 
            href="#unidades" 
            onClick={() => {
              if (publicPage !== 'home') setPublicPage('home');
            }}
            className="hover:text-red-500 transition-colors py-1.5"
          >
            CTs & Unidades
          </a>

          <a 
            href="#noticias" 
            onClick={() => {
              if (publicPage !== 'home') setPublicPage('home');
            }}
            className="hover:text-red-500 transition-colors py-1.5"
          >
            Notícias
          </a>
        </nav>

        {/* Right CTA / Auth Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Direct Painel de Gestão button always available */}
          <button
            type="button"
            onClick={handleGoToLoggedPanel}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-xs transition-all flex items-center gap-2 border border-neutral-700/80 hover:border-red-600 shadow-sm"
            title="Acessar painel administrativo e sistema de fotos/gestão"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-red-500" />
            <span>Painel de Gestão</span>
            {students.filter(s => s.status === 'Pendente').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGoToLoggedPanel}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-lg flex items-center gap-1.5 border border-white/20"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>
                  {currentRole === 'aluno' ? `Meu Portal (${currentStudent.name.split(' ')[0]})` : 'Área do Mestre/Staff'}
                </span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                title="Encerrar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Cadastrar-se */}
              <button
                type="button"
                onClick={() => openLoginModal('aluno')}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-neutral-700 hover:border-red-600"
              >
                <span>Cadastrar-se</span>
              </button>

              {/* Entrar no Sistema */}
              <button
                type="button"
                onClick={() => openLoginModal('staff')}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-lg hover:scale-105 border border-red-500/50"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar (Login / Google)</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white lg:hidden border border-neutral-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 bg-neutral-950 border-b border-neutral-800 space-y-3 animate-in fade-in slide-in-from-top-2 text-xs">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`w-full text-left py-2.5 px-3 rounded-lg font-bold flex items-center gap-2 ${
                publicPage === 'home' ? 'bg-red-600 text-white font-black' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Início (Página Principal)</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('biografia')}
              className={`w-full text-left py-2.5 px-3 rounded-lg font-bold flex items-center gap-2 ${
                publicPage === 'biografia' ? 'bg-red-600 text-white font-black' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Biografia do Mestre & Professores</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('biblioteca')}
              className={`w-full text-left py-2.5 px-3 rounded-lg font-bold flex items-center gap-2 ${
                publicPage === 'biblioteca' ? 'bg-red-600 text-white font-black' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Biblioteca Digital & Acervo Oficial</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('ranking')}
              className={`w-full text-left py-2.5 px-3 rounded-lg font-bold flex items-center gap-2 ${
                publicPage === 'ranking' ? 'bg-red-600 text-white font-black' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Ranking & Atletas Oficiais</span>
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleGoToLoggedPanel();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 text-white font-black flex items-center justify-center gap-2 shadow-lg"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Acessar Meu Painel de Gestão</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-red-400 font-bold flex items-center justify-center gap-2 border border-neutral-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">

                <button
                  type="button"
                  onClick={() => {
                    openLoginModal('staff');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 text-white font-black flex items-center justify-center gap-2 shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Entrar (Login / Conta Google)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openLoginModal('aluno');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold flex items-center justify-center gap-2"
                >
                  <span>Cadastrar-se na Plataforma</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
