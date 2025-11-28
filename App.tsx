
import React from 'react';
import Sidebar from './src/components/layout/Sidebar';
import Dashboard from './src/modules/Dashboard/Dashboard';
import Inventory from './src/modules/Inventory/Inventory';
import CRM from './src/modules/CRM/CRM';
import HR from './src/modules/HR/HR';
import Sales from './src/modules/Sales/Sales';
import Settings from './src/modules/Settings/Settings';
import Login from './src/modules/Auth/Login';
import Accounting from './src/modules/Accounting/Accounting';
import Payments from './src/modules/Payments/Payments';
import VersionFooter from './src/components/layout/VersionFooter';
import { ModuleType } from './src/types';
import { Menu, Armchair } from 'lucide-react';
import { useAppStore } from './src/hooks/useAppStore';

const App: React.FC = () => {
  const { state, actions } = useAppStore();

  const renderContent = () => {
    switch (state.currentModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard selectedBranchId={state.selectedBranchId} branches={state.branches} />;
      case ModuleType.SALES:
        return (
          <Sales 
            selectedBranchId={state.selectedBranchId} 
            paymentMethods={state.paymentMethods} 
            productCategories={state.productCategories} 
            geoConfig={state.geoConfig} 
            branches={state.branches}
            accountCategories={state.accountCategories}
            systemConfig={state.systemConfig}
          />
        );
      case ModuleType.INVENTORY:
        return <Inventory selectedBranchId={state.selectedBranchId} productCategories={state.productCategories} />;
      case ModuleType.ACCOUNTING:
        return <Accounting selectedBranchId={state.selectedBranchId} categories={state.accountCategories} paymentMethods={state.paymentMethods} />;
      case ModuleType.CRM:
        return <CRM selectedBranchId={state.selectedBranchId} geoConfig={state.geoConfig} paymentMethods={state.paymentMethods} />;
      case ModuleType.PAYMENTS:
        return <Payments selectedBranchId={state.selectedBranchId} paymentMethods={state.paymentMethods} />;
      case ModuleType.HR:
        return (
          <HR 
            selectedBranchId={state.selectedBranchId} 
            branches={state.branches} 
            paymentMethods={state.paymentMethods} 
            accountCategories={state.accountCategories}
            departments={state.departments}
            statuses={state.employeeStatuses}
            systemConfig={state.systemConfig}
          />
        );
      case ModuleType.SETTINGS:
        return (
          <Settings 
            branches={state.branches} 
            users={state.users} 
            geoConfig={state.geoConfig}
            accountCategories={state.accountCategories}
            paymentMethods={state.paymentMethods}
            roles={state.roles}
            productCategories={state.productCategories}
            systemConfig={state.systemConfig}
            departments={state.departments}
            employeeStatuses={state.employeeStatuses}
            onUpdateBranches={actions.setBranches}
            onUpdateUsers={actions.setUsers}
            onUpdateGeo={actions.setGeoConfig}
            onUpdateCategories={actions.setAccountCategories}
            onUpdatePaymentMethods={actions.setPaymentMethods}
            onUpdateRoles={actions.setRoles}
            onUpdateProductCategories={actions.setProductCategories}
            onUpdateSystemConfig={actions.setSystemConfig}
            onUpdateDepartments={actions.setDepartments}
            onUpdateEmployeeStatuses={actions.setEmployeeStatuses}
          />
        );
      default:
        return <Dashboard selectedBranchId={state.selectedBranchId} branches={state.branches} />;
    }
  };

  if (!state.isAuthenticated) return <Login onLogin={actions.handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex" dir="rtl">
      <Sidebar 
        currentModule={state.currentModule} 
        onModuleChange={(module) => { actions.setCurrentModule(module); actions.setIsMobileMenuOpen(false); }}
        branches={state.branches}
        selectedBranchId={state.selectedBranchId}
        onBranchChange={actions.setSelectedBranchId}
        currentUser={state.currentUser}
        permissions={state.permissions}
        onLogout={actions.handleLogout}
        isOpen={state.isMobileMenuOpen}
        onClose={() => actions.setIsMobileMenuOpen(false)}
        isCollapsed={state.isSidebarCollapsed}
        onToggleCollapse={() => actions.setIsSidebarCollapsed(!state.isSidebarCollapsed)}
        systemConfig={state.systemConfig}
      />
      
      {/* 
        Main content adjustment:
        mr-0 for mobile (sidebar hidden)
        md:mr-72 when expanded
        md:mr-20 when collapsed
      */}
      <main className={`flex-1 p-4 md:p-8 h-screen overflow-y-auto transition-all duration-300 mr-0 ${state.isSidebarCollapsed ? 'md:mr-20' : 'md:mr-72'} flex flex-col print:mr-0 print:p-0`}>
        <div className="md:hidden flex items-center justify-between mb-6 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-2 print:hidden">
            <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg"><Armchair className="text-white w-5 h-5"/></div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">{state.systemConfig?.companyName || 'فورني فلو'}</span>
            </div>
            <button onClick={() => actions.setIsMobileMenuOpen(true)} className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm"><Menu className="w-6 h-6 text-slate-700" /></button>
        </div>
        <div className="max-w-7xl mx-auto pb-4 w-full flex-1">{renderContent()}</div>
        <div className="print:hidden"><VersionFooter /></div>
      </main>
    </div>
  );
};

export default App;
