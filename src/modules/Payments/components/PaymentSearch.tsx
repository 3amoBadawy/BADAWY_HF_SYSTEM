
import React, { useState } from 'react';
import { Customer, SalesOrder } from '../../../types';
import { Card, Input } from '../../../components/common/UIComponents';
import { Search, Phone, FileText, X, Calendar } from 'lucide-react';

interface PaymentSearchProps {
    customers: Customer[];
    orders: SalesOrder[];
    selectedBranchId: string;
    onSelectCustomer: (c: Customer) => void;
    selectedCustomerId?: string;
}

type SearchType = 'all' | 'name' | 'phone' | 'contract';

const PaymentSearch: React.FC<PaymentSearchProps> = ({ customers, orders, selectedBranchId, onSelectCustomer, selectedCustomerId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredCustomers = customers.filter(c => {
        if (selectedBranchId !== 'HQ' && c.branchId !== selectedBranchId) return false;
        
        if (startDate || endDate) {
            const hasOrderInRange = orders.some(o => {
                if (o.customerId !== c.id) return false;
                const oDate = new Date(o.date).getTime();
                const start = startDate ? new Date(startDate).getTime() : 0;
                const end = endDate ? new Date(endDate).getTime() : Infinity;
                return oDate >= start && oDate <= end;
            });
            if (!hasOrderInRange) return false;
        }

        if (searchTerm.length < 2 && !startDate && !endDate) return false;
        if (searchTerm.length < 2) return true; 

        const term = searchTerm.toLowerCase();
        
        if (searchType === 'name') return c.name.toLowerCase().includes(term);
        if (searchType === 'phone') return c.mobile1.includes(term) || c.mobile2.includes(term);
        if (searchType === 'contract') return orders.some(o => o.customerId === c.id && o.manualContractId?.toLowerCase().includes(term));
        
        return c.name.toLowerCase().includes(term) || c.mobile1.includes(term) || orders.some(o => o.customerId === c.id && o.manualContractId?.toLowerCase().includes(term));
    });

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                 <label className="block text-sm font-bold text-slate-700">بحث عن عميل</label>
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setSearchType('all')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${searchType === 'all' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>الكل</button>
                    <button onClick={() => setSearchType('name')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${searchType === 'name' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>الاسم</button>
                    <button onClick={() => setSearchType('phone')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${searchType === 'phone' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>هاتف</button>
                    <button onClick={() => setSearchType('contract')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${searchType === 'contract' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>عقد</button>
                 </div>
            </div>
            
            <div className="space-y-3 mb-4">
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                        className="pr-12 pl-3 py-3 text-lg"
                        placeholder={searchType === 'contract' ? "أدخل رقم العقد..." : "بحث..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="date" 
                            className="w-full pr-10 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <span className="text-slate-400">-</span>
                    <div className="relative flex-1">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="date" 
                            className="w-full pr-10 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {(searchTerm.length >= 2 || startDate || endDate) && (
                <div className="border border-slate-200 rounded-xl shadow-sm overflow-hidden max-h-[400px] overflow-y-auto">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 flex justify-between">
                        <span>النتائج ({filteredCustomers.length})</span>
                        <button onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); }}><X className="w-3 h-3"/></button>
                    </div>
                    {filteredCustomers.length > 0 ? filteredCustomers.map(c => {
                        const bal = c.totalSales - c.totalPaid;
                        return (
                            <div key={c.id} onClick={() => { onSelectCustomer(c); }} className={`p-4 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center ${selectedCustomerId === c.id ? 'bg-indigo-50' : ''}`}>
                                <div>
                                    <h4 className="font-bold text-slate-900">{c.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {c.mobile1}</span>
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> #{c.id.slice(0,6)}</span>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-slate-500 font-bold">المستحق</p>
                                    <p className={`font-bold ${bal > 0 ? 'text-red-600' : 'text-emerald-600'}`}>${bal.toLocaleString()}</p>
                                </div>
                            </div>
                        );
                    }) : <div className="p-4 text-center text-slate-400 text-sm italic">لا توجد نتائج.</div>}
                </div>
            )}
        </Card>
    );
};

export default PaymentSearch;
