import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { ModalityType } from '../../types';
import { BeltBadge } from '../Common/BeltBadge';
import { 
  ClipboardCheck, 
  Check, 
  X, 
  Users, 
  Calendar, 
  Clock, 
  Building2, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { 
    students, 
    trainingCenters, 
    professors, 
    recordAttendance, 
    attendanceRecords 
  } = useGaditas();

  const [selectedCT, setSelectedCT] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);
  const [classTime, setClassTime] = useState('19:30 - Adulto Geral');
  const [modality, setModality] = useState<ModalityType>('Jiu-Jitsu');
  const [selectedProfId, setSelectedProfId] = useState(professors[0]?.id || 'prof-roberto');

  // Filter students belonging to the chosen CT
  const ctStudents = students.filter(s => s.trainingCenterId === selectedCT);

  // Presence check state: Map of studentId -> boolean
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    ctStudents.forEach(s => {
      init[s.id] = true; // Default present
    });
    return init;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleStudent = (id: string) => {
    setPresentMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveAttendance = () => {
    const presentIds = Object.keys(presentMap).filter(id => presentMap[id]);
    const prof = professors.find(p => p.id === selectedProfId);

    recordAttendance({
      date: classDate,
      trainingCenterId: selectedCT,
      classTime,
      modality,
      professorId: selectedProfId,
      professorName: prof?.name || 'Professor',
      presentStudentIds: presentIds
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const presentCount = Object.values(presentMap).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Chamada Digital & Controle de Frequência
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Registro diário de presenças no tatame com atualização direta do progresso para faixas e exames.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAttendance}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Chamada ({presentCount} Presentes)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Chamada gravada com sucesso! As presenças foram somadas ao histórico de cada aluno.</span>
        </div>
      )}

      {/* Class Session Configuration Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
        <div>
          <label className="text-neutral-400 block mb-1">Centro de Treino (CT)</label>
          <select
            value={selectedCT}
            onChange={(e) => setSelectedCT(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
          >
            {trainingCenters.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1">Data da Aula</label>
          <input
            type="date"
            value={classDate}
            onChange={(e) => setClassDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1">Turma / Horário</label>
          <select
            value={classTime}
            onChange={(e) => setClassTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
          >
            <option value="07:00 - Adulto Matinal">07:00 - Adulto Matinal</option>
            <option value="12:00 - Almoço Fight">12:00 - Almoço Fight</option>
            <option value="17:30 - Kids & Juvenil">17:30 - Kids & Juvenil</option>
            <option value="19:30 - Adulto Geral">19:30 - Adulto Geral</option>
            <option value="21:00 - No-Gi Competição">21:00 - No-Gi Competição</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1">Professor Responsável</label>
          <select
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
          >
            {professors.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Lista de Alunos da Turma ({ctStudents.length})
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const updated: Record<string, boolean> = {};
                ctStudents.forEach(s => updated[s.id] = true);
                setPresentMap(updated);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Marcar Todos
            </button>
            <span className="text-neutral-600">·</span>
            <button
              type="button"
              onClick={() => setPresentMap({})}
              className="text-neutral-400 hover:text-neutral-200"
            >
              Desmarcar Todos
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-800/60">
          {ctStudents.length === 0 ? (
            <p className="text-xs text-neutral-500 py-8 text-center">Nenhum aluno cadastrado neste CT.</p>
          ) : (
            ctStudents.map(student => {
              const isPresent = Boolean(presentMap[student.id]);
              return (
                <div 
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isPresent ? 'bg-neutral-900 hover:bg-neutral-800/70' : 'bg-neutral-950/40 hover:bg-neutral-950 text-neutral-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={student.photoUrl} 
                      alt={student.name} 
                      className={`w-10 h-10 rounded-xl object-cover border ${isPresent ? 'border-amber-500/30' : 'border-neutral-800 grayscale'}`} 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isPresent ? 'text-neutral-100' : 'text-neutral-500'}`}>
                          {student.name}
                        </span>
                        <BeltBadge belt={student.belt} stripes={student.stripes} size="sm" />
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Matrícula: {student.registrationNumber} · {student.attendanceCount} presenças no mês
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStudent(student.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isPresent 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {isPresent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Presente</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Falta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
