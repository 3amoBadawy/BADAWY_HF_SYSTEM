
import React, { useState } from 'react';
import { Customer, PaymentMethod } from '../../../types';
import { Card, Button, Input } from '../../../components/common/UIComponents';
import { CreditCard, User, DollarSign, Upload, Image as ImageIcon, CheckCircle, X } from 'lucide-react';

interface PaymentTerminalProps {
    customer: Customer | null;
    paymentMethods: PaymentMethod[];
    selectedBranchId: string;
    onProcess: (amount: number, method: string, note: string, contractImg: string, receiptImg: string) => void;
}

const PaymentTerminal: React.FC<PaymentTerminalProps> = ({ customer, paymentMethods, selectedBranchId, onProcess }) => {
    const [amount, setAmount] = useState<number>(0);
    const [method, setMethod] = useState('');
    const [note, setNote] = useState('');
    const [contractImg, setContractImg] = useState('');
    const [receiptImg, setReceiptImg] = useState('');

    const balance = customer ? customer.totalSales - customer.totalPaid : 0;
    
    const availMethods = paymentMethods.filter(pm => !pm.branchId || pm.branchId === 'HQ' || pm.branchId === (selectedBranchId === 'HQ' ? (customer?.branchId || 'NY') : selectedBranchId));

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setImg: (s: string) => void) => {
        if(e.target.files?.[0]) {
            const r = new FileReader();
            r.onload = () => setImg(r.result as string);
            r.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if(!amount || !method) return;
        onProcess(amount, method, note, contractImg, receiptImg);
        setAmount(0); setMethod(''); setNote(''); setContractImg(''); setReceiptImg('');
    };

    if (!customer) return (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 h-full min-h-[400px]">
            <User className="w-16 h-16 mb-4 opacity-20"/>
            <p>اختر عميلاً للبدء في عملية الدفع.</p>
        </div>
    );

    return (
        <Card className="sticky top-6 border-indigo-200 shadow-lg shadow-indigo-50/50">
            <div className="border-b border-indigo-100 pb-4 mb-4">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2"><CreditCard className="w-5 h-5"/> محطة الدفع</h2>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-indigo-600"/>
                    <span className="font-bold text-indigo-900">{customer.name}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded border border-indigo-100 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">الرصيد المستحق</span>
                    <span className={`text-xl font-bold ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>${balance.toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">المبلغ ($)</label>
                    <div className="relative">
                        <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input type="number" className="pr-10 text-lg font-bold" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} placeholder="0.00" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الطريقة</label>
                    <div className="grid grid-cols-2 gap-2">
                        {availMethods.map(pm => (
                            <button key={pm.id} onClick={() => setMethod(pm.name)} className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${method === pm.name ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                                {pm.name}
                            </button>
                        ))}
                    </div>
                </div>

                <Input label="ملاحظات" placeholder="اختياري..." value={note} onChange={e => setNote(e.target.value)} />

                <div className="grid grid-cols-2 gap-3 pt-2">
                    {[ {label: 'العقد', val: contractImg, set: setContractImg, icon: Upload}, {label: 'الإيصال', val: receiptImg, set: setReceiptImg, icon: ImageIcon} ].map((f, i) => (
                        <div key={i}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{f.label}</label>
                            {f.val ? (
                                <div className="relative group h-20">
                                    <img src={f.val} className="w-full h-full object-cover rounded-lg border border-slate-200"/>
                                    <button onClick={() => f.set('')} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded shadow opacity-0 group-hover:opacity-100"><X className="w-3 h-3"/></button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                                    <f.icon className="w-5 h-5 text-slate-400 mb-1"/>
                                    <span className="text-[10px] text-slate-500">رفع</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, f.set)} />
                                </label>
                            )}
                        </div>
                    ))}
                </div>

                <Button className="w-full py-4 mt-4" onClick={handleSubmit} disabled={!amount || !method}>
                    <CheckCircle className="w-5 h-5 ml-2"/> تأكيد الدفع
                </Button>
            </div>
        </Card>
    );
};

export default PaymentTerminal;
