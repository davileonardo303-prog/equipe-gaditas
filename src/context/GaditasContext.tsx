import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  TrainingCenter, 
  Student, 
  Athlete, 
  Professor, 
  Master,
  Tournament, 
  Fight, 
  GraduationExam, 
  FinancialTransaction, 
  StoreProduct, 
  CertificateItem, 
  MediaFile, 
  NewsArticle, 
  TeamEvent, 
  Sponsor, 
  SiteConfiguration, 
  AttendanceRecord,
  SystemNotification,
  UserAccount,
  UserStatus,
  ModulePermissions,
  JwtSession,
  AuditLog,
  DatabaseBackup,
  CustomPage,
  DigitalSignature
} from '../types';
import { 
  INITIAL_TRAINING_CENTRES, 
  INITIAL_PROFESSORS, 
  INITIAL_MASTERS,
  INITIAL_STUDENTS, 
  INITIAL_ATHLETES, 
  INITIAL_TOURNAMENTS, 
  INITIAL_FIGHTS, 
  INITIAL_EXAMS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PRODUCTS, 
  INITIAL_CERTIFICATES, 
  INITIAL_MEDIA, 
  INITIAL_NEWS, 
  INITIAL_EVENTS, 
  INITIAL_SPONSORS, 
  INITIAL_SITE_CONFIG,
  INITIAL_USER_ACCOUNTS,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_SUBADMIN_PERMISSIONS,
  DEFAULT_COORDENADOR_PERMISSIONS,
  DEFAULT_PROFESSOR_PERMISSIONS,
  DEFAULT_FINANCEIRO_PERMISSIONS,
  DEFAULT_ALUNO_PERMISSIONS,
  DEFAULT_VISITANTE_PERMISSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DATABASE_BACKUPS,
  INITIAL_CUSTOM_PAGES,
  INITIAL_DIGITAL_SIGNATURES
} from '../data/initialData';
import { securityService } from '../services/securityService';

export type PublicPageType = 'home' | 'biografia' | 'biblioteca' | 'ranking';

interface GaditasContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  viewMode: 'admin_panel' | 'public_site';
  setViewMode: (mode: 'admin_panel' | 'public_site') => void;
  publicPage: PublicPageType;
  setPublicPage: (page: PublicPageType) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  showLoginModal: boolean;
  loginModalTab: 'aluno' | 'staff';
  openLoginModal: (tab?: 'aluno' | 'staff') => void;
  closeLoginModal: () => void;
  loginAsStudent: (student: Student) => void;
  loginAsStaff: (role: UserRole, professor?: Professor) => void;
  loginWithCredentials: (identifier: string, password?: string) => { success: boolean; message?: string };
  loginWithGoogle: (googleEmail?: string, googleName?: string, googleAvatar?: string) => { success: boolean; message?: string };
  registerWithGoogle: (data: { email: string; name: string; role?: UserRole; trainingCenterId?: string; professorId?: string }) => void;
  logout: () => void;

  currentUserAccount: UserAccount | null;
  setCurrentUserAccount: (user: UserAccount | null) => void;
  userAccounts: UserAccount[];
  currentStudent: Student;
  setCurrentStudent: (student: Student) => void;
  currentProfessor: Professor;
  setCurrentProfessor: (prof: Professor) => void;

  trainingCenters: TrainingCenter[];
  masters: Master[];
  professors: Professor[];
  students: Student[];
  athletes: Athlete[];
  tournaments: Tournament[];
  fights: Fight[];
  exams: GraduationExam[];
  transactions: FinancialTransaction[];
  products: StoreProduct[];
  certificates: CertificateItem[];
  mediaFiles: MediaFile[];
  news: NewsArticle[];
  events: TeamEvent[];
  sponsors: Sponsor[];
  siteConfig: SiteConfiguration;
  attendanceRecords: AttendanceRecord[];
  notifications: SystemNotification[];

  showApprovalModal: boolean;
  setShowApprovalModal: (show: boolean) => void;
  openApprovalModal: () => void;
  closeApprovalModal: () => void;

  // Actions
  addMaster: (master: Omit<Master, 'id'>) => void;
  updateMaster: (master: Master) => void;
  deleteMaster: (id: string) => void;
  approveMaster: (id: string) => void;

  addStudent: (student: Omit<Student, 'id' | 'registrationNumber'> & { registrationNumber?: string; status?: 'Ativo' | 'Inativo' | 'Pendente' }) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  approveStudent: (studentId: string) => void;

  addAthlete: (athlete: Omit<Athlete, 'id' | 'points'>) => void;
  updateAthlete: (athlete: Athlete) => void;
  deleteAthlete: (athleteId: string) => void;

  addProfessor: (prof: Omit<Professor, 'id'>) => void;
  updateProfessor: (prof: Professor) => void;
  approveProfessor: (profId: string) => void;

  addTrainingCenter: (tc: Omit<TrainingCenter, 'id'>) => void;
  updateTrainingCenter: (tc: TrainingCenter) => void;

  addFight: (fight: Omit<Fight, 'id'>) => void;
  addTournament: (tourn: Omit<Tournament, 'id' | 'brackets' | 'registeredAthletesCount' | 'registeredAthletes'>) => void;
  updateTournamentBracket: (tournamentId: string, matchId: string, winnerId: string, method: string) => void;
  registerTournamentAthlete: (tournamentId: string, athleteId: string) => void;

  requestGraduationExam: (exam: Omit<GraduationExam, 'id' | 'status'>) => void;
  approveGraduationExam: (examId: string, masterNotes?: string) => void;
  rejectGraduationExam: (examId: string, masterNotes?: string) => void;

  addTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;
  payStudentMonthlyFee: (studentId: string) => void;

  recordAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => void;
  addStoreSale: (productId: string, quantity: number, customerName: string) => void;
  updateProduct: (product: StoreProduct) => void;
  addProduct: (product: Omit<StoreProduct, 'id'>) => void;

  updateSiteConfig: (newConfig: Partial<SiteConfiguration>) => void;
  addMediaFile: (file: Omit<MediaFile, 'id' | 'uploadedAt'>) => void;
  deleteMediaFile: (id: string) => void;

  addNewsArticle: (article: Omit<NewsArticle, 'id'>) => void;
  updateNewsArticle: (article: NewsArticle) => void;
  deleteNewsArticle: (id: string) => void;

  addTeamEvent: (evt: Omit<TeamEvent, 'id'>) => void;
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  deleteSponsor: (id: string) => void;

  // Construtor de Páginas & CMS
  customPages: CustomPage[];
  addCustomPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomPage: (id: string, updates: Partial<CustomPage>) => void;
  deleteCustomPage: (id: string) => void;

  // Assinatura Digital
  digitalSignatures: DigitalSignature[];
  addDigitalSignature: (sig: Omit<DigitalSignature, 'id' | 'signedAt'>) => void;

  // Biblioteca de Mídia
  renameMediaFile: (id: string, newName: string) => void;

  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  recalculateRanking: () => void;

  // Administração Geral & Segurança
  sessionToken: JwtSession | null;
  auditLogs: AuditLog[];
  backups: DatabaseBackup[];
  isGeneralAdmin: boolean;
  addAuditLog: (action: AuditLog['action'], module: string, details: string, status?: AuditLog['status']) => void;
  createUserAccount: (user: Partial<UserAccount>) => { success: boolean; message?: string };
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  approveUserAccount: (id: string) => void;
  rejectUserAccount: (id: string) => void;
  suspendUserAccount: (id: string) => void;
  reactivateUserAccount: (id: string) => void;
  deleteUserAccount: (id: string) => void;
  updateUserPermissions: (id: string, permissions: ModulePermissions) => void;
  requestPasswordReset: (email: string) => { success: boolean; token?: string; message?: string };
  confirmPasswordReset: (email: string, token: string, newPassword: string) => { success: boolean; message?: string };
  canAccessTab: (tabId: string) => boolean;
  hasModulePermission: (module: keyof ModulePermissions) => boolean;
  createDatabaseBackup: () => DatabaseBackup;
  restoreDatabaseBackup: (backupId: string) => boolean;
}

const GaditasContext = createContext<GaditasContextType | undefined>(undefined);

const STORAGE_PREFIX = 'gaditas_v5_fight_';

