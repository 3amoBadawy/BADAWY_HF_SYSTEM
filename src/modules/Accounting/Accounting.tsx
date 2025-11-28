
import React, { useState } from 'react';
import { Plus, MapPin, Download, Trash2 } from 'lucide-react';
import { Transaction, AccountCategory, PaymentMethod } from '../../types';
import { db } from '../../services/database';
import { CLASSES } from '../../styles/designSystem';
import { Button, Badge, Table, PageHeader } from '../../components/common/UIComponents';
import { FinancialSummary } from './components/FinancialSummary';
import { TransactionModal } from './components/TransactionModal';

interface AccountingProps {
    selectedBranchId: string;
    categories: AccountCategory[];
    paymentMethods: PaymentMethod[];
}

const Accounting: React.FC<AccountingProps> = ({ selectedBranchId, categories, paymentMethods }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => db.transactions.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const branchTransactions = selectedBranchId === 'HQ' ? transactions : transactions.filter(t => t.branchId === selectedBranchId);
  const sortedTransactions = [...branchTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSave = (newTx: Partial<Transaction>) => {
      if (!newTx.amount || !newTx.description) return;
      const tx: Transaction = {
          id: `TX-${Date.now()}`,
          date: newTx.date!, description: newTx.description!, amount: newTx.amount!,
          type: newTx.type!, category: newTx.category || 'عام', status: 'Completed',
          branchId: selectedBranchId === 'HQ' ? 'NY' : selectedBranchId, paymentMethod: newTx.paymentMethod
      };
      const updated = [tx, ...transactions];
      setTransactions(updated);
      db.transactions.save(updated);
      setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if (confirm("هل أنت متأكد من حذف هذه المعاملة؟")) {
          const updated = transactions.filter(t => t.id !== id);
          setTransactions(updated);
          db.transactions.save(updated);
      }
  };

  return (
    <div className={CLASSES.pageContainer}>
      <PageHeader 
        title="الحسابات العامة"
        subtitle={
            <div className="flex items-center gap-2">
                <span>تتبع المعاملات المالية. عرض:</span>
                <span className="font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedBranchId}</span>
            </div>
        }
        actions={
            <div className="flex gap-3">
                 <Button variant="secondary"><Download className="w-4 h-4 ml-2" /> تصدير</Button>
                 <Button onClick={() => setIsModalOpen(true)}><Plus className="w-5 h-5 ml-2" /> تسجيل معاملة</Button>
            </div>
        }
      />

      <FinancialSummary transactions={branchTransactions} paymentMethods={paymentMethods} selectedBranchId={selectedBranchId} />

      <div className={CLASSES.section}>
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800">أحدث المعاملات</div>
          <Table 
            data={sortedTransactions}
            columns={[
                { header: 'التاريخ', accessor: 'date', render: t => <span className="text-slate-500 font-mono">{t.date}</span> },
                { header: 'الوصف', accessor: 'description', render: t => <span className="font-medium">{t.description}</span> },
                { header: 'الفئة', accessor: 'category', render: t => <Badge variant="neutral">{t.category}</Badge> },
                { header: 'المبلغ', render: t => <span className={`font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`} dir="ltr">{t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}</span> },
                { header: '', align: 'right', render: t => <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button> }
            ]}
            emptyMessage="لا توجد معاملات مسجلة."
          />
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} categories={categories} paymentMethods={paymentMethods} />
    </div>
  );
};

export default Accounting;
