import React, { useState } from 'react';
import { useGaditas } from '../context/GaditasContext';
import { UserRole } from '../types';
import { TeamBadge } from './Common/TeamBadge';
import { 
  Bell, 
  Globe, 
  LayoutDashboard, 
  UserCheck, 
  Crown, 
  DollarSign, 
  GraduationCap, 
  User, 
  CheckCircle2, 
  Menu,
  Sparkles,
  LogOut,
  Shield,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  onOpenAI?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenAI }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    viewMode, 
    setViewMode, 
    notifications, 
    markNotificationAsRead,
    currentStudent,
    siteConfig,
    logout,
    openApprovalModal,
    students,
    professors,
    currentUserAccount,
    isGeneralAdmin
  } = useGaditas();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingTotal = students.filter(s => s.status === 'Pendente').length + professors.filter(p => p.status === 'Pendente').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      {/* Top Banner Ribbon com o Lema da Equipe */}
      <div className="bg-black/90 border-b border-red-950/60 text-white text-[10px] sm:text-[11px] font-mono py-1 px-4 text-center tracking-wider flex items-center justify-center gap-2">
        <span className="text-red-500 font-black">LEMA DA EQUIPE:</span>
        <span className="text-white font-bold tracking-widest font-cinzel">"A DOR É PASSAGEIRA, MAS O ORGULHO É ETERNO"</span>
        <span className="text-neutral-500 hidden md:inline">· GADITAS FIGHT TEAM RJ</span>
      </div>

      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Mobile Toggle & Team Badge */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 lg:hidden"
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <TeamBadge size="md" />
        </div>

        {/* Center: View Switcher (Site Institucional vs Painel de Gestão) */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setViewMode('public_site')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Voltar ao Site Oficial da Equipe"
          >
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>← Site Oficial</span>
          </button>

          <span className="text-neutral-700 hidden sm:inline">|</span>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black text-white bg-red-600 rounded-md">
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
            <span>Área de Gestão</span>
          </span>
        </div>

        {/* Right: Role Switcher, AI Assistant & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Quick Trigger */}
          {onOpenAI && (
            <button
              type="button"
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 border border-red-500/30 text-white hover:bg-red-600/25 text-xs font-bold transition-colors"
              title="Abrir Assistente IA Gaditas"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden md:inline">IA Gaditas</span>
            </button>
          )}

          {/* Verified User Account Badge */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white truncate block max-w-[100px] sm:max-w-[150px]">
                {currentUserAccount?.name || 'Administrador Geral'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 uppercase font-bold shrink-0">
              {currentUserAccount?.role === 'admin' ? 'Super Admin' :
               currentUserAccount?.role === 'subadmin' ? 'Administrador' :
               currentUserAccount?.role === 'coordenador' ? 'Coordenador' :
               currentUserAccount?.role === 'mestre' ? 'Mestre' :
               currentUserAccount?.role === 'professor' ? 'Professor' :
               currentUserAccount?.role === 'financeiro' ? 'Financeiro' : 
               currentUserAccount?.role === 'visitante' ? 'Visitante' : 'Aluno'}
            </span>
          </div>

          {/* Pending Approvals Quick Pill */}
          {pendingTotal > 0 && (
            <button
              type="button"
              onClick={openApprovalModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md border border-white/20 animate-pulse"
              title="Ver fila de aprovações de novos cadastros"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{pendingTotal} Pendente{pendingTotal > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-neutral-950 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-neutral-900 border-2 border-red-600/40 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Notificações do Sistema
                  </span>
                  <span className="text-[11px] text-red-400 font-bold font-mono">
                    {unreadCount} novas
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-4 text-center">Nenhuma notificação recente.</p>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          notif.read ? 'bg-neutral-950/40 border-neutral-800/50 text-neutral-400' : 'bg-neutral-950 border-red-600/30 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white">{notif.title}</span>
                          {!notif.read && (
                            <button
                              type="button"
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="text-neutral-400 hover:text-red-400"
                              title="Marcar como lida"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center justify-between mt-1.5 text-[10px] text-neutral-500">
                          <span>{notif.timestamp}</span>
                          <span className="capitalize">{notif.type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sair / Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            title="Sair para o Site Público"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