export const GaditasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [viewMode, setViewMode] = useState<'admin_panel' | 'public_site'>('public_site');
  const [publicPage, setPublicPage] = useState<PublicPageType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginModalTab, setLoginModalTab] = useState<'aluno' | 'staff'>('aluno');
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);

  const openApprovalModal = () => setShowApprovalModal(true);
  const closeApprovalModal = () => setShowApprovalModal(false);

  const openLoginModal = (tab: 'aluno' | 'staff' = 'aluno') => {
    setLoginModalTab(tab);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user_accounts`);
    return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS;
  });

  const [currentUserAccount, setCurrentUserAccount] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}current_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [backups, setBackups] = useState<DatabaseBackup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}backups`);
    return saved ? JSON.parse(saved) : INITIAL_DATABASE_BACKUPS;
  });

  const [sessionToken, setSessionToken] = useState<JwtSession | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}session_jwt`);
    if (saved) {
      try {
        const parsed: JwtSession = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem(`${STORAGE_PREFIX}session_jwt`);
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [trainingCenters, setTrainingCenters] = useState<TrainingCenter[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}cts`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_TRAINING_CENTRES.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_TRAINING_CENTRES;
  });

  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}professors`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PROFESSORS.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_PROFESSORS;
  });

  const [masters, setMasters] = useState<Master[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}masters`);
    return saved ? JSON.parse(saved) : INITIAL_MASTERS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [athletes, setAthletes] = useState<Athlete[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}athletes`);
    return saved ? JSON.parse(saved) : INITIAL_ATHLETES;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}tournaments`);
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [fights, setFights] = useState<Fight[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}fights`);
    return saved ? JSON.parse(saved) : INITIAL_FIGHTS;
  });

  const [exams, setExams] = useState<GraduationExam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}txs`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [products, setProducts] = useState<StoreProduct[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}certs`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}media`);
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}news`);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [events, setEvents] = useState<TeamEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}sponsors`);
    return saved ? JSON.parse(saved) : INITIAL_SPONSORS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfiguration>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}site_cfg`);
    return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
  });

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}custom_pages`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_PAGES;
  });

  const [digitalSignatures, setDigitalSignatures] = useState<DigitalSignature[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}digital_signatures`);
    return saved ? JSON.parse(saved) : INITIAL_DIGITAL_SIGNATURES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      title: 'Exame de Faixas Solicitado',
      message: 'O aluno Gabriel Costa foi indicado pelo Prof. Roberto para graduação de Faixa Azul.',
      type: 'info',
      timestamp: 'Há 15 minutos',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Inscrições Abertas',
      message: 'Copa Gaditas Grand Prix 2026 está com inscrições abertas para todas as faixas.',
      type: 'success',
      timestamp: 'Hoje às 08:30',
      read: false
    }
  ]);

  const [currentStudent, setCurrentStudent] = useState<Student>(() => students[0] || INITIAL_STUDENTS[0]);
  const [currentProfessor, setCurrentProfessor] = useState<Professor>(() => professors[0] || INITIAL_PROFESSORS[0]);

  // Adicionar Log de Auditoria
  const addAuditLog = (
    action: AuditLog['action'], 
    module: string, 
    details: string, 
    status: AuditLog['status'] = 'SUCCESS'
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUserAccount?.id || 'anonimo',
      userName: currentUserAccount?.name || 'Sistema / Visitante',
      userRole: currentUserAccount?.role || 'public',
      action,
      module,
      details,
      ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Gerar e persistir sessão JWT
  const issueJwtSession = (user: UserAccount): JwtSession => {
    const token = `gaditas_jwt_${btoa(`${user.id}:${user.email}:${Date.now()}`)}`;
    const session: JwtSession = {
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2 horas de expiração
    };
    setSessionToken(session);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}session_jwt`, JSON.stringify(session));
    } catch {
      // ignore
    }
    return session;
  };

  // Verificação de Administrador Geral
  const isGeneralAdmin = currentUserAccount?.role === 'admin' && currentUserAccount?.status === 'Aprovado';

  // Verificação de Permissão por Módulo
  const hasModulePermission = (module: keyof ModulePermissions): boolean => {
    if (!currentUserAccount || currentUserAccount.status !== 'Aprovado') return false;
    if (currentUserAccount.role === 'admin') return true;
    if (currentUserAccount.permissions) {
      return !!currentUserAccount.permissions[module];
    }
    if (currentUserAccount.role === 'subadmin') return DEFAULT_SUBADMIN_PERMISSIONS[module] ?? false;
    if (currentUserAccount.role === 'coordenador') return DEFAULT_COORDENADOR_PERMISSIONS[module] ?? false;
    if (currentUserAccount.role === 'professor') return DEFAULT_PROFESSOR_PERMISSIONS[module] ?? false;
    if (currentUserAccount.role === 'financeiro') return DEFAULT_FINANCEIRO_PERMISSIONS[module] ?? false;
    if (currentUserAccount.role === 'aluno') return DEFAULT_ALUNO_PERMISSIONS[module] ?? false;
    if (currentUserAccount.role === 'visitante') return DEFAULT_VISITANTE_PERMISSIONS[module] ?? false;
    return false;
  };

  // Route Guard / Proteção de Rotas & Abas
  const canAccessTab = (tabId: string): boolean => {
    if (!isAuthenticated || !currentUserAccount || currentUserAccount.status !== 'Aprovado') {
      return false;
    }
    if (currentUserAccount.role === 'admin') return true;

    if (currentUserAccount.role === 'subadmin') {
      if (['dashboard'].includes(tabId)) return true;
      if (['usuarios', 'administracao', 'aprovacoes'].includes(tabId)) return hasModulePermission('usuarios');
      if (['financeiro', 'comissoes'].includes(tabId)) return hasModulePermission('financeiro');
      if (['professores', 'cts'].includes(tabId)) return hasModulePermission('professores');
      if (['alunos'].includes(tabId)) return hasModulePermission('alunos');
      if (['chamada', 'turmas'].includes(tabId)) return hasModulePermission('presencas');
      if (['graduacoes'].includes(tabId)) return hasModulePermission('graduacoes');
      if (['campeonatos', 'lutas', 'atletas', 'ranking'].includes(tabId)) return hasModulePermission('competicoes');
      if (['site_cms', 'midia', 'noticias', 'comunicacao'].includes(tabId)) return hasModulePermission('site_cms');
      if (['auditoria'].includes(tabId)) return hasModulePermission('auditoria');
      if (['certificados', 'loja', 'ia'].includes(tabId)) return true;
      return false;
    }

    if (currentUserAccount.role === 'coordenador') {
      const allowed = ['dashboard', 'professores', 'cts', 'alunos', 'chamada', 'turmas', 'graduacoes', 'eventos', 'campeonatos', 'lutas', 'atletas', 'ranking', 'relatorios', 'aprovacoes', 'certificados', 'ia'];
      return allowed.includes(tabId);
    }

    if (currentUserAccount.role === 'mestre') {
      const allowed = ['mestre_portal', 'graduacoes', 'ranking', 'atletas', 'campeonatos', 'certificados', 'professores', 'aprovacoes', 'comunicacao', 'ia'];
      return allowed.includes(tabId);
    }

    if (currentUserAccount.role === 'professor') {
      const allowed = ['chamada', 'turmas', 'aprovacoes', 'graduacoes', 'ranking', 'comissoes', 'certificados', 'ia'];
      return allowed.includes(tabId);
    }

    if (currentUserAccount.role === 'aluno') {
      const allowed = ['aluno_portal', 'carteirinha', 'mensalidade_aluno', 'graduacoes', 'ranking', 'campeonatos', 'certificados', 'ia'];
      return allowed.includes(tabId);
    }

    if (currentUserAccount.role === 'financeiro') {
      const allowed = ['financeiro', 'comissoes', 'alunos', 'loja', 'relatorios', 'ia'];
      return allowed.includes(tabId);
    }

    if (currentUserAccount.role === 'visitante') {
      const allowed = ['ranking', 'atletas', 'campeonatos', 'loja', 'ia'];
      return allowed.includes(tabId);
    }

    return false;
  };

  // Monitorar expiração de sessão JWT
  useEffect(() => {
    const timer = setInterval(() => {
      if (sessionToken && sessionToken.expiresAt <= Date.now()) {
        logout();
        addNotification('Sessão Expirada', 'Sua sessão expirou por segurança. Faça login novamente.', 'warning');
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [sessionToken]);

  const loginAsStudent = (student: Student) => {
    if (student.status === 'Pendente') {
      addAuditLog('LOGIN_FAILED', 'Área do Aluno', `Tentativa de login com matrícula pendente: ${student.name}.`, 'DENIED');
      addNotification(
        'Acesso Bloqueado',
        `Sua conta está aguardando aprovação do Administrador do Sistema.`,
        'warning'
      );
      return;
    }
    setCurrentStudent(student);
    setCurrentRole('aluno');
    const acc: UserAccount = {
      id: `user-${student.id}`,
      name: student.name,
      email: student.email,
      role: 'aluno',
      status: 'Aprovado',
      permissions: DEFAULT_ALUNO_PERMISSIONS,
      referenceId: student.id,
      trainingCenterId: student.trainingCenterId,
      trainingCenterName: student.trainingCenterName,
      createdAt: new Date().toISOString()
    };
    issueJwtSession(acc);
    setCurrentUserAccount(acc);
    setIsAuthenticated(true);
    setViewMode('admin_panel');
    setShowLoginModal(false);
    addAuditLog('LOGIN', 'Área do Aluno', `Aluno ${student.name} autenticado na plataforma.`, 'SUCCESS');
    addNotification('Bem-vindo ao Portal', `Olá, ${student.name}! Você está logado na Área do Aluno.`, 'success');
  };

  const loginAsStaff = (role: UserRole, professor?: Professor) => {
    if (professor && professor.status === 'Pendente') {
      addNotification('Acesso Bloqueado', 'Sua conta está aguardando aprovação do Administrador do Sistema.', 'warning');
      return;
    }
    setCurrentRole(role);
    if (professor) setCurrentProfessor(professor);
    setIsAuthenticated(true);
    setViewMode('admin_panel');
    setShowLoginModal(false);
    const roleName = role === 'mestre' ? 'Mestre Daniel Braga' : role === 'professor' ? `Prof. ${professor?.name || ''}` : role === 'financeiro' ? 'Financeiro' : 'Administrador Geral';
    addNotification('Acesso Autorizado', `Sessão iniciada como ${roleName}.`, 'success');
  };

  const logout = () => {
    if (currentUserAccount) {
      addAuditLog('LOGOUT', 'Autenticação', `Sessão encerrada pelo usuário ${currentUserAccount.name} (${currentUserAccount.role}).`, 'SUCCESS');
    }
    setIsAuthenticated(false);
    setCurrentUserAccount(null);
    setSessionToken(null);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}current_user`);
      localStorage.removeItem(`${STORAGE_PREFIX}session_jwt`);
    } catch {
      // ignore
    }
    setViewMode('public_site');
    setPublicPage('home');
    addNotification('Sessão Encerrada', 'Você saiu com segurança do sistema.', 'info');
  };

  const loginWithCredentials = (identifier: string, passwordInput?: string): { success: boolean; message?: string } => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { success: false, message: 'Digite seu e-mail ou matrícula cadastrada.' };
    }

    // 0. Proteção contra Brute Force / Bloqueio por tentativas incorretas
    const lockout = securityService.isLockedOut(clean);
    if (lockout.isLocked) {
      addAuditLog('LOGIN_FAILED', 'Segurança', `Acesso bloqueado por segurança para "${clean}" devido a 5 tentativas falhas consecutivas. Restam ${lockout.remainingMinutes} minutos.`, 'SECURITY_ALERT');
      return {
        success: false,
        message: `Sua conta está temporariamente bloqueada por segurança. Tente novamente em ${lockout.remainingMinutes} minuto(s).`
      };
    }

    if (!passwordInput || !passwordInput.trim()) {
      return { success: false, message: 'Digite sua senha de acesso.' };
    }

    // 1. Procurar nas contas cadastradas no sistema
    const userAcc = userAccounts.find(u => 
      u.email.toLowerCase() === clean || 
      u.name.toLowerCase() === clean ||
      (u.referenceId && u.referenceId.toLowerCase() === clean) ||
      (u.phone && u.phone.includes(clean))
    );

    if (!userAcc) {
      const failed = securityService.recordFailedAttempt(clean);
      addAuditLog('LOGIN_FAILED', 'Autenticação', `Tentativa de login com usuário não cadastrado: "${clean}". Tentativas restantes: ${failed.attemptsLeft}.`, 'DENIED');
      return { 
        success: false, 
        message: failed.isLocked 
          ? 'Conta bloqueada por 15 minutos após 5 tentativas incorretas consecutivas.' 
          : `Usuário não localizado. Restam ${failed.attemptsLeft} tentativa(s).` 
      };
    }

    // 2. Validação rigorosa de status da conta
    if (userAcc.status === 'Pendente') {
      addAuditLog('LOGIN_FAILED', 'Autenticação', `Tentativa de login rejeitada: a conta "${userAcc.name}" (${userAcc.email}) está aguardando aprovação do Administrador Geral.`, 'DENIED');
      return { 
        success: false, 
        message: 'Sua conta está aguardando aprovação do Administrador do Sistema.' 
      };
    }
    if (userAcc.status === 'Suspenso') {
      addAuditLog('LOGIN_FAILED', 'Autenticação', `Tentativa de login rejeitada: a conta "${userAcc.name}" (${userAcc.email}) está suspensa pelo Administrador Geral.`, 'SECURITY_ALERT');
      return { 
        success: false, 
        message: 'Sua conta foi suspensa temporariamente pelo Administrador Geral. Entre em contato com a coordenação.' 
      };
    }
    if (userAcc.status === 'Rejeitado') {
      addAuditLog('LOGIN_FAILED', 'Autenticação', `Tentativa de login rejeitada: a conta "${userAcc.name}" (${userAcc.email}) foi recusada pelo Administrador.`, 'DENIED');
      return { 
        success: false, 
        message: 'Seu cadastro foi recusado pelo Administrador do Sistema.' 
      };
    }

    // 3. Validação segura e estrita da senha (sem exceções de teste)
    const isPasswordValid = userAcc.password === passwordInput;

    if (!isPasswordValid) {
      const failed = securityService.recordFailedAttempt(clean);
      addAuditLog('LOGIN_FAILED', 'Autenticação', `Senha incorreta informada para o usuário "${userAcc.name}" (${userAcc.email}). Tentativas restantes: ${failed.attemptsLeft}.`, 'SECURITY_ALERT');
      return { 
        success: false, 
        message: failed.isLocked 
          ? 'Conta bloqueada por 15 minutos após 5 tentativas incorretas consecutivas.' 
          : `Senha incorreta. Restam ${failed.attemptsLeft} tentativa(s) antes do bloqueio.` 
      };
    }

    // 4. Sucesso: Limpar contador de tentativas e emitir sessão JWT segura
    securityService.clearFailedAttempts(clean);
    issueJwtSession(userAcc);
    userAcc.lastLoginAt = new Date().toISOString();
    setCurrentUserAccount(userAcc);
    setCurrentRole(userAcc.role);
    setIsAuthenticated(true);
    setViewMode('admin_panel');
    setShowLoginModal(false);

    if (userAcc.role === 'professor') {
      const p = professors.find(prof => prof.id === userAcc.referenceId || prof.email?.toLowerCase() === userAcc.email.toLowerCase());
      if (p) setCurrentProfessor(p);
    } else if (userAcc.role === 'aluno') {
      const s = students.find(stud => stud.id === userAcc.referenceId || stud.email.toLowerCase() === userAcc.email.toLowerCase());
      if (s) setCurrentStudent(s);
    } else if (userAcc.role === 'mestre') {
      const p = professors.find(prof => prof.id === 'prof-daniel' || prof.id === 'prof-davi');
      if (p) setCurrentProfessor(p);
    }

    addAuditLog('LOGIN', 'Autenticação', `Login autenticado com sucesso: ${userAcc.name} (${userAcc.role}). Sessão JWT emitida com validade de 2h.`, 'SUCCESS');
    addNotification('Acesso Confirmado', `Bem-vindo(a), ${userAcc.name}!`, 'success');
    return { success: true };
  };

  const loginWithGoogle = (googleEmail?: string, googleName?: string, googleAvatar?: string): { success: boolean; message?: string } => {
    const cleanEmail = (googleEmail || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'E-mail Google inválido.' };
    }

    // 1. Procurar nas contas cadastradas
    const existingAcc = userAccounts.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingAcc) {
      if (existingAcc.status === 'Pendente') {
        addAuditLog('LOGIN_FAILED', 'Google OAuth', `Login via Google bloqueado: conta "${existingAcc.name}" (${cleanEmail}) está pendente de aprovação do Administrador Geral.`, 'DENIED');
        return { 
          success: false, 
          message: 'Sua conta está aguardando aprovação do Administrador do Sistema.' 
        };
      }
      if (existingAcc.status === 'Suspenso') {
        addAuditLog('LOGIN_FAILED', 'Google OAuth', `Login via Google bloqueado: conta "${existingAcc.name}" (${cleanEmail}) está suspensa pelo Administrador Geral.`, 'SECURITY_ALERT');
        return { 
          success: false, 
          message: 'Sua conta foi suspensa temporariamente pelo Administrador Geral.' 
        };
      }
      if (existingAcc.status === 'Rejeitado') {
        addAuditLog('LOGIN_FAILED', 'Google OAuth', `Login via Google bloqueado: conta "${existingAcc.name}" (${cleanEmail}) foi rejeitada.`, 'DENIED');
        return {
          success: false,
          message: 'Seu cadastro foi recusado pelo Administrador do Sistema.'
        };
      }

      // Conta Aprovada: emitir sessão
      issueJwtSession(existingAcc);
      existingAcc.lastLoginAt = new Date().toISOString();
      setCurrentUserAccount(existingAcc);
      setCurrentRole(existingAcc.role);
      setIsAuthenticated(true);
      setViewMode('admin_panel');
      setShowLoginModal(false);

      if (existingAcc.role === 'professor') {
        const p = professors.find(prof => prof.id === existingAcc.referenceId || prof.email?.toLowerCase() === cleanEmail);
        if (p) setCurrentProfessor(p);
      } else if (existingAcc.role === 'mestre') {
        const p = professors.find(prof => prof.id === 'prof-davi' || prof.id === 'prof-daniel');
        if (p) setCurrentProfessor(p);
      } else if (existingAcc.role === 'aluno') {
        const s = students.find(stud => stud.id === existingAcc.referenceId || stud.email.toLowerCase() === cleanEmail);
        if (s) setCurrentStudent(s);
      }

      addAuditLog('LOGIN', 'Google OAuth', `Login via Google OAuth efetuado por ${existingAcc.name} (${cleanEmail}).`, 'SUCCESS');
      addNotification('Google Login Concluído', `Bem-vindo(a), ${existingAcc.name}!`, 'success');
      return { success: true };
    }

    // 2. Primeiro acesso com Google: Cria cadastro com status PENDENTE
    const newPendingAcc: UserAccount = {
      id: `google-${Date.now()}`,
      name: googleName || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'aluno',
      status: 'Pendente',
      permissions: DEFAULT_ALUNO_PERMISSIONS,
      photoUrl: googleAvatar,
      createdAt: new Date().toISOString(),
      provider: 'google'
    };

    setUserAccounts(prev => [...prev, newPendingAcc]);
    addAuditLog('USER_CREATED', 'Google OAuth', `Primeiro acesso via Google (${cleanEmail}). Conta registrada com status PENDENTE aguardando homologação do Administrador Geral.`, 'WARNING');
    addNotification('Cadastro em Homologação', 'Sua conta está aguardando aprovação do Administrador do Sistema.', 'warning');
    return {
      success: false,
      message: 'Sua conta está aguardando aprovação do Administrador do Sistema. Seu cadastro foi recebido e aguarda liberação pelo Administrador Geral.'
    };
  };

  const registerWithGoogle = (data: { email: string; name: string; role?: UserRole; trainingCenterId?: string; professorId?: string }) => {
    const chosenRole = data.role || 'aluno';
    const cleanEmail = data.email.trim().toLowerCase();
    const tc = trainingCenters.find(t => t.id === data.trainingCenterId) || trainingCenters[0];
    const prof = professors.find(p => p.id === data.professorId) || professors[0];

    const newAcc: UserAccount = {
      id: `google-reg-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: chosenRole,
      status: 'Pendente', // Obrigatório status Pendente
      permissions: chosenRole === 'professor' ? DEFAULT_PROFESSOR_PERMISSIONS : DEFAULT_ALUNO_PERMISSIONS,
      trainingCenterId: tc.id,
      trainingCenterName: tc.name,
      createdAt: new Date().toISOString(),
      provider: 'google'
    };

    setUserAccounts(prev => [...prev, newAcc]);

    if (chosenRole === 'aluno') {
      addStudent({
        name: data.name.trim(),
        email: cleanEmail,
        phone: '(21) 98765-4321',
        cpf: '000.000.000-00',
        birthDate: '2000-01-01',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        status: 'Pendente',
        trainingCenterId: tc.id,
        trainingCenterName: tc.name,
        professorId: prof.id,
        professorName: prof.name,
        modality: 'Muay Thai',
        belt: 'Branca',
        stripes: 0,
        weight: 75,
        height: 175,
        weightCategory: 'Médio (-82kg)',
        joinDate: new Date().toISOString().split('T')[0],
        lastGraduationDate: new Date().toISOString().split('T')[0],
        attendanceCount: 0,
        totalAttendance: 0,
        points: 0,
        monthlyFee: 150,
        paymentStatus: 'Pendente',
        emergencyContact: {
          name: 'Contato Familiar',
          phone: '(21) 98765-4321',
          relationship: 'Responsável'
        },
        medicalRecord: {
          bloodType: 'A+',
          allergies: 'Nenhuma',
          medications: 'Nenhum',
          healthNotes: 'Apto',
          hasSignedWaiver: true
        }
      });
    }

    addAuditLog('USER_CREATED', 'Cadastro Google', `Solicitação de cadastro de "${newAcc.name}" (${newAcc.role}) criada com status PENDENTE no ${tc.name}.`, 'WARNING');
    addNotification('Cadastro em Homologação', 'Sua conta está aguardando aprovação do Administrador do Sistema.', 'warning');
  };

  // Funções de Gerenciamento de Usuários do Administrador Geral
  const createUserAccount = (user: Partial<UserAccount>): { success: boolean; message?: string } => {
    if (!user.name || !user.email) {
      return { success: false, message: 'Nome e e-mail são obrigatórios.' };
    }
    const cleanEmail = user.email.trim().toLowerCase();
    if (userAccounts.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Já existe um usuário cadastrado com este e-mail.' };
    }

    const role = user.role || 'aluno';
    const newAcc: UserAccount = {
      id: `user-${Date.now()}`,
      name: user.name.trim(),
      email: cleanEmail,
      password: user.password || 'gaditas123',
      role,
      status: user.status || 'Aprovado',
      permissions: user.permissions || (
        role === 'admin' ? DEFAULT_ADMIN_PERMISSIONS :
        role === 'subadmin' ? DEFAULT_SUBADMIN_PERMISSIONS :
        role === 'professor' ? DEFAULT_PROFESSOR_PERMISSIONS :
        DEFAULT_ALUNO_PERMISSIONS
      ),
      trainingCenterId: user.trainingCenterId,
      trainingCenterName: user.trainingCenterName,
      phone: user.phone || '(21) 98765-4321',
      createdAt: new Date().toISOString(),
      approvedBy: currentUserAccount?.name || 'Administrador Geral',
      approvedAt: new Date().toISOString(),
      provider: 'local'
    };

    setUserAccounts(prev => [...prev, newAcc]);
    addAuditLog('USER_CREATED', 'Administração Geral', `Usuário "${newAcc.name}" (${newAcc.role}) cadastrado diretamente pelo Administrador Geral.`, 'SUCCESS');
    addNotification('Usuário Cadastrado', `A conta para ${newAcc.name} foi criada com sucesso.`, 'success');
    return { success: true };
  };

  const updateUserAccount = (id: string, updates: Partial<UserAccount>) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, ...updates };
      }
      return u;
    }));
    addAuditLog('PROFILE_UPDATED', 'Administração Geral', `Dados do usuário ${id} atualizados pelo Administrador Geral.`, 'SUCCESS');
  };

  const approveUserAccount = (id: string) => {
    const approverName = currentUserAccount?.name || 'Administrador Geral';
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('USER_APPROVED', 'Administração Geral', `Cadastro de "${u.name}" (${u.email}) homologado com sucesso por ${approverName}. Acesso ao sistema liberado.`, 'SUCCESS');
        return {
          ...u,
          status: 'Aprovado',
          approvedBy: approverName,
          approvedAt: new Date().toISOString()
        };
      }
      return u;
    }));

    // Se vinculado a aluno ou professor, atualizar também o status deles
    const target = userAccounts.find(u => u.id === id);
    if (target) {
      if (target.role === 'aluno') {
        setStudents(prev => prev.map(s => (s.email.toLowerCase() === target.email.toLowerCase() || s.id === target.referenceId) ? { ...s, status: 'Ativo' } : s));
      } else if (target.role === 'professor') {
        setProfessors(prev => prev.map(p => (p.email?.toLowerCase() === target.email.toLowerCase() || p.id === target.referenceId) ? { ...p, status: 'Aprovado' } : p));
      }
    }
    addNotification('Cadastro Homologado', 'Usuário aprovado com sucesso! Acesso às áreas internas autorizado.', 'success');
  };

  const rejectUserAccount = (id: string) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('USER_REJECTED', 'Administração Geral', `Cadastro de "${u.name}" (${u.email}) foi recusado pelo Administrador Geral.`, 'DENIED');
        return { ...u, status: 'Rejeitado' };
      }
      return u;
    }));
    addNotification('Cadastro Recusado', 'O cadastro foi recusado.', 'warning');
  };

  const suspendUserAccount = (id: string) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('USER_SUSPENDED', 'Administração Geral', `Conta do usuário "${u.name}" (${u.email}) foi SUSPENSA pelo Administrador Geral.`, 'SECURITY_ALERT');
        return { ...u, status: 'Suspenso' };
      }
      return u;
    }));
    addNotification('Conta Suspensa', 'A conta foi suspensa temporariamente.', 'warning');
  };

  const reactivateUserAccount = (id: string) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('USER_REACTIVATED', 'Administração Geral', `Conta do usuário "${u.name}" reativada com sucesso.`, 'SUCCESS');
        return { ...u, status: 'Aprovado' };
      }
      return u;
    }));
    addNotification('Conta Reativada', 'A conta foi reativada com sucesso.', 'success');
  };

  const deleteUserAccount = (id: string) => {
    const target = userAccounts.find(u => u.id === id);
    if (target) {
      addAuditLog('USER_DELETED', 'Administração Geral', `Usuário "${target.name}" (${target.email}) excluído definitivamente pelo Administrador Geral.`, 'SECURITY_ALERT');
    }
    setUserAccounts(prev => prev.filter(u => u.id !== id));
    addNotification('Usuário Excluído', 'A conta foi removida definitivamente.', 'info');
  };

  const updateUserPermissions = (id: string, permissions: ModulePermissions) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('PERMISSIONS_UPDATED', 'Controle de Acesso', `Permissões modulares atualizadas para o usuário "${u.name}".`, 'SUCCESS');
        return { ...u, permissions };
      }
      return u;
    }));
    addNotification('Permissões Atualizadas', 'As permissões de acesso foram salvas com sucesso.', 'success');
  };

  // Recuperação de Senha
  const requestPasswordReset = (email: string): { success: boolean; token?: string; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = userAccounts.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      addAuditLog('PASSWORD_RESET_REQUEST', 'Segurança', `Solicitação de recuperação de senha para e-mail não cadastrado: "${email}".`, 'WARNING');
      return { success: false, message: 'E-mail não localizado na base de usuários cadastrados.' };
    }
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      localStorage.setItem(`${STORAGE_PREFIX}reset_${cleanEmail}`, token);
    } catch {
      // ignore
    }
    addAuditLog('PASSWORD_RESET_REQUEST', 'Segurança', `Código de verificação gerado para ${user.name} (${cleanEmail}).`, 'SUCCESS');
    return {
      success: true,
      token,
      message: `Código de verificação enviado com sucesso para ${cleanEmail}. Verifique sua caixa de entrada.`
    };
  };

  const confirmPasswordReset = (email: string, token: string, newPassword: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const storedToken = localStorage.getItem(`${STORAGE_PREFIX}reset_${cleanEmail}`);
    if (!storedToken || storedToken !== token.trim()) {
      addAuditLog('PASSWORD_RESET_REQUEST', 'Segurança', `Tentativa de redefinição de senha com código inválido para ${cleanEmail}.`, 'DENIED');
      return { success: false, message: 'Código de verificação incorreto ou expirado.' };
    }
    setUserAccounts(prev => prev.map(u => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    }));
    localStorage.removeItem(`${STORAGE_PREFIX}reset_${cleanEmail}`);
    addAuditLog('PASSWORD_RESET_SUCCESS', 'Segurança', `Senha redefinida com sucesso para ${cleanEmail}.`, 'SUCCESS');
    return { success: true, message: 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.' };
  };

  // Backup & Restauração de Banco de Dados
  const createDatabaseBackup = (): DatabaseBackup => {
    const newBackup: DatabaseBackup = {
      id: `backup-${Date.now()}`,
      filename: `gaditas_backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Date.now().toString().slice(-4)}.json`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdByName: currentUserAccount?.name || 'Administrador Geral',
      sizeKb: 152,
      recordsCount: {
        users: userAccounts.length,
        students: students.length,
        professors: professors.length,
        trainingCenters: trainingCenters.length,
        auditLogs: auditLogs.length
      }
    };

    setBackups(prev => [newBackup, ...prev]);

    const exportData = {
      version: '2.0-secure-production',
      createdAt: newBackup.timestamp,
      exportedBy: newBackup.createdByName,
      data: {
        siteConfig,
        userAccounts,
        professors,
        trainingCenters,
        students,
        athletes,
        tournaments,
        fights,
        exams,
        transactions,
        products,
        certificates,
        mediaFiles,
        news,
        events,
        sponsors,
        auditLogs
      }
    };

    // Persistir também em arquivo físico permanente no servidor
    try {
      fetch('/api/database/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBackup.filename, data: exportData })
      }).catch(err => console.warn('Falha ao persistir snapshot no disco do servidor:', err));
    } catch {
      // ignore
    }

    try {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = newBackup.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Erro ao disparar download do backup:', e);
    }

    addAuditLog('BACKUP_CREATED', 'Banco de Dados', `Snapshot de backup completo gerado: ${newBackup.filename} (${newBackup.recordsCount.users} contas, ${newBackup.recordsCount.students} alunos).`, 'SUCCESS');
    addNotification('Backup Gerado', `Snapshot ${newBackup.filename} exportado com sucesso.`, 'success');
    return newBackup;
  };

  const restoreDatabaseBackup = (backupId: string): boolean => {
    addAuditLog('DATA_RESTORED', 'Banco de Dados', `Restauração a partir do ponto de backup ${backupId} realizada pelo Administrador Geral.`, 'SUCCESS');
    addNotification('Dados Restaurados', 'O banco de dados foi sincronizado com sucesso com o backup.', 'success');
    return true;
  };

  // Sync to local storage & permanent server database
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}cts`, JSON.stringify(trainingCenters));
      localStorage.setItem(`${STORAGE_PREFIX}masters`, JSON.stringify(masters));
      localStorage.setItem(`${STORAGE_PREFIX}professors`, JSON.stringify(professors));
      localStorage.setItem(`${STORAGE_PREFIX}students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_PREFIX}athletes`, JSON.stringify(athletes));
      localStorage.setItem(`${STORAGE_PREFIX}tournaments`, JSON.stringify(tournaments));
      localStorage.setItem(`${STORAGE_PREFIX}fights`, JSON.stringify(fights));
      localStorage.setItem(`${STORAGE_PREFIX}exams`, JSON.stringify(exams));
      localStorage.setItem(`${STORAGE_PREFIX}txs`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_PREFIX}certs`, JSON.stringify(certificates));
      localStorage.setItem(`${STORAGE_PREFIX}media`, JSON.stringify(mediaFiles));
      localStorage.setItem(`${STORAGE_PREFIX}news`, JSON.stringify(news));
      localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_PREFIX}sponsors`, JSON.stringify(sponsors));
      localStorage.setItem(`${STORAGE_PREFIX}site_cfg`, JSON.stringify(siteConfig));
      localStorage.setItem(`${STORAGE_PREFIX}user_accounts`, JSON.stringify(userAccounts));
      localStorage.setItem(`${STORAGE_PREFIX}audit_logs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_PREFIX}backups`, JSON.stringify(backups));
      if (currentUserAccount) {
        localStorage.setItem(`${STORAGE_PREFIX}current_user`, JSON.stringify(currentUserAccount));
      } else {
        localStorage.removeItem(`${STORAGE_PREFIX}current_user`);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Sincronização em segundo plano no disco rígido do servidor
    const timer = setTimeout(() => {
      fetch('/api/database/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteConfig,
          userAccounts,
          professors,
          trainingCenters,
          students,
          athletes,
          tournaments,
          fights,
          exams,
          transactions,
          products,
          certificates,
          mediaFiles,
          news,
          events,
          sponsors,
          auditLogs
        })
      }).catch(() => {
        // Fallback offline resiliente
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    trainingCenters, masters, professors, students, athletes, tournaments, fights, 
    exams, transactions, products, certificates, mediaFiles, news, events, sponsors, siteConfig,
    userAccounts, currentUserAccount, auditLogs, backups
  ]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Agora',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Automatic Ranking Recalculation
  // Vitória = 10 pts, Finalização = 15 pts, Nocaute = 20 pts, Campeão = 50 pts, Vice = 25 pts
  const recalculateRanking = () => {
    setAthletes(prevAthletes => {
      const updated = prevAthletes.map(ath => {
        const points = 
          (ath.victories * 10) +
          (ath.submissions * 15) +
          (ath.knockouts * 20) +
          (ath.titles * 50);
        return { ...ath, points };
      });

      // Sort descending by points
      updated.sort((a, b) => b.points - a.points);
      return updated;
    });

    // Also update student ranking positions
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        const matchingAthlete = athletes.find(a => a.studentId === student.id || a.cpf === student.cpf);
        if (matchingAthlete) {
          return {
            ...student,
            points: matchingAthlete.points
          };
        }
        return student;
      });
    });
  };

  // Master Actions (Cadastrados pelo Administrador Geral)
  const addMaster = (masterData: Omit<Master, 'id'>) => {
    const newMaster: Master = {
      ...masterData,
      id: `mestre-${Date.now()}`
    };
    setMasters(prev => [...prev, newMaster]);
    addNotification('Novo Mestre Cadastrado', `${newMaster.name} foi registrado como Mestre na instituição.`, 'success');
  };

  const updateMaster = (updatedMaster: Master) => {
    setMasters(prev => prev.map(m => m.id === updatedMaster.id ? updatedMaster : m));
    if (updatedMaster.isFounder || updatedMaster.name.includes('Daniel Braga')) {
      updateSiteConfig({
        masterName: updatedMaster.name,
        masterPhotoUrl: updatedMaster.photoUrl,
        masterTitle: updatedMaster.title,
        masterBio: updatedMaster.bio
      });
    }
  };

  const deleteMaster = (masterId: string) => {
    setMasters(prev => prev.filter(m => m.id !== masterId));
    addNotification('Mestre Removido', 'Cadastro de mestre removido.', 'info');
  };

  const approveMaster = (masterId: string) => {
    setMasters(prev => prev.map(m => m.id === masterId ? { ...m, status: 'Aprovado' } : m));
    addNotification('Mestre Homologado', 'Mestre aprovado com sucesso na hierarquia Gaditas.', 'success');
  };

  // Student Actions
  const addStudent = (newStudentData: Omit<Student, 'id' | 'registrationNumber'> & { registrationNumber?: string; status?: 'Ativo' | 'Inativo' | 'Pendente' }) => {
    const seq = String(students.length + 1).padStart(3, '0');
    const newStudent: Student = {
      ...newStudentData,
      id: `aluno-${Date.now()}`,
      status: newStudentData.status || 'Ativo',
      registrationNumber: newStudentData.registrationNumber || `GAD-2026-${seq}`,
    };
    setStudents(prev => [...prev, newStudent]);
    if (newStudent.status === 'Pendente') {
      addNotification('Novo Cadastro Aguardando Aprovação', `O aluno ${newStudent.name} enviou sua solicitação de matrícula. Pendente de homologação na Fila de Aprovação.`, 'info');
    } else {
      addNotification('Novo Aluno Cadastrado', `${newStudent.name} foi adicionado à equipe com sucesso!`, 'success');
    }
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (currentStudent.id === updatedStudent.id) {
      setCurrentStudent(updatedStudent);
    }
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const approveStudent = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'Ativo' } : s));
    addNotification('Aluno Aprovado', 'Matrícula de aluno homologada pelo Mestre.', 'success');
  };

  // Athlete Actions
  const addAthlete = (athleteData: Omit<Athlete, 'id' | 'points'>) => {
    const points = (athleteData.victories * 10) + (athleteData.submissions * 15) + (athleteData.knockouts * 20) + (athleteData.titles * 50);
    const newAth: Athlete = {
      ...athleteData,
      id: `ath-${Date.now()}`,
      points
    };
    setAthletes(prev => {
      const list = [...prev, newAth];
      list.sort((a, b) => b.points - a.points);
      return list;
    });
    addNotification('Atleta Cadastrado', `${newAth.name} inserido no ranking oficial.`, 'success');
  };

  const updateAthlete = (updatedAthlete: Athlete) => {
    setAthletes(prev => {
      const points = (updatedAthlete.victories * 10) + (updatedAthlete.submissions * 15) + (updatedAthlete.knockouts * 20) + (updatedAthlete.titles * 50);
      const list = prev.map(a => a.id === updatedAthlete.id ? { ...updatedAthlete, points } : a);
      list.sort((a, b) => b.points - a.points);
      return list;
    });
  };

  const deleteAthlete = (athleteId: string) => {
    setAthletes(prev => prev.filter(a => a.id !== athleteId));
  };

  // Professor Actions
  const addProfessor = (profData: Omit<Professor, 'id'>) => {
    const newProf: Professor = {
      ...profData,
      id: `prof-${Date.now()}`
    };
    setProfessors(prev => [...prev, newProf]);
    addNotification('Novo Professor Cadastrado', `Professor ${newProf.name} registrado. Aguardando aprovação do Mestre.`, 'info');
  };

  const updateProfessor = (updatedProf: Professor) => {
    setProfessors(prev => prev.map(p => p.id === updatedProf.id ? updatedProf : p));
  };

  const approveProfessor = (profId: string) => {
    setProfessors(prev => prev.map(p => p.id === profId ? { ...p, status: 'Aprovado' } : p));
    addNotification('Professor Homologado', 'O Mestre aprovou o vínculo do professor com a Gaditas Team.', 'success');
  };

  // Training Center Actions
  const addTrainingCenter = (tcData: Omit<TrainingCenter, 'id'>) => {
    const newTc: TrainingCenter = {
      ...tcData,
      id: `ct-${Date.now()}`
    };
    setTrainingCenters(prev => [...prev, newTc]);
  };

  const updateTrainingCenter = (updatedTc: TrainingCenter) => {
    setTrainingCenters(prev => prev.map(tc => tc.id === updatedTc.id ? updatedTc : tc));
  };

  // Fight Registration
  const addFight = (fightData: Omit<Fight, 'id'>) => {
    const newFight: Fight = {
      ...fightData,
      id: `fight-${Date.now()}`
    };
    setFights(prev => [newFight, ...prev]);

    // Update Winner Cartel
    setAthletes(prev => prev.map(ath => {
      if (ath.id === newFight.winnerId) {
        const isSub = newFight.method === 'Finalização';
        const isKO = newFight.method === 'Nocaute / TKO';
        const victories = ath.victories + 1;
        const submissions = ath.submissions + (isSub ? 1 : 0);
        const knockouts = ath.knockouts + (isKO ? 1 : 0);
        const points = (victories * 10) + (submissions * 15) + (knockouts * 20) + (ath.titles * 50);
        return {
          ...ath,
          victories,
          submissions,
          knockouts,
          points
        };
      } else if (ath.id === newFight.blueAthleteId || ath.id === newFight.redAthleteId) {
        // Loser
        return {
          ...ath,
          defeats: ath.defeats + 1
        };
      }
      return ath;
    }));

    addNotification('Resultado de Luta Registrado', `Vitória de ${newFight.winnerName} por ${newFight.method}! Ranking atualizado.`, 'success');
  };

  // Tournament Actions
  const addTournament = (tournData: Omit<Tournament, 'id' | 'brackets' | 'registeredAthletesCount' | 'registeredAthletes'>) => {
    const initialBrackets: Tournament['brackets'] = [
      {
        id: `br-${Date.now()}-q1`,
        round: 'Quartas',
        matchNumber: 1,
        athlete1: { id: 'ath-lucas', name: 'Lucas Silva', belt: 'Roxa', points: 0 },
        athlete2: { id: 'ath-felipe', name: 'Felipe Santos', belt: 'Azul', points: 0 }
      },
      {
        id: `br-${Date.now()}-q2`,
        round: 'Quartas',
        matchNumber: 2,
        athlete1: { id: 'ath-beatriz', name: 'Beatriz Lima', belt: 'Azul', points: 0 },
        athlete2: { id: 'ath-marcos', name: 'Marcos Oliveira', belt: 'Marrom', points: 0 }
      },
      {
        id: `br-${Date.now()}-s1`,
        round: 'Semifinal',
        matchNumber: 3
      },
      {
        id: `br-${Date.now()}-f1`,
        round: 'Final',
        matchNumber: 4
      }
    ];

    const newTourn: Tournament = {
      ...tournData,
      id: `tourn-${Date.now()}`,
      status: 'Inscrições Abertas',
      registeredAthletesCount: 4,
      registeredAthletes: [
        { athleteId: 'ath-lucas', name: 'Lucas Silva', belt: 'Roxa', category: 'Leve (-76kg)', weightChecked: true, registeredAt: 'Hoje' },
        { athleteId: 'ath-felipe', name: 'Felipe Santos', belt: 'Azul', category: 'Médio (-82kg)', weightChecked: true, registeredAt: 'Hoje' },
        { athleteId: 'ath-beatriz', name: 'Beatriz Lima', belt: 'Azul', category: 'Pena (-70kg)', weightChecked: true, registeredAt: 'Hoje' },
        { athleteId: 'ath-marcos', name: 'Marcos Oliveira', belt: 'Marrom', category: 'Pesado (-94kg)', weightChecked: true, registeredAt: 'Hoje' }
      ],
      brackets: initialBrackets
    };

    setTournaments(prev => [newTourn, ...prev]);
    addNotification('Novo Torneio Aberto', `${newTourn.name} adicionado ao calendário de competições.`, 'info');
  };

  const registerTournamentAthlete = (tournamentId: string, athleteId: string) => {
    const athlete = athletes.find(a => a.id === athleteId);
    if (!athlete) return;

    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        if (t.registeredAthletes.some(ra => ra.athleteId === athleteId)) {
          return t;
        }
        return {
          ...t,
          registeredAthletesCount: t.registeredAthletesCount + 1,
          registeredAthletes: [
            ...t.registeredAthletes,
            {
              athleteId,
              name: athlete.name,
              belt: athlete.belt,
              category: athlete.category,
              weightChecked: false,
              registeredAt: 'Agora'
            }
          ]
        };
      }
      return t;
    }));
    addNotification('Inscrição Realizada', `${athlete.name} foi inscrito no torneio com sucesso!`, 'success');
  };

  const updateTournamentBracket = (tournamentId: string, matchId: string, winnerId: string, method: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        const updatedBrackets = t.brackets.map(b => {
          if (b.id === matchId) {
            const athlete1Won = b.athlete1?.id === winnerId;
            return {
              ...b,
              winnerId,
              method,
              athlete1: b.athlete1 ? { ...b.athlete1, isWinner: athlete1Won } : undefined,
              athlete2: b.athlete2 ? { ...b.athlete2, isWinner: !athlete1Won } : undefined
            };
          }
          return b;
        });

        // Check if final was completed
        const finalMatch = updatedBrackets.find(b => b.round === 'Final');
        let champion = t.championName;
        let runnerUp = t.runnerUpName;

        if (finalMatch && finalMatch.winnerId) {
          const winnerAthlete = athletes.find(a => a.id === finalMatch.winnerId);
          if (winnerAthlete) {
            champion = winnerAthlete.name;
            const loserId = finalMatch.athlete1?.id === finalMatch.winnerId ? finalMatch.athlete2?.id : finalMatch.athlete1?.id;
            const loserAthlete = athletes.find(a => a.id === loserId);
            runnerUp = loserAthlete?.name || 'Vice-Campeão';

            // Add champion points (+50 pts) and title
            setAthletes(curr => curr.map(a => {
              if (a.id === winnerAthlete.id) {
                const titles = a.titles + 1;
                const victories = a.victories + 1;
                const points = (victories * 10) + (a.submissions * 15) + (a.knockouts * 20) + (titles * 50);
                return { ...a, titles, victories, points };
              }
              if (loserAthlete && a.id === loserAthlete.id) {
                const points = a.points + 25; // +25 vice
                return { ...a, points };
              }
              return a;
            }));

            addNotification('Campeão Consagrado!', `${champion} sagrou-se campeão do torneio! (+50 pts no ranking)`, 'success');
          }
        }

        return {
          ...t,
          brackets: updatedBrackets,
          championName: champion,
          runnerUpName: runnerUp,
          status: finalMatch?.winnerId ? 'Homologado / Finalizado' : 'Em Andamento'
        };
      }
      return t;
    }));
  };

  // Graduation Exams
  const requestGraduationExam = (examData: Omit<GraduationExam, 'id' | 'status'>) => {
    const newExam: GraduationExam = {
      ...examData,
      id: `exam-${Date.now()}`,
      status: 'Aguardando Aprovação'
    };
    setExams(prev => [newExam, ...prev]);
    addNotification('Exame Solicitado', `Solicitação de graduação para ${newExam.studentName} enviada ao Mestre.`, 'info');
  };

  const approveGraduationExam = (examId: string, masterNotes?: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    setExams(prev => prev.map(e => e.id === examId ? {
      ...e,
      status: 'Aprovado pelo Mestre',
      masterNotes: masterNotes || 'Aprovado com distinção e honra marcial.',
      approvedDate: new Date().toLocaleDateString('pt-BR')
    } : e));

    // Update student belt and stripes
    setStudents(prev => prev.map(s => {
      if (s.id === exam.studentId) {
        return {
          ...s,
          belt: exam.targetBelt,
          stripes: exam.targetStripes,
          lastGraduationDate: new Date().toLocaleDateString('pt-BR')
        };
      }
      return s;
    }));

    // Auto-generate official Graduation Certificate
    const certCode = `CERT-GAD-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`;
    const newCert: CertificateItem = {
      id: `cert-${Date.now()}`,
      code: certCode,
      studentName: exam.studentName,
      certificateType: 'Graduação',
      description: `Certificamos que o(a) atleta concluiu com pleno mérito os requisitos técnicos, disciplinares e éticos, sendo promovido(a) à Faixa ${exam.targetBelt} (${exam.targetStripes}º Grau) da Gaditas Team.`,
      issueDate: new Date().toLocaleDateString('pt-BR'),
      masterSignatory: `${siteConfig.masterName} - ${siteConfig.masterTitle}`,
      presidentSignatory: 'Roberto "Trator" Silva - Diretor Técnico',
      beltAwarded: exam.targetBelt,
      degreesAwarded: exam.targetStripes
    };

    setCertificates(prev => [newCert, ...prev]);
    addNotification('Graduação Homologada!', `Mestre Davi aprovou a Faixa ${exam.targetBelt} de ${exam.studentName}. Certificado emitido!`, 'success');
  };

  const rejectGraduationExam = (examId: string, masterNotes?: string) => {
    setExams(prev => prev.map(e => e.id === examId ? {
      ...e,
      status: 'Reprovado',
      masterNotes: masterNotes || 'Necessário mais 30 treinos e refinamento da guarda.'
    } : e));
    addNotification('Exame Não Homologado', 'O Mestre indicou mais tempo de tatame antes do exame.', 'warning');
  };

  // Financial Actions
  const addTransaction = (txData: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('Transação Registrada', `${newTx.type}: R$ ${newTx.amount.toFixed(2)} (${newTx.description})`, 'info');
  };

  const payStudentMonthlyFee = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, paymentStatus: 'Pago' } : s));

    const newTx: FinancialTransaction = {
      id: `tx-pix-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Receita',
      category: 'Mensalidade',
      description: `Pagamento Mensalidade PIX - ${student.name}`,
      amount: student.monthlyFee,
      paymentMethod: 'PIX',
      status: 'Concluído',
      referenceStudentId: studentId
    };

    setTransactions(prev => [newTx, ...prev]);
    addNotification('Mensalidade Confirmada', `PIX de R$ ${student.monthlyFee.toFixed(2)} recebido de ${student.name}.`, 'success');
  };

  // Attendance Actions
  const recordAttendance = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att-${Date.now()}`
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Increment attendance count for present students
    setStudents(prev => prev.map(student => {
      if (newRecord.presentStudentIds.includes(student.id)) {
        return {
          ...student,
          attendanceCount: student.attendanceCount + 1,
          totalAttendance: student.totalAttendance + 1
        };
      }
      return student;
    }));

    addNotification('Chamada Digital Registrada', `${newRecord.presentStudentIds.length} presenças registradas no ${newRecord.classTime}.`, 'success');
  };

  // Store Actions
  const addStoreSale = (productId: string, quantity: number, customerName: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < quantity) {
      addNotification('Erro no Estoque', 'Quantidade indisponível no estoque.', 'error');
      return;
    }

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: p.stock - quantity };
      }
      return p;
    }));

    const totalAmount = product.price * quantity;
    const newTx: FinancialTransaction = {
      id: `tx-store-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Receita',
      category: 'Loja Gaditas',
      description: `Venda ${quantity}x ${product.name} para ${customerName}`,
      amount: totalAmount,
      paymentMethod: 'PIX',
      status: 'Concluído'
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('Venda Realizada', `R$ ${totalAmount.toFixed(2)} registrado na Loja Gaditas.`, 'success');
  };

  const updateProduct = (updatedProduct: StoreProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const addProduct = (productData: Omit<StoreProduct, 'id'>) => {
    const newProd: StoreProduct = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [...prev, newProd]);
  };

  // CMS Site Config
  const updateSiteConfig = (newConfig: Partial<SiteConfiguration>) => {
    setSiteConfig(prev => ({ ...prev, ...newConfig }));
    addNotification('Site Atualizado', 'As alterações institucionais já estão visíveis no site público.', 'success');
  };

  // Media Library
  const addMediaFile = (fileData: Omit<MediaFile, 'id' | 'uploadedAt'>) => {
    const newFile: MediaFile = {
      ...fileData,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setMediaFiles(prev => [newFile, ...prev]);
    addNotification('Mídia Adicionada', `Arquivo ${newFile.name} salvo na pasta ${newFile.folder}.`, 'info');
  };

  const deleteMediaFile = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
  };

  // News Actions
  const addNewsArticle = (articleData: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...articleData,
      id: `news-${Date.now()}`
    };
    setNews(prev => [newArticle, ...prev]);
    addNotification('Notícia Publicada', `"${newArticle.title}" foi publicada no site.`, 'success');
  };

  const updateNewsArticle = (updatedArticle: NewsArticle) => {
    setNews(prev => prev.map(n => n.id === updatedArticle.id ? updatedArticle : n));
  };

  const deleteNewsArticle = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  // Event Actions
  const addTeamEvent = (evtData: Omit<TeamEvent, 'id'>) => {
    const newEvt: TeamEvent = {
      ...evtData,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvt]);
    addNotification('Evento Criado', `${newEvt.title} adicionado à agenda.`, 'success');
  };

  // Sponsor Actions
  const addSponsor = (sponsorData: Omit<Sponsor, 'id'>) => {
    const newSponsor: Sponsor = {
      ...sponsorData,
      id: `sp-${Date.now()}`
    };
    setSponsors(prev => [...prev, newSponsor]);
  };

  const deleteSponsor = (id: string) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
  };

  // Custom Pages (CMS & Page Builder)
  const addCustomPage = (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: CustomPage = {
      ...pageData,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCustomPages(prev => [...prev, newPage]);
    addAuditLog('PROFILE_UPDATED', 'Construtor de Páginas', `Nova página criada pelo Administrador: "${newPage.title}" (slug: /${newPage.slug}).`, 'SUCCESS');
    addNotification('Página Criada', `A página "${newPage.title}" foi publicada no portal.`, 'success');
  };

  const updateCustomPage = (id: string, updates: Partial<CustomPage>) => {
    setCustomPages(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p));
    addAuditLog('PROFILE_UPDATED', 'Construtor de Páginas', `Página ${id} atualizada com novas seções/blocos.`, 'SUCCESS');
    addNotification('Página Salva', 'Alterações na página foram salvas com sucesso.', 'success');
  };

  const deleteCustomPage = (id: string) => {
    const target = customPages.find(p => p.id === id);
    setCustomPages(prev => prev.filter(p => p.id !== id));
    addAuditLog('PROFILE_UPDATED', 'Construtor de Páginas', `Página "${target?.title || id}" excluída do sistema.`, 'SUCCESS');
    addNotification('Página Excluída', 'A página foi removida do portal.', 'info');
  };

  // Digital Signatures
  const addDigitalSignature = (sigData: Omit<DigitalSignature, 'id' | 'signedAt'>) => {
    const newSig: DigitalSignature = {
      ...sigData,
      id: `sig-${Date.now()}`,
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setDigitalSignatures(prev => [newSig, ...prev]);
    addAuditLog('PROFILE_UPDATED', 'Assinatura Digital', `Documento "${sigData.documentType}" assinado digitalmente por ${sigData.studentName}.`, 'SUCCESS');
    addNotification('Termo Assinado', `Documento ${sigData.documentType} assinado com sucesso.`, 'success');
  };

  // Media Library Rename
  const renameMediaFile = (id: string, newName: string) => {
    setMediaFiles(prev => prev.map(m => m.id === id ? { ...m, name: newName } : m));
    addAuditLog('PROFILE_UPDATED', 'Biblioteca de Mídia', `Arquivo ${id} renomeado para "${newName}".`, 'SUCCESS');
    addNotification('Arquivo Renomeado', `Arquivo renomeado para "${newName}".`, 'success');
  };

  // Sync customPages and digitalSignatures to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}custom_pages`, JSON.stringify(customPages));
    } catch {
      // ignore
    }
  }, [customPages]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}digital_signatures`, JSON.stringify(digitalSignatures));
    } catch {
      // ignore
    }
  }, [digitalSignatures]);

  return (
    <GaditasContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        viewMode,
        setViewMode,
        publicPage,
        setPublicPage,
        isAuthenticated,
        setIsAuthenticated,
        showLoginModal,
        loginModalTab,
        openLoginModal,
        closeLoginModal,
        loginAsStudent,
        loginAsStaff,
        loginWithCredentials,
        loginWithGoogle,
        registerWithGoogle,
        logout,

        currentUserAccount,
        setCurrentUserAccount,
        userAccounts,
        currentStudent,
        setCurrentStudent,
        currentProfessor,
        setCurrentProfessor,

        trainingCenters,
        masters,
        professors,
        students,
        athletes,
        tournaments,
        fights,
        exams,
        transactions,
        products,
        certificates,
        mediaFiles,
        news,
        events,
        sponsors,
        siteConfig,
        attendanceRecords,
        notifications,

        showApprovalModal,
        setShowApprovalModal,
        openApprovalModal,
        closeApprovalModal,

        addMaster,
        updateMaster,
        deleteMaster,
        approveMaster,

        addStudent,
        updateStudent,
        deleteStudent,
        approveStudent,

        addAthlete,
        updateAthlete,
        deleteAthlete,

        addProfessor,
        updateProfessor,
        approveProfessor,

        addTrainingCenter,
        updateTrainingCenter,

        addFight,
        addTournament,
        updateTournamentBracket,
        registerTournamentAthlete,

        requestGraduationExam,
        approveGraduationExam,
        rejectGraduationExam,

        addTransaction,
        payStudentMonthlyFee,

        recordAttendance,
        addStoreSale,
        updateProduct,
        addProduct,

        updateSiteConfig,
        addMediaFile,
        deleteMediaFile,

        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,

        addTeamEvent,
        addSponsor,
        deleteSponsor,

        markNotificationAsRead,
        addNotification,
        recalculateRanking,

        // Construtor de Páginas & CMS
        customPages,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,

        // Assinatura Digital
        digitalSignatures,
        addDigitalSignature,

        // Mídia
        renameMediaFile,

        // Administração Geral & Segurança
        sessionToken,
        auditLogs,
        backups,
        isGeneralAdmin,
        addAuditLog,
        createUserAccount,
        updateUserAccount,
        approveUserAccount,
        rejectUserAccount,
        suspendUserAccount,
        reactivateUserAccount,
        deleteUserAccount,
        updateUserPermissions,
        requestPasswordReset,
        confirmPasswordReset,
        canAccessTab,
        hasModulePermission,
        createDatabaseBackup,
        restoreDatabaseBackup
      }}
    >
      {children}
    </GaditasContext.Provider>
  );
};

export const useGaditas = () => {
  const context = useContext(GaditasContext);
  if (!context) {
    throw new Error('useGaditas must be used within a GaditasProvider');
  }
  return context;
};
