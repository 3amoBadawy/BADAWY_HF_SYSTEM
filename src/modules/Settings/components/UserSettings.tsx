
import React, { useState } from 'react';
import { User, Role, Branch, UserRole } from '../../../types';
import { Button, Input, Select } from '../../../components/common/UIComponents';
import { Trash2, Plus, User as UserIcon } from 'lucide-react';

interface UserSettingsProps {
    users: User[];
    roles: Role[];
    branches: Branch[];
    onUpdate: (users: User[]) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ users, roles, branches, onUpdate }) => {
    const [newUser, setNewUser] = useState<Partial<User>>({ name: '', email: '', role: 'Staff', branchId: 'HQ', password: '123' });

    const handleAdd = () => {
        if (!newUser.name || !newUser.email) return;
        const user: User = {
            id: `USR-${Date.now()}`,
            name: newUser.name!, email: newUser.email!, role: newUser.role as UserRole,
            branchId: newUser.branchId || 'HQ', password: newUser.password || '123'
        };
        onUpdate([...users, user]);
        setNewUser({ name: '', email: '', role: 'Staff', branchId: 'HQ', password: '123' });
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="الاسم الكامل" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <Input placeholder="البريد الإلكتروني" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <div className="flex gap-2">
                    <Select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                        {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </Select>
                    <Select value={newUser.branchId} onChange={e => setNewUser({...newUser, branchId: e.target.value})}>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                    <Button onClick={handleAdd}><Plus className="w-4 h-4"/></Button>
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {users.map(u => (
                    <div key={u.id} className="py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><UserIcon className="w-5 h-5"/></div>
                            <div>
                                <p className="font-bold text-slate-900">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.email} • {u.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">{u.branchId}</span>
                            <Button variant="ghost" onClick={() => { if(confirm("حذف المستخدم؟")) onUpdate(users.filter(x => x.id !== u.id)); }}><Trash2 className="w-4 h-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSettings;
