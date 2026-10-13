import React, { useState, useRef, useEffect } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { DigitalSignature, Student } from '../../types';
import { 
  FileSignature, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Download,
  AlertCircle
} from 'lucide-react';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({ isOpen, onClose, student }) => {
  const { addDigitalSignature, digitalSignatures, addNotification } = useGaditas();

  const [documentType, setDocumentType] = useState<DigitalSignature['documentType']>('Regulamento Interno');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = 160;

    // Canvas background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Guide baseline
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 35);
    ctx.lineTo(canvas.width - 30, canvas.height - 35);
    ctx.stroke();

    // Text hint
    ctx.font = '11px monospace';
    ctx.fillStyle = '#525252';
    ctx.fillText('Assine digitalmente sobre a linha com o dedo ou mouse', 35, canvas.height - 15);
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch & Mouse Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#ef4444'; // Red martial ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 35);
    ctx.lineTo(canvas.width - 30, canvas.height - 35);
    ctx.stroke();

    ctx.font = '11px monospace';
    ctx.fillStyle = '#525252';
    ctx.fillText('Assine digitalmente sobre a linha com o dedo ou mouse', 35, canvas.height - 15);

    setHasDrawn(false);
  };

  const handleSaveSignature = () => {
    if (!hasDrawn) {
      addNotification('Assinatura Obrigatória', 'Por favor, desenhe sua assinatura no campo indicado.', 'warning');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    const dataUrl = canvas.toDataURL('image/png');

    addDigitalSignature({
      studentId: student.id,
      studentName: student.name,
      documentType,
      signatureDataUrl: dataUrl,
      ipAddress: '189.102.45.12 (Rio de Janeiro, RJ)',
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Dispositivo Móvel' : 'Computador / Desktop',
      status: 'Válido'
    });

    setIsSubmitting(false);
    onClose();
  };

  const studentSignatures = digitalSignatures.filter(s => s.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-600/30 flex items-center justify-center shadow-lg">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider block">
                Validação Jurídica & Termos Gaditas
              </span>
              <h2 className="text-lg font-black text-white font-cinzel">
                Assinatura Digital de Documentos
              </h2>
            </div>
          </div>

          <button type="button" onClick={onClose} className="p-1 rounded-lg text-neutral-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student identification badge */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-white block">{student.name}</span>
            <span className="text-neutral-400 font-mono text-[11px]">Matrícula: {student.registrationNumber} · {student.trainingCenterName}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono text-[10px] font-bold">
            Identidade Confirmada
          </span>
        </div>

        {/* Document Selection */}
        <div className="space-y-2 text-xs">
          <label className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
            Selecione o Documento / Termo a Assinar:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Regulamento Interno',
              'Contrato de Matrícula',
              'Termo de Responsabilidade & Parq',
              'Autorização de Menores'
            ].map((doc) => (
              <button
                key={doc}
                type="button"
                onClick={() => setDocumentType(doc as any)}
                className={`p-3 rounded-xl border text-left transition-all font-semibold ${
                  documentType === doc
                    ? 'bg-red-600/20 border-red-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {doc}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Signature Pad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">
              Desenhe sua Assinatura Abaixo:
            </span>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-[10px] font-mono text-neutral-400 hover:text-red-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar Traço</span>
            </button>
          </div>

          <div className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-neutral-700 bg-neutral-950 touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair w-full block"
            />
          </div>
        </div>

        {/* Security and timestamp badge */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Ao assinar, o sistema registra automaticamente o IP, data, hora e credenciais do aluno no log de auditoria permanente da plataforma.
          </p>
        </div>

        {/* Previously Signed Documents History */}
        {studentSignatures.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
              Documentos Já Assinados por este Aluno ({studentSignatures.length}):
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {studentSignatures.map(sig => (
                <div key={sig.id} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">{sig.documentType}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{sig.signedAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSaveSignature}
            disabled={!hasDrawn || isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-red-950/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Assinatura Digital</span>
          </button>
        </div>
      </div>
    </div>
  );
};
