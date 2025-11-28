
import React, { useState } from 'react';
import { MapPin, Plus, Fingerprint, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Employee, SalesOrder, Transaction, Branch, PaymentMethod, AccountCategory, Department, EmployeeStatus, SystemConfig } from '../../types';
import { db } from '../../services/database';
import { Button, Select, PageHeader } from '../../components/common/UIComponents';
import { CLASSES } from '../../styles/designSystem';

import AttendanceKiosk from './components/AttendanceKiosk';
import EmployeeModal from './components/EmployeeModal';
import FinanceModal from './components/FinanceModal';
import EmployeeList from './components/EmployeeList';
import LiveAttendance from './components/LiveAttendance';
import TeamAttendanceCalendar from './components/TeamAttendanceCalendar';

interface HRProps {
    selectedBranchId: string;
    branches: Branch[];
    paymentMethods: PaymentMethod[];
    accountCategories: AccountCategory[];
    departments?: Department[]; 
    statuses?: EmployeeStatus[];
    systemConfig?: SystemConfig;
}

const HR: React.FC<HRProps> = ({ selectedBranchId, branches, paymentMethods, accountCategories, departments = [], statuses = [], systemConfig }) => {
  const [activeTab, setActiveTab] = useState<'personnel' | 'attendance'>('personnel');
  const [attendanceView, setAttendanceView] = useState<'live' | 'calendar'>('live');
  const [employees, setEmployees] = useState<Employee[]>(() => db.employees.getAll());
  const [orders, setOrders] = useState<SalesOrder[]>(() => db.orders.getAll()); 
  const [transactions, setTransactions] = useState<Transaction[]>(() => db.transactions.getAll());
  
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Partial<Employee> | undefined>(undefined);
  
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [selectedFinanceEmp, setSelectedFinanceEmp] = useState<Employee | null>(null);
  
  const [isKioskOpen, setIsKioskOpen] = useState(false);

  const filteredEmployees = employees
    .filter(e => selectedBranchId === 'HQ' || e.branchId === selectedBranchId)
    .filter(e => deptFilter === 'All' || e.department === deptFilter)
    .filter(e => statusFilter === 'All' || e.status === statusFilter);

  // --- HANDLERS ---

  const handleSaveEmployee = (data: Partial<Employee>) => {
      let updated: Employee[];
      if (data.id) {
          updated = employees.map(e => e.id === data.id ? { ...e, ...data } as Employee : e);
      } else {
          updated = [...employees, { ...data, id: `emp-${Date.now()}`, logs: [], isCheckedIn: false, loanBalance: 0 } as Employee];
      }
      setEmployees(updated);
      db.employees.save(updated);
      setIsEmpModalOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
      if(confirm("هل أنت متأكد من حذف الموظف؟")) {
          const updated = employees.filter(e => e.id !== id);
          setEmployees(updated);
          db.employees.save(updated);
      }
  };

  const handleProcessPayment = (
      amount: number, 
      type: 'Salary' | 'Commission' | 'Advance' | 'Bonus', 
      note: string, 
      method: string, 
      orderOverrides?: { orderId: string, amount: number }[]
    ) => {
      if (!selectedFinanceEmp) return;

      // Map internal types to Arabic Category Names defined in seed.ts/Settings
      const categoryMap: Record<string, string> = {
          'Salary': 'رواتب',
          'Commission': 'عمولات',
          'Advance': 'سلف موظفين',
          'Bonus': 'رواتب' // Bonus usually falls under salaries
      };

      const newTx: Transaction = {
          id: `PAY-${Date.now()}`, 
          date: new Date().toISOString().split('T')[0],
          description: note,
          amount, 
          type: 'Expense', 
          category: categoryMap[type] || 'عام', 
          status: 'Completed',
          branchId: selectedFinanceEmp.branchId, 
          employeeId: selectedFinanceEmp.id, 
          paymentMethod: method
      };

      const updatedTxs = [newTx, ...transactions];
      setTransactions(updatedTxs);
      db.transactions.save(updatedTxs);

      // Update Employee Data
      let updatedEmps = [...employees];
      
      // If Advance, increase loan balance
      if (type === 'Advance') {
          updatedEmps = updatedEmps.map(e => e.id === selectedFinanceEmp.id ? { ...e, loanBalance: (e.loanBalance || 0) + amount } : e);
      }
      
      // Update Orders (Commission)
      if (type === 'Commission' && orderOverrides) {
          const updatedOrders = orders.map(o => {
              const override = orderOverrides.find(ov => ov.orderId === o.id);
              if (override) {
                  return { 
                      ...o, 
                      isCommissionPaid: true, 
                      commissionPaidDate: new Date().toISOString(),
                      commissionOverrideAmount: override.amount
                  };
              }
              return o;
          });
          setOrders(updatedOrders);
          db.orders.save(updatedOrders);
      }

      setEmployees(updatedEmps);
      db.employees.save(updatedEmps);

      // Refresh Modal Data
      setSelectedFinanceEmp(updatedEmps.find(e => e.id === selectedFinanceEmp.id) || null);
      alert(`تم تسجيل دفع ${type === 'Salary' ? 'الراتب' : type === 'Commission' ? 'العمولة' : 'المبلغ'} بنجاح!`);
  };

  const handleCheckAction = (emp: Employee, action: 'in' | 'out') => {
      const now = new Date();
      // Get Local YYYY-MM-DD to prevent UTC rollover issues
      const localDateKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      
      let updatedLogs = emp.logs ? [...emp.logs] : [];
      let addedDays = 0;

      if (action === 'in') {
          updatedLogs.push({ date: localDateKey, checkIn: now.toISOString() });
      } else {
          const last = updatedLogs[updatedLogs.length - 1];
          if (last && !last.checkOut) {
              const duration = (now.getTime() - new Date(last.checkIn).getTime()) / 36e5;
              last.checkOut = now.toISOString();
              last.durationHours = duration;
              if (duration > 4) addedDays = 1; // Simple rule: >4 hours counts as a day
          }
      }

      const updated = employees.map(e => e.id === emp.id ? { ...e, isCheckedIn: action === 'in', lastCheckInTime: action === 'in' ? now.toISOString() : undefined, logs: updatedLogs, attendanceDays: (e.attendanceDays || 0) + addedDays } : e);
      setEmployees(updated);
      db.employees.save(updated);
  };

  return (
    <div className={CLASSES.pageContainer}>
       <PageHeader 
        title="إدارة الموارد البشرية"
        subtitle={
            <div className="flex items-center gap-2">
                <span>شؤون الموظفين والرواتب. عرض:</span>
                <span className="font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedBranchId}
                </span>
            </div>
        }
        actions={
            <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setIsKioskOpen(true)}><Fingerprint className="w-5 h-5 ml-2"/> جهاز البصمة</Button>
                <Button onClick={() => { setEditingEmp(undefined); setIsEmpModalOpen(true); }}><Plus className="w-5 h-5 ml-2"/> إضافة موظف</Button>
            </div>
        }
       />

      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
              <button onClick={() => setActiveTab('personnel')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'personnel' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}>الموظفين</button>
              <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'attendance' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}>الحضور والانصراف</button>
          </div>
          
          {activeTab === 'personnel' ? (
              <div className="flex gap-2">
                  <Select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                      <option value="All">كل الأقسام</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </Select>
                   <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                      <option value="All">كل الحالات</option>
                      {statuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
              </div>
          ) : (
             <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button onClick={() => setAttendanceView('live')} className={`p-2 rounded-md ${attendanceView === 'live' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'}`} title="عرض مباشر"><Clock className="w-4 h-4"/></button>
                <button onClick={() => setAttendanceView('calendar')} className={`p-2 rounded-md ${attendanceView === 'calendar' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'}`} title="التقويم"><CalendarIcon className="w-4 h-4"/></button>
             </div>
          )}
      </div>

      {activeTab === 'personnel' ? (
          <EmployeeList 
            employees={filteredEmployees} 
            orders={orders} 
            transactions={transactions}
            onEdit={(e) => { setEditingEmp(e); setIsEmpModalOpen(true); }}
            onDelete={(id) => handleDeleteEmployee(id)}
            onManageFinance={(e) => { setSelectedFinanceEmp(e); setIsFinanceModalOpen(true); }}
          />
      ) : (
          attendanceView === 'live' ? <LiveAttendance employees={filteredEmployees} /> : <TeamAttendanceCalendar employees={filteredEmployees} />
      )}

      <EmployeeModal 
        isOpen={isEmpModalOpen} 
        onClose={() => setIsEmpModalOpen(false)} 
        onSave={handleSaveEmployee} 
        initialData={editingEmp} 
        branches={branches} 
        departments={departments}
        statuses={statuses}
        defaultWorkingDays={systemConfig?.standardMonthlyWorkingDays}
      />
      
      {selectedFinanceEmp && (
          <FinanceModal 
            isOpen={isFinanceModalOpen} 
            onClose={() => setIsFinanceModalOpen(false)} 
            employee={selectedFinanceEmp} 
            orders={orders} 
            transactions={transactions}
            paymentMethods={paymentMethods}
            onProcessPayment={handleProcessPayment}
          />
      )}

      <AttendanceKiosk isOpen={isKioskOpen} onClose={() => setIsKioskOpen(false)} employees={filteredEmployees} branches={branches} onCheckAction={handleCheckAction} />
    </div>
  );
};

export default HR;
