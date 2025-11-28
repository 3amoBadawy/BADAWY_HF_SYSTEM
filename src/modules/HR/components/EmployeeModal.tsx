
import React, { useState, useEffect } from 'react';
import { Employee, Branch, Department, EmployeeStatus } from '../../../types';
import { Modal, Button, Input, Select } from '../../../components/common/UIComponents';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (emp: Partial<Employee>) => void;
    initialData?: Partial<Employee>;
    branches: Branch[];
    departments: Department[];
    statuses: EmployeeStatus[];
    defaultWorkingDays?: number;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, initialData, branches, departments, statuses, defaultWorkingDays }) => {
    const [formData, setFormData] = useState<Partial<Employee>>({});

    useEffect(() => {
        setFormData(initialData || {
            name: '', role: '', department: departments[0]?.name || '', email: '', status: statuses[0]?.name || 'نشط',
            branchId: branches[0]?.id, salary: 0, commissionRate: 0, salesTarget: 0,
            attendanceDays: 0, totalWorkingDays: defaultWorkingDays || 26, avatarUrl: '', idFrontUrl: '', idBackUrl: ''
        });
    }, [initialData, isOpen, branches, departments, statuses, defaultWorkingDays]);

    const optimizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const scaleSize = MAX_WIDTH / img.width;
                    const width = Math.min(MAX_WIDTH, img.width);
                    const height = img.height * (img.width > MAX_WIDTH ? scaleSize : 1);
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
            };
        });
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Employee) => {
        if(e.target.files?.[0]) {
            const url = await optimizeImage(e.target.files[0]);
            setFormData(prev => ({ ...prev, [field]: url }));
        }
    };

    const isSales = formData.department?.toLowerCase().includes('مبيعات') || formData.role?.toLowerCase().includes('مبيعات') || formData.role?.toLowerCase().includes('sales');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={formData.id ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="الاسم بالكامل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <Input label="البريد الإلكتروني" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="المسمى الوظيفي" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    <Select label="القسم" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Select label="الفرع" value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                    <Select label="الحالة" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        {statuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </Select>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">المستندات والصور</label>
                    <div className="grid grid-cols-3 gap-4">
                        {[{key: 'avatarUrl', label: 'صورة شخصية', icon: ImageIcon}, {key: 'idFrontUrl', label: 'صورة الهوية (أمام)', icon: FileText}, {key: 'idBackUrl', label: 'صورة الهوية (خلف)', icon: FileText}].map((item) => (
                            <label key={item.key} className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                                {formData[item.key as keyof Employee] ? 
                                    <img src={formData[item.key as keyof Employee] as string} className="w-full h-16 object-cover rounded mb-2"/> : 
                                    <div className="p-2 bg-slate-100 rounded-full mb-2"><item.icon className="w-6 h-6 text-slate-400"/></div>
                                }
                                <span className="text-xs font-medium text-slate-600">{item.label}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, item.key as keyof Employee)} />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">التعويضات المالية</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" label="الراتب الأساسي" value={formData.salary} onChange={e => setFormData({...formData, salary: parseFloat(e.target.value)})} />
                        <Input type="number" label="أيام العمل الشهرية" value={formData.totalWorkingDays} onChange={e => setFormData({...formData, totalWorkingDays: parseFloat(e.target.value)})} />
                    </div>
                    {isSales && (
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="number" label="نسبة العمولة (%)" value={formData.commissionRate} onChange={e => setFormData({...formData, commissionRate: parseFloat(e.target.value)})} />
                            <Input type="number" label="المستهدف الشهري" value={formData.salesTarget} onChange={e => setFormData({...formData, salesTarget: parseFloat(e.target.value)})} />
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button onClick={() => onSave(formData)}>حفظ البيانات</Button>
                </div>
            </div>
        </Modal>
    );
};

export default EmployeeModal;
