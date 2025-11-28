
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { SalesOrder, Transaction, Branch, WidgetType } from '../../types';
import { db } from '../../services/database';
import { CLASSES } from '../../styles/designSystem';
import { StatsCards } from './components/StatsCards';
import { FinancialChart } from './components/FinancialChart';
import ActivityFeed from './components/ActivityFeed';

interface DashboardProps {
    selectedBranchId: string;
    branches: Branch[];
}

const Dashboard: React.FC<DashboardProps> = ({ selectedBranchId, branches }) => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [config, setConfig] = useState<WidgetType[]>([]);

  useEffect(() => {
    setOrders(db.orders.getAll());
    setTransactions(db.transactions.getAll());
    const roleConfig = db.dashboardConfig.getAll().find(c => c.role === 'مسؤول النظام')?.visibleWidgets || [];
    setConfig(roleConfig.length > 0 ? roleConfig : ['REVENUE', 'ACTIVE_ORDERS', 'NET_PROFIT', 'RECEIVABLES', 'CHART_FINANCIAL', 'RECENT_ACTIVITY']);
  }, []); 

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const currencyCode = currentBranch?.currency || 'EGP';
  const currencySymbol = currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : 'ج.م';
  const formatCurrency = (val: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: currencyCode }).format(val);

  const filteredOrders = selectedBranchId === 'HQ' ? orders : orders.filter(o => o.branchId === selectedBranchId);
  const filteredTx = selectedBranchId === 'HQ' ? transactions : transactions.filter(t => t.branchId === selectedBranchId);

  return (
    <div className={CLASSES.pageContainer}>
      <header className={CLASSES.header}>
        <div>
          <h1 className={CLASSES.h1}>لوحة التحكم التنفيذية</h1>
          <div className="flex items-center gap-2 mt-2">
             <span className={CLASSES.textSecondary}>نظرة عامة لـ:</span>
             <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <MapPin className="w-3 h-3 text-indigo-500" /> {currentBranch.name}
             </span>
          </div>
        </div>
      </header>

      <StatsCards orders={filteredOrders} transactions={filteredTx} config={config} currency={formatCurrency} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            {config.includes('CHART_FINANCIAL') && <FinancialChart orders={filteredOrders} transactions={filteredTx} currencySymbol={currencySymbol} />}
        </div>

        {config.includes('RECENT_ACTIVITY') && (
            <div className="h-full">
                <ActivityFeed orders={filteredOrders} formatCurrency={formatCurrency} />
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
