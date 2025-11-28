
import React, { useState } from 'react';
import { Transaction, AccountCategory, PaymentMethod, TransactionType } from '../../../types';
import { Modal, Button, Input, Select } from '../../../components/common/UIComponents';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tx: Partial<Transaction>) => void;
    categories: AccountCategory[];
    paymentMethods: PaymentMethod[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, categories, paymentMethods }) => {
    const [tx, setTx] = useState<Partial<Transaction>>({
        type: 'Expense', amount: 0, description: '', category: '', paymentMethod: '', date: new Date().toISOString().split('T')[0]
    });

    const availCats = categories.filter(c => c.type === tx.type || c.type === 'Both');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تسجيل معاملة مالية">
            <div className="p-6 space-y-4">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    {['Income', 'Expense'].map(t => (
                        <button key={t} onClick={() => setTx({...tx, type: t as TransactionType})} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tx.type === t ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>
                            {t === 'Income' ? 'إيرادات (داخل)' : 'مصروفات (خارج)'}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input type="number" label="المبلغ" value={tx.amount} onChange={e => setTx({...tx, amount: parseFloat(e.target.value)})} />
                    <Input type="date" label="التاريخ" value={tx.date} onChange={e => setTx({...tx, date: e.target.value})} />
                </div>
                <Input label="الوصف" value={tx.description} onChange={e => setTx({...tx, description: e.target.value})} placeholder="تفاصيل المعاملة..." />
                <div className="grid grid-cols-2 gap-4">
                    <Select label="الفئة" value={tx.category} onChange={e => setTx({...tx, category: e.target.value})}>
                        <option value="">اختر الفئة...</option>
                        {availCats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </Select>
                    <Select label="طريقة الدفع/الحساب" value={tx.paymentMethod} onChange={e => setTx({...tx, paymentMethod: e.target.value})}>
                        <option value="">اختر الحساب...</option>
                        {paymentMethods.map(pm => <option key={pm.id} value={pm.name}>{pm.name}</option>)}
                    </Select>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button onClick={() => onSave(tx)}>حفظ</Button>
                </div>
            </div>
        </Modal>
    );
};
