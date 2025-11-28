
import React, { useState } from 'react';
import { User, Branch, GeoRegion, AccountCategory, PaymentMethod, Role, ProductCategory, SystemConfig, Department, EmployeeStatus } from '../../types';
import { Users, Building2, Shield, MapPin, CreditCard, Package, Globe, Briefcase, UserCheck } from 'lucide-react';
import { CLASSES } from '../../styles/designSystem';
import { PageHeader } from '../../components/common/UIComponents';
import BranchSettings from './components/BranchSettings';
import UserSettings from './components/UserSettings';
import RoleSettings from './components/RoleSettings';
import GeoSettings from './components/GeoSettings';
import FinancialSettings from './components/FinancialSettings';
import InventorySettings from './components/InventorySettings';
import GeneralSettings from './components/GeneralSettings';
import DepartmentSettings from './components/DepartmentSettings';
import HRSettings from './components/HRSettings';
import SettingsSidebar from './components/SettingsSidebar';

interface SettingsProps {
  branches: Branch[];
  users: User[];
  geoConfig: GeoRegion[];
  accountCategories: AccountCategory[];
  paymentMethods: PaymentMethod[];
  roles: Role[];
  productCategories: ProductCategory[];
  systemConfig?: SystemConfig;
  departments?: Department[];
  employeeStatuses?: EmployeeStatus[];
  onUpdateBranches: (branches: Branch[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateGeo: (geo: GeoRegion[]) => void;
  onUpdateCategories: (categories: AccountCategory[]) => void;
  onUpdatePaymentMethods: (methods: PaymentMethod[]) => void;
  onUpdateRoles: (roles: Role[]) => void;
  onUpdateProductCategories: (categories: ProductCategory[]) => void;
  onUpdateSystemConfig?: (config: SystemConfig[]) => void;
  onUpdateDepartments?: (depts: Department[]) => void;
  onUpdateEmployeeStatuses?: (statuses: EmployeeStatus[]) => void;
}

const Settings: React.FC<SettingsProps> = (props) => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
      { id: 'users', label: 'المستخدمين', icon: Users },
      { id: 'roles', label: 'الأدوار والصلاحيات', icon: Shield },
      { id: 'branches', label: 'الفروع', icon: Building2 },
      { id: 'departments', label: 'الأقسام', icon: Briefcase },
      { id: 'hr', label: 'إعدادات الموارد البشرية', icon: UserCheck },
      { id: 'geo', label: 'المواقع الجغرافية', icon: MapPin },
      { id: 'financial', label: 'الإعدادات المالية', icon: CreditCard },
      { id: 'inventory', label: 'تصنيفات المخزون', icon: Package },
      { id: 'general', label: 'إعدادات عامة', icon: Globe },
  ];

  return (
    <div className={CLASSES.pageContainer}>
      <PageHeader title="إعدادات النظام" subtitle="إدارة تفضيلات وتكوينات التطبيق." />

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} />

        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[500px]">
            {activeTab === 'users' && <UserSettings users={props.users} roles={props.roles} branches={props.branches} onUpdate={props.onUpdateUsers} />}
            {activeTab === 'branches' && <BranchSettings branches={props.branches} onUpdate={props.onUpdateBranches} />}
            {activeTab === 'roles' && <RoleSettings roles={props.roles} onUpdate={props.onUpdateRoles} />}
            {activeTab === 'departments' && props.departments && props.onUpdateDepartments && <DepartmentSettings departments={props.departments} onUpdate={props.onUpdateDepartments} />}
            {activeTab === 'hr' && props.employeeStatuses && props.systemConfig && props.onUpdateEmployeeStatuses && props.onUpdateSystemConfig && <HRSettings statuses={props.employeeStatuses} config={props.systemConfig} onUpdateStatuses={props.onUpdateEmployeeStatuses} onUpdateConfig={props.onUpdateSystemConfig} />}
            {activeTab === 'geo' && <GeoSettings geoConfig={props.geoConfig} onUpdate={props.onUpdateGeo} />}
            {activeTab === 'financial' && <FinancialSettings categories={props.accountCategories} paymentMethods={props.paymentMethods} branches={props.branches} onUpdateCategories={props.onUpdateCategories} onUpdateMethods={props.onUpdatePaymentMethods} />}
            {activeTab === 'inventory' && <InventorySettings categories={props.productCategories} onUpdate={props.onUpdateProductCategories} />}
            {activeTab === 'general' && props.systemConfig && props.onUpdateSystemConfig && <GeneralSettings geoConfig={props.geoConfig} config={props.systemConfig} onUpdate={props.onUpdateSystemConfig} />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
