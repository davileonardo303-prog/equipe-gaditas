import React from 'react';
import { useGaditas } from '../context/GaditasContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Building2, 
  Trophy, 
  Medal, 
  Swords, 
  Flame, 
  Award, 
  DollarSign, 
  ShoppingBag, 
  ClipboardCheck, 
  FileText, 
  Globe, 
  Image as ImageIcon, 
  Newspaper, 
  MessageSquare, 
  Sparkles,
  CreditCard,
  QrCode,
  ShieldCheck,
  Percent,
  Shield,
  Crown
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  isMobileOpen = false, 
  onCloseMobile 
}) => {
  const { 
    currentRole, 
    currentStudent, 
    currentProfessor, 
    siteConfig, 
    students, 
    professors, 
    currentUserAccount,
    hasModulePermission,
    isGeneralAdmin 
  } = useGaditas();

  const pendingStudents = students.filter(s => s.status === 'Pendente').length;
  const pendingProfessors = professors.filter(p => p.status === 'Pendente').length;
  const totalPending = pendingStudents + pendingProfessors;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }

  const getNavItems = (): { section: string; items: NavItem[] }[] => {
    if (currentRole === 'admin') {
      return [
        {
          section: 'Administração Geral & Segurança',
          items: [
            { id: 'administracao', label: 'Gestão de Usuários & RBAC', icon: <Shield className="w-4 h-4 text-red-500" /> },
            { id: 'aprovacoes', label: 'Fila de Aprovações', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, badge: totalPending > 0 ? `${totalPending}` : undefined },
            { id: 'auditoria', label: 'Auditoria Completa & Logs', icon: <FileText className="w-4 h-4 text-purple-400" /> },
            { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
          ]
        },
        {
          section: 'Estrutura & Pessoas',
          items: [
            { id: 'alunos', label: 'Gestão de Alunos', icon: <Users className="w-4 h-4" /> },
            { id: 'professores', label: 'Professores (13 Polos)', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'cts', label: 'Centros de Treino (CTs)', icon: <Building2 className="w-4 h-4" /> },
          ]
        },
        {
          section: 'Módulo Esportivo',
          items: [
            { id: 'atletas', label: 'Atletas & Cartel', icon: <Flame className="w-4 h-4 text-red-500" /> },
            { id: 'ranking', label: 'Ranking Automático', icon: <Medal className="w-4 h-4 text-white" /> },
            { id: 'campeonatos', label: 'Torneios & Chaves', icon: <Trophy className="w-4 h-4" /> },
            { id: 'lutas', label: 'Gestão de Lutas', icon: <Swords className="w-4 h-4" /> },
            { id: 'graduacoes', label: 'Graduações & Faixas', icon: <Award className="w-4 h-4" /> },
          ]
        },
        {
          section: 'Operacional & Finanças',
          items: [
            { id: 'financeiro', label: 'Financeiro & PIX', icon: <DollarSign className="w-4 h-4 text-white" /> },
            { id: 'comissoes', label: 'Comissões de Professores', icon: <Percent className="w-4 h-4" /> },
            { id: 'loja', label: 'Loja Gaditas & Estoque', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'chamada', label: 'Chamada Digital', icon: <ClipboardCheck className="w-4 h-4" /> },
            { id: 'certificados', label: 'Certificados Oficiais', icon: <FileText className="w-4 h-4" /> },
          ]
        },
        {
          section: 'Institucional & Mídia',
          items: [
            { id: 'site_cms', label: 'Site CMS (Sem Código)', icon: <Globe className="w-4 h-4 text-red-500" /> },
            { id: 'midia', label: 'Biblioteca de Mídia', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'noticias', label: 'Notícias & Eventos', icon: <Newspaper className="w-4 h-4" /> },
            { id: 'comunicacao', label: 'Comunicação & WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'ia', label: 'Assistente IA Gaditas', icon: <Sparkles className="w-4 h-4 text-red-400" /> },
          ]
        }
      ];
    }

    if (currentRole === 'subadmin') {
      const items: NavItem[] = [
        { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
      ];
      if (hasModulePermission('usuarios')) {
        items.push({ id: 'administracao', label: 'Usuários Autorizados', icon: <Users className="w-4 h-4" /> });
        items.push({ id: 'aprovacoes', label: 'Fila de Aprovações', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, badge: totalPending > 0 ? `${totalPending}` : undefined });
      }
      if (hasModulePermission('alunos')) items.push({ id: 'alunos', label: 'Gestão de Alunos', icon: <Users className="w-4 h-4" /> });
      if (hasModulePermission('professores')) items.push({ id: 'professores', label: 'Professores', icon: <GraduationCap className="w-4 h-4" /> });
      if (hasModulePermission('financeiro')) items.push({ id: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-4 h-4 text-white" /> });
      if (hasModulePermission('presencas')) items.push({ id: 'chamada', label: 'Chamada Digital', icon: <ClipboardCheck className="w-4 h-4" /> });
      if (hasModulePermission('graduacoes')) items.push({ id: 'graduacoes', label: 'Graduações', icon: <Award className="w-4 h-4" /> });
      if (hasModulePermission('competicoes')) {
        items.push({ id: 'campeonatos', label: 'Torneios', icon: <Trophy className="w-4 h-4" /> });
        items.push({ id: 'ranking', label: 'Ranking', icon: <Medal className="w-4 h-4 text-white" /> });
      }
      if (hasModulePermission('auditoria')) items.push({ id: 'auditoria', label: 'Auditoria', icon: <FileText className="w-4 h-4 text-purple-400" /> });
      items.push({ id: 'ia', label: 'Assistente IA', icon: <Sparkles className="w-4 h-4 text-red-400" /> });

      return [
        {
          section: 'Administrador Secundário (Permissões Concedidas)',
          items
        }
      ];
    }

    if (currentRole === 'mestre') {
      return [
        {
          section: 'Portal do Mestre',
          items: [
            { id: 'mestre_portal', label: 'Visão Geral & Mestre', icon: <Crown className="w-4 h-4 text-red-500" /> },
            { id: 'aprovacoes', label: 'Fila de Aprovações', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, badge: totalPending > 0 ? `${totalPending}` : undefined },
            { id: 'graduacoes', label: 'Graduações & Faixas', icon: <Award className="w-4 h-4" /> },
            { id: 'ranking', label: 'Definição de Ranking', icon: <Medal className="w-4 h-4 text-white" /> },
            { id: 'atletas', label: 'Cartel de Atletas', icon: <Flame className="w-4 h-4" /> },
            { id: 'campeonatos', label: 'Torneios Homologados', icon: <Trophy className="w-4 h-4" /> },
            { id: 'certificados', label: 'Assinatura de Certificados', icon: <FileText className="w-4 h-4" /> },
            { id: 'professores', label: 'Aprovação de Professores', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'ia', label: 'Assistente IA Mestre', icon: <Sparkles className="w-4 h-4 text-red-400" /> },
          ]
        }
      ];
    }

    if (currentRole === 'financeiro') {
      return [
        {
          section: 'Financeiro Profissional',
          items: [
            { id: 'financeiro', label: 'Fluxo de Caixa & PIX', icon: <DollarSign className="w-4 h-4 text-white" /> },
            { id: 'comissoes', label: 'Comissões de Professores', icon: <Percent className="w-4 h-4" /> },
            { id: 'alunos', label: 'Mensalidades & Alunos', icon: <Users className="w-4 h-4" /> },
            { id: 'loja', label: 'Loja & Receitas', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'ia', label: 'Assistente Financeiro IA', icon: <Sparkles className="w-4 h-4 text-red-400" /> },
          ]
        }
      ];
    }

    if (currentRole === 'professor') {
      return [
        {
          section: 'Área do Professor',
          items: [
            { id: 'chamada', label: 'Chamada Digital & Presença', icon: <ClipboardCheck className="w-4 h-4 text-red-500" /> },
            { id: 'aprovacoes', label: 'Aprovar Alunos da Turma', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, badge: pendingStudents > 0 ? `${pendingStudents}` : undefined },
            { id: 'turmas', label: 'Minhas Turmas & Alunos', icon: <Users className="w-4 h-4" /> },
            { id: 'graduacoes', label: 'Solicitar Exame de Faixa', icon: <Award className="w-4 h-4" /> },
            { id: 'ranking', label: 'Ranking do CT', icon: <Medal className="w-4 h-4 text-white" /> },
            { id: 'comissoes', label: 'Minhas Comissões', icon: <Percent className="w-4 h-4" /> },
            { id: 'certificados', label: 'Certificados da Turma', icon: <FileText className="w-4 h-4" /> },
            { id: 'ia', label: 'Assistente Pedagógico IA', icon: <Sparkles className="w-4 h-4 text-red-400" /> },
          ]
        }
      ];
    }

    // Role: Aluno
    return [
      {
        section: 'Aplicativo do Aluno',
        items: [
          { id: 'aluno_portal', label: 'Visão Geral & Frequência', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'carteirinha', label: 'Carteirinha Digital (QR)', icon: <QrCode className="w-4 h-4 text-red-500" /> },
          { id: 'mensalidade_aluno', label: 'Mensalidade & PIX', icon: <CreditCard className="w-4 h-4 text-white" /> },
          { id: 'graduacoes', label: 'Minha Graduação & Graus', icon: <Award className="w-4 h-4 text-red-400" /> },
          { id: 'ranking', label: 'Ranking da Equipe', icon: <Medal className="w-4 h-4" /> },
          { id: 'campeonatos', label: 'Inscrições em Torneios', icon: <Trophy className="w-4 h-4" /> },
          { id: 'certificados', label: 'Meus Certificados', icon: <FileText className="w-4 h-4" /> },
          { id: 'ia', label: 'Assistente IA Gaditas', icon: <Sparkles className="w-4 h-4 text-red-400" /> },
        ]
      }
    ];
  };

  const navSections = getNavItems();

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 bg-neutral-950 border-r border-neutral-800
        transition-transform duration-200 ease-in-out overflow-y-auto
        lg:static lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* User Active Card Header */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-950 border-2 border-red-600/40 shrink-0">
              {currentRole === 'mestre' ? (
                <img src={siteConfig.masterPhotoUrl} alt="Mestre" className="w-full h-full object-cover" />
              ) : currentRole === 'professor' ? (
                <img src={currentProfessor.photoUrl} alt="Professor" className="w-full h-full object-cover" />
              ) : currentRole === 'aluno' ? (
                <img src={currentStudent.photoUrl} alt="Aluno" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-red-600 text-white font-black text-sm">
                  AD
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {currentUserAccount ? currentUserAccount.name :
                 currentRole === 'mestre' ? siteConfig.masterName :
                 currentRole === 'professor' ? currentProfessor.name :
                 currentRole === 'aluno' ? currentStudent.name : 'Administrador Geral'}
              </p>
              <p className="text-[10px] text-red-400 font-mono tracking-tight uppercase font-bold">
                {currentUserAccount?.role === 'admin' ? 'Super Admin (Acesso Total)' :
                 currentUserAccount?.role === 'subadmin' ? 'Admin Secundário' :
                 currentRole === 'mestre' ? 'Faixa Coral 8º Dan' :
                 currentRole === 'professor' ? (currentProfessor.role ? currentProfessor.role.split('&')[0] : 'Professor') :
                 currentRole === 'aluno' ? `${currentStudent.belt} (${currentStudent.stripes}º Grau)` : 'Acesso Total'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1 font-mono">
                {section.section}
              </span>

              {section.items.map(item => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all
                      ${isActive 
                        ? 'bg-red-600 text-white font-black shadow-md border border-white/20' 
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'}
                    `}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? 'text-white' : 'text-neutral-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
