
import React, { useState } from 'react';
import { EmployeeStatus, SystemConfig } from '../../../types';
import { Button, Input, SettingsRow, Select, Badge } from '../../../components/common/UIComponents';
import { Plus, Briefcase } from 'lucide-react';

interface HRSettingsProps {
    statuses: EmployeeStatus[];
    config: SystemConfig;
    onUpdateStatuses: (data: EmployeeStatus[]) => void;
    onUpdateConfig: (config: SystemConfig[]) => void;
}

const HRSettings: React.FC<HRSettingsProps> = ({ statuses, config, onUpdateStatuses, onUpdateConfig }) => {
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState<'success'|'warning'|'danger'|'neutral'>('neutral');
    const [workingDays, setWorkingDays] = useState(config.standardMonthlyWorkingDays || 26);

    const handleAddStatus = () => {
        if (!newName) return;
        onUpdateStatuses([...statuses, { id: `st_${Date.now()}`, name: newName, color: newColor }]);
        setNewName('');
    };

    const handleDeleteStatus = (id: string) => {
        if(confirm("حذف الحالة؟")) onUpdateStatuses(statuses.filter(s => s.id !== id));
    };

    const handleSaveConfig = () => {
        onUpdateConfig([{...config, standardMonthlyWorkingDays: workingDays}]);
        alert("تم حفظ الإعدادات الافتراضية");
    };

    return (
        <div className="space-y-8">
            {/* Defaults Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-4">الإعدادات الافتراضية</h3>
                <div className="flex items-end gap-4 max-w-md">
                    <Input label="أيام العمل الشهرية القياسية" type="number" value={workingDays} onChange={e => setWorkingDays(parseInt(e.target.value))} />
                    <Button onClick={handleSaveConfig}>حفظ</Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">تستخدم هذه القيمة لحساب الأجر اليومي والرواتب للموظفين الجدد.</p>
            </div>

            {/* Statuses Section */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">حالات الموظفين</h3>
                <div className="flex gap-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                    <Input placeholder="اسم الحالة (مثال: فترة تجربة)" value={newName} onChange={e => setNewName(e.target.value)} />
                    <Select value={newColor} onChange={e => setNewColor(e.target.value as any)} className="w-40">
                        <option value="success">أخضر</option>
                        <option value="warning">أصفر</option>
                        <option value="danger">أحمر</option>
                        <option value="neutral">رمادي</option>
                    </Select>
                    <Button onClick={handleAddStatus}><Plus className="w-4 h-4"/> إضافة</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {statuses.map(s => (
                        <SettingsRow
                            key={s.id}
                            title={s.name}
                            icon={Briefcase}
                            onDelete={() => handleDeleteStatus(s.id)}
                        >
                            <Badge variant={s.color}>{s.name}</Badge>
                        </SettingsRow>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HRSettings;
