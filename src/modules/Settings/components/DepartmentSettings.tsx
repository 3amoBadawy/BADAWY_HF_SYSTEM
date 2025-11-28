
import React, { useState } from 'react';
import { Department } from '../../../types';
import { Button, Input, SettingsRow } from '../../../components/common/UIComponents';
import { Plus, Briefcase } from 'lucide-react';

interface DepartmentSettingsProps {
    departments: Department[];
    onUpdate: (data: Department[]) => void;
}

const DepartmentSettings: React.FC<DepartmentSettingsProps> = ({ departments, onUpdate }) => {
    const [newName, setNewName] = useState('');

    const handleAdd = () => {
        if (!newName) return;
        onUpdate([...departments, { id: `dept_${Date.now()}`, name: newName }]);
        setNewName('');
    };

    const handleDelete = (id: string) => {
        if(confirm("حذف القسم؟")) onUpdate(departments.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <Input placeholder="اسم القسم" value={newName} onChange={e => setNewName(e.target.value)} />
                <Button onClick={handleAdd}><Plus className="w-4 h-4"/> إضافة</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {departments.map(d => (
                    <SettingsRow
                        key={d.id}
                        title={d.name}
                        icon={Briefcase}
                        onDelete={() => handleDelete(d.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DepartmentSettings;
