import React from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  Users, 
  Flame, 
  Trophy, 
  DollarSign, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight,
  Sparkles,
  Calendar,
  Building2,
  Shield,
  FileText,
  ShieldCheck,
  Database
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    students, 
    athletes, 
    tournaments, 
    fights, 
    transactions, 
    exams, 
    trainingCenters,
    siteConfig,
    openApprovalModal,
    userAccounts,
    auditLogs
  } = useGaditas();

  // Financial calculations
  const totalRevenues = transactions
    .filter(t => t.type === 'Receita')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Despesa')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenues - totalExpenses;
  const activeStudents = students.filter(s => s.status === 'Ativo').length;
  const pendingStudents = students.filter(s => s.status === 'Pendente').length;
  const pendingExams = exams.filter(e => e.status === 'Aguardando Aprovação').length;

  // Top athletes by points
  const topAthletes = [...athletes].sort((a, b) => b.points - a.points).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-500">
                Central de Comando Gaditas
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400">Temporada Oficial 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-cinzel tracking-tight">
              {siteConfig.teamName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Gestão integrada de tatame, ranking de lutas, controle financeiro, carteirinhas e publicação de conteúdo institucional.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {pendingStudents > 0 && (
              <button
                type="button"
                onClick={openApprovalModal}
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse border border-white/20"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{pendingStudents} Cadastros Pendentes</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('administracao')}
              className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Gestão de Usuários & RBAC</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('auditoria')}
              className="px-3.5 py-2 rounded-lg bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 text-xs font-bold transition-colors border border-purple-700/50 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Auditoria Completa ({auditLogs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('alunos')}
              className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border border-neutral-700"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Novo Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lutas')}
              className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors border border-neutral-700 flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Registrar Luta</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('site_cms')}
              className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors border border-neutral-700 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Editar Site</span>
            </button>
          </div>
        </div>

        {/* Subtle background martial glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Alunos Ativos */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Alunos Ativos</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-neutral-100">{activeStudents}</span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
              <span>{students.length} matrículas</span>
              {pendingStudents > 0 && (
                <>
                  <span>·</span>
                  <span className="text-amber-400 font-semibold">{pendingStudents} pendentes</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Atletas Competidores */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Time de Atletas</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-neutral-100">{athletes.length}</span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
              <span>{fights.length} combates no cartel</span>
              <span>·</span>
              <span className="text-emerald-400">Ranking ativo</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Faturamento Total */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Receita Mensal</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-400">
              R$ {totalRevenues.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
              <span>Lucro: R$ {netProfit.toFixed(0)}</span>
              <span>·</span>
              <span className="text-neutral-400">PIX & Loja</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Exames & Torneios */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Exames & Torneios</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-neutral-100">{tournaments.length}</span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
              <span className="text-amber-400 font-semibold">{pendingExams} exames pendentes</span>
              <span>·</span>
              <span>{trainingCenters.length} CTs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ranking Highlights + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Athletes in Ranking (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Top Ranking Geral Gaditas</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Pontuação calculada automaticamente com base no cartel e títulos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('ranking')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Ver Ranking Completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topAthletes.map((ath, idx) => (
              <div 
                key={ath.id}
                className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800/90 flex items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-400 text-neutral-950 shadow-sm' :
                    idx === 1 ? 'bg-neutral-300 text-neutral-950' :
                    idx === 2 ? 'bg-amber-700 text-amber-100' :
                    'bg-neutral-800 text-neutral-400'
                  }`}>
                    {idx + 1}º
                  </div>

                  <img 
                    src={ath.photoUrl} 
                    alt={ath.name} 
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-700 bg-neutral-950" 
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100">{ath.name}</span>
                      <BeltBadge belt={ath.belt} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{ath.category}</span>
                      <span>·</span>
                      <span>{ath.trainingCenterName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Cartel summary */}
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-neutral-300">
                      {ath.victories}V - {ath.defeats}D - {ath.draws}E
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {ath.submissions} subs · {ath.titles} títulos
                    </span>
                  </div>

                  {/* Points Badge */}
                  <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm">
                    {ath.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CT Overview */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Centros de Treinamento Gaditas (CTs)</span>
              </span>
              <button
                type="button"
                onClick={() => onNavigate('cts')}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Gerenciar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {trainingCenters.map(tc => (
                <div key={tc.id} className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs">
                  <p className="font-bold text-neutral-200 truncate">{tc.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{tc.city} - {tc.state}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/80 text-[11px]">
                    <span className="text-neutral-500">Alunos Ativos:</span>
                    <span className="font-semibold text-amber-400">{tc.activeStudentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Quick Approvals */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-100 flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Aprovações Pendentes</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold">
                {pendingExams}
              </span>
            </h3>

            <div className="space-y-3 mt-3">
              {exams.length === 0 ? (
                <p className="text-xs text-neutral-500 py-3 text-center">Nenhum exame aguardando.</p>
              ) : (
                exams.slice(0, 3).map(exam => (
                  <div key={exam.id} className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-neutral-200">{exam.studentName}</span>
                      <span className="text-[10px] text-amber-400 font-medium">Aguardando</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-neutral-400">Promoção para:</span>
                      <BeltBadge belt={exam.targetBelt} stripes={exam.targetStripes} size="sm" />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      "{exam.professorRecommendation}"
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('graduacoes')}
                        className="w-full py-1.5 text-center text-xs font-semibold rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                      >
                        Avaliar no Portal do Mestre
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tournament Card */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Próximo Torneio</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Inscrições</span>
            </div>

            {tournaments[0] && (
              <div className="mt-3 text-xs space-y-2">
                <p className="font-bold text-sm text-neutral-100">{tournaments[0].name}</p>
                <div className="text-neutral-400 space-y-1 text-[11px]">
                  <p>📍 {tournaments[0].location}</p>
                  <p>📅 {tournaments[0].date} às {tournaments[0].time}</p>
                  <p>🥊 {tournaments[0].registeredAthletesCount} atletas inscritos</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('campeonatos')}
                  className="w-full mt-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition-colors border border-neutral-700 text-xs"
                >
                  Abrir Chaves & Pesagem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
