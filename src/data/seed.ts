
import { InventoryItem, Customer, Employee, SalesOrder, Branch, User, Transaction, GeoRegion, AccountCategory, PaymentMethod, Role, ProductCategory, DashboardRoleConfig, ModuleType, SystemConfig, Department, Supplier, PurchaseOrder, EmployeeStatus } from '../types';

// --- SEED DATA ---
// Arabic Localization for initial setup

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'HQ', name: 'المركز الرئيسي (الكل)', address: 'الإدارة العامة', currency: 'EGP', coordinates: { lat: 30.0444, lng: 31.2357, radius: 200 } }, // Cairo
  { id: 'CAI', name: 'فرع القاهرة', address: 'التجمع الخامس, القاهرة', currency: 'EGP', coordinates: { lat: 30.0444, lng: 31.2357, radius: 100 } },
  { id: 'ALX', name: 'فرع الإسكندرية', address: 'سموحة, الإسكندرية', currency: 'EGP', coordinates: { lat: 31.2001, lng: 29.9187, radius: 100 } },
  { id: 'JED', name: 'فرع جدة', address: 'شارع التحلية, جدة', currency: 'SAR', coordinates: { lat: 21.4858, lng: 39.1925, radius: 100 } },
];

export const INITIAL_ROLES: Role[] = [
  { 
    id: 'role_admin', 
    name: 'مسؤول النظام', 
    permissions: [ModuleType.DASHBOARD, ModuleType.INVENTORY, ModuleType.SALES, ModuleType.CRM, ModuleType.PAYMENTS, ModuleType.HR, ModuleType.ACCOUNTING, ModuleType.SETTINGS], 
    isSystem: true 
  },
  { 
    id: 'role_manager', 
    name: 'مدير فرع', 
    permissions: [ModuleType.DASHBOARD, ModuleType.INVENTORY, ModuleType.SALES, ModuleType.CRM, ModuleType.PAYMENTS, ModuleType.HR, ModuleType.ACCOUNTING], 
    isSystem: true 
  },
  { 
    id: 'role_staff', 
    name: 'موظف مبيعات', 
    permissions: [ModuleType.DASHBOARD, ModuleType.INVENTORY, ModuleType.SALES, ModuleType.CRM, ModuleType.PAYMENTS], 
    isSystem: true 
  },
];

export const INITIAL_DASHBOARD_CONFIG: DashboardRoleConfig[] = [
    { role: 'مسؤول النظام', visibleWidgets: ['REVENUE', 'ACTIVE_ORDERS', 'NET_PROFIT', 'RECEIVABLES', 'CHART_FINANCIAL', 'RECENT_ACTIVITY'] },
    { role: 'مدير فرع', visibleWidgets: ['REVENUE', 'ACTIVE_ORDERS', 'NET_PROFIT', 'RECENT_ACTIVITY'] },
    { role: 'موظف مبيعات', visibleWidgets: ['ACTIVE_ORDERS', 'RECENT_ACTIVITY'] }
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'المدير العام', email: 'admin@furniflow.com', role: 'مسؤول النظام', branchId: 'HQ', avatarUrl: '', password: 'admin' },
  { id: 'u2', name: 'أحمد مدير', email: 'ahmed@furniflow.com', role: 'مدير فرع', branchId: 'CAI', avatarUrl: '', password: '123' },
  { id: 'u3', name: 'سارة مبيعات', email: 'sarah@furniflow.com', role: 'موظف مبيعات', branchId: 'CAI', avatarUrl: '', password: '123' },
];

export const INITIAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'cat_living', name: 'غرف المعيشة', subCategories: ['كنب', 'كراسي', 'طاولات قهوة', 'مكتبات'] },
  { id: 'cat_dining', name: 'غرف السفرة', subCategories: ['طاولات طعام', 'كراسي سفرة', 'بوفيه', 'نيش'] },
  { id: 'cat_bedroom', name: 'غرف النوم', subCategories: ['سرير', 'دولاب', 'كمود', 'تسريحة', 'مراتب'] },
  { id: 'cat_office', name: 'أثاث مكتبي', subCategories: ['مكاتب', 'كراسي مكتب', 'وحدات تخزين'] },
  { id: 'cat_outdoor', name: 'أثاث خارجي', subCategories: ['جلسات خارجية', 'مظلات', 'أراجيح'] },
];

