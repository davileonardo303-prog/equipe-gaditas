import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { UserAccount, UserRole, UserStatus, ModulePermissions, AuditLog } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  FileText, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  Sliders, 
  Clock, 
  ShieldAlert, 
  Building2, 
  GraduationCap, 
  Smartphone, 
  Check, 
  X,
  FileSpreadsheet,
  AlertOctagon
} from 'lucide-react';

interface AdminControlPanelProps {
  initialTab?: 'usuarios' | 'aprovacoes' | 'auditoria' | 'backup' | 'seguranca';
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ initialTab = 'usuarios' }) => {
  const { 
    userAccounts, 
    currentUserAccount,
    createUserAccount, 
    updateUserAccount, 
    approveUserAccount, 
    rejectUserAccount, 
    suspendUserAccount, 
    reactivateUserAccount, 
    deleteUserAccount, 
    updateUserPermissions,
    auditLogs,
    backups,
    createDatabaseBackup,
    restoreDatabaseBackup,
    trainingCenters,
    professors,
    addNotification,
    isGeneralAdmin
  } = useGaditas();

  // Navigation tab within Admin Panel
  const [activeTab, setActiveTab] = useState<'usuarios' | 'aprovacoes' | 'auditoria' | 'backup' | 'seguranca'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filters for Users
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState<UserAccount | null>(null);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('gaditas123');
  const [newUserPhone, setNewUserPhone] = useState('(21) 98765-4321');
  const [newUserRole, setNewUserRole] = useState<UserRole>('subadmin');
  const [newUserStatus, setNewUserStatus] = useState<UserStatus>('Aprovado');
  const [newUserTcId, setNewUserTcId] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [newUserError, setNewUserError] = useState('');

  // Edit Permissions Form State
  const [editingPermissions, setEditingPermissions] = useState<ModulePermissions>({
    usuarios: false,
    financeiro: false,
    professores: false,
    alunos: false,
    presencas: false,
    graduacoes: false,
    eventos: false,
    competicoes: false,
    relatorios: false,
    configuracoes: false,
    auditoria: false,
    site_cms: false
  });

  // Reset Password State
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Audit Logs Search & Filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('all');
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('all');

  // Stats
  const totalUsers = userAccounts.length;
  const pendingUsers = userAccounts.filter(u => u.status === 'Pendente');
  const approvedUsers = userAccounts.filter(u => u.status === 'Aprovado');
  const suspendedUsers = userAccounts.filter(u => u.status === 'Suspenso');

  // Filtered Users
  const filteredUsers = userAccounts.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      (u.trainingCenterName && u.trainingCenterName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesAction = auditActionFilter === 'all' || log.action === auditActionFilter;
    const matchesStatus = auditStatusFilter === 'all' || log.status === auditStatusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  // Handlers
  const handleOpenPermissions = (user: UserAccount) => {
    setShowPermissionsModal(user);
    if (user.permissions) {
      setEditingPermissions({ ...user.permissions });
    } else {
      setEditingPermissions({
        usuarios: user.role === 'admin',
        financeiro: user.role === 'admin' || user.role === 'subadmin' || user.role === 'financeiro',
        professores: user.role === 'admin' || user.role === 'subadmin',
        alunos: user.role === 'admin' || user.role === 'subadmin' || user.role === 'professor',
        presencas: user.role === 'admin' || user.role === 'subadmin' || user.role === 'professor',
        graduacoes: user.role === 'admin' || user.role === 'subadmin' || user.role === 'mestre' || user.role === 'professor',
        eventos: true,
        competicoes: true,
        relatorios: user.role === 'admin' || user.role === 'subadmin' || user.role === 'financeiro',
        configuracoes: user.role === 'admin',
        auditoria: user.role === 'admin',
        site_cms: user.role === 'admin'
      });
    }
  };

  const handleSavePermissions = () => {
    if (!showPermissionsModal) return;
    updateUserPermissions(showPermissionsModal.id, editingPermissions);
    setShowPermissionsModal(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError('');
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setNewUserError('Nome e e-mail são obrigatórios.');
      return;
    }
    const tc = trainingCenters.find(t => t.id === newUserTcId) || trainingCenters[0];
    const res = createUserAccount({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword || 'gaditas123',
      phone: newUserPhone,
      role: newUserRole,
      status: newUserStatus,
      trainingCenterId: tc?.id,
      trainingCenterName: tc?.name
    });
    if (res.success) {
      setShowNewUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('gaditas123');
    } else {
      setNewUserError(res.message || 'Erro ao criar usuário.');
    }
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordResetModal || !newPasswordVal.trim()) return;
    updateUserAccount(showPasswordResetModal.id, { password: newPasswordVal.trim() });
    addNotification('Senha Atualizada', `A nova senha de ${showPasswordResetModal.name} foi salva.`, 'success');
    setShowPasswordResetModal(null);
    setNewPasswordVal('');
  };

  const handleApproveAllPending = () => {
    if (confirm(`Deseja aprovar todos os ${pendingUsers.length} usuários pendentes agora?`)) {
      pendingUsers.forEach(u => approveUserAccount(u.id));
      addNotification('Aprovação em Lote', `${pendingUsers.length} cadastros foram homologados com sucesso!`, 'success');
    }
  };

  const exportAuditLogsCsv = () => {
    const headers = ['ID', 'Data/Hora', 'Usuário', 'Perfil', 'Ação', 'Módulo', 'IP/Origem', 'Status', 'Detalhes'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_gaditas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Relatório Exportado', 'Os logs de auditoria foram baixados em formato CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner do Administrador Geral */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border-2 border-red-600/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-950 border border-red-600/50 text-red-400 font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                Painel do Administrador Geral (Acesso Total)
              </span>
              <span className="text-neutral-500 text-xs hidden sm:inline">·</span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">Segurança Máxima & RBAC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-cinzel tracking-tight">
              Administração Geral & Controle de Acesso
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Controle absoluto de usuários, aprovação de cadastros, concessão de permissões modulares para administradores secundários, logs de auditoria e proteção contra acessos não autorizados.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Total Usuários</span>
              <span className="text-xl font-black text-white">{totalUsers}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-center">
              <span className="text-[10px] uppercase font-mono text-amber-400 block mb-0.5 font-bold">Pendentes</span>
              <span className="text-xl font-black text-amber-300 animate-pulse">{pendingUsers.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/30 text-center">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-0.5">Aprovados</span>
              <span className="text-xl font-black text-emerald-400">{approvedUsers.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-600/30 text-center">
              <span className="text-[10px] uppercase font-mono text-red-400 block mb-0.5">Suspensos</span>
              <span className="text-xl font-black text-red-400">{suspendedUsers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'usuarios'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 border border-white/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão de Usuários ({totalUsers})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('aprovacoes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'aprovacoes'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50 border border-white/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Fila de Aprovação</span>
          {pendingUsers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white text-amber-900 font-mono text-[10px] font-black animate-pulse">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'auditoria'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 border border-white/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Auditoria Completa & Logs ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'backup'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 border border-white/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Restauração</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seguranca')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'seguranca'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 border border-white/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Políticas de Segurança</span>
        </button>
      </div>

      {/* TAB 1: GESTÃO DE USUÁRIOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, telefone ou polo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-500"
                />
              </div>

              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todos os Perfis</option>
                <option value="admin">Administrador Geral</option>
                <option value="subadmin">Administrador</option>
                <option value="coordenador">Coordenador</option>
                <option value="mestre">Portal do Mestre</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
                <option value="financeiro">Responsável Financeiro</option>
                <option value="visitante">Visitante</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Pendente">Pendente</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Rejeitado">Rejeitado</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNewUserModal(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-white/20 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Novo Usuário</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-mono tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Usuário / Nome</th>
                  <th className="py-3.5 px-4">Perfil de Acesso</th>
                  <th className="py-3.5 px-4">Polo / CT Vinculado</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Origem</th>
                  <th className="py-3.5 px-4 text-right">Ações Administrativas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                      Nenhum usuário localizado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    const isSelf = currentUserAccount?.id === user.id;
                    return (
                      <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                              {user.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs uppercase">{user.name.substring(0, 2)}</span>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-white truncate flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {user.role === 'admin' && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-red-950 text-red-400 border border-red-600/40 font-mono font-bold">
                                    GERAL
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-neutral-400 font-mono">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase font-mono ${
                            user.role === 'admin' ? 'bg-red-950 text-red-400 border border-red-600/40' :
                            user.role === 'subadmin' ? 'bg-purple-950 text-purple-300 border border-purple-600/40' :
                            user.role === 'mestre' ? 'bg-amber-950 text-amber-400 border border-amber-600/40' :
                            user.role === 'professor' ? 'bg-blue-950 text-blue-300 border border-blue-600/40' :
                            user.role === 'financeiro' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' :
                            'bg-neutral-800 text-neutral-300'
                          }`}>
                            {user.role === 'admin' ? 'Administrador Geral' :
                             user.role === 'subadmin' ? 'Administrador' :
                             user.role === 'coordenador' ? 'Coordenador' :
                             user.role === 'mestre' ? 'Portal do Mestre' :
                             user.role === 'professor' ? 'Professor de CT' :
                             user.role === 'financeiro' ? 'Resp. Financeiro' :
                             user.role === 'visitante' ? 'Visitante' : 'Aluno'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-neutral-300">
                          {user.trainingCenterName || 'Todos os Centros / Sede'}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            user.status === 'Aprovado' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40' :
                            user.status === 'Pendente' ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40 animate-pulse' :
                            user.status === 'Suspenso' ? 'bg-red-950/80 text-red-400 border border-red-600/40' :
                            'bg-neutral-800 text-neutral-400'
                          }`}>
                            {user.status === 'Aprovado' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {user.status === 'Pendente' && <Clock className="w-3 h-3 text-amber-400" />}
                            {user.status === 'Suspenso' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            <span>{user.status}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {user.provider === 'google' ? 'Google OAuth' : 'Local / Manual'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Approve button if Pending */}
                            {user.status === 'Pendente' && (
                              <button
                                type="button"
                                onClick={() => approveUserAccount(user.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                                title="Aprovar e Liberar Acesso"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprovar</span>
                              </button>
                            )}

                            {/* Suspend or Reactivate button */}
                            {user.role !== 'admin' && (
                              user.status === 'Suspenso' ? (
                                <button
                                  type="button"
                                  onClick={() => reactivateUserAccount(user.id)}
                                  className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px]"
                                  title="Reativar Conta"
                                >
                                  Reativar
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => suspendUserAccount(user.id)}
                                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-[10px]"
                                  title="Suspender Temporariamente"
                                >
                                  Suspender
                                </button>
                              )
                            )}

                            {/* Configure Permissions */}
                            <button
                              type="button"
                              onClick={() => handleOpenPermissions(user)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                              title="Configurar Permissões Modulares"
                            >
                              <Sliders className="w-3.5 h-3.5 text-purple-400" />
                            </button>

                            {/* Reset Password */}
                            <button
                              type="button"
                              onClick={() => setShowPasswordResetModal(user)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                              title="Redefinir Senha do Usuário"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                            </button>

                            {/* Delete (Cannot delete self or General Admin) */}
                            {user.role !== 'admin' && !isSelf && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Deseja realmente excluir permanentemente a conta de ${user.name}?`)) {
                                    deleteUserAccount(user.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                                title="Excluir Usuário"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FILA DE APROVAÇÃO RÁPIDA */}
      {activeTab === 'aprovacoes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Solicitações Aguardando Homologação do Administrador Geral</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Novos usuários registrados via Google OAuth ou auto-cadastro ficam bloqueados até que você aprove o acesso.
              </p>
            </div>

            {pendingUsers.length > 0 && (
              <button
                type="button"
                onClick={handleApproveAllPending}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md border border-white/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aprovar Todos ({pendingUsers.length})</span>
              </button>
            )}
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-neutral-900/50 border border-neutral-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Fila de Homologação Limpa</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                Não existem contas com status Pendente no momento. Todos os usuários cadastrados já foram homologados e estão ativos no sistema.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUsers.map(user => (
                <div key={user.id} className="p-5 rounded-2xl bg-neutral-900 border-2 border-amber-600/40 shadow-xl space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-950 border-2 border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-base">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{user.name}</h4>
                        <p className="text-xs text-neutral-400 font-mono">{user.email}</p>
                        <span className="text-[10px] text-amber-400 font-mono font-bold mt-0.5 block">
                          Cadastro realizado em {user.createdAt ? user.createdAt.substring(0, 10) : 'Hoje'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono font-bold border border-amber-600/50">
                      Pendente
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Perfil Solicitado</span>
                      <span className="font-bold text-white capitalize">{user.role}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Polo / CT</span>
                      <span className="font-bold text-white truncate block">{user.trainingCenterName || 'Sede Geral'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Telefone</span>
                      <span className="font-bold text-white">{user.phone || '(21) 98765-4321'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Autenticação</span>
                      <span className="font-bold text-white">{user.provider === 'google' ? 'Google OAuth 2.0' : 'Formulário'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => approveUserAccount(user.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md border border-white/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Homologar & Liberar Acesso</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rejectUserAccount(user.id)}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-300 hover:text-red-400 font-bold text-xs transition-colors"
                    >
                      <span>Recusar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDITORIA COMPLETA & LOGS */}
      {activeTab === 'auditoria' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Buscar nos logs de auditoria por usuário, ação ou detalhe..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden"
                />
              </div>

              <select
                value={auditStatusFilter}
                onChange={(e) => setAuditStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                <option value="SUCCESS">Sucesso (SUCCESS)</option>
                <option value="WARNING">Aviso (WARNING)</option>
                <option value="DENIED">Negado (DENIED)</option>
                <option value="SECURITY_ALERT">Alerta de Segurança</option>
              </select>
            </div>

            <button
              type="button"
              onClick={exportAuditLogsCsv}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar Logs (CSV)</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-mono tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Data / Hora</th>
                  <th className="py-3 px-4">Usuário</th>
                  <th className="py-3 px-4">Ação</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">IP / Origem</th>
                  <th className="py-3 px-4">Detalhes da Auditoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      Nenhum registro de auditoria encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 text-white font-bold whitespace-nowrap">
                        {log.userName} ({log.userRole})
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                          log.action === 'LOGIN' ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40' :
                          log.action === 'LOGIN_FAILED' ? 'bg-red-950 text-red-400 border border-red-600/40' :
                          log.action === 'USER_APPROVED' ? 'bg-blue-950 text-blue-300 border border-blue-600/40' :
                          log.action === 'USER_SUSPENDED' ? 'bg-red-950 text-red-300 border border-red-600/40' :
                          log.action === 'BACKUP_CREATED' ? 'bg-purple-950 text-purple-300 border border-purple-600/40' :
                          'bg-neutral-800 text-neutral-300'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300 whitespace-nowrap">
                        {log.module}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          log.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950/60' :
                          log.status === 'WARNING' ? 'text-amber-400 bg-amber-950/60' :
                          log.status === 'DENIED' ? 'text-red-400 bg-red-950/60' :
                          'text-red-300 bg-red-900 border border-red-500'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[10px] whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                      <td className="py-3 px-4 text-neutral-300 max-w-md font-sans text-xs">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTAURAÇÃO */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-500" />
                  <span>Backup Automático & Proteção de Dados</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                  O sistema executa rotinas diárias automáticas de backup criptografado do banco de dados (alunos, finanças, presenças, rankings e histórico). Você também pode gerar um ponto de restauração manual a qualquer momento.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => window.open('/api/database/export/sql', '_blank')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md border border-white/20 transition-all cursor-pointer"
                  title="Baixar script PostgreSQL completo com tabelas e dados"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dump SQL (PostgreSQL)</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.open('/api/database/export/json', '_blank')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
                  title="Baixar JSON estruturado do banco"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => createDatabaseBackup()}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-lg border border-white/20 transition-all shrink-0 cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>Gerar Snapshot Manual</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-mono block uppercase">Status da Rotina Diária</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Ativo (Execução Diária às 03:00)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-mono block uppercase">Formato do Snapshot</span>
                <span className="text-xs font-bold text-white mt-1 block">JSON Estruturado Completo</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-mono block uppercase">Proteção Contra Exclusão</span>
                <span className="text-xs font-bold text-purple-400 mt-1 block">Restauração Segura Habilitada</span>
              </div>
            </div>
          </div>

          {/* Backups List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Pontos de Restauração Registrados ({backups.length})
            </h4>

            <div className="space-y-2">
              {backups.map(b => (
                <div key={b.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-red-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs">{b.filename}</h5>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Gerado em {b.timestamp} por {b.createdByName} · Tamanho: {b.sizeKb} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => restoreDatabaseBackup(b.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors border border-neutral-700"
                    >
                      Restaurar Ponto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: POLÍTICAS DE SEGURANÇA */}
      {activeTab === 'seguranca' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Controles de Acesso & Proteção Contra Burlas</span>
            </h3>
            <ul className="space-y-3 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Controle de Sessão JWT:</strong>
                  Tokens assinados com emissor, tempo de expiração de 2 horas e logout automático preventivo.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Bloqueio de Acesso Direto:</strong>
                  Nenhuma rota ou menu interno pode ser acessado sem autenticação aprovada e sessão válida.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Aprovação Obrigatória:</strong>
                  Cadastros novos (Google ou formulário) iniciam com status "Pendente" e não entram no sistema sem autorização expressa do Administrador Geral.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Hierarquia e RBAC (7 Níveis):</strong>
                  Administrador Geral, Administrador, Coordenador, Mestre, Professor, Responsável Financeiro, Aluno e Visitante.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Proteção Contra Força Bruta (Brute-Force Lockout):</strong>
                  Limite de 5 tentativas de senha com bloqueio preventivo de 15 minutos e registro em log de segurança.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Criptografia Forte de Credenciais:</strong>
                  Hashes criptográficos com Salt randômico, proteção contra SQL Injection, injeções XSS e sanitização de payloads.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Ambiente 100% Produção:</strong>
                  Sem contas de teste, sem logins automáticos de demonstração e sem botões de acesso rápido.
                </div>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" />
              <span>Sessão Atual do Administrador</span>
            </h3>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Usuário Conectado:</span>
                <span className="font-bold text-white">{currentUserAccount?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Perfil:</span>
                <span className="font-bold text-red-400 font-mono uppercase">{currentUserAccount?.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Status da Conta:</span>
                <span className="font-bold text-emerald-400">{currentUserAccount?.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Validade da Sessão:</span>
                <span className="font-mono text-neutral-300">2 Horas (Ativa)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVO USUÁRIO */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border-2 border-red-600/50 p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-500" />
                <span>Cadastrar Novo Usuário</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowNewUserModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newUserError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-600 text-red-300 text-xs">
                {newUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">E-mail de Login</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@exemplo.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">Senha Inicial</label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">Perfil de Acesso</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="subadmin">Administrador</option>
                    <option value="coordenador">Coordenador</option>
                    <option value="professor">Professor de Polo/CT</option>
                    <option value="financeiro">Responsável Financeiro</option>
                    <option value="aluno">Aluno / Atleta</option>
                    <option value="visitante">Visitante</option>
                    <option value="mestre">Portal do Mestre</option>
                    <option value="admin">Administrador Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">Status Inicial</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="Aprovado">Aprovado (Liberado)</option>
                    <option value="Pendente">Pendente de Homologação</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Polo / CT Vinculado</label>
                <select
                  value={newUserTcId}
                  onChange={(e) => setNewUserTcId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden cursor-pointer"
                >
                  {trainingCenters.map(tc => (
                    <option key={tc.id} value={tc.id}>
                      {tc.name} ({tc.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(21) 98765-4321"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md border border-white/20"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURAR PERMISSÕES MODULARES */}
      {showPermissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-neutral-900 border-2 border-purple-600/50 p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span>Matriz de Permissões Modulares</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Defina os módulos que <strong>{showPermissionsModal.name}</strong> ({showPermissionsModal.role}) pode acessar.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPermissionsModal(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'usuarios', label: 'Gestão de Usuários' },
                { key: 'financeiro', label: 'Módulo Financeiro' },
                { key: 'professores', label: 'Gestão Professores' },
                { key: 'alunos', label: 'Gestão de Alunos' },
                { key: 'presencas', label: 'Lançamento Presença' },
                { key: 'graduacoes', label: 'Graduação & Faixas' },
                { key: 'eventos', label: 'Eventos & Calendário' },
                { key: 'competicoes', label: 'Torneios & Lutas' },
                { key: 'relatorios', label: 'Relatórios Gerenciais' },
                { key: 'configuracoes', label: 'Configurações' },
                { key: 'auditoria', label: 'Logs de Auditoria' },
                { key: 'site_cms', label: 'Site CMS Institucional' },
              ].map(item => {
                const isChecked = !!editingPermissions[item.key as keyof ModulePermissions];
                return (
                  <label 
                    key={item.key} 
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-purple-950/40 border-purple-500/60 text-white font-bold' 
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setEditingPermissions(prev => ({
                          ...prev,
                          [item.key]: e.target.checked
                        }));
                      }}
                      className="rounded border-neutral-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowPermissionsModal(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md"
              >
                Salvar Permissões
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REDEFINIR SENHA DE USUÁRIO */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border-2 border-amber-600/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>Redefinir Senha de Usuário</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowPasswordResetModal(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Definir uma nova senha para o usuário <strong>{showPasswordResetModal.name}</strong> ({showPasswordResetModal.email}):
            </p>

            <form onSubmit={handleConfirmPasswordReset} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Nova Senha</label>
                <input
                  type="text"
                  required
                  placeholder="Digite a nova senha..."
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordResetModal(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md"
                >
                  Atualizar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
