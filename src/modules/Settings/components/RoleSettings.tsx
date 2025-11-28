
import React, { useState } from 'react';
import { Role, ModuleType } from '../../../types';
import { Button, Input, SettingsRow } from '../../../components/common/UIComponents';
import { Plus, Shield } from 'lucide-react';

interface RoleSettingsProps {
    roles: Role[];
    onUpdate: (roles: Role[]) => void;
}

const RoleSettings: React.FC<RoleSettingsProps> = ({ roles, onUpdate }) => {
    const [newRole, setNewRole] = useState<Partial<Role>>({ name: '', permissions: [] });

    const handleAdd = () => {
        if (!newRole.name) return;
        const role: Role = {
            id: `role_${Date.now()}`,
            name: newRole.name!,
            permissions: newRole.permissions || [],
            isSystem: false
        };
        onUpdate([...roles, role]);
        setNewRole({ name: '', permissions: [] });
    };

    const handleDelete = (id: string) => {
        if (confirm("حذف الدور الوظيفي؟")) onUpdate(roles.filter(r => r.id !== id));
    };

    const togglePerm = (mod: ModuleType) => {
        const perms = newRole.permissions || [];
        setNewRole({ ...newRole, permissions: perms.includes(mod) ? perms.filter(p => p !== mod) : [...perms, mod] });
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex gap-4">
                    <Input placeholder="اسم الدور" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} />
                    <Button onClick={handleAdd}><Plus className="w-4 h-4"/> إضافة دور</Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(Object.values(ModuleType) as ModuleType[]).map(m => (
                        <label key={m} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="checkbox" checked={newRole.permissions?.includes(m)} onChange={() => togglePerm(m)} className="rounded text-indigo-600" />
                            {m}
                        </label>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(r => (
                    <SettingsRow
                        key={r.id}
                        title={r.name}
                        icon={Shield}
                        onDelete={!r.isSystem ? () => handleDelete(r.id) : undefined}
                    >
                         <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                            {r.permissions.map(p => <span key={p} className="text-[10px] bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600">{p}</span>)}
                        </div>
                    </SettingsRow>
                ))}
            </div>
        </div>
    );
};

export default RoleSettings;
