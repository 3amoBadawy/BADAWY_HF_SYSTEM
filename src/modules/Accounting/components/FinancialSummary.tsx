
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction, PaymentMethod } from '../../../types';
import { Card } from '../../../components/common/UIComponents';

interface FinancialSummaryProps {
    transactions: Transaction[];
    paymentMethods: PaymentMethod[];
    selectedBranchId: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions, paymentMethods, selectedBranchId }) => {
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expense;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">صافي الربح</p>
                            <p className={`text-3xl font-bold ${net >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                                {net < 0 ? '-' : ''}${Math.abs(net).toLocaleString()}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full ${net >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">إجمالي الإيرادات</p>
                            <p className="text-3xl font-bold text-emerald-600">+${income.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
                    </div>
                </Card>
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">إجمالي المصروفات</p>
                            <p className="text-3xl font-bold text-red-600">-${expense.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full text-red-600"><TrendingDown className="w-6 h-6" /></div>
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-indigo-600"/> أرصدة الحسابات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paymentMethods.filter(pm => selectedBranchId === 'HQ' || !pm.branchId || pm.branchId === selectedBranchId).map(pm => {
                        const pmTx = transactions.filter(t => t.paymentMethod === pm.name);
                        const pmIncome = pmTx.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
                        const pmExpense = pmTx.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
                        const bal = pmIncome - pmExpense;
                        return (
                            <Card key={pm.id} padding="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-700 block">{pm.name}</span>
                                    {bal >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500"/> : <TrendingDown className="w-4 h-4 text-red-500"/>}
                                </div>
                                <span className={`text-2xl font-bold ${bal >= 0 ? 'text-slate-900' : 'text-red-600'}`}>${bal.toLocaleString()}</span>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
