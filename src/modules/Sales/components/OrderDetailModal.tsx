
import React, { useState } from 'react';
import { SalesOrder, Transaction, AccountCategory, PaymentMethod } from '../../../types';
import { Modal, Button, Badge, Input, Select, Table } from '../../../components/common/UIComponents';
import { Printer, Settings, Receipt, Plus } from 'lucide-react';

interface OrderDetailModalProps {
    order: SalesOrder | null;
    onClose: () => void;
    onUpdateStatus: (status: any) => void;
    onPrint: (order: SalesOrder) => void;
    transactions: Transaction[];
    onAddExpense: (amount: number, description: string, category: string, paymentMethod: string) => void;
    accountCategories: AccountCategory[];
    paymentMethods: PaymentMethod[];
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateStatus, onPrint, transactions, onAddExpense, accountCategories, paymentMethods }) => {
    const [isExpenseOpen, setIsExpenseOpen] = useState(false);
    const [expAmount, setExpAmount] = useState('');
    const [expDesc, setExpDesc] = useState('');
    const [expCat, setExpCat] = useState('');
    const [expMethod, setExpMethod] = useState('');

    if (!order) return null;

    const handlePrint = () => {
        onPrint(order);
    };

    const submitExpense = () => {
        if (!expAmount || !expDesc || !expCat || !expMethod) return alert("يرجى ملء جميع الحقول");
        onAddExpense(parseFloat(expAmount), expDesc, expCat, expMethod);
        setIsExpenseOpen(false);
        setExpAmount(''); setExpDesc(''); setExpCat(''); setExpMethod('');
    };

    return (
        <Modal isOpen={!!order} onClose={onClose} title={`طلب رقم #${order.systemOrderId}`} maxWidth="max-w-4xl">
            <div className="p-6 space-y-6 print:p-0">
                {/* Header for Print */}
                <div className="hidden print:block mb-8 text-center">
                    <h1 className="text-2xl font-bold">أمر شغل / فاتورة</h1>
                    <p>طلب رقم #{order.systemOrderId}</p>
                </div>

                <div className="flex justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:border-0 print:p-0">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">العميل</p>
                        <p className="font-bold text-xl text-slate-900">{order.customerName}</p>
                        <p className="text-sm text-slate-500 mt-1">التاريخ: {order.date}</p>
                        {order.deliveryDate && <p className="text-sm text-slate-500">تاريخ التسليم: {order.deliveryDate}</p>}
                        {order.manualContractId && <p className="text-sm text-slate-500">رقم العقد: {order.manualContractId}</p>}
                    </div>
                    <div className="text-left print:hidden">
                        <p className="text-xs font-bold text-slate-400 uppercase">الحالة</p>
                        <div className="flex gap-1 mt-1">
                            {['Pending', 'Completed', 'Refunded'].map(s => (
                                <button key={s} onClick={() => onUpdateStatus(s)} className={`px-2 py-1 text-xs rounded border ${order.status === s ? 'bg-slate-800 text-white' : 'bg-white'}`}>
                                    {s === 'Pending' ? 'انتظار' : s === 'Completed' ? 'مكتمل' : 'مرتجع'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="hidden print:block text-left">
                        <p className="font-bold text-lg">{order.status}</p>
                    </div>
                </div>

                <table className="w-full text-sm text-left mt-6">
                    <thead className="bg-slate-50 text-slate-500 border-b print:bg-white print:text-black print:border-black">
                        <tr><th>الصنف</th><th className="text-left">الكمية</th><th className="text-left">الإجمالي</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-black">
                        {order.items.map((item, i) => (
                            <tr key={i}>
                                <td className="py-3">
                                    <span className="font-bold">{item.productName}</span>
                                    {item.components?.map((c, idx) => (
                                        <div key={idx} className="text-xs text-slate-500 pr-2 print:text-slate-700">
                                            • {c.quantity}x {c.name}
                                            {c.customizations && (c.customizations.isTextile || c.customizations.isMeasures || c.customizations.isOther) && (
                                                <span className="mr-2 italic text-[10px]">
                                                    [{[c.customizations.isTextile && 'قماش', c.customizations.isMeasures && 'مقاسات', c.customizations.isOther && 'تخصيص'].filter(Boolean).join(', ')}]
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {item.customizations?.note && <div className="text-xs italic text-slate-500 mt-1">ملاحظة: {item.customizations.note}</div>}
                                </td>
                                <td className="py-3 text-left">{item.quantity}</td>
                                <td className="py-3 text-left font-bold">${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 print:border-black">
                        <tr>
                            <td colSpan={2} className="py-4 text-left font-bold uppercase text-slate-500">الإجمالي الكلي</td>
                            <td className="py-4 text-left font-bold text-lg text-slate-900">${order.totalAmount.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* EXPENSES SECTION */}
                <div className="print:hidden mt-8 border-t border-slate-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2"><Receipt className="w-4 h-4"/> مصروفات الطلب</h3>
                        <Button variant="secondary" onClick={() => setIsExpenseOpen(!isExpenseOpen)} className="text-xs h-8"><Plus className="w-3 h-3 ml-1"/> إضافة مصروف</Button>
                    </div>

                    {isExpenseOpen && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 grid grid-cols-2 md:grid-cols-5 gap-2 animate-in slide-in-from-top-2">
                            <Input placeholder="الوصف" value={expDesc} onChange={e => setExpDesc(e.target.value)} className="col-span-2 text-sm" />
                            <Input type="number" placeholder="المبلغ" value={expAmount} onChange={e => setExpAmount(e.target.value)} className="text-sm" />
                            <Select value={expCat} onChange={e => setExpCat(e.target.value)} className="text-sm">
                                <option value="">الفئة</option>
                                {accountCategories.filter(c => c.type === 'Expense' || c.type === 'Both').map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </Select>
                            <Select value={expMethod} onChange={e => setExpMethod(e.target.value)} className="text-sm">
                                <option value="">طريقة الدفع</option>
                                {paymentMethods.map(pm => <option key={pm.id} value={pm.name}>{pm.name}</option>)}
                            </Select>
                            <Button onClick={submitExpense} className="col-span-2 md:col-span-5 mt-2">حفظ المصروف</Button>
                        </div>
                    )}

                    <Table 
                        data={transactions}
                        columns={[
                            { header: 'التاريخ', accessor: 'date', render: (t: Transaction) => <span className="text-xs text-slate-500">{t.date}</span> },
                            { header: 'الوصف', accessor: 'description' },
                            { header: 'الفئة', accessor: 'category', render: (t: Transaction) => <Badge variant="neutral">{t.category}</Badge> },
                            { header: 'المبلغ', align: 'left', render: (t: Transaction) => <span className="font-bold text-red-600">-${t.amount.toLocaleString()}</span> }
                        ]}
                        emptyMessage="لا توجد مصروفات مسجلة لهذا الطلب."
                    />
                </div>

                <div className="hidden print:block mt-12 pt-8 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                        <div className="w-1/3 border-t border-black pt-2 text-center">توقيع العميل</div>
                        <div className="w-1/3 border-t border-black pt-2 text-center">مدير المعرض</div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 print:hidden">
                    <Button variant="secondary" onClick={handlePrint}><Printer className="w-4 h-4 ml-2"/> طباعة أمر الشغل</Button>
                    <Button onClick={onClose}>إغلاق</Button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailModal;
