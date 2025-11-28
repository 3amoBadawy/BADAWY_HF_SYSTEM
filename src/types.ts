
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  CRM = 'CRM',
  PAYMENTS = 'PAYMENTS',
  HR = 'HR',
  ACCOUNTING = 'ACCOUNTING',
  PURCHASING = 'PURCHASING', // New Module
  SETTINGS = 'SETTINGS',
}

export type UserRole = string;

export interface Role {
  id: string;
  name: string;
  permissions: ModuleType[];
  isSystem?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  currency: string;
  coordinates?: {
    lat: number;
    lng: number;
    radius: number; // Allowed radius in meters
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string; // 'HEADQUARTERS' or specific branch ID
  avatarUrl?: string;
  password?: string; // In a real app, this would be hashed/handled by backend
}

export interface OrderItemCustomization {
    isTextile: boolean;
    isMeasures: boolean;
    isOther: boolean;
    note?: string;
}

export interface ProductMedia {
  id: string;
  type: 'image' | 'video';
  url: string; // Base64 for images, URL for videos
  thumbnail?: string; // Optional thumbnail for videos
  isPrimary?: boolean;
}

export interface InventoryComponent {
  id: string; // Added ID for reliable editing
  name: string; // e.g., "King Bed Frame"
  category?: string; // Sub-category based on parent product category
  quantity: number; // e.g., 1
  media?: ProductMedia[]; // Added Media support for component images
  customizations?: OrderItemCustomization; // Per-component customization flags
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // Selling Price
  priceAfterDiscount?: number; // New: Price after discount
  discountPercentage?: number; // New: Calculated percentage
  costPrice?: number; // For profit calculation
  stock: number;
  description: string;
  imageUrl?: string; // Deprecated, kept for backward compatibility
  media: ProductMedia[]; // New Multi-media support
  material: string;
  branchId: string;
  components?: InventoryComponent[]; // List of sub-items
}

export interface ProductCategory {
  id: string;
  name: string;
  subCategories?: string[]; // List of allowed sub-categories
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile1: string;
  mobile2: string;
  country: string;
  county: string;
  totalSales: number; // Total value of orders
  totalPaid: number; // Total cash received
  lastPurchaseDate: string;
  tags: string[];
  notes: string;
  branchId: string;
}

export interface GeoRegion {
  country: string;
  counties: string[];
}

export interface AttendanceLog {
  date: string;
  checkIn: string; // ISO string
  checkOut?: string; // ISO string
  durationHours?: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: string; // Changed from hardcoded union to string to support dynamic statuses
  branchId: string;
  salary: number; // Monthly Base Salary
  loanBalance?: number; // Amount borrowed/advanced
  commissionRate?: number; // Percentage (0-100) if applicable
  salesTarget?: number; // Monthly Sales Goal
  attendanceDays?: number; // Days worked this month
  totalWorkingDays?: number; // Total possible working days in month (e.g., 22)
  // Smart Attendance Fields
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  logs?: AttendanceLog[];
  // Identity Documents
  avatarUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

export interface EmployeeStatus {
  id: string;
  name: string;
  color: 'success' | 'warning' | 'danger' | 'neutral';
}

export interface SalesData {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface SalesForecast {
  month: string;
  actual: number;
  projected: number;
  target: number;
}

// Replaced Deal types with Order types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  components?: InventoryComponent[]; // Customized components for this specific order item
  customizations?: OrderItemCustomization; // Main item customizations
}

export interface SalesOrder {
  id: string; // Internal UUID
  systemOrderId: number; // Sequential System ID (e.g. 1001, 1002)
  manualContractId?: string; // Physical contract reference manually entered
  date: string; // System Date (Automatic)
  showroomDate?: string; // Date order was taken in showroom
  deliveryDate?: string; // Expected delivery date
  customerId: string;
  customerName: string;
  salesRepId?: string; // Employee ID of who made the sale
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'Completed' | 'Pending' | 'Partial' | 'Refunded';
  paymentMethod: string;
  branchId: string;
  scope: string; // Job or Project Scope reference
  contractSnapshot?: string; // Base64 image of the signed contract
  // Commission Tracking
  isCommissionPaid?: boolean;
  commissionPaidDate?: string;
  commissionOverrideAmount?: number; // If manager manually changed the amount
}

export type TransactionType = 'Income' | 'Expense';
export type TransactionStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  branchId: string;
  customerId?: string; // Link transaction to a customer if applicable
  employeeId?: string; // Link transaction to an employee (for payroll history)
  orderId?: string; // Link transaction to a specific Sales Order (e.g. Order Expense)
  contractSnapshot?: string; // Base64 image of payment contract
  transferSnapshot?: string; // Base64 image of transfer receipt
  paymentMethod?: string; // The account or method used (e.g., "Cash", "Bank Transfer")
}

export interface AccountCategory {
  id: string;
  name: string;
  type: 'Income' | 'Expense' | 'Both';
}

export interface PaymentMethod {
  id: string;
  name: string;
  branchId?: string; // If undefined or 'HQ', available to all. Otherwise specific to branch.
}

// Dashboard Config Types
export type WidgetType = 'REVENUE' | 'ACTIVE_ORDERS' | 'NET_PROFIT' | 'RECEIVABLES' | 'CHART_FINANCIAL' | 'RECENT_ACTIVITY';

export interface DashboardRoleConfig {
  role: string;
  visibleWidgets: WidgetType[];
}

// System Configuration Types
export interface SystemConfig {
  id: string; // Singleton 'CONFIG'
  companyName: string;
  supportEmail: string;
  orderPrefix: string;
  defaultCurrency: string;
  defaultCountry: string;
  defaultTimezone: string;
  standardMonthlyWorkingDays?: number; // Default working days per month
}

export interface Department {
  id: string;
  name: string;
}

// --- NEW PURCHASING TYPES ---

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
}

export type POStatus = 'Draft' | 'Ordered' | 'Received' | 'Cancelled';

export interface POItem {
  productId: string;
  productName: string; // Snapshot name
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-1001
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDate?: string;
  items: POItem[];
  totalCost: number;
  status: POStatus;
  branchId: string;
  itemsRecieved?: boolean;
  notes?: string;
}
