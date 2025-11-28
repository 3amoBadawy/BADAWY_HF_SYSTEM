
import React, { useState } from 'react';
import { ProductCategory } from '../../../types';
import { Button, Input, SettingsRow } from '../../../components/common/UIComponents';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface InventorySettingsProps {
    categories: ProductCategory[];
    onUpdate: (c: ProductCategory[]) => void;
}

const InventorySettings: React.FC<InventorySettingsProps> = ({ categories, onUpdate }) => {
    const [newCat, setNewCat] = useState('');
    const [expandedCat, setExpandedCat] = useState<string | null>(null);
    const [newSubCat, setNewSubCat] = useState('');

    const add = () => {
        if(!newCat) return;
        onUpdate([...categories, { id: `pc_${Date.now()}`, name: newCat, subCategories: [] }]);
        setNewCat('');
    };

    const addSubCategory = (catId: string) => {
        if(!newSubCat) return;
        const updated = categories.map(c => 
            c.id === catId ? { ...c, subCategories: [...(c.subCategories || []), newSubCat] } : c
        );
        onUpdate(updated);
        setNewSubCat('');
    };

    const removeSubCategory = (catId: string, sub: string) => {
        const updated = categories.map(c => 
            c.id === catId ? { ...c, subCategories: c.subCategories?.filter(s => s !== sub) } : c
        );
        onUpdate(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 mb-4 max-w-md">
                <Input placeholder="اسم تصنيف المنتجات الجديد" value={newCat} onChange={e => setNewCat(e.target.value)} />
                <Button onClick={add}><Plus className="w-4 h-4"/></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(c => (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
                        <SettingsRow
                            title={c.name}
                            subtitle={`${c.subCategories?.length || 0} مكونات فرعية`}
                            onDelete={() => onUpdate(categories.filter(x => x.id !== c.id))}
                        >
                            <Button variant="ghost" onClick={() => setExpandedCat(expandedCat === c.id ? null : c.id)}>
                                {expandedCat === c.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                            </Button>
                        </SettingsRow>
                        
                        {expandedCat === c.id && (
                            <div className="p-4 bg-slate-50 border-t border-slate-100">
                                <div className="flex gap-2 mb-3">
                                    <Input 
                                        placeholder="اسم المكون الفرعي (مثال: سرير، دولاب)" 
                                        value={newSubCat} 
                                        onChange={e => setNewSubCat(e.target.value)}
                                        className="h-9 text-sm"
                                    />
                                    <Button onClick={() => addSubCategory(c.id)} className="h-9 w-9 p-0 flex items-center justify-center"><Plus className="w-4 h-4"/></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {c.subCategories?.map(sub => (
                                        <span key={sub} className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1">
                                            {sub}
                                            <button onClick={() => removeSubCategory(c.id, sub)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3"/></button>
                                        </span>
                                    ))}
                                    {!c.subCategories?.length && <span className="text-xs text-slate-400 italic">لا توجد مكونات فرعية.</span>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventorySettings;
