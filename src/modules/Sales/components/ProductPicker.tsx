
import React from 'react';
import { InventoryItem } from '../../../types';
import { Button } from '../../../components/common/UIComponents';
import { X, Box } from 'lucide-react';
import { CLASSES } from '../../../styles/designSystem';

interface ProductPickerProps {
    isOpen: boolean;
    onClose: () => void;
    inventory: InventoryItem[];
    onAddToCart: (item: InventoryItem) => void;
}

const ProductPicker: React.FC<ProductPickerProps> = ({ isOpen, onClose, inventory, onAddToCart }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0 shadow-sm">
                <div>
                    <h3 className={CLASSES.h3}>كتالوج المنتجات</h3>
                    <p className="text-xs text-slate-500">اضغط على المنتج لإضافته للطلب</p>
                </div>
                <Button onClick={onClose} variant="secondary"><X className="w-4 h-4 ml-1"/> إغلاق</Button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {inventory.map(item => {
                        const primaryImg = item.media?.find(m => m.isPrimary)?.url || item.media?.[0]?.url;
                        return (
                            <div key={item.id} onClick={() => onAddToCart(item)} className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 hover:shadow-xl cursor-pointer transition-all group flex flex-col">
                                <div className="w-full aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
                                    {primaryImg ? <img src={primaryImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <Box className="w-8 h-8 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>}
                                </div>
                                <div className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">{item.name}</div>
                                <div className="mt-auto flex justify-between items-center">
                                    <div className="font-bold text-indigo-600">${item.price.toLocaleString()}</div>
                                    <div className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{item.sku}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductPicker;
