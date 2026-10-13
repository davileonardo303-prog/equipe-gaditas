import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { BeltType } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  Award, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  XCircle, 
  FileText,
  UserCheck,
  X
} from 'lucide-react';

export const GraduationControl: React.FC = () => {
  const { 
    exams, 
    requestGraduationExam, 
    approveGraduationExam, 
    rejectGraduationExam, 
    students, 
    currentRole 
  } = useGaditas();

  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [targetBelt, setTargetBelt] = useState<BeltType>('Azul');
  const [targetStripes, setTargetStripes] = useState(0);
  const [examDate, setExamDate] = useState('2026-11-15');
  const [recommendation, setRecommendation] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleRequestExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    requestGraduationExam({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      currentBelt: selectedStudent.belt,
      currentStripes: selectedStudent.stripes,
      targetBelt,
      targetStripes: Number(targetStripes),
      examDate,
      professorRecommendation: recommendation || 'Aluno demonstrou domínio técnico consistente e disciplina exemplar.'
    });

    setShowModal(false);
    setRecommendation('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Controle de Graduações & Exames de Faixa
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Solicitação de exames, verificação de tempo de tatame, histórico de graus e homologação pelo Mestre.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Exame de Graduação</span>
        </button>
      </div>

      {/* Graduation Exams List */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Fila de Exames & Histórico de Graduações
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {exams.length} processos registrados
          </span>
        </div>

        <div className="divide-y divide-neutral-800/60">
          {exams.map(exam => {
            const student = students.find(s => s.id === exam.studentId);
            const isPending = exam.status === 'Aguardando Aprovação';

            return (
              <div key={exam.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-neutral-100">{exam.studentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      exam.status.includes('Aprovado') ? 'bg-emerald-500/10 text-emerald-400' :
                      exam.status === 'Reprovado' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {exam.status}
                    </span>
                  </div>

                  {/* Belt change progression */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">De:</span>
                      <BeltBadge belt={exam.currentBelt} stripes={exam.currentStripes} size="sm" />
                    </div>
                    <span className="text-neutral-500 font-bold">➜</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-semibold">Para:</span>
                      <BeltBadge belt={exam.targetBelt} stripes={exam.targetStripes} size="sm" />
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed italic bg-neutral-950/50 p-2.5 rounded-lg border border-neutral-800/80">
                    "{exam.professorRecommendation}"
                  </p>

                  <div className="text-[11px] text-neutral-500 flex items-center gap-3">
                    <span>Data do Exame: <strong>{exam.examDate}</strong></span>
                    {student && <span>· Presenças: <strong>{student.attendanceCount} no mês</strong> ({student.totalAttendance} totais)</span>}
                  </div>
                </div>

                {/* Actions (if Mestre or Admin) */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    (currentRole === 'mestre' || currentRole === 'admin') ? (
                      <>
                        <button
                          type="button"
                          onClick={() => approveGraduationExam(exam.id, 'Graduação homologada pessoalmente pelo Mestre!')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aprovar Faixa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => rejectGraduationExam(exam.id, 'Aguardar próximo exame semestral.')}
                          className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-400 font-semibold text-xs border border-neutral-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-amber-400 text-[11px] font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Aguardando análise do Mestre</span>
                      </span>
                    )
                  ) : (
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Diploma Emitido</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Solicitar Exame */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Indicação para Exame de Graduação</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestExam} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Selecione o Aluno</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Atual: {s.belt} {s.stripes}º Grau)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Nova Faixa Almejada</label>
                  <select
                    value={targetBelt}
                    onChange={(e) => setTargetBelt(e.target.value as BeltType)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Branca">Branca</option>
                    <option value="Azul">Azul</option>
                    <option value="Roxa">Roxa</option>
                    <option value="Marrom">Marrom</option>
                    <option value="Preta">Preta</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Graus (0 a 4)</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={targetStripes}
                    onChange={(e) => setTargetStripes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Data Prevista do Exame</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Parecer Técnico do Professor</label>
                <textarea
                  rows={3}
                  required
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  placeholder="Justifique a promoção com base na assiduidade, técnica e conduta marcial..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Submeter ao Mestre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
