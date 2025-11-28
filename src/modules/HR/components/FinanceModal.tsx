
import React, { useState } from 'react';
import { Employee, SalesOrder, Transaction, PaymentMethod } from '../../../types';
import { Modal, Button, Input, Card, Badge, Table, Select } from '../../../components/common/UIComponents';
import { DollarSign, Wallet, Clock, TrendingUp, CheckSquare, Edit2, Calendar } from 'lucide-react';
import { CLASSES } from '../../../styles/designSystem';

interface FinanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee;
    orders: SalesOrder[];
    transactions: Transaction[];
    paymentMethods: PaymentMethod[];
    onProcessPayment: (amount: number, type: 'Salary' | 'Commission' | 'Advance' | 'Bonus', note: string, method: string, orderOverrides?: {orderId: string, amount: number}[]) => void;
}

const FinanceModal: React.FC<FinanceModalProps> = ({ isOpen, onClose, employee, orders, transactions, paymentMethods, onProcessPayment }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'direct' | 'commission' | 'comm_log' | 'history'>('overview');
    
    // Direct Payment State
    const [payAmount, setPayAmount] = useState<string>('');
    const [payReason, setPayReason] = useState('');
    const [payType, setPayType] = useState<'Advance' | 'Bonus'>('Advance');
    const [payMethod, setPayMethod] = useState('');

    // Commission State
    const [overrides, setOverrides] = useState<Record<string, number>>({});
    const [selectedOrders, setSelectedOrders] = useState<Record<string, boolean>>({});
    const [commMethod, setCommMethod] = useState('');

    if (!isOpen) return null;

    // --- CALCULATIONS ---
    const dailyRate = employee.salary / (employee.totalWorkingDays || 22);
    const earnedSalary = dailyRate * (employee.attendanceDays || 0);
    const progress = Math.min(((employee.attendanceDays || 0) / (employee.totalWorkingDays || 22)) * 100, 100);

    const empOrders = orders.filter(o => o.salesRepId === employee.id);
    const eligibleOrders = empOrders.filter(o => o.status === 'Completed' && !o.isCommissionPaid);
    const paidCommissionOrders = empOrders.filter(o => o.isCommissionPaid).sort((a,b) => new Date(b.commissionPaidDate || '').getTime() - new Date(a.commissionPaidDate || '').getTime());
    
    const calculateTotalCommission = () => {
        return eligibleOrders.reduce((sum, o) => {
            if (selectedOrders[o.id]) {
                const standard = o.totalAmount * ((employee.commissionRate||0)/100);
                return sum + (overrides[o.id] !== undefined ? overrides[o.id] : standard);
            }
            return sum;
        }, 0);
    };

    const totalSelectedCommission = calculateTotalCommission();

    const empTx = transactions.filter(t => t.employeeId === employee.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // --- HANDLERS ---
    const handleDirectSubmit = () => {
        const amt = parseFloat(payAmount);
        if (!amt || amt <= 0) return alert("مبلغ غير صحيح");
        if (!payMethod) return alert("اختر طريقة الدفع");
        
        const month = new Date().toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
        const typeAr = payType === 'Advance' ? 'سلفة' : 'مكافأة';
        const note = `صرف ${typeAr} - ${month}${payReason ? ` (${payReason})` : ''}`;
        
        onProcessPayment(amt, payType, note, payMethod);
        setPayAmount(''); setPayReason(''); setPayMethod('');
        setActiveTab('overview');
    };

    const handleCommissionSubmit = () => {
        if (totalSelectedCommission <= 0) return alert("لم يتم تحديد عمولات أو المبلغ 0");
        if (!commMethod) return alert("اختر طريقة الدفع");

        const orderData = eligibleOrders
            .filter(o => selectedOrders[o.id])
            .map(o => ({
                orderId: o.id,
                amount: overrides[o.id] !== undefined ? overrides[o.id] : (o.totalAmount * ((employee.commissionRate||0)/100))
            }));
            
        const month = new Date().toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
        onProcessPayment(totalSelectedCommission, 'Commission', `صرف عمولات - ${month} (${orderData.length} طلبات)`, commMethod, orderData);
        setOverrides({}); setSelectedOrders({}); setCommMethod('');
        setActiveTab('overview');
    };

    const toggleOrderSelection = (id: string) => {
        setSelectedOrders(prev => ({...prev, [id]: !prev[id]}));
    };

    const updateOverride = (id: string, val: string) => {
        const num = parseFloat(val);
        setOverrides(prev => ({...prev, [id]: isNaN(num) ? 0 : num}));
    };

    const getPaymentTypeBadge = (category: string) => {
        const map: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
            'Salaries': 'primary', 'roatb': 'primary', 'رواتب': 'primary',
            'Commissions': 'success', 'omolat': 'success', 'عمولات': 'success',
            'Advances': 'warning', 'solaf': 'warning', 'سلف موظفين': 'warning',
            'Bonuses': 'primary', 'mokafaat': 'primary', 'مكافأة': 'primary',
            'General': 'neutral', '3am': 'neutral', 'عام': 'neutral'
        };
        // If the category itself is Arabic, just display it.
        return <Badge variant={map[category] || 'neutral'}>{category}</Badge>;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`الإدارة المالية: ${employee.name}`} maxWidth="max-w-5xl">
            <div className="flex border-b border-slate-100 mb-6 bg-slate-50 overflow-x-auto">
                {[
                    {id: 'overview', label: 'نظرة عامة'}, 
                    {id: 'direct', label: 'دفع مباشر'}, 
                    {id: 'commission', label: 'صرف عمولات'}, 
                    {id: 'comm_log', label: 'سجل العمولات'}, 
                    {id: 'history', label: 'سجل المعاملات'}
                ].map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-6 pt-0 min-h-[450px]">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-indigo-50 border-indigo-100">
                                <p className="text-xs font-bold text-indigo-400 uppercase">الراتب الشهري</p>
                                <p className="text-2xl font-bold text-indigo-900">${employee.salary.toLocaleString()}</p>
                                <p className="text-xs text-indigo-600 mt-1">${dailyRate.toFixed(2)} / يوم</p>
                            </Card>
                            <Card className="bg-emerald-50 border-emerald-100">
                                <p className="text-xs font-bold text-emerald-500 uppercase">المستحق (حتى الآن)</p>
                                <p className="text-2xl font-bold text-emerald-700">${earnedSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-[10px] text-emerald-600 mt-1">{employee.attendanceDays || 0} / {employee.totalWorkingDays} يوم</p>
                            </Card>
                            <Card className="bg-amber-50 border-amber-100">
                                <p className="text-xs font-bold text-amber-500 uppercase">رصيد السلف</p>
                                <p className="text-2xl font-bold text-amber-700">${(employee.loanBalance || 0).toLocaleString()}</p>
                                <p className="text-xs text-amber-600 mt-1">مديونية قائمة</p>
                            </Card>
                        </div>
                    </div>
                )}

                {/* DIRECT PAY TAB */}
                {activeTab === 'direct' && (
                    <div className="max-w-lg mx-auto space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8"/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">دفع مباشر</h3>
                            <p className="text-slate-500 text-sm">صرف سلفة أو مكافأة للموظف.</p>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                            <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-lg">
                                {[{id: 'Advance', label: 'سلفة'}, {id: 'Bonus', label: 'مكافأة'}].map(t => (
                                    <button key={t.id} onClick={() => setPayType(t.id as any)} className={`flex-1 py-2 text-sm font-bold rounded ${payType === t.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <Input label="المبلغ ($)" type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                            <Input label="ملاحظات (اختياري)" value={payReason} onChange={e => setPayReason(e.target.value)} placeholder="مثال: مكافأة أداء" />
                            <Select label="مصدر الدفع (الخزينة)" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                                <option value="">اختر الحساب...</option>
                                {paymentMethods.map(pm => <option key={pm.id} value={pm.name}>{pm.name}</option>)}
                            </Select>
                            <Button onClick={handleDirectSubmit} className="w-full justify-center py-3">
                                تأكيد الدفع
                            </Button>
                        </div>
                    </div>
                )}

                {/* COMMISSION TAB */}
                {activeTab === 'commission' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">صرف العمولات</h3>
                                <p className="text-sm text-slate-500">اختر الطلبات لصرف عمولتها. يمكنك تعديل المبلغ يدوياً.</p>
                            </div>
                            <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase">الإجمالي المستحق</p>
                                <p className="text-2xl font-bold text-emerald-600">${totalSelectedCommission.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="border rounded-xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 border-b sticky top-0">
                                    <tr>
                                        <th className="p-3 w-10"><input type="checkbox" onChange={(e) => {
                                            const newVal = e.target.checked;
                                            const newSel: Record<string, boolean> = {};
                                            eligibleOrders.forEach(o => newSel[o.id] = newVal);
                                            setSelectedOrders(newSel);
                                        }}/></th>
                                        <th className="p-3 text-right">الطلب</th>
                                        <th className="p-3 text-right">التاريخ</th>
                                        <th className="p-3 text-left">الإجمالي</th>
                                        <th className="p-3 text-left">العمولة ({employee.commissionRate}%)</th>
                                        <th className="p-3 w-32">تعديل ($)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {eligibleOrders.length > 0 ? eligibleOrders.map(o => {
                                        const standard = o.totalAmount * ((employee.commissionRate||0)/100);
                                        const isSel = !!selectedOrders[o.id];
                                        return (
                                            <tr key={o.id} className={isSel ? 'bg-indigo-50/30' : ''}>
                                                <td className="p-3"><input type="checkbox" checked={isSel} onChange={() => toggleOrderSelection(o.id)}/></td>
                                                <td className="p-3 font-mono font-bold text-indigo-600 text-right">#{o.systemOrderId}</td>
                                                <td className="p-3 text-slate-500 text-right">{o.date}</td>
                                                <td className="p-3 text-left">${o.totalAmount.toLocaleString()}</td>
                                                <td className="p-3 text-left text-slate-500">${standard.toFixed(2)}</td>
                                                <td className="p-3">
                                                    <input 
                                                        type="number" 
                                                        className="w-full border border-slate-300 rounded px-2 py-1 text-right font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        placeholder={standard.toFixed(2)}
                                                        value={overrides[o.id] ?? ''}
                                                        onChange={e => updateOverride(o.id, e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">لا توجد طلبات مستحقة للعمولة.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-4 items-center pt-4 border-t border-slate-100">
                            <div className="w-64">
                                <Select label="حساب الدفع" value={commMethod} onChange={e => setCommMethod(e.target.value)}>
                                    <option value="">اختر الطريقة...</option>
                                    {paymentMethods.map(pm => <option key={pm.id} value={pm.name}>{pm.name}</option>)}
                                </Select>
                            </div>
                            <Button onClick={handleCommissionSubmit} disabled={totalSelectedCommission <= 0} className="h-full mt-5">
                                صرف المحدد
                            </Button>
                        </div>
                    </div>
                )}

                {/* COMMISSION LOG TAB */}
                {activeTab === 'comm_log' && (
                    <div className="space-y-4">
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-slate-900">سجل العمولات المدفوعة</h3>
                            <div className="text-sm text-slate-500">إجمالي المدفوع: <span className="font-bold text-emerald-600">${paidCommissionOrders.reduce((sum, o) => sum + (o.commissionOverrideAmount || (o.totalAmount * ((employee.commissionRate||0)/100))), 0).toLocaleString()}</span></div>
                        </div>
                        <Table
                            data={paidCommissionOrders}
                            columns={[
                                { header: 'تاريخ الصرف', accessor: 'commissionPaidDate', render: (o: SalesOrder) => <span className="text-slate-500 font-mono text-xs">{o.commissionPaidDate?.split('T')[0]}</span> },
                                { header: 'رقم الطلب', accessor: 'systemOrderId', render: (o: SalesOrder) => <span className="font-bold text-indigo-600">#{o.systemOrderId}</span> },
                                { header: 'إجمالي الطلب', align: 'left', render: (o: SalesOrder) => <span>${o.totalAmount.toLocaleString()}</span> },
                                { header: 'العمولة', align: 'left', render: (o: SalesOrder) => {
                                    const amount = o.commissionOverrideAmount || (o.totalAmount * ((employee.commissionRate||0)/100));
                                    return <span className="font-bold text-emerald-600">${amount.toFixed(2)}</span>;
                                }}
                            ]}
                            emptyMessage="لا يوجد سجل لعمولات مدفوعة."
                        />
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">سجل المعاملات المالية</h3>
                        <Table 
                            data={empTx}
                            columns={[
                                { header: 'التاريخ', accessor: 'date', render: (t: Transaction) => <span className="text-slate-500 font-mono text-xs">{t.date}</span> },
                                { header: 'النوع', accessor: 'category', render: (t: Transaction) => getPaymentTypeBadge(t.category) },
                                { header: 'الوصف', accessor: 'description', render: (t: Transaction) => <span className="font-medium text-xs md:text-sm">{t.description}</span> },
                                { header: 'الطريقة', accessor: 'paymentMethod', render: (t: Transaction) => <span className="text-xs bg-slate-100 px-2 py-1 rounded">{t.paymentMethod}</span> },
                                { header: 'المبلغ', align: 'left', render: (t: Transaction) => <span className="font-bold text-slate-900">${t.amount.toLocaleString()}</span> }
                            ]}
                            emptyMessage="لا يوجد سجل مالي لهذا الموظف."
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default FinanceModal;
