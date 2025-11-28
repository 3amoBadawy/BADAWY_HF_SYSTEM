
import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { SalesOrder } from '../../../types';
import { Card, Button } from '../../../components/common/UIComponents';

interface ActivityFeedProps {
    orders: SalesOrder[];
    formatCurrency: (val: number) => string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ orders, formatCurrency }) => {
    const recentActivity = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <Card className="flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">النشاط الحديث</h3>
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] custom-scrollbar">
                {recentActivity.length > 0 ? recentActivity.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center text-slate-500 font-bold text-xs transition-colors">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">#{order.systemOrderId}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[120px]">{order.customerName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-bold text-slate-800 block text-sm">{formatCurrency(order.totalAmount)}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {order.status === 'Completed' ? 'مكتمل' : order.status === 'Pending' ? 'قيد الانتظار' : order.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <ShoppingBag className="w-12 h-12 mb-2 opacity-20"/>
                        <p className="text-sm italic">لا يوجد نشاط حديث.</p>
                    </div>
                )}
            </div>
            <Button variant="secondary" className="w-full mt-6 justify-between">
                عرض الكل <ArrowRight className="w-4 h-4"/>
            </Button>
        </Card>
    );
};

export default ActivityFeed;
