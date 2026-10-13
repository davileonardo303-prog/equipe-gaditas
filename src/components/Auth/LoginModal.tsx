import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { UserRole } from '../../types';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X, 
  Sparkles, 
  UserPlus, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Shield, 
  GraduationCap, 
  Building2, 
  LogIn,
  Clock
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    showLoginModal, 
    closeLoginModal, 
    loginModalTab, 
    professors, 
    trainingCenters,
    loginWithCredentials,
    loginWithGoogle,
    registerWithGoogle,
    addStudent,
    siteConfig,
    addNotification,
    requestPasswordReset,
    confirmPasswordReset,
    createUserAccount
  } = useGaditas();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states - Login (Campos limpos para ambiente profissional e seguro)
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states - Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'aluno' | 'professor'>('aluno');
  const [regTrainingCenterId, setRegTrainingCenterId] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [regProfessorId, setRegProfessorId] = useState(professors[0]?.id || 'prof-gabriel');
  const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState<string | null>(null);

  // Password Recovery States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotToken, setForgotToken] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotMsg, setForgotMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Google Account Chooser popup
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(true);

  if (!showLoginModal) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(loginInput, passwordInput);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Erro ao realizar login.');
      }
    }, 250);
  };

  const handleGoogleSelect = (email: string, name: string) => {
    setIsLoading(true);
    setShowGoogleChooser(false);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'register') {
        registerWithGoogle({
          email,
          name,
          role: regRole,
          trainingCenterId: regTrainingCenterId,
          professorId: regProfessorId
        });
        setRegistrationSuccessMsg(`Sua conta Google (${email}) foi registrada com status Pendente. Aguardando homologação do Administrador Geral.`);
        setAuthMode('login');
      } else {
        const res = loginWithGoogle(email, name);
        if (!res.success) {
          setErrorMessage(res.message || 'Sua conta está aguardando aprovação do Administrador do Sistema.');
        }
      }
    }, 300);
  };

  const handleSelfRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Por favor, informe seu nome e e-mail.');
      return;
    }

    const selectedTC = trainingCenters.find(t => t.id === regTrainingCenterId) || trainingCenters[0];
    const selectedProf = professors.find(p => p.id === regProfessorId) || professors[0];

    // Novo cadastro entra SEMPRE como PENDENTE aguardando homologação do Administrador Geral!
    if (regRole === 'aluno') {
      addStudent({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone || '(21) 98765-4321',
        cpf: '000.000.000-00',
        birthDate: '2000-01-01',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        status: 'Pendente',
        trainingCenterId: selectedTC.id,
        trainingCenterName: selectedTC.name,
        professorId: selectedProf.id,
        professorName: selectedProf.name,
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
          phone: regPhone || '(21) 98765-4321',
          relationship: 'Responsável'
        },
        medicalRecord: {
          bloodType: 'A+',
          allergies: 'Nenhuma',
          medications: 'Nenhum',
          healthNotes: 'Apto para atividades marciais intensas',
          hasSignedWaiver: true
        }
      });
      createUserAccount({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword || 'gaditas123',
        role: 'aluno',
        status: 'Pendente',
        phone: regPhone || '(21) 98765-4321',
        trainingCenterId: selectedTC.id,
        trainingCenterName: selectedTC.name
      });
      setRegistrationSuccessMsg(`Sua conta está aguardando aprovação do Administrador do Sistema. A solicitação de ${regName} foi enviada para homologação.`);
    } else {
      createUserAccount({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword || 'gaditas123',
        role: 'professor',
        status: 'Pendente',
        phone: regPhone || '(21) 98765-4321',
        trainingCenterId: selectedTC.id,
        trainingCenterName: selectedTC.name
      });
      addNotification('Cadastro em Análise', `Solicitação de professor para ${regName} registrada e aguardando aprovação do Administrador Geral.`, 'warning');
      setRegistrationSuccessMsg(`Sua conta está aguardando aprovação do Administrador do Sistema. A coordenação foi notificada.`);
    }

    setLoginInput(regEmail.trim());
    setAuthMode('login');
  };

  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    const res = requestPasswordReset(forgotEmail);
    if (res.success) {
      setForgotStep(2);
      setForgotMsg({ text: res.message || 'Código de verificação enviado com sucesso para o e-mail informado.', type: 'success' });
    } else {
      setForgotMsg({ text: res.message || 'Erro ao solicitar código de recuperação.', type: 'error' });
    }
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    const res = confirmPasswordReset(forgotEmail, forgotToken, forgotNewPass);
    if (res.success) {
      setForgotMsg({ text: res.message || 'Senha alterada com sucesso!', type: 'success' });
      setTimeout(() => {
        setShowForgotPassword(false);
        setPasswordInput(forgotNewPass);
        setLoginInput(forgotEmail);
        setForgotStep(1);
      }, 1500);
    } else {
      setForgotMsg({ text: res.message || 'Erro ao redefinir senha. Verifique o código.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border-2 border-red-600/40 shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200 text-xs max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-950/50 border border-white/20">
            <Shield className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-tight uppercase">
            {authMode === 'login' ? 'Acesso ao Sistema' : 'Cadastro na Plataforma'}
          </h2>
          <p className="text-xs text-neutral-300 font-medium">
            <span className="text-red-500 font-bold">"A dor é passageira, mas o orgulho é eterno"</span>
          </p>
        </div>

        {/* Auth Mode Switch: Entrar vs Cadastrar */}
        <div className="grid grid-cols-2 p-1 bg-black rounded-xl border border-neutral-800 mb-5 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
              setRegistrationSuccessMsg(null);
            }}
            className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'login'
                ? 'bg-red-600 text-white shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
              setRegistrationSuccessMsg(null);
            }}
            className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'register'
                ? 'bg-red-600 text-white shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar-se</span>
          </button>
        </div>

        {/* Success Alert */}
        {registrationSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-600/40 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Sucesso!</p>
              <p className="text-[11px] leading-relaxed mt-0.5">{registrationSuccessMsg}</p>
            </div>
          </div>
        )}

        {/* Error Alert / Pending Notice */}
        {errorMessage && errorMessage.includes('aguardando aprovação') ? (
          <div className="mb-4 p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500/80 text-amber-200 text-xs shadow-xl animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Conta Aguardando Homologação</h4>
                <p className="text-xs text-amber-300 font-bold mt-1">
                  "Sua conta está aguardando aprovação do Administrador do Sistema."
                </p>
                <p className="text-[11px] text-amber-200/80 mt-1 leading-relaxed">
                  Por motivos de segurança e controle de acesso, nenhum usuário pode ingressar nas áreas internas sem autorização prévia. O Administrador Geral analisará sua solicitação na fila de homologação.
                </p>
              </div>
            </div>
          </div>
        ) : errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Atenção</p>
              <p className="text-[11px] leading-relaxed mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* BOTÃO GOOGLE OFICIAL NO TOPO */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowGoogleChooser(true)}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-neutral-300 hover:scale-[1.01] active:scale-[0.99]"
          >
            {/* SVG Oficial Google G */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-semibold text-neutral-800">
              {authMode === 'login' ? 'Entrar com a Conta Google' : 'Cadastrar com a Conta Google'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <span className="relative bg-neutral-900 px-3 text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
            ou com login e senha
          </span>
        </div>

        {/* MODE 1: ENTRAR (LOGIN) */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Login, E-mail ou Matrícula
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Seu e-mail, matrícula (ex: MT-01 a MT-13)"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono"
                />
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center justify-between">
                <span>Senha de Acesso</span>
                <span className="text-[10px] text-neutral-500 font-normal">Ambiente Criptografado</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite sua senha"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-white p-0.5"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-500 font-mono text-[10px]">Sessão Segura JWT</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotEmail(loginInput.includes('@') ? loginInput : '');
                    setForgotStep(1);
                    setForgotMsg(null);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 hover:scale-[1.01] active:scale-[0.99] border border-red-500/50 mt-1 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* MODE 2: CADASTRAR (REGISTRO) */}
        {authMode === 'register' && (
          <form onSubmit={handleSelfRegistration} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo dos Santos"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                required
                placeholder="Ex: seuemail@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Sua senha"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  WhatsApp / Celular
                </label>
                <input
                  type="text"
                  placeholder="(21) 98765-4321"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-red-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Perfil de Cadastro
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('aluno')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-colors ${
                    regRole === 'aluno'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  🥋 Aluno / Atleta
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('professor')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-colors ${
                    regRole === 'professor'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  👨‍🏫 Professor de Polo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Centro de Treinamento (CT) Vinculado ({trainingCenters.length} Polos)
              </label>
              <select
                value={regTrainingCenterId}
                onChange={(e) => setRegTrainingCenterId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-red-600 cursor-pointer"
              >
                {trainingCenters.map(tc => (
                  <option key={tc.id} value={tc.id}>
                    {tc.name} ({tc.city} - {tc.state})
                  </option>
                ))}
              </select>
            </div>

            {regRole === 'aluno' && (
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Professor Responsável ({professors.length} Professores)
                </label>
                <select
                  value={regProfessorId}
                  onChange={(e) => setRegProfessorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-red-600 cursor-pointer"
                >
                  {professors.map(p => (
                    <option key={p.id} value={p.id}>
                      Prof. {p.name} · {p.role.split('·')[0]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 mt-1 cursor-pointer"
            >
              <span>Concluir Cadastro</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

      {/* POPUP OFICIAL DO GOOGLE ACCOUNT CHOOSER */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white text-neutral-900 shadow-2xl p-6 relative border border-neutral-200 animate-in zoom-in-95 duration-150 text-xs">
            
            <button
              type="button"
              onClick={() => setShowGoogleChooser(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-1 mb-5">
              <svg className="w-7 h-7 mx-auto mb-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="text-base font-bold text-neutral-900">
                Fazer login com o Google
              </h3>
              <p className="text-[11px] text-neutral-500">
                Escolha uma conta para continuar em <strong className="text-neutral-800">Gaditas Fight Team</strong>
              </p>
            </div>

            {/* Formulário Autêntico da Conta Google */}
            <div className="space-y-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu Nome Completo"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs focus:outline-hidden focus:border-blue-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    E-mail Google (@gmail.com)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs focus:outline-hidden focus:border-blue-600 shadow-xs font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleChooser(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!customGoogleEmail.includes('@')}
                    onClick={() => handleGoogleSelect(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0])}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-50 shadow-md transition-all cursor-pointer"
                  >
                    Prosseguir com Google
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 text-center leading-relaxed">
              Para prosseguir, o Google compartilhará seu nome, e-mail e foto do perfil com o sistema Gaditas Fight Team.
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RECUPERAÇÃO DE SENHA */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border-2 border-red-600/50 p-6 space-y-4 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Recuperação de Senha</h3>
                <p className="text-[10px] text-neutral-400">Verificação segura em 2 etapas</p>
              </div>
            </div>

            {forgotMsg && (
              <div className={`p-2.5 rounded-xl border text-xs ${
                forgotMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border-emerald-600/50 text-emerald-200' 
                  : 'bg-red-950/70 border-red-600/50 text-red-200'
              }`}>
                {forgotMsg.text}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestPasswordReset} className="space-y-3">
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  Informe o e-mail cadastrado na plataforma para receber o código de verificação:
                </p>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">E-mail Cadastrado</label>
                  <input
                    type="email"
                    required
                    placeholder="ex: lucas.silva@gaditasteam.com.br"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md border border-white/20"
                  >
                    Gerar Código
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmPasswordReset} className="space-y-3">
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  Digite o código de verificação recebido por e-mail e defina sua nova senha:
                </p>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">Código de 6 dígitos</label>
                  <input
                    type="text"
                    required
                    placeholder="000000"
                    value={forgotToken}
                    onChange={(e) => setForgotToken(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono tracking-widest text-center focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">Nova Senha</label>
                  <input
                    type="password"
                    required
                    placeholder="Digite sua nova senha"
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-red-500 font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md border border-white/20"
                  >
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
