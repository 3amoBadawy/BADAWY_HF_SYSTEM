
import React, { useState } from 'react';
import { AccountCategory, PaymentMethod, Branch } from '../../../types';
import { Button, Input, Select, Badge, SettingsRow } from '../../../components/common/UIComponents';
import { Plus } from 'lucide-react';

interface FinancialSettingsProps {
    categories: AccountCategory[];
    paymentMethods: PaymentMethod[];
    branches: Branch[];
    onUpdateCategories: (c: AccountCategory[]) => void;
    onUpdateMethods: (pm: PaymentMethod[]) => void;
}

const FinancialSettings: React.FC<FinancialSettingsProps> = ({ categories, paymentMethods, branches, onUpdateCategories, onUpdateMethods }) => {
    const [newCat, setNewCat] = useState<{name: string, type: 'Income'|'Expense'|'Both'}>({ name: '', type: 'Expense' });
    const [newMethod, setNewMethod] = useState<{name: string, branchId: string}>({ name: '', branchId: 'HQ' });

    const addCat = () => {
        if(!newCat.name) return;
        onUpdateCategories([...categories, { id: `cat_${Date.now()}`, ...newCat }]);
        setNewCat({ name: '', type: 'Expense' });
    };

    const addMethod = () => {
        if(!newMethod.name) return;
        onUpdateMethods([...paymentMethods, { id: `pm_${Date.now()}`, ...newMethod }]);
        setNewMethod({ name: '', branchId: 'HQ' });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">فئات الحسابات</h3>
                <div className="flex gap-2 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Input placeholder="اسم الفئة" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
                    <Select value={newCat.type} onChange={e => setNewCat({...newCat, type: e.target.value as any})}>
                        <option value="Expense">مصروفات</option><option value="Income">إيرادات</option><option value="Both">كلاهما</option>
                    </Select>
                    <Button onClick={addCat}><Plus className="w-4 h-4"/></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map(c => (
                        <SettingsRow
                            key={c.id}
                            title={c.name}
                            onDelete={() => onUpdateCategories(categories.filter(x => x.id !== c.id))}
                        >
                            <Badge>{c.type}</Badge>
                        </SettingsRow>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">طرق الدفع</h3>
                <div className="flex gap-2 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Input placeholder="اسم الطريقة (مثلاً كاش، فيزا)" value={newMethod.name} onChange={e => setNewMethod({...newMethod, name: e.target.value})} />
                    <Select value={newMethod.branchId} onChange={e => setNewMethod({...newMethod, branchId: e.target.value})}>
                        <option value="HQ">عام (كل الفروع)</option>
                        {branches.filter(b => b.id !== 'HQ').map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                    <Button onClick={addMethod}><Plus className="w-4 h-4"/></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentMethods.map(pm => (
                        <SettingsRow
                            key={pm.id}
                            title={pm.name}
                            subtitle={pm.branchId === 'HQ' || !pm.branchId ? 'عام' : pm.branchId}
                            onDelete={() => onUpdateMethods(paymentMethods.filter(x => x.id !== pm.id))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinancialSettings;
