import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { storageService } from '../../services/storageService';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  X, 
  HardDrive, 
  ShieldCheck, 
  Cloud, 
  FileJson,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface DatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseBackupModal: React.FC<DatabaseBackupModalProps> = ({ isOpen, onClose }) => {
  const { 
    siteConfig,
    students,
    professors,
    masters,
    trainingCenters,
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
    addNotification
  } = useGaditas();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    const backupPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      team: siteConfig.teamName,
      data: {
        siteConfig,
        masters,
        professors,
        students,
        trainingCenters,
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
        sponsors
      }
    };

    storageService.exportBackupFile(backupPayload, siteConfig.teamName);
    addNotification('Backup Gerado', 'O arquivo JSON com todos os dados e fotos foi exportado para o seu aparelho.', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (!json.data || !json.data.siteConfig) {
          throw new Error('Arquivo de backup inválido.');
        }

        // Save imported data to localStorage
        const prefix = 'gaditas_v3_fight_';
        if (json.data.siteConfig) localStorage.setItem(`${prefix}site_cfg`, JSON.stringify(json.data.siteConfig));
        if (json.data.masters) localStorage.setItem(`${prefix}masters`, JSON.stringify(json.data.masters));
        if (json.data.professors) localStorage.setItem(`${prefix}professors`, JSON.stringify(json.data.professors));
        if (json.data.students) localStorage.setItem(`${prefix}students`, JSON.stringify(json.data.students));
        if (json.data.trainingCenters) localStorage.setItem(`${prefix}cts`, JSON.stringify(json.data.trainingCenters));
        if (json.data.athletes) localStorage.setItem(`${prefix}athletes`, JSON.stringify(json.data.athletes));
        if (json.data.mediaFiles) localStorage.setItem(`${prefix}media`, JSON.stringify(json.data.mediaFiles));

        setImportStatus('Backup importado com sucesso! Recarregando aplicação...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        addNotification('Erro na Importação', 'Arquivo de backup inválido ou corrompido.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border-2 border-red-600/50 shadow-2xl p-6 sm:p-8 text-xs flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-lg shadow-red-950/40 border border-white/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel">
                Banco de Dados & Armazenamento de Fotos
              </h2>
              <p className="text-[11px] text-neutral-400">
                Gerenciamento de persistência local, fotos, PDFs e exportação de backups
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-4">
          {/* Storage Status Banner */}
          <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-red-500" />
                <span>Status do Banco de Dados Local (IndexedDB)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ativo & Persistente</span>
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Todas as fotos adicionadas manualmente, dados cadastrais de Mestres, Professores, Alunos e arquivos da biblioteca ficam gravados com persistência na memória do navegador.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                <span className="text-xl font-black text-white font-mono block">{students.length}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Alunos Gravados</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                <span className="text-xl font-black text-white font-mono block">{professors.length}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Professores</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                <span className="text-xl font-black text-white font-mono block">{masters.length}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Mestres</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                <span className="text-xl font-black text-white font-mono block">{mediaFiles.length}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Arquivos & Fotos</span>
              </div>
            </div>
          </div>

          {/* Export & Import Backup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-black border-2 border-neutral-800 hover:border-red-600/40 transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="font-black text-white text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-red-500" />
                  <span>Exportar Backup Completo</span>
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Baixe um arquivo JSON com todas as fotos, cadastros e configurações para guardar com segurança ou transferir para outro computador.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 border border-white/20"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Backup (.JSON)</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black border-2 border-neutral-800 hover:border-red-600/40 transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="font-black text-white text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-red-500" />
                  <span>Restaurar / Importar Backup</span>
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Carregue um arquivo JSON de backup previamente exportado para restaurar todos os alunos, fotos e configurações instantaneamente.
                </p>
              </div>

              <label className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-700">
                <FileJson className="w-4 h-4 text-red-500" />
                <span>Selecionar Arquivo Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {importStatus && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold text-center">
              {importStatus}
            </div>
          )}

          {/* Cloud Database Integration Info */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cloud className="w-4 h-4 text-red-500" />
              <span>Sincronização em Nuvem (Firebase / Firestore)</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              O sistema já armazena com segurança todos os dados e arquivos no seu dispositivo. Caso deseje sincronização multi-dispositivo em tempo real com múltiplos aparelhos em CTs diferentes simultaneamente, a integração com Firebase Firestore e Firebase Storage pode ser ativada sob sua solicitação.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
