
import React, { useState } from 'react';
import { Customer } from '../../../types';
import { Badge, Input, Button } from '../../../components/common/UIComponents';
import { MapPin, Search, Plus } from 'lucide-react';
import { CLASSES } from '../../../styles/designSystem';

interface CustomerListProps {
    customers: Customer[];
    selectedId: string | undefined;
    onSelect: (c: Customer) => void;
    onAdd: () => void;
    branchName: string;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, selectedId, onSelect, onAdd, branchName }) => {
    const [search, setSearch] = useState('');

    const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile1.includes(search));

    return (
        <div className="w-full md:w-1/3 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className={CLASSES.h3}>العملاء</h2>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500"><MapPin className="w-3 h-3"/> {branchName}</div>
                    </div>
                    <Button onClick={onAdd} className="p-2"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input className="pr-10" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {filtered.map(c => (
                    <div key={c.id} onClick={() => onSelect(c)} className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedId === c.id ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-300' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-slate-900">{c.name}</h3>
                            <Badge variant={(c.totalSales - c.totalPaid) > 0 ? 'danger' : 'success'}>{(c.totalSales - c.totalPaid) > 0 ? 'عليه مستحقات' : 'خالص'}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{c.mobile1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerList;
