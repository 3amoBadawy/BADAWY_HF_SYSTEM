
import { InventoryItem, Customer, Employee, SalesOrder, Branch, User, Transaction, GeoRegion, AccountCategory, PaymentMethod, Role, ProductCategory, DashboardRoleConfig, SystemConfig, Department, Supplier, PurchaseOrder, EmployeeStatus } from '../types';
import { 
  INITIAL_INVENTORY, 
  INITIAL_CUSTOMERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_ORDERS, 
  INITIAL_BRANCHES, 
  INITIAL_USERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_GEO_CONFIG, 
  INITIAL_CATEGORIES, 
  INITIAL_PAYMENT_METHODS, 
  INITIAL_ROLES, 
  INITIAL_PRODUCT_CATEGORIES, 
  INITIAL_DASHBOARD_CONFIG,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_DEPARTMENTS_LIST,
  INITIAL_SUPPLIERS,
  INITIAL_POS,
  INITIAL_EMPLOYEE_STATUSES
} from '../data/seed';

const KEYS = {
  INVENTORY: 'furniflow_inventory',
  CUSTOMERS: 'furniflow_customers',
  EMPLOYEES: 'furniflow_employees',
  ORDERS: 'furniflow_orders',
  BRANCHES: 'furniflow_branches',
  USERS: 'furniflow_users',
  TRANSACTIONS: 'furniflow_transactions',
  GEO: 'furniflow_geo',
  CATEGORIES: 'furniflow_categories',
  PAYMENT_METHODS: 'furniflow_payment_methods',
  ROLES: 'furniflow_roles',
  PRODUCT_CATEGORIES: 'furniflow_product_categories',
  DASHBOARD_CONFIG: 'furniflow_dashboard_config',
  SYSTEM_CONFIG: 'furniflow_system_config',
  DEPARTMENTS: 'furniflow_departments',
  SUPPLIERS: 'furniflow_suppliers',
  POS: 'furniflow_pos',
  EMPLOYEE_STATUSES: 'furniflow_employee_statuses'
};

// Generic Repository Helper
const createRepository = <T>(key: string, initialData: T[]) => ({
    getAll: (): T[] => {
        try {
            const item = localStorage.getItem(key);
            if (item) return JSON.parse(item);
            localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        } catch (e) {
            console.error(`Error loading ${key}`, e);
            return initialData;
        }
    },
    save: (data: T[]) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}`, e);
        }
    }
});

export const db = {
  inventory: createRepository<InventoryItem>(KEYS.INVENTORY, INITIAL_INVENTORY),
  customers: createRepository<Customer>(KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  employees: createRepository<Employee>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES),
  orders: createRepository<SalesOrder>(KEYS.ORDERS, INITIAL_ORDERS),
  branches: createRepository<Branch>(KEYS.BRANCHES, INITIAL_BRANCHES),
  users: createRepository<User>(KEYS.USERS, INITIAL_USERS),
  transactions: createRepository<Transaction>(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  geo: createRepository<GeoRegion>(KEYS.GEO, INITIAL_GEO_CONFIG),
  categories: createRepository<AccountCategory>(KEYS.CATEGORIES, INITIAL_CATEGORIES),
  paymentMethods: createRepository<PaymentMethod>(KEYS.PAYMENT_METHODS, INITIAL_PAYMENT_METHODS),
  roles: createRepository<Role>(KEYS.ROLES, INITIAL_ROLES),
  productCategories: createRepository<ProductCategory>(KEYS.PRODUCT_CATEGORIES, INITIAL_PRODUCT_CATEGORIES),
  dashboardConfig: createRepository<DashboardRoleConfig>(KEYS.DASHBOARD_CONFIG, INITIAL_DASHBOARD_CONFIG),
  systemConfig: createRepository<SystemConfig>(KEYS.SYSTEM_CONFIG, INITIAL_SYSTEM_CONFIG),
  departments: createRepository<Department>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS_LIST),
  suppliers: createRepository<Supplier>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS),
  pos: createRepository<PurchaseOrder>(KEYS.POS, INITIAL_POS),
  employeeStatuses: createRepository<EmployeeStatus>(KEYS.EMPLOYEE_STATUSES, INITIAL_EMPLOYEE_STATUSES),
};
