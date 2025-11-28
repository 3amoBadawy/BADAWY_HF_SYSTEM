
import React, { useState } from 'react';
import { MapPin, Clock, Filter, FileText } from 'lucide-react';
import { Customer, PaymentMethod, Transaction, SalesOrder } from '../../types';
import { db } from '../../services/database';
import { CLASSES } from '../../styles/designSystem';
import { PageHeader } from '../../components/common/UIComponents';
import PaymentSearch from './components/PaymentSearch';
import PaymentTerminal from './components/PaymentTerminal';

interface PaymentsProps {
    selectedBranchId: string;
    paymentMethods: PaymentMethod[];
}

const Payments: React.FC<PaymentsProps> = ({ selectedBranchId, paymentMethods }) => {
    const [customers, setCustomers] = useState<Customer[]>(() => db.customers.getAll());
    const [orders] = useState<SalesOrder[]>(() => db.orders.getAll());
    const [transactions, setTransactions] = useState<Transaction[]>(() => db.transactions.getAll());
    
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [methodFilter, setMethodFilter] = useState('All');

    const recentPayments = transactions
        .filter(t => t.type === 'Income' && (selectedBranchId === 'HQ' || t.branchId === selectedBranchId))
        .filter(t => methodFilter === 'All' || t.paymentMethod === methodFilter)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const handleProcess = (amount: number, method: string, note: string, contractImg: string, receiptImg: string) => {
        if (!selectedCustomer) return;
        
        const tx: Transaction = {
            id: `PAY-${Date.now()}`, date: new Date().toISOString().split('T')[0],
            description: `دفعة حساب: ${selectedCustomer.name} ${note ? `(${note})` : ''}`,
            amount, type: 'Income', category: 'المبيعات', status: 'Completed',
            branchId: selectedCustomer.branchId, customerId: selectedCustomer.id,
            paymentMethod: method, contractSnapshot: contractImg, transferSnapshot: receiptImg
        };

        const updatedTx = [tx, ...transactions];
        setTransactions(updatedTx);
        db.transactions.save(updatedTx);

        const updatedCustomers = customers.map(c => c.id === selectedCustomer.id ? { ...c, totalPaid: c.totalPaid + amount } : c);
        setCustomers(updatedCustomers);
        db.customers.save(updatedCustomers);
        
        setSelectedCustomer(updatedCustomers.find(c => c.id === selectedCustomer.id) || null);
        alert("تم تسجيل الدفعة بنجاح!");
    };

    return (
        <div className={CLASSES.pageContainer}>
            <PageHeader 
                title="محطة المدفوعات" 
                subtitle={
                    <div className="flex items-center gap-2">
                        <span>تسجيل التحصيلات. النطاق:</span>
                        <span className="font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedBranchId}</span>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <PaymentSearch 
                        customers={customers} 
                        orders={orders} 
                        selectedBranchId={selectedBranchId} 
                        onSelectCustomer={setSelectedCustomer}
                        selectedCustomerId={selectedCustomer?.id}
                    />
                    
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-sm font-bold text-slate-700 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> أحدث المدفوعات</span>
                            <div className="flex items-center gap-2">
                                <Filter className="w-3 h-3 text-slate-400"/>
                                <select className="text-xs bg-transparent border-none outline-none text-slate-600 cursor-pointer" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
                                    <option value="All">كل الطرق</option>
                                    {paymentMethods.map(pm => <option key={pm.id} value={pm.name}>{pm.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentPayments.map(tx => (
                                <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-900">{tx.description}</p>
                                        <p className="text-xs text-slate-500">{tx.date} • {tx.paymentMethod}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {(tx.contractSnapshot || tx.transferSnapshot) && <div className="flex gap-1"><FileText className="w-3 h-3 text-indigo-500"/></div>}
                                        <span className="font-bold text-emerald-600" dir="ltr">+${tx.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                            {recentPayments.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">لا توجد مدفوعات حديثة.</div>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <PaymentTerminal 
                        customer={selectedCustomer} 
                        paymentMethods={paymentMethods} 
                        selectedBranchId={selectedBranchId} 
                        onProcess={handleProcess}
                    />
                </div>
            </div>
        </div>
    );
};

export default Payments;
