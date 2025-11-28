
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, Briefcase, Settings, LogOut, Armchair, BadgeDollarSign, ChevronDown, Receipt, X, CreditCard, Lock, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { ModuleType, Branch, User, SystemConfig } from '../../types';

interface SidebarProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  branches: Branch[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  currentUser: User | null;
  permissions: ModuleType[];
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  systemConfig?: SystemConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentModule, 
  onModuleChange, 
  branches, 
  selectedBranchId, 
  onBranchChange,
  currentUser,
  permissions,
  onLogout,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  systemConfig
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allMenuItems = [
    { id: ModuleType.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: ModuleType.SALES, label: 'طلبات المبيعات', icon: BadgeDollarSign },
    { id: ModuleType.PAYMENTS, label: 'المدفوعات', icon: CreditCard },
    { id: ModuleType.INVENTORY, label: 'المخزون والمنتجات', icon: Package },
    { id: ModuleType.ACCOUNTING, label: 'الحسابات والمصروفات', icon: Receipt },
    { id: ModuleType.CRM, label: 'العملاء (CRM)', icon: Users },
    { id: ModuleType.HR, label: 'الموارد البشرية (HR)', icon: Briefcase },
  ];

  const menuItems = allMenuItems.filter(item => permissions.includes(item.id));
  const canSwitchBranch = currentUser?.branchId === 'HQ';
  const showSettings = permissions.includes(ModuleType.SETTINGS);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - RTL Adjusted */}
      <div className={`
        fixed right-0 top-0 bottom-0 z-40 bg-slate-900 text-slate-300 shadow-2xl flex flex-col transition-all duration-300 ease-in-out border-l border-slate-800 print:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        md:translate-x-0 md:right-0
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Brand Header */}
        <div className={`h-20 flex items-center border-b border-slate-800 bg-slate-950/50 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <div className="flex items-center gap-3 text-white overflow-hidden whitespace-nowrap">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                <Armchair className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
                <div className="animate-in fade-in duration-200">
                    <h1 className="text-xl font-bold tracking-tight">{systemConfig?.companyName || 'فورني فلو'}</h1>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">إدارة المؤسسة</p>
                </div>
            )}
          </div>
          {/* Close Button for Mobile */}
          <button onClick={onClose} className="md:hidden mr-auto text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Branch Selector */}
        <div className={`pt-6 pb-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2 mb-2 block text-right animate-in fade-in">الفرع الحالي</label>}
          <div className="relative">
            {canSwitchBranch ? (
              <div className="relative group">
                {/* Changed to bg-white and text-slate-900 to ensure visibility */}
                <select 
                  value={selectedBranchId}
                  onChange={(e) => onBranchChange(e.target.value)}
                  className={`w-full appearance-none bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm
                    ${isCollapsed ? 'p-2 text-transparent opacity-0 absolute inset-0 z-10' : 'p-3 ps-4 pe-8'}
                  `}
                >
                    {branches.map(b => (
                        <option key={b.id} value={b.id} className="text-slate-900 font-medium">
                            {b.name}
                        </option>
                    ))}
                </select>
                
                {isCollapsed ? (
                    <div className="w-full h-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center pointer-events-none">
                        <span className="font-bold text-white text-xs">{selectedBranchId.substring(0, 2)}</span>
                    </div>
                ) : (
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                )}
              </div>
            ) : (
              <div className={`bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-medium rounded-xl flex items-center cursor-not-allowed ${isCollapsed ? 'justify-center p-2' : 'p-3 ps-4 justify-between'}`}>
                  {!isCollapsed ? (
                      <>
                        <span className="truncate">{branches.find(b => b.id === currentUser?.branchId)?.name || 'غير معروف'}</span>
                        <Lock className="w-3 h-3 opacity-50" />
                      </>
                  ) : <Lock className="w-4 h-4 opacity-50" />}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {!isCollapsed && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-3 mb-2 mt-4 block text-right animate-in fade-in">الوحدات</label>}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative font-medium text-sm ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className={`w-5 h-5 transition-colors shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {!isCollapsed && <span className="whitespace-nowrap animate-in fade-in">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Clock Section */}
        <div className="border-t border-slate-800 bg-slate-900/50 py-3 text-center overflow-hidden">
            {isCollapsed ? (
                <div className="flex flex-col items-center gap-1 text-[10px] font-mono text-slate-500">
                    <span>{time.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
            ) : (
                <div className="animate-in fade-in">
                    <div className="text-xl font-bold text-white tracking-widest font-mono flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500 animate-pulse"/>
                        {time.toLocaleTimeString('ar-EG')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">
                        {time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            )}
        </div>

        {/* Bottom Actions */}
        <div className={`p-4 border-t border-slate-800 space-y-2 bg-slate-950/30 ${isCollapsed ? 'px-2' : ''}`}>
          {showSettings && (
              <button 
                  onClick={() => onModuleChange(ModuleType.SETTINGS)}
                  title={isCollapsed ? 'الإعدادات' : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${currentModule === ModuleType.SETTINGS ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                  <Settings className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>الإعدادات</span>}
              </button>
          )}
          <button 
              onClick={onLogout}
              title={isCollapsed ? 'تسجيل الخروج' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
          >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
        
        {/* User Profile & Collapse Toggle */}
        <div className="bg-slate-950 border-t border-slate-800 relative">
            {/* Collapse Button */}
            <button 
                onClick={onToggleCollapse}
                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 bg-slate-800 text-slate-400 hover:text-white p-1 rounded-full border border-slate-700 shadow-sm z-50 transition-colors"
            >
                {isCollapsed ? <ChevronLeft className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
            </button>

            <div className={`p-4 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-slate-800 text-white shrink-0">
                    {currentUser?.name.charAt(0)}
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden animate-in fade-in">
                        <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            {currentUser?.role}
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
