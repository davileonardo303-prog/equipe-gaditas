import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  UserCheck, 
  GraduationCap, 
  Flame, 
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const MasterPortal: React.FC = () => {
  const { 
    exams, 
    approveGraduationExam, 
    rejectGraduationExam, 
    professors, 
    approveProfessor, 
    tournaments, 
    athletes, 
    recalculateRanking, 
    siteConfig,
    students 
  } = useGaditas();

  const [masterNote, setMasterNote] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const pendingExams = exams.filter(e => e.status === 'Aguardando Aprovação');
  const pendingProfessors = professors.filter(p => p.status === 'Pendente');

  return (
    <div className="space-y-6">
      {/* Master Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-amber-950/30 border border-red-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-red-600/40 overflow-hidden bg-neutral-950 shrink-0 shadow-lg">
            <img 
              src={siteConfig.masterPhotoUrl} 
              alt={siteConfig.masterName} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-red-500 font-bold">
                Líder e Fundador Gaditas Fight Team
              </span>
              <span className="text-neutral-600">·</span>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-black">Grau Preta e Branca (Muay Thai)</span>
              <span className="px-2 py-0.5 rounded bg-white text-black font-mono text-[10px] font-black">Faixa Preta (Luta Livre 2017)</span>
            </div>
            <h1 className="text-2xl font-black text-white font-cinzel mt-0.5">
              Portal do Mestre Daniel Braga
            </h1>
            <p className="text-xs text-neutral-300 mt-1 max-w-lg">
              Painel restrito para outorga de faixas e graus, homologação de exames técnicos, chancela de professores e validação de campeonatos no Rio de Janeiro.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={recalculateRanking}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Auditar & Recalcular Ranking</span>
          </button>
        </div>
      </div>

      {/* Main Tabs / Sections for the Master */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Exames de Faixa para Aprovação */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-neutral-100 font-cinzel">
                Aprovação de Graduações & Faixas
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {pendingExams.length} aguardando
            </span>
          </div>

          {pendingExams.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/40 mb-2" />
              <p>Todas as graduações e exames estão homologados pelo Mestre.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingExams.map(exam => {
                const student = students.find(s => s.id === exam.studentId);
                return (
                  <div 
                    key={exam.id}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-100">{exam.studentName}</span>
                          <span className="text-[11px] text-neutral-400">· {student?.trainingCenterName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-300">
                          <span className="text-neutral-400">Faixa Atual:</span>
                          <BeltBadge belt={exam.currentBelt} stripes={exam.currentStripes} size="sm" />
                          <span className="text-neutral-500">➜</span>
                          <span className="text-amber-400 font-semibold">Nova Graduação:</span>
                          <BeltBadge belt={exam.targetBelt} stripes={exam.targetStripes} size="sm" />
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-neutral-400">
                        <span>{student?.attendanceCount || 0} presenças</span>
                        <p className="text-emerald-400 font-medium">{student?.totalAttendance || 0} acumuladas</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed italic">
                      "{exam.professorRecommendation}"
                    </div>

                    {/* Master Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => approveGraduationExam(exam.id, 'Graduação homologada pessoalmente pelo Mestre com louvor!')}
                        className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprovar & Emitir Diploma</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectGraduationExam(exam.id, 'Aguardar próximo exame semestral.')}
                        className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 text-xs font-semibold transition-colors border border-neutral-700"
                        title="Rejeitar solicitação"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Aprovação de Professores & Homologação de Torneios */}
        <div className="space-y-6">
          {/* Homologar Campeonatos */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-neutral-100 font-cinzel">
                  Homologação de Campeonatos & Chaves
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {tournaments.map(tourn => (
                <div key={tourn.id} className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-200">{tourn.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      tourn.status.includes('Homologado') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {tourn.status}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    📍 {tourn.location} · 📅 {tourn.date} · 🥊 {tourn.registeredAthletesCount} Atletas
                  </p>

                  {tourn.championName ? (
                    <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold flex items-center justify-between">
                      <span>🏆 Campeão Declarado: {tourn.championName}</span>
                      <span className="text-[10px] text-neutral-300">Vice: {tourn.runnerUpName}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500">Chaves em andamento no tatame.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Homologação de Professores */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-neutral-100 font-cinzel">
                  Chancela de Professores & Instrutores
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {professors.map(prof => (
                <div key={prof.id} className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={prof.photoUrl} 
                      alt={prof.name} 
                      className="w-10 h-10 rounded-lg object-cover border border-neutral-800" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-200">{prof.name}</span>
                        <BeltBadge belt={prof.belt} stripes={prof.degrees} size="sm" />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{prof.role}</p>
                    </div>
                  </div>

                  <div>
                    {prof.status === 'Aprovado' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Homologado</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => approveProfessor(prof.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Chancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
