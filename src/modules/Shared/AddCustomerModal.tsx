
import React, { useState } from 'react';
import { Customer, GeoRegion } from '../../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  geoConfig: GeoRegion[];
  selectedBranchId: string;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  geoConfig, 
  selectedBranchId 
}) => {
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '', 
    email: '', 
    mobile1: '', 
    mobile2: '', 
    country: '', 
    county: '', 
    notes: ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.country) {
        alert('يرجى ملء الاسم، البريد الإلكتروني، والدولة.');
        return;
    }
    
    const customer: Customer = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCustomer.name!,
        email: newCustomer.email!,
        mobile1: newCustomer.mobile1 || '',
        mobile2: newCustomer.mobile2 || '',
        country: newCustomer.country!,
        county: newCustomer.county || '',
        totalSales: 0,
        totalPaid: 0,
        lastPurchaseDate: 'Never',
        tags: ['New'],
        notes: newCustomer.notes || '',
        branchId: selectedBranchId === 'HQ' ? 'NY' : selectedBranchId
    };

    onSave(customer);
    setNewCustomer({ name: '', email: '', mobile1: '', mobile2: '', country: '', county: '', notes: '' });
  };

  const availableCounties = newCustomer.country 
    ? geoConfig.find(g => g.country === newCustomer.country)?.counties || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold text-slate-900">إضافة عميل جديد</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم بالكامل *</label>
                <input 
                    className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="مثال: أحمد محمد"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني *</label>
                <input 
                    type="email"
                    className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="name@example.com"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">رقم الموبايل 1</label>
                    <input 
                        className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newCustomer.mobile1}
                        onChange={e => setNewCustomer({...newCustomer, mobile1: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">رقم الموبايل 2</label>
                    <input 
                        className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newCustomer.mobile2}
                        onChange={e => setNewCustomer({...newCustomer, mobile2: e.target.value})}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الدولة *</label>
                    <select 
                        className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newCustomer.country}
                        onChange={e => setNewCustomer({...newCustomer, country: e.target.value, county: ''})}
                    >
                        <option value="">اختر الدولة...</option>
                        {geoConfig.map(g => (
                            <option key={g.country} value={g.country}>{g.country}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">المحافظة/المنطقة</label>
                    <select 
                        className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newCustomer.county}
                        onChange={e => setNewCustomer({...newCustomer, county: e.target.value})}
                        disabled={!newCustomer.country}
                    >
                        <option value="">اختر...</option>
                        {availableCounties.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات</label>
                <textarea 
                    className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                    value={newCustomer.notes}
                    onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})}
                />
            </div>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl mt-auto">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">إلغاء</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium shadow-sm transition-colors">حفظ العميل</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