export const INITIAL_DEPARTMENTS_LIST: Department[] = [
    { id: 'd1', name: 'الإدارة العليا' },
    { id: 'd2', name: 'المبيعات' },
    { id: 'd3', name: 'الموارد البشرية' },
    { id: 'd4', name: 'الحسابات' },
    { id: 'd5', name: 'اللوجستيات' },
    { id: 'd6', name: 'المخازن' },
    { id: 'd7', name: 'التصميم' },
    { id: 'd8', name: 'خدمة العملاء' }
];

export const INITIAL_DEPARTMENTS = INITIAL_DEPARTMENTS_LIST.map(d => d.name);

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'محمد علي',
    role: 'مدير معرض',
    department: 'المبيعات',
    email: 'mohamed@furniflow.com',
    status: 'نشط',
    branchId: 'CAI',
    salary: 8000,
    commissionRate: 2,
    salesTarget: 100000,
    attendanceDays: 21,
    totalWorkingDays: 26,
    loanBalance: 0,
    isCheckedIn: false,
    logs: [],
    avatarUrl: ''
  },
  {
    id: 'e2',
    name: 'خالد إبراهيم',
    role: 'استشاري مبيعات',
    department: 'المبيعات',
    email: 'khaled@furniflow.com',
    status: 'نشط',
    branchId: 'ALX',
    salary: 4000,
    commissionRate: 5,
    salesTarget: 50000,
    attendanceDays: 26,
    totalWorkingDays: 26,
    loanBalance: 200,
    isCheckedIn: true,
    lastCheckInTime: new Date().toISOString(),
    logs: [],
    avatarUrl: ''
  },
  {
    id: 'e3',
    name: 'د. يوسف',
    role: 'أخصائي HR',
    department: 'الموارد البشرية',
    email: 'youssef@furniflow.com',
    status: 'إجازة',
    branchId: 'HQ',
    salary: 6000,
    attendanceDays: 10,
    totalWorkingDays: 26,
    loanBalance: 0,
    isCheckedIn: false,
    logs: [],
    avatarUrl: ''
  },
];

export const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: 'ORD-UUID-1001',
    systemOrderId: 1001,
    manualContractId: 'CNT-001',
    date: '2024-01-15',
    showroomDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    customerId: 'c1',
    customerName: 'ليلى أحمد',
    salesRepId: 'e1',
    items: [{ productId: '1', productName: 'طاولة سفرة بلوط', quantity: 1, price: 15000, components: [] }],
    totalAmount: 15000,
    paidAmount: 15000,
    status: 'Completed',
    paymentMethod: 'كاش (القاهرة)',
    branchId: 'CAI',
    scope: 'تجديد غرفة السفرة',
    isCommissionPaid: false
  }
];

