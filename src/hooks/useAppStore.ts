
import { useState } from 'react';
import { db } from '../services/database';
import { User, Branch, GeoRegion, AccountCategory, PaymentMethod, Role, ProductCategory, ModuleType, SystemConfig, Department, Supplier, PurchaseOrder, EmployeeStatus } from '../types';

export const useAppStore = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App Data State
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [branches, setBranches] = useState<Branch[]>(() => db.branches.getAll());
  const [users, setUsers] = useState<User[]>(() => db.users.getAll());
  const [geoConfig, setGeoConfig] = useState<GeoRegion[]>(() => db.geo.getAll());
  const [accountCategories, setAccountCategories] = useState<AccountCategory[]>(() => db.categories.getAll());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => db.paymentMethods.getAll());
  const [roles, setRoles] = useState<Role[]>(() => db.roles.getAll());
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(() => db.productCategories.getAll());
  const [systemConfig, setSystemConfig] = useState<SystemConfig[]>(() => db.systemConfig.getAll());
  const [departments, setDepartments] = useState<Department[]>(() => db.departments.getAll());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => db.suppliers.getAll());
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => db.pos.getAll());
  const [employeeStatuses, setEmployeeStatuses] = useState<EmployeeStatus[]>(() => db.employeeStatuses.getAll());
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('HQ');

  // Derived State
  const currentUserRole = roles.find(r => r.name === currentUser?.role);
  const permissions = currentUserRole?.permissions || [];
  
  // Helper to get active config object
  const activeConfig = systemConfig[0];

  // Handlers
  const handleLogin = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (user.branchId !== 'HQ') {
      setSelectedBranchId(user.branchId);
    } else {
      setSelectedBranchId('HQ');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentModule(ModuleType.DASHBOARD);
  };

  const actions = {
    setBranches: (data: Branch[]) => { setBranches(data); db.branches.save(data); },
    setUsers: (data: User[]) => { setUsers(data); db.users.save(data); },
    setGeoConfig: (data: GeoRegion[]) => { setGeoConfig(data); db.geo.save(data); },
    setAccountCategories: (data: AccountCategory[]) => { setAccountCategories(data); db.categories.save(data); },
    setPaymentMethods: (data: PaymentMethod[]) => { setPaymentMethods(data); db.paymentMethods.save(data); },
    setRoles: (data: Role[]) => { setRoles(data); db.roles.save(data); },
    setProductCategories: (data: ProductCategory[]) => { setProductCategories(data); db.productCategories.save(data); },
    setSystemConfig: (data: SystemConfig[]) => { setSystemConfig(data); db.systemConfig.save(data); },
    setDepartments: (data: Department[]) => { setDepartments(data); db.departments.save(data); },
    setSuppliers: (data: Supplier[]) => { setSuppliers(data); db.suppliers.save(data); },
    setPurchaseOrders: (data: PurchaseOrder[]) => { setPurchaseOrders(data); db.pos.save(data); },
    setEmployeeStatuses: (data: EmployeeStatus[]) => { setEmployeeStatuses(data); db.employeeStatuses.save(data); },
    
    // UI Actions
    setCurrentModule,
    setIsMobileMenuOpen,
    setIsSidebarCollapsed,
    setSelectedBranchId,
    handleLogin,
    handleLogout
  };

  return {
    state: {
      isAuthenticated,
      currentUser,
      currentModule,
      branches,
      users,
      geoConfig,
      accountCategories,
      paymentMethods,
      roles,
      productCategories,
      systemConfig: activeConfig, // Expose the single object directly
      departments,
      suppliers,
      purchaseOrders,
      employeeStatuses,
      isMobileMenuOpen,
      isSidebarCollapsed,
      selectedBranchId,
      permissions
    },
    actions
  };
};
