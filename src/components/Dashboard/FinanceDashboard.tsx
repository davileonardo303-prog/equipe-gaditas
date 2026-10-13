import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  FileText,
  Copy,
  Users
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const { 
    transactions, 
    addTransaction, 
    professors, 
    students, 
    payStudentMonthlyFee,
    addNotification 
  } = useGaditas();

  const [timeFilter, setTimeFilter] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const [selectedStudentForPix, setSelectedStudentForPix] = useState<string | null>(null);

  // New Transaction Form states
  const [txType, setTxType] = useState<'Receita' | 'Despesa'>('Receita');
  const [category, setCategory] = useState<any>('Mensalidade');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(150);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Dinheiro' | 'Cartão' | 'Transferência'>('PIX');

  // Financial aggregates
  const revenues = transactions.filter(t => t.type === 'Receita');
  const expenses = transactions.filter(t => t.type === 'Despesa');

  const totalRevenues = revenues.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenues - totalExpenses;

  // Inadimplência
  const lateStudents = students.filter(s => s.paymentStatus === 'Atrasado');
  const pendingStudents = students.filter(s => s.paymentStatus === 'Pendente');
  const paidStudents = students.filter(s => s.paymentStatus === 'Pago');

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      type: txType,
      category,
      description,
      amount: Number(amount),
      paymentMethod,
      status: 'Concluído'
    });
    setShowNewTxModal(false);
    setDescription('');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('financeiro@gaditasteam.com.br');
    addNotification('Chave PIX Copiada', 'financeiro@gaditasteam.com.br copiada para a área de transferência.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Financeiro Profissional & Fluxo de Caixa
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gestão de receitas, despesas, comissões de professores, controle de mensalidades e conciliação bancária PIX.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPix}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Chave PIX Oficial</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewTxModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Transação</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Receitas */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider block">Receitas Totais</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
              R$ {totalRevenues.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mensalidades, Loja e Patrocínio</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Despesas */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider block">Despesas Operacionais</span>
            <span className="text-2xl font-extrabold text-red-400 font-mono mt-1 block">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span>Aluguel CTs, Comissões e Tatames</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider block">Saldo / Lucro Líquido</span>
            <span className={`text-2xl font-extrabold font-mono mt-1 block ${netProfit >= 0 ? 'text-amber-400' : 'text-red-500'}`}>
              R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">Margem saudável Gaditas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono">
            R$
          </div>
        </div>
      </div>

      {/* Comissões de Professores (Exemplo Exato da Solicitação do Usuário) */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-neutral-100 font-cinzel">
              Comissões Automáticas de Professores
            </h2>
          </div>
          <span className="text-xs text-neutral-400">
            Fórmula: (Nº Alunos × Mensalidade Média) × % Comissão
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {professors.map(prof => {
            const avgFee = 150;
            const revenueGenerated = prof.studentsCount * avgFee;
            const commissionAmount = (revenueGenerated * prof.commissionRate) / 100;

            return (
              <div key={prof.id} className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-3">
                <div className="flex items-center gap-3">
                  <img src={prof.photoUrl} alt={prof.name} className="w-10 h-10 rounded-lg object-cover border border-neutral-800" />
                  <div>
                    <span className="font-bold text-neutral-100 text-sm">{prof.name}</span>
                    <p className="text-[11px] text-neutral-400">{prof.trainingCenterName}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-neutral-400">
                    <span>Base de Alunos:</span>
                    <span className="font-bold text-neutral-200">{prof.studentsCount} alunos</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Receita Gerada:</span>
                    <span className="text-neutral-200">R$ {revenueGenerated.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Alíquota de Comissão:</span>
                    <span className="text-amber-400 font-bold">{prof.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-neutral-800 text-xs font-bold text-emerald-400">
                    <span>Pagamento Comissão:</span>
                    <span>R$ {commissionAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addTransaction({
                      date: new Date().toISOString().split('T')[0],
                      type: 'Despesa',
                      category: 'Comissão Professor',
                      description: `Pagamento Comissão Prof. ${prof.name}`,
                      amount: commissionAmount,
                      paymentMethod: 'PIX',
                      status: 'Concluído',
                      referenceProfessorId: prof.id
                    });
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition-colors border border-neutral-700 text-xs"
                >
                  Lançar Pagamento PIX
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fluxo de Caixa: Período e Gráfico Visual */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-100 font-cinzel">
              Fluxo de Caixa Analítico
            </h3>
            <p className="text-xs text-neutral-400">Visão consolidada por período contábil.</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            {(['dia', 'semana', 'mes', 'ano'] as const).map(period => (
              <button
                key={period}
                type="button"
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  timeFilter === period ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Financial Flow Chart */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 h-40 items-end pt-6 px-2">
          {[
            { label: 'Jan', rev: 12000, exp: 6500 },
            { label: 'Fev', rev: 14500, exp: 7000 },
            { label: 'Mar', rev: 16000, exp: 8200 },
            { label: 'Abr', rev: 15200, exp: 7800 },
            { label: 'Mai', rev: 17800, exp: 9000 },
            { label: 'Jun', rev: 19500, exp: 9400 },
            { label: 'Jul', rev: 18200, exp: 8800 },
            { label: 'Ago', rev: 21000, exp: 10200 },
            { label: 'Set', rev: 22400, exp: 10600 },
            { label: 'Out', rev: 24800, exp: 11500 },
            { label: 'Nov', rev: 23900, exp: 11000 },
            { label: 'Dez', rev: 28000, exp: 13000 },
          ].map((bar, i) => {
            const heightPercent = Math.min(100, Math.round((bar.rev / 30000) * 100));
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-600 to-amber-400 rounded-t-sm transition-all group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                  title={`${bar.label}: Receitas R$ ${bar.rev} / Despesas R$ ${bar.exp}`}
                />
                <span className="text-[10px] text-neutral-500 font-mono">{bar.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inadimplência e Cobrança Rápida PIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Alunos e Status de Mensalidade */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-neutral-100 font-cinzel">
                Mensalidades & Inadimplência
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {paidStudents.length} pagos · {pendingStudents.length + lateStudents.length} abertos
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {students.map(student => (
              <div 
                key={student.id} 
                className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-neutral-200 block">{student.name}</span>
                  <span className="text-[11px] text-neutral-400">
                    Mensalidade: R$ {student.monthlyFee.toFixed(2)} · {student.trainingCenterName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    student.paymentStatus === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' :
                    student.paymentStatus === 'Atrasado' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {student.paymentStatus}
                  </span>

                  {student.paymentStatus !== 'Pago' && (
                    <button
                      type="button"
                      onClick={() => payStudentMonthlyFee(student.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm"
                    >
                      Dar Baixa PIX
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Transações Financeiras */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100 font-cinzel">
                Extrato Recente
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Últimos lançamentos</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {transactions.slice(0, 8).map(tx => (
              <div key={tx.id} className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-neutral-200 block">{tx.description}</span>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                    <span>{tx.date}</span>
                    <span>·</span>
                    <span>{tx.category}</span>
                    <span>·</span>
                    <span className="text-amber-400/90 font-mono">{tx.paymentMethod}</span>
                  </div>
                </div>

                <span className={`font-mono font-bold text-sm ${tx.type === 'Receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'Receita' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Lançar Transação */}
      {showNewTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Novo Lançamento Financeiro</h2>
              <button type="button" onClick={() => setShowNewTxModal(false)} className="text-neutral-400 hover:text-neutral-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTx} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('Receita')}
                  className={`py-2 rounded-lg font-bold text-xs ${txType === 'Receita' ? 'bg-emerald-600 text-white' : 'bg-neutral-950 text-neutral-400'}`}
                >
                  + Receita (Entrada)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('Despesa')}
                  className={`py-2 rounded-lg font-bold text-xs ${txType === 'Despesa' ? 'bg-red-600 text-white' : 'bg-neutral-950 text-neutral-400'}`}
                >
                  - Despesa (Saída)
                </button>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Patrocínio Marca X ou Reparo Tatame"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                >
                  <option value="Mensalidade">Mensalidade</option>
                  <option value="Patrocínio">Patrocínio</option>
                  <option value="Loja Gaditas">Loja Gaditas</option>
                  <option value="Inscrição Campeonato">Inscrição Campeonato</option>
                  <option value="Aluguel CT">Aluguel CT</option>
                  <option value="Comissão Professor">Comissão Professor</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewTxModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
