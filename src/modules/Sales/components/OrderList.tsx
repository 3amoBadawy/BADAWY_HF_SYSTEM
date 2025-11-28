
import React, { useState } from 'react';
import { SalesOrder } from '../../../types';
import { Badge } from '../../../components/common/UIComponents';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface OrderListProps {
    orders: SalesOrder[];
    onSelectOrder: (order: SalesOrder) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onSelectOrder }) => {
    const [sortKey, setSortKey] = useState<keyof SalesOrder | 'systemOrderId'>('systemOrderId');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const handleSort = (key: keyof SalesOrder) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const sortedOrders = [...orders].sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        
        if (sortKey === 'date') {
            valA = new Date(a.date).getTime();
            valB = new Date(b.date).getTime();
        }

        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (sortDir === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });

    const SortIcon = ({ active }: { active: boolean }) => (
        active ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline mr-1"/> : <ChevronDown className="w-3 h-3 inline mr-1"/>) : null
    );

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('systemOrderId')}>رقم الطلب <SortIcon active={sortKey === 'systemOrderId'}/></th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('manualContractId')}>رقم العقد <SortIcon active={sortKey === 'manualContractId'}/></th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('customerName')}>العميل <SortIcon active={sortKey === 'customerName'}/></th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('date')}>التاريخ <SortIcon active={sortKey === 'date'}/></th>
                        <th className="p-4 text-left cursor-pointer hover:bg-slate-100" onClick={() => handleSort('totalAmount')}>الإجمالي <SortIcon active={sortKey === 'totalAmount'}/></th>
                        <th className="p-4 text-left cursor-pointer hover:bg-slate-100" onClick={() => handleSort('status')}>الحالة <SortIcon active={sortKey === 'status'}/></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {sortedOrders.length > 0 ? sortedOrders.map(o => (
                        <tr key={o.id} onClick={() => onSelectOrder(o)} className="hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                            <td className="p-4 font-mono font-bold text-indigo-600 text-right">#{o.systemOrderId}</td>
                            <td className="p-4 text-slate-500 text-right">{o.manualContractId || '-'}</td>
                            <td className="p-4 font-bold text-right">{o.customerName}</td>
                            <td className="p-4 text-slate-500 text-xs text-right">{o.date}</td>
                            <td className="p-4 text-left font-bold text-slate-900">${o.totalAmount.toLocaleString()}</td>
                            <td className="p-4 text-left">
                                <Badge variant={o.status === 'Completed' ? 'success' : o.status === 'Refunded' ? 'danger' : 'warning'}>
                                    {o.status === 'Completed' ? 'مكتمل' : o.status === 'Pending' ? 'قيد الانتظار' : o.status}
                                </Badge>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 italic">لا توجد طلبات مطابقة للبحث.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
