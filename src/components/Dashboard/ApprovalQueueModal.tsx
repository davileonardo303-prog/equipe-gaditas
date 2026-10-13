import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Shield, 
  Crown, 
  GraduationCap, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  Sparkles,
  Search
} from 'lucide-react';

interface ApprovalQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalQueueModal: React.FC<ApprovalQueueModalProps> = ({ isOpen, onClose }) => {
  const { 
    students, 
    professors, 
    approveStudent, 
    deleteStudent, 
    approveProfessor, 
    currentRole,
    currentProfessor,
    addNotification 
  } = useGaditas();

  const [activeTab, setActiveTab] = useState<'alunos' | 'professores'>('alunos');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Filter pending students
  const pendingStudents = students.filter(s => {
    const isPending = s.status === 'Pendente';
    if (!isPending) return false;

    // If logged in as professor, only show students for their CT
    if (currentRole === 'professor') {
      return s.trainingCenterId === currentProfessor?.trainingCenterId || s.professorId === currentProfessor?.id;
    }
    return true;
  }).filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.cpf.includes(search)
  );

  // Filter pending professors (only admin and mestre can approve)
  const pendingProfessors = professors.filter(p => p.status === 'Pendente');

  const handleApproveStudent = (studentId: string, studentName: string) => {
    approveStudent(studentId);
    addNotification('Cadastro Homologado', `O aluno ${studentName} foi aprovado e agora tem acesso liberado ao portal!`, 'success');
  };

  const handleRejectStudent = (studentId: string, studentName: string) => {
    if (confirm(`Deseja realmente recusar o cadastro de ${studentName}?`)) {
      deleteStudent(studentId);
      addNotification('Cadastro Recusado', `O cadastro de ${studentName} foi removido.`, 'warning');
    }
  };

  const handleApproveProfessor = (profId: string, profName: string) => {
    approveProfessor(profId);
    addNotification('Professor Homologado', `O Professor ${profName} foi aprovado com sucesso!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-neutral-900 border-2 border-red-600/50 shadow-2xl p-6 sm:p-8 text-xs flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-lg shadow-red-950/40 border border-white/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500">
                  Hierarquia & Gestão de Cadastros
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-600 text-red-400 font-mono font-bold text-[10px]">
                  {pendingStudents.length + ((currentRole === 'admin' || currentRole === 'mestre') ? pendingProfessors.length : 0)} Pendentes
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel tracking-tight">
                Fila de Homologação & Aprovações
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-2 p-1 bg-black rounded-xl border border-neutral-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('alunos')}
              className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                activeTab === 'alunos'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Alunos ({pendingStudents.length})</span>
            </button>

            {(currentRole === 'admin' || currentRole === 'mestre') && (
              <button
                type="button"
                onClick={() => setActiveTab('professores')}
                className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  activeTab === 'professores'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>Professores ({pendingProfessors.length})</span>
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-red-600 text-xs"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {activeTab === 'alunos' && (
            <>
              {pendingStudents.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black border border-neutral-800 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Nenhum aluno pendente de aprovação</h4>
                  <p className="text-neutral-400 max-w-md mx-auto text-xs">
                    Todos os cadastros de alunos foram avaliados e homologados. Novos cadastros realizados pelo site aparecerão aqui para validação do Professor ou Mestre.
                  </p>
                </div>
              ) : (
                pendingStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="p-4 sm:p-5 rounded-2xl bg-black border-2 border-neutral-800 hover:border-red-600/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-red-600 bg-neutral-950 shrink-0">
                        <img 
                          src={student.photoUrl} 
                          alt={student.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-black text-white font-cinzel">
                            {student.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Pendente de Aprovação</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-300">
                          <BeltBadge belt={student.belt} stripes={student.stripes} size="sm" />
                          <span>·</span>
                          <span className="text-white font-bold">{student.modality}</span>
                          <span>·</span>
                          <span className="text-neutral-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500" />
                            {student.trainingCenterName}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-400 font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-red-500" />
                            {student.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-red-500" />
                            {student.phone}
                          </span>
                          <span>CPF: {student.cpf}</span>
                          <span>Prof. Indicado: <strong className="text-white">{student.professorName}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-neutral-900">
                      <button
                        type="button"
                        onClick={() => handleRejectStudent(student.id, student.name)}
                        className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-red-400 border border-neutral-800 font-bold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Recusar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveStudent(student.id, student.name)}
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider transition-all shadow-md shadow-red-950/50 flex items-center gap-1.5 border border-white/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprovar Aluno</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'professores' && (
            <>
              {pendingProfessors.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-black border border-neutral-800 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Nenhum professor pendente</h4>
                  <p className="text-neutral-400 max-w-md mx-auto text-xs">
                    Todos os professores cadastrados na instituição estão homologados e ativos.
                  </p>
                </div>
              ) : (
                pendingProfessors.map((prof) => (
                  <div 
                    key={prof.id}
                    className="p-4 sm:p-5 rounded-2xl bg-black border-2 border-neutral-800 hover:border-red-600/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-red-600 bg-neutral-950 shrink-0">
                        <img 
                          src={prof.photoUrl} 
                          alt={prof.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs sm:text-sm font-black text-white font-cinzel">
                          {prof.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <BeltBadge belt={prof.belt} stripes={prof.degrees} size="sm" />
                          <span className="text-xs text-red-500 font-mono font-bold">{prof.role}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{prof.trainingCenterName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveProfessor(prof.id, prof.name)}
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider transition-all shadow-md shadow-red-950/50 flex items-center gap-1.5 border border-white/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprovar Professor</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer info banner */}
        <div className="pt-4 border-t border-neutral-800 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500 shrink-0" />
            <span>
              <strong>Regra de Hierarquia:</strong> Alunos cadastrados pelo site só podem logar após aprovação de seus Professores ou Mestres.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
