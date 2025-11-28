
import React, { useState } from 'react';
import { Branch } from '../../../types';
import { Button, Input, Select, SettingsRow, Modal } from '../../../components/common/UIComponents';
import { Plus, Building2, Edit2, MapPin } from 'lucide-react';

interface BranchSettingsProps {
    branches: Branch[];
    onUpdate: (branches: Branch[]) => void;
}

const BranchSettings: React.FC<BranchSettingsProps> = ({ branches, onUpdate }) => {
    const [newBranch, setNewBranch] = useState<Partial<Branch>>({ name: '', address: '', currency: 'USD' });
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const handleAdd = () => {
        if (!newBranch.name) return;
        const branch: Branch = {
            id: `BR-${Date.now()}`,
            name: newBranch.name!,
            address: newBranch.address || '',
            currency: newBranch.currency || 'USD',
            coordinates: { lat: 0, lng: 0, radius: 100 }
        };
        onUpdate([...branches, branch]);
        setNewBranch({ name: '', address: '', currency: 'USD' });
    };

    const handleDelete = (id: string) => {
        if (id === 'HQ') return alert("لا يمكن حذف المركز الرئيسي");
        if (confirm("هل أنت متأكد من حذف الفرع؟")) onUpdate(branches.filter(b => b.id !== id));
    };

    const handleUpdate = () => {
        if (!editingBranch || !editingBranch.name) return;
        const updated = branches.map(b => b.id === editingBranch.id ? editingBranch : b);
        onUpdate(updated);
        setEditingBranch(null);
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return alert("تحديد الموقع غير مدعوم في هذا المتصفح");
        navigator.geolocation.getCurrentPosition(pos => {
            if (editingBranch) {
                setEditingBranch({
                    ...editingBranch,
                    coordinates: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        radius: editingBranch.coordinates?.radius || 100
                    }
                });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <Input placeholder="اسم الفرع" value={newBranch.name} onChange={e => setNewBranch({...newBranch, name: e.target.value})} />
                <Input placeholder="العنوان" value={newBranch.address} onChange={e => setNewBranch({...newBranch, address: e.target.value})} />
                <Select value={newBranch.currency} onChange={e => setNewBranch({...newBranch, currency: e.target.value})}>
                    <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="EGP">EGP (ج.م)</option><option value="SAR">SAR (ر.س)</option>
                </Select>
                <Button onClick={handleAdd}><Plus className="w-4 h-4"/> إضافة</Button>
            </div>

            <div className="space-y-3">
                {branches.map(b => (
                    <SettingsRow
                        key={b.id}
                        title={<span>{b.name} {b.id === 'HQ' && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded ml-2">رئيسي</span>}</span>}
                        subtitle={`${b.address} • ${b.currency}`}
                        icon={Building2}
                        onDelete={b.id !== 'HQ' ? () => handleDelete(b.id) : undefined}
                    >
                        <Button variant="ghost" onClick={() => setEditingBranch(b)}><Edit2 className="w-4 h-4 text-slate-400 hover:text-indigo-600"/></Button>
                    </SettingsRow>
                ))}
            </div>

            <Modal isOpen={!!editingBranch} onClose={() => setEditingBranch(null)} title="تعديل الفرع">
                {editingBranch && (
                    <div className="p-6 space-y-4">
                        <Input label="اسم الفرع" value={editingBranch.name} onChange={e => setEditingBranch({...editingBranch, name: e.target.value})} />
                        <Input label="العنوان" value={editingBranch.address} onChange={e => setEditingBranch({...editingBranch, address: e.target.value})} />
                        <Select label="العملة" value={editingBranch.currency} onChange={e => setEditingBranch({...editingBranch, currency: e.target.value})}>
                            <option value="USD">USD</option><option value="EUR">EUR</option><option value="EGP">EGP</option><option value="SAR">SAR</option>
                        </Select>
                        
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-700">الموقع الجغرافي (للبصمة)</label>
                                <Button variant="secondary" className="text-xs h-8" onClick={getCurrentLocation}><MapPin className="w-3 h-3 ml-1"/> تحديد موقعي الحالي</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="خط العرض (Lat)" type="number" value={editingBranch.coordinates?.lat || 0} onChange={e => setEditingBranch({...editingBranch, coordinates: {...(editingBranch.coordinates || {radius: 100, lng: 0}), lat: parseFloat(e.target.value)}})} />
                                <Input label="خط الطول (Lng)" type="number" value={editingBranch.coordinates?.lng || 0} onChange={e => setEditingBranch({...editingBranch, coordinates: {...(editingBranch.coordinates || {radius: 100, lat: 0}), lng: parseFloat(e.target.value)}})} />
                            </div>
                            <Input label="نطاق السماح (متر)" type="number" value={editingBranch.coordinates?.radius || 100} onChange={e => setEditingBranch({...editingBranch, coordinates: {...(editingBranch.coordinates || {lat: 0, lng: 0}), radius: parseFloat(e.target.value)}})} />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="secondary" onClick={() => setEditingBranch(null)}>إلغاء</Button>
                            <Button onClick={handleUpdate}>حفظ التغييرات</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BranchSettings;
