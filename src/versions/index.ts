
import { VersionLog } from './types';

// Consolidated Version Logs to prevent build/runtime errors
const logs: VersionLog[] = [
  {
    version: '2.42.3',
    date: '2024-01-09',
    changes: [
      'Localization: Achieved 100% Arabic coverage across all modules.',
      'System: Fixed automated version log loading.',
      'Performance: Optimized build process.'
    ],
    isMajor: false
  },
  {
    version: '2.42.2',
    date: '2024-01-08',
    changes: [
      'Localization: Complete 100% Arabic translation for all remaining modules (Settings, HR, Purchasing, Finance).',
      'Localization: Translated all modal forms, alerts, and placeholders.',
      'UI: Polished RTL layouts for all modals.'
    ],
    isMajor: false
  },
  {
    version: '2.42.1',
    date: '2024-01-08',
    changes: [
      'Localization: Complete translation of Sales Module (Orders, Details, Cart, New Order).',
      'Localization: Complete translation of Inventory Module (Product Grid, Modal, Media).',
      'Localization: Complete translation of CRM Module (Customer List, History, Add Customer).',
      'Localization: Standardized Arabic terminology across all business modules.'
    ],
    isMajor: false
  },
  {
    version: '2.42.0',
    date: '2024-01-08',
    changes: [
      'System: Complete Arabic Localization (RTL Direction).',
      'UI: Switched primary font to "Cairo" for better Arabic typography.',
      'Data: Translated seed data (Branches, Roles, Categories) to Arabic.',
      'Navigation: Translated Sidebar and Dashboard modules.'
    ],
    isMajor: true
  },
  {
    version: '2.41.1',
    date: '2024-01-07',
    changes: [
      'Inventory: Enhanced Product Modal Media tab with improved UI/UX.',
      'Inventory: Added visual feedback for image optimization and video upload processing.',
      'Inventory: Improved "Set as Cover" functionality with clear visual indicators.',
      'Inventory: Enforced 10MB size limit for video uploads to prevent storage issues.'
    ],
    isMajor: false
  },
  {
    version: '2.41.0',
    date: '2024-01-06',
    changes: [
      'System: Temporarily removed Supply Chain (Purchasing) module from navigation and routing upon request.',
      'Config: Updated default role permissions to exclude Purchasing access.'
    ],
    isMajor: false
  },
  {
    version: '2.40.1',
    date: '2024-01-05',
    changes: [
      'Settings: Fixed issue preventing Branch creation.',
      'Settings: Added "Edit Branch" modal with Geolocation configuration.'
    ],
    isMajor: false
  },
  {
    version: '2.40.0',
    date: '2024-01-05',
    changes: [
      'HR: Implemented Dynamic Employee Statuses (e.g., Probation, Terminated). No longer hardcoded.',
      'Settings: Added HR Settings Tab to manage statuses and system-wide defaults.',
      'HR: Standard Monthly Working Days is now a configurable system setting.'
    ],
    isMajor: true
  },
  {
    version: '2.39.1',
    date: '2024-01-04',
    changes: [
      'HR: Added visual Commission Rate % display on Employee Cards.',
      'HR: Ensured "Working Days" display reflects the specific employee setting, removing ambiguity.'
    ],
    isMajor: false
  },
  {
    version: '2.39.0',
    date: '2024-01-04',
    changes: [
      'HR: Enhanced attendance tracking accuracy. Switched from UTC to Local Date for log entries to prevent shift splitting at UTC midnight.',
      'HR: Polished daily hour calculation logic to reflect local time zones correctly.'
    ],
    isMajor: false
  },
  {
    version: '2.38.0',
    date: '2024-01-03',
    changes: [
      'Inventory: Added "Cost Price" to products for profit margin analysis.',
      'Inventory: Added Valuation Dashboard (Total Value, Potential Profit) to Inventory page.',
      'Inventory: Added Stock History tab to Product Modal showing detailed incoming/outgoing movements.',
      'Inventory: Added Category Filter for easier navigation.'
    ],
    isMajor: true
  },
  {
    version: '2.37.0',
    date: '2024-01-02',
    changes: [
      'Feature: Added "Supply Chain" Module.',
      'Purchasing: Manage Suppliers and Vendor details.',
      'Purchasing: Create Purchase Orders (PO) to track incoming stock.',
      'Inventory: "Receive Stock" logic automatically increases inventory and records expenses.'
    ],
    isMajor: true
  },
  {
    version: '2.36.0',
    date: '2024-01-01',
    changes: [
      'System: Added Data Backup (Export) and Restore (Import) functionality in Settings. Crucial for data safety.',
      'Inventory: Added "Low Stock" visual indicators to the product grid.',
      'Auth: Added password hint for recovery.'
    ],
    isMajor: true
  },
  {
    version: '2.35.1',
    date: '2023-12-31',
    changes: [
      'Sales: Implemented strict branch filtering. Order list, Inventory Picker, and Customer Dropdown now respect the selected branch context.',
      'Sales: New orders are now automatically assigned to the currently selected branch ID (or default system branch if HQ).'
    ],
    isMajor: false
  },
  {
    version: '2.35.0',
    date: '2023-12-31',
    changes: [
      'System: Implemented Dynamic Configuration. Company Name, Order Prefix, and Currency are now editable in Settings.',
      'Settings: Added Department Management tab. Departments are no longer hardcoded.',
      'HR: Integrated dynamic departments into employee management.',
      'Sales: Orders now use the configured Order Prefix from system settings.'
    ],
    isMajor: true
  },
  {
    version: '2.34.1',
    date: '2023-12-30',
    changes: [
      'HR: Enhanced Employee List with real-time daily working hours calculation.',
      'HR: Display active session duration dynamically on employee cards.'
    ],
    isMajor: false
  },
  {
    version: '2.34.0',
    date: '2023-12-30',
    changes: [
      'Payments: Added Date Range Filter to Payment Search.',
      'HR: Added Commission Log tab to Finance Modal.',
      'Sales: Added clickable sorting to Order List.',
      'Sales: Added Order Expenses tracking and Add Expense button.'
    ],
    isMajor: false
  },
  {
    version: '2.33.3',
    date: '2023-12-29',
    changes: [
      'HR: Added Team Attendance Calendar with monthly matrix view.',
      'HR: Added Employee ID and explicit working days to employee cards.',
      'HR: Enhanced Finance Modal with robust commission override and clear payment history.',
      'UI: Added visual indicators for checked-in status in calendar.'
    ],
    isMajor: false
  },
  {
    version: '2.33.2',
    date: '2023-12-28',
    changes: [
      'HR: Added Month Filter to Employee List.',
      'HR: Display Earned vs Paid amounts for the selected month on employee cards.'
    ],
    isMajor: false
  },
  {
    version: '2.33.1',
    date: '2023-12-28',
    changes: [
      'HR: Enhanced Live Attendance view with real-time daily hour calculation.',
      'HR: Added First-In and Last-Out tracking columns.'
    ],
    isMajor: false
  },
  {
    version: '2.33.0',
    date: '2023-12-28',
    changes: [
      'HR: Revamped Finance System. Replaced Lending with Direct Payment (Advance/Bonus).',
      'HR: Added Order-based Commission Manager with override capability.',
      'HR: Integrated Payment Method selection for all employee payouts.'
    ],
    isMajor: true
  },
  {
    version: '2.32.1',
    date: '2023-12-27',
    changes: [
      'HR: Added explicit Salary and Working Days display to Employee Cards for better visibility.'
    ],
    isMajor: false
  },
  {
    version: '2.32.0',
    date: '2023-12-27',
    changes: [
      'Architecture: Added in-app "System Architecture" documentation for easier developer onboarding and upgrades.',
      'System: Codebase reached Gold Standard state. All modules decoupled, typed, and styled via centralized design system.',
      'Cleanup: Finalized file structure and removed all deprecated references.'
    ],
    isMajor: false
  },
  {
    version: '2.31.1',
    date: '2023-12-26',
    changes: [
      'System: Enabled automatic version discovery. New changelog files are now automatically detected and loaded without manual registration.',
      'Architecture: Updated version manager to use dynamic glob imports.'
    ],
    isMajor: false
  },
  {
    version: '2.31.0',
    date: '2023-12-26',
    changes: [
      'Architecture: Implemented custom useAppStore hook for global state management, drastically simplifying App.tsx.',
      'Refactor: Extracted ActivityFeed from Dashboard for improved modularity.',
      'Performance: Improved re-render optimization logic.'
    ],
    isMajor: true
  },
  {
    version: '2.30.2',
    date: '2023-12-25',
    changes: [
      'Refactor: Standardized all Settings lists using reusable SettingsRow component.',
      'Refactor: Extracted CartItemRow from NewOrderModal for cleaner code.'
    ],
    isMajor: false
  },
  {
    version: '2.30.1',
    date: '2023-12-24',
    changes: [
      'Refactor: Introduced reusable PageHeader component to reduce boilerplate code.',
      'Refactor: Simplified StatsCards in Dashboard with dynamic mapping.',
      'Refactor: Extracted CartItemRow from NewOrderModal to improve readability.',
      'Cleanup: Standardized page headers across all major modules.'
    ],
    isMajor: false
  },
  {
    version: '2.30.0',
    date: '2023-12-23',
    changes: [
      'RELEASE: Production Gold Master.',
      'Cleanup: Removed all legacy root module files to ensure clean architecture.',
      'UI: Enforced strict white backgrounds on all inputs to resolve visibility issues on dark mode devices.',
      'System: Optimized bundle imports.'
    ],
    isMajor: true
  },
  {
    version: '2.29.0',
    date: '2023-12-22',
    changes: [
      'Refactor: Implemented Generic Repository Pattern for Database Service, reducing code duplication.',
      'UI: Created reusable Table component and integrated it into Inventory and Accounting modules.',
      'Architecture: Moved VersionFooter to correct layout directory and cleaned up deprecated root components.'
    ],
    isMajor: false
  },
  {
    version: '2.28.1',
    date: '2023-12-21',
    changes: [
      'Architecture: Finalized directory structure. Sidebar moved to layout components.',
      'Feature: Added Print functionality for Sales Orders and Work Orders.',
      'Cleanup: Removed all legacy component files and updated routing logic.',
      'System: Production-ready build structure.'
    ],
    isMajor: false
  },
  {
    version: '2.28.0',
    date: '2023-12-20',
    changes: [
      'COMPLETED: Full system modularization.',
      'UI: Integrated Visual Product Picker in Sales.',
      'CRM: Restored Order and Payment History tabs in Customer Detail view.',
      'System: Final code cleanup and optimization for production deployment.'
    ],
    isMajor: true
  },
  {
    version: '2.27.0',
    date: '2023-12-18',
    changes: [
      'Architecture: Implemented centralized Design System using TypeScript constants for system-wide style consistency.',
      'Refactor: Modularized codebase. Sales, Inventory, and CRM now consume shared atomic UI components.',
      'System: New file-based versioning system. Updates are now read dynamically from the versions folder.',
      'UX: Standardized all inputs, buttons, and modals across the entire application.',
      'Performance: Optimized module loading structure.'
    ],
    isMajor: true
  },
  {
    version: '2.26.0',
    date: '2023-12-16',
    changes: ['Deployment Polish: Completed full UI audit.', 'Refactor: Standardized form styling across Settings, HR, Inventory.']
  },
  {
    version: '2.25.0',
    date: '2023-12-14',
    changes: ['Feature: Added Order Expenses tracking.', 'Integration: Expenses link to Accounting automatically.']
  },
  {
    version: '2.24.0',
    date: '2023-12-12',
    changes: ['Feature: Fully implemented Settings logic.', 'HR Update: Restored Expected Commission pipeline view.']
  },
  {
    version: '2.23.0',
    date: '2023-12-10',
    changes: ['Inventory: Added Video Upload & Link capability.', 'Sales: Enhanced Component Customization (Grid View).']
  },
  {
    version: '2.20.0',
    date: '2023-12-01',
    changes: ['CRM: Added real-time Customer Search (Name/Phone/Contract).']
  },
  {
    version: '2.10.0',
    date: '2023-11-10',
    changes: ['HR: Added Payroll Calculator & Attendance Proration.']
  },
  {
    version: '2.4.0',
    date: '2023-10-20',
    changes: ['Initial Release: Core Modules (Sales, Inventory, CRM, Accounting).']
  }
];

// Sort by date descending
export const VERSIONS = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const LATEST_VERSION = VERSIONS[0]?.version || 'Unknown';