export const INITIAL_CATEGORIES: AccountCategory[] = [
  { id: 'cat1', name: 'المبيعات', type: 'Income' },
  { id: 'cat2', name: 'خدمات', type: 'Income' },
  { id: 'cat3', name: 'إيجار', type: 'Expense' },
  { id: 'cat4', name: 'رواتب', type: 'Expense' },
  { id: 'cat5', name: 'كهرباء ومياه', type: 'Expense' },
  { id: 'cat6', name: 'تسويق', type: 'Expense' },
  { id: 'cat7', name: 'مستلزمات', type: 'Expense' },
  { id: 'cat8', name: 'مشتريات بضاعة', type: 'Expense' },
  { id: 'cat9', name: 'عام', type: 'Both' },
  { id: 'cat10', name: 'عمولات', type: 'Expense' },
  { id: 'cat11', name: 'سلف موظفين', type: 'Expense' },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', name: 'كاش (القاهرة)', branchId: 'CAI' },
  { id: 'pm2', name: 'فيزا (القاهرة)', branchId: 'CAI' },
  { id: 'pm3', name: 'تحويل بنكي (CIB)', branchId: 'CAI' },
  { id: 'pm4', name: 'كاش (إسكندرية)', branchId: 'ALX' },
  { id: 'pm5', name: 'فودافون كاش', branchId: 'HQ' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-01-01', description: 'إيجار المعرض', amount: 25000, type: 'Expense', category: 'إيجار', status: 'Completed', branchId: 'CAI', paymentMethod: 'تحويل بنكي (CIB)' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
    { id: 'sup1', name: 'الشركة الحديثة للأخشاب', contactPerson: 'أستاذ حسن', email: 'hassan@wood.com', phone: '0100000000', address: 'دمياط, مصر' },
];

export const INITIAL_POS: PurchaseOrder[] = [
    { 
        id: 'PO-1001', poNumber: 'PO-1001', supplierId: 'sup1', supplierName: 'الشركة الحديثة للأخشاب', 
        date: '2024-01-01', totalCost: 45000, status: 'Received', branchId: 'CAI',
        items: [{ productId: '1', productName: 'طاولة سفرة بلوط', quantity: 5, unitCost: 9000 }] 
    }
];

export const INITIAL_EMPLOYEE_STATUSES: EmployeeStatus[] = [
    { id: 'st_active', name: 'نشط', color: 'success' },
    { id: 'st_leave', name: 'إجازة', color: 'warning' },
    { id: 'st_probation', name: 'فترة اختبار', color: 'neutral' },
    { id: 'st_terminated', name: 'تم إنهاء العقد', color: 'danger' }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig[] = [{
    id: 'CONFIG',
    companyName: 'فورني فلو',
    supportEmail: 'support@furniflow.com',
    orderPrefix: 'فاتورة',
    defaultCurrency: 'ج.م',
    defaultCountry: 'مصر',
    defaultTimezone: 'Africa/Cairo',
    standardMonthlyWorkingDays: 26
}];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'طاولة سفرة بلوط نورديك',
    sku: 'TBL-001',
    category: 'غرف السفرة',
    price: 18500,
    costPrice: 12000,
    stock: 12,
    description: 'طاولة سفرة بتصميم بسيط مصنوعة من خشب البلوط الصلب المستدام.',
    media: [
        { id: 'm1', type: 'image', url: 'https://picsum.photos/400/300?random=1', isPrimary: true }
    ],
    material: 'خشب بلوط',
    branchId: 'CAI',
    components: []
  },
  {
    id: '2',
    name: 'غرفة نوم ملكية كاملة',
    sku: 'SET-BD-004',
    category: 'غرف النوم',
    price: 65000,
    costPrice: 40000,
    stock: 3,
    description: 'طقم غرفة نوم كامل يتضمن سرير كينج، وعدد 2 كمود، ودولاب كبير.',
    media: [
        { id: 'm2', type: 'image', url: 'https://picsum.photos/400/300?random=2', isPrimary: true }
    ],
    material: 'ماهوجني ومخمل',
    branchId: 'CAI',
    components: [
        { id: 'comp_bed', name: 'سرير كينج', quantity: 1, category: 'سرير' },
        { id: 'comp_ns', name: 'كمود', quantity: 2, category: 'كمود' },
        { id: 'comp_wd', name: 'دولاب 3 درف', quantity: 1, category: 'دولاب' }
    ]
  },
  {
    id: '3',
    name: 'مكتبة معدنية صناعية',
    sku: 'SHL-022',
    category: 'أثاث مكتبي',
    price: 4500,
    costPrice: 2000,
    stock: 24,
    description: 'إطار فولاذي قوي مع أرفف خشبية.',
    media: [
        { id: 'm3', type: 'image', url: 'https://picsum.photos/400/300?random=3', isPrimary: true }
    ],
    material: 'حديد وخشب',
    branchId: 'ALX',
    components: []
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'ليلى أحمد',
    email: 'laila@example.com',
    mobile1: '01234567890',
    mobile2: '',
    country: 'مصر',
    county: 'القاهرة',
    totalSales: 15000,
    totalPaid: 15000,
    lastPurchaseDate: '2024-01-15',
    tags: ['VIP'],
    notes: 'تفضل الألوان الفاتحة.',
    branchId: 'CAI',
  },
];

export const INITIAL_GEO_CONFIG: GeoRegion[] = [
  { country: 'مصر', counties: ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'أسيوط'] },
  { country: 'السعودية', counties: ['الرياض', 'جدة', 'الدمام', 'مكة'] },
  { country: 'الإمارات', counties: ['دبي', 'أبو ظبي', 'الشارقة'] }
];
