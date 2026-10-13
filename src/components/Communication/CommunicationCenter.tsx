import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Building2, 
  GraduationCap, 
  User, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const CommunicationCenter: React.FC = () => {
  const { students, trainingCenters, professors, addNotification, siteConfig } = useGaditas();

  const [targetType, setTargetType] = useState<'todos' | 'ct' | 'professor' | 'aluno'>('todos');
  const [targetCT, setTargetCT] = useState(trainingCenters[0]?.id || 'ct-matriz');
  const [targetProf, setTargetProf] = useState(professors[0]?.id || 'prof-roberto');
  const [targetStudent, setTargetStudent] = useState(students[0]?.id || 'aluno-lucas');

  const [channel, setChannel] = useState<'whatsapp' | 'interno' | 'email'>('whatsapp');
  const [subject, setSubject] = useState('Comunicado Oficial Gaditas Team');
  const [message, setMessage] = useState(
    'Prezados guerreiros(as), informamos que o aulão geral com o Mestre Davi acontecerá neste sábado às 10h. Contamos com a presença e disciplina de todos! Oss!'
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = () => {
    let targetPhone = '5511987654321';

    if (targetType === 'aluno') {
      const s = students.find(item => item.id === targetStudent);
      if (s) targetPhone = s.phone.replace(/\D/g, '');
    } else if (targetType === 'professor') {
      const p = professors.find(item => item.id === targetProf);
      if (p) targetPhone = p.phone.replace(/\D/g, '');
    }

    if (channel === 'whatsapp') {
      const encoded = encodeURIComponent(`*${siteConfig.teamName}*\n\n${subject}\n\n${message}`);
      const waUrl = `https://wa.me/${targetPhone}?text=${encoded}`;
      window.open(waUrl, '_blank');
    }

    addNotification(
      'Mensagem Disparada', 
      `Envio via ${channel.toUpperCase()} para ${targetType} efetuado com sucesso.`, 
      'success'
    );

    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Central de Comunicação & WhatsApp
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Disparos segmentados de avisos e comunicados por WhatsApp, e-mail e mural interno do aplicativo.
          </p>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Disparo concluído com sucesso e registrado na central de notificações da equipe!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
          <div className="space-y-2">
            <label className="text-neutral-300 font-bold block">1. Canal de Envio</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                }`}
              >
                <span>WhatsApp Direto</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('interno')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  channel === 'interno' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                }`}
              >
                <span>Aviso Interno</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  channel === 'email' ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                }`}
              >
                <span>E-mail</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-neutral-300 font-bold block">2. Destinatários (Segmentação)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('todos')}
                className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
                  targetType === 'todos' ? 'bg-neutral-800 text-amber-400 border border-amber-500/40' : 'bg-neutral-950 text-neutral-400'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Todos</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('ct')}
                className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
                  targetType === 'ct' ? 'bg-neutral-800 text-amber-400 border border-amber-500/40' : 'bg-neutral-950 text-neutral-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>CT Específico</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('professor')}
                className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
                  targetType === 'professor' ? 'bg-neutral-800 text-amber-400 border border-amber-500/40' : 'bg-neutral-950 text-neutral-400'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Professor</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('aluno')}
                className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
                  targetType === 'aluno' ? 'bg-neutral-800 text-amber-400 border border-amber-500/40' : 'bg-neutral-950 text-neutral-400'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Aluno Individual</span>
              </button>
            </div>

            {/* Target Selectors */}
            {targetType === 'ct' && (
              <select
                value={targetCT}
                onChange={(e) => setTargetCT(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
              >
                {trainingCenters.map(tc => (
                  <option key={tc.id} value={tc.id}>{tc.name}</option>
                ))}
              </select>
            )}

            {targetType === 'professor' && (
              <select
                value={targetProf}
                onChange={(e) => setTargetProf(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
              >
                {professors.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                ))}
              </select>
            )}

            {targetType === 'aluno' && (
              <select
                value={targetStudent}
                onChange={(e) => setTargetStudent(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.phone})</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-neutral-300 font-bold block mb-1">Assunto / Título do Comunicado</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-bold block mb-1">Texto da Mensagem</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSend}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Enviar via {channel.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
            Pré-visualização da Mensagem
          </span>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>{siteConfig.teamName}</span>
            </div>
            <p className="font-semibold text-neutral-100">{subject}</p>
            <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
              {message}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-neutral-400 space-y-1 text-[11px]">
            <p>Destinatário: <strong className="text-neutral-200 uppercase">{targetType}</strong></p>
            <p>Canal: <strong className="text-emerald-400 uppercase">{channel}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
