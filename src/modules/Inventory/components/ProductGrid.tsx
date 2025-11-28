
import React from 'react';
import { InventoryItem } from '../../../types';
import { Package, AlertCircle } from 'lucide-react';

interface ProductGridProps {
    items: InventoryItem[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ items }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
                const isLowStock = item.stock <= 5;
                return (
                    <div key={item.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col relative">
                        <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300 relative">
                            {item.media && item.media.length > 0 ? (
                                <img src={item.media.find(m => m.isPrimary)?.url || item.media[0].url} className="w-full h-full object-cover" />
                            ) : <Package className="w-12 h-12"/>}
                            
                            {isLowStock && (
                                <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <AlertCircle className="w-3 h-3" /> مخزون منخفض
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1" title={item.name}>{item.name}</h3>
                            <p className="text-xs text-slate-500 mb-2">كود: {item.sku}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-indigo-600">${item.price.toLocaleString()}</span>
                                <span className={`text-sm font-medium ${isLowStock ? 'text-rose-600' : 'text-slate-600'}`}>
                                    {item.stock} في المخزن
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
