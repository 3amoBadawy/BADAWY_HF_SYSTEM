
import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';
import { SalesOrder, Transaction, WidgetType } from '../../../types';
import { Card } from '../../../components/common/UIComponents';

interface StatsCardsProps {
    orders: SalesOrder[];
    transactions: Transaction[];
    config: WidgetType[];
    currency: (val: number) => string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ orders, transactions, config, currency }) => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Partial').length;
    
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = income - expense;
    
    const receivables = orders.reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0);

    const cards = [
        {
            id: 'REVENUE' as WidgetType,
            title: 'إجمالي الإيرادات',
            value: currency(totalRevenue),
            icon: DollarSign,
            color: 'indigo',
            footer: <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {orders.length} طلب</span>
        },
        {
            id: 'ACTIVE_ORDERS' as WidgetType,
            title: 'طلبات نشطة',
            value: activeOrders,
            icon: ShoppingBag,
            color: 'blue',
            footer: <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2"><div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div></div>
        },
        {
            id: 'NET_PROFIT' as WidgetType,
            title: 'صافي الربح',
            value: currency(netProfit),
            valueClass: netProfit >= 0 ? 'text-emerald-600' : 'text-red-600',
            icon: TrendingUp,
            color: 'emerald',
            footer: <div className="text-xs text-slate-400 flex gap-2"><span className="text-emerald-600 font-medium">+{currency(income)}</span><span>|</span><span className="text-red-500 font-medium">-{currency(expense)}</span></div>
        },
        {
            id: 'RECEIVABLES' as WidgetType,
            title: 'مستحقات (آجل)',
            value: currency(receivables),
            icon: Activity,
            color: 'amber',
            footer: <div className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded w-fit">بانتظار التحصيل</div>
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.filter(c => config.includes(c.id)).map(c => {
                const Icon = c.icon;
                const colors: Record<string, string> = {
                    indigo: 'bg-indigo-50 text-indigo-600 group-hover:border-indigo-300',
                    blue: 'bg-blue-50 text-blue-600 group-hover:border-blue-300',
                    emerald: 'bg-emerald-50 text-emerald-600 group-hover:border-emerald-300',
                    amber: 'bg-amber-50 text-amber-600 group-hover:border-amber-300'
                };
                return (
                    <Card key={c.id} className={`relative overflow-hidden group transition-colors border border-transparent ${colors[c.color].split(' ').pop()}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500">{c.title}</p>
                                <p className={`text-3xl font-bold text-slate-900 tracking-tight ${c.valueClass || ''}`}>{c.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${colors[c.color].split(' ').slice(0, 2).join(' ')}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {c.footer}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
