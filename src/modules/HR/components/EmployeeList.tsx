
import React, { useState, useEffect } from 'react';
import { Employee, SalesOrder, Transaction } from '../../../types';
import { Edit, Trash2, User, Calendar, DollarSign, ChevronLeft, ChevronRight, Hash, Clock, Percent } from 'lucide-react';
import { Button } from '../../../components/common/UIComponents';

interface EmployeeListProps {
    employees: Employee[];
    orders: SalesOrder[];
    transactions: Transaction[];
    onEdit: (emp: Employee) => void;
    onDelete: (id: string) => void;
    onManageFinance: (emp: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, orders, transactions, onEdit, onDelete, onManageFinance }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleMonthChange = (delta: number) => {
        const date = new Date(selectedMonth + '-01');
        date.setMonth(date.getMonth() + delta);
        setSelectedMonth(date.toISOString().slice(0, 7));
    };

    const formatMonth = (isoMonth: string) => {
        const [y, m] = isoMonth.split('-');
        return new Date(parseInt(y), parseInt(m) - 1).toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
    };
    
    const calcStats = (emp: Employee) => {
        const daysWorkedInMonth = emp.logs?.filter(l => l.date.startsWith(selectedMonth)).length || 0;
        const baseSalary = emp.salary || 0;
        const workingDays = emp.totalWorkingDays ?? 22; 
        const earnedSalary = (baseSalary / workingDays) * daysWorkedInMonth;
        const paidThisMonth = transactions
            .filter(t => t.employeeId === emp.id && t.type === 'Expense' && t.date.startsWith(selectedMonth))
            .reduce((sum, t) => sum + t.amount, 0);

        return { earnedSalary, daysWorkedInMonth, paidThisMonth };
    };

    const getTodayHours = (emp: Employee) => {
        const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const todaysLogs = emp.logs?.filter(l => l.date === todayStr) || [];
        let totalMs = 0;
        
        todaysLogs.forEach(log => {
            if (log.checkOut) {
                totalMs += new Date(log.checkOut).getTime() - new Date(log.checkIn).getTime();
            }
        });

        if (emp.isCheckedIn && emp.lastCheckInTime) {
            const lastCheckIn = new Date(emp.lastCheckInTime);
            totalMs += now.getTime() - lastCheckIn.getTime();
        }

        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        
        return { h, m, totalMs };
    };

    if (employees.length === 0) return <div className="p-10 text-center text-slate-400">لا يوجد موظفين حالياً.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 w-fit mx-auto shadow-sm">
                <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronRight className="w-5 h-5"/></button>
                <div className="flex items-center gap-2 font-bold text-slate-700 min-w-[150px] justify-center">
                    <Calendar className="w-4 h-4 text-indigo-500"/>
                    {formatMonth(selectedMonth)}
                </div>
                <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft className="w-5 h-5"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => {
                    const { earnedSalary, daysWorkedInMonth, paidThisMonth } = calcStats(emp);
                    const workingDaysRef = emp.totalWorkingDays ?? 22;
                    const progress = Math.min((daysWorkedInMonth / workingDaysRef) * 100, 100);
                    const todayStats = getTodayHours(emp);

                    return (
                        <div key={emp.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    {emp.avatarUrl ? <img src={emp.avatarUrl} className="w-12 h-12 rounded-full object-cover"/> : <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><User className="w-6 h-6"/></div>}
                                    {emp.isCheckedIn && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button onClick={() => onEdit(emp)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4"/></button>
                                    <button onClick={() => onDelete(emp.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    {emp.name} 
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center">
                                        <Hash className="w-3 h-3 mr-0.5"/> {emp.id.slice(0, 4)}
                                    </span>
                                </h3>
                                <p className="text-indigo-600 text-sm font-medium">{emp.role}</p>
                            </div>

                            {/* Today's Hours */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <Clock className="w-3.5 h-3.5 text-indigo-500"/> ساعات اليوم
                                </div>
                                <div className={`font-mono text-sm font-bold ${todayStats.totalMs > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {todayStats.h} س {todayStats.m} د
                                </div>
                            </div>

                            {/* Salary Info Bar */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">الراتب الأساسي</span>
                                    <span className="font-mono font-bold">${(emp.salary || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">أيام العمل الشهرية</span>
                                    <span className="font-mono font-bold">{workingDaysRef} يوم/شهر</span>
                                </div>
                                {emp.commissionRate && emp.commissionRate > 0 ? (
                                    <div className="flex justify-between text-xs bg-indigo-50 px-2 py-1 rounded text-indigo-700 font-medium">
                                        <span className="flex items-center gap-1"><Percent className="w-3 h-3"/> نسبة العمولة</span>
                                        <span className="font-bold">{emp.commissionRate}%</span>
                                    </div>
                                ) : null}
                                
                                <div className="w-full h-px bg-slate-100 my-1"></div>
                                <div className="flex justify-between text-xs items-center">
                                    <span className="text-emerald-600 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> مستحق (حتى الآن)</span>
                                    <span className="font-mono font-bold text-emerald-600">${(earnedSalary || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                                </div>
                                <div className="flex justify-between text-xs items-center">
                                    <span className="text-indigo-600 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> مدفوع (هذا الشهر)</span>
                                    <span className="font-mono font-bold text-indigo-600">${(paidThisMonth || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                                </div>
                                
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                                </div>
                                <div className="text-[10px] text-slate-400 text-right">{daysWorkedInMonth} / {workingDaysRef} يوم</div>
                            </div>

                            {/* Loan Warning */}
                            {emp.loanBalance && emp.loanBalance > 0 ? (
                                <div className="mb-4 text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded border border-amber-100 flex items-center justify-between">
                                    <span>سلف مستحقة:</span>
                                    <span className="font-bold">-${(emp.loanBalance || 0).toLocaleString()}</span>
                                </div>
                            ) : null}

                            <Button className="w-full mt-auto" variant="secondary" onClick={() => onManageFinance(emp)}>
                                <DollarSign className="w-4 h-4 ml-2"/> الإدارة المالية
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmployeeList;
