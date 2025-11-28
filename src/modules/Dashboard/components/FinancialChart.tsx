
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesOrder, Transaction } from '../../../types';
import { Card } from '../../../components/common/UIComponents';

interface FinancialChartProps {
    orders: SalesOrder[];
    transactions: Transaction[];
    currencySymbol: string;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ orders, transactions, currencySymbol }) => {
    const getLast6Months = () => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push(d.toLocaleString('ar-EG', { month: 'short' }));
        }
        return months;
    };
  
    const chartData = getLast6Months().map(month => {
        const monthOrders = orders.filter(o => {
            const d = new Date(o.date);
            return d.toLocaleString('ar-EG', { month: 'short' }) === month;
        });
        const revenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
        const monthExpenses = transactions.filter(t => {
            const d = new Date(t.date);
            return t.type === 'Expense' && d.toLocaleString('ar-EG', { month: 'short' }) === month;
        });
        const costs = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
  
        return { month, revenue, costs };
    });

    return (
        <Card className="min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">الأداء المالي (آخر 6 أشهر)</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${currencySymbol}${val/1000}k`}/>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        labelStyle={{textAlign: 'right'}}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="الإيرادات" />
                    <Area type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCosts)" name="المصروفات" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};
