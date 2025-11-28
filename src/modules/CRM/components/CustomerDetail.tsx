
import React, { useState } from 'react';
import { Customer, SalesOrder, Transaction } from '../../../types';
import { Card, Badge } from '../../../components/common/UIComponents';
import { Mail, Phone, Globe, User, Clock, ShoppingBag, Receipt, FileText, CheckCircle } from 'lucide-react';
import { CLASSES } from '../../../styles/designSystem';

interface CustomerDetailProps {
    customer: Customer | null;
    orders: SalesOrder[];
    transactions: Transaction[];
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, orders, transactions }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');

    if (!customer) {
        return (
            <div className="flex-1 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center flex-col text-slate-400 h-full">
                <User className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">اختر عميلاً لعرض التفاصيل</p>
                <p className="text-sm">إدارة معلومات الاتصال والسجل المالي.</p>
            </div>
        );
    }

    const customerOrders = orders.filter(o => o.customerId === customer.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const customerTx = transactions.filter(t => t.customerId === customer.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className={CLASSES.h2}>{customer.name}</h2>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mt-2">
                                <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400"/> {customer.email}</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-400"/> {customer.mobile1}</span>
                                {customer.country && <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400"/> {customer.country}, {customer.county}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-center gap-2 pl-6 border-l border-slate-100">
                        <div className="text-left">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">رصيد الحساب</p>
                            <p className={`text-2xl font-bold ${(customer.totalSales - customer.totalPaid) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                ${(customer.totalSales - customer.totalPaid).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex gap-2 text-xs">
                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">مشتريات: ${customer.totalSales.toLocaleString()}</span>
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">مدفوعات: ${customer.totalPaid.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'orders' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        <ShoppingBag className="w-4 h-4"/> سجل الطلبات ({customerOrders.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('payments')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'payments' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Receipt className="w-4 h-4"/> سجل المدفوعات ({customerTx.length})
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {activeTab === 'orders' ? (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-right">رقم الطلب</th>
                                    <th className="px-6 py-3 text-right">التاريخ</th>
                                    <th className="px-6 py-3 text-right">النطاق</th>
                                    <th className="px-6 py-3 text-left">الإجمالي</th>
                                    <th className="px-6 py-3 text-left">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customerOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-indigo-600 text-right">#{o.systemOrderId}</td>
                                        <td className="px-6 py-4 text-slate-500 text-right">{o.date}</td>
                                        <td className="px-6 py-4 font-medium text-right">{o.scope || '-'}</td>
                                        <td className="px-6 py-4 text-left font-bold text-slate-900">${o.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-left">
                                            <Badge variant={o.status === 'Completed' ? 'success' : 'warning'}>{o.status === 'Completed' ? 'مكتمل' : 'قيد الانتظار'}</Badge>
                                        </td>
                                    </tr>
                                ))}
                                {customerOrders.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">لا توجد طلبات سابقة.</td></tr>}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-right">التاريخ</th>
                                    <th className="px-6 py-3 text-right">الوصف</th>
                                    <th className="px-6 py-3 text-right">الطريقة</th>
                                    <th className="px-6 py-3 text-right">مستندات</th>
                                    <th className="px-6 py-3 text-left">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customerTx.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 text-right">{t.date}</td>
                                        <td className="px-6 py-4 font-medium text-right">{t.description}</td>
                                        <td className="px-6 py-4 text-right"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{t.paymentMethod}</span></td>
                                        <td className="px-6 py-4 flex gap-1 justify-end">
                                            {t.contractSnapshot && <div title="العقد مرفق" className="text-indigo-500"><FileText className="w-4 h-4"/></div>}
                                            {t.transferSnapshot && <div title="الإيصال مرفق" className="text-emerald-500"><CheckCircle className="w-4 h-4"/></div>}
                                        </td>
                                        <td className="px-6 py-4 text-left font-bold text-emerald-600">+${t.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {customerTx.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">لا توجد مدفوعات مسجلة.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
