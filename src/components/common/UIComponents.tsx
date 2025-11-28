
import React from 'react';
import { CLASSES } from '../../styles/designSystem';
import { Trash2 } from 'lucide-react';

// --- ATOMS ---

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ variant = 'primary', className = '', ...props }) => {
  let baseClass = CLASSES.buttonPrimary;
  if (variant === 'secondary') baseClass = CLASSES.buttonSecondary;
  if (variant === 'danger') baseClass = CLASSES.buttonDanger;
  if (variant === 'ghost') baseClass = CLASSES.buttonGhost;
  
  return <button className={`${baseClass} ${className}`} {...props} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className={CLASSES.label}>{label}</label>}
    <input className={`${CLASSES.input} ${className}`} {...props} />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="w-full">
    {label && <label className={CLASSES.label}>{label}</label>}
    <select className={`${CLASSES.select} ${className}`} {...props}>
      {children}
    </select>
  </div>
);

export const Badge: React.FC<{ variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary', children: React.ReactNode }> = ({ variant = 'neutral', children }) => {
  return <span className={`${CLASSES.badge.base} ${CLASSES.badge[variant]}`}>{children}</span>;
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, padding?: string }> = ({ children, className = '', padding = "p-6" }) => (
  <div className={`${CLASSES.section} ${padding} ${className}`}>
    {children}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: React.ReactNode, children: React.ReactNode, maxWidth?: string }> = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} flex flex-col max-h-[90vh] border border-slate-200`}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 rounded-t-2xl">
           <div className="text-lg font-bold text-slate-900">{title}</div>
           <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: string;
}

export const Table = <T,>({ data, columns, onRowClick, emptyMessage = "لا توجد بيانات للعرض" }: { data: T[], columns: Column<T>[], onRowClick?: (item: T) => void, emptyMessage?: string }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`px-6 py-4 font-medium text-${col.align || 'left'} ${col.width ? `w-[${col.width}]` : ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? data.map((item, rowIdx) => (
                        <tr key={rowIdx} onClick={() => onRowClick && onRowClick(item)} className={onRowClick ? CLASSES.rowClickable : 'hover:bg-slate-50'}>
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className={`px-6 py-4 text-${col.align || 'left'}`}>
                                    {col.render ? col.render(item) : (col.accessor ? String(item[col.accessor]) : '')}
                                </td>
                            ))}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400 italic">{emptyMessage}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// --- MOLECULES ---

export const PageHeader: React.FC<{ title: string, subtitle?: React.ReactNode, actions?: React.ReactNode }> = ({ title, subtitle, actions }) => (
  <header className={CLASSES.header}>
    <div>
      <h1 className={CLASSES.h1}>{title}</h1>
      {subtitle && <div className="mt-1 text-slate-500">{subtitle}</div>}
    </div>
    {actions && <div className="flex gap-3">{actions}</div>}
  </header>
);

export const SettingsRow: React.FC<{ 
  title: React.ReactNode; 
  subtitle?: React.ReactNode; 
  icon?: any; 
  onDelete?: () => void;
  children?: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, onDelete, children }) => (
  <div className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow group">
      <div className="flex items-center gap-4">
          {Icon && <div className="p-2 bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-lg transition-colors"><Icon className="w-5 h-5"/></div>}
          <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
      </div>
      <div className="flex items-center gap-3">
          {children}
          {onDelete && (
             <Button variant="ghost" onClick={onDelete} className="text-slate-300 hover:text-red-600"><Trash2 className="w-4 h-4"/></Button>
          )}
      </div>
  </div>
);
