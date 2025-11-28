
import React from 'react';
import { Trash2, Layers, Scissors, Ruler, HelpCircle } from 'lucide-react';
import { OrderItem, OrderItemCustomization } from '../../../types';
import { Input } from '../../../components/common/UIComponents';

interface CartItemRowProps {
    item: OrderItem;
    formatCurrency: (v: number) => string;
    actions: {
        updateCartQty: (id: string, delta: number) => void;
        updateCartPrice: (id: string, price: number) => void;
        removeFromCart: (id: string) => void;
        toggleCartCustomization: (id: string, field: keyof OrderItemCustomization) => void;
        updateCartCustomizationNote: (id: string, note: string) => void;
        updateComponentQty: (prodId: string, idx: number, qty: number) => void;
        updateComponentName: (prodId: string, idx: number, name: string) => void;
        toggleComponentFlag: (prodId: string, idx: number, field: keyof OrderItemCustomization) => void;
    }
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, formatCurrency, actions }) => (
    <div className="p-6 bg-white hover:bg-slate-50/50 transition-colors">
        {/* Main Item Row */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
                <h4 className="font-bold text-lg text-slate-800">{item.productName}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span>الوحدة: {formatCurrency(item.price)}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => actions.updateCartQty(item.productId, -1)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200">-</button>
                        <span className="font-mono font-bold text-slate-900">{item.quantity}</span>
                        <button onClick={() => actions.updateCartQty(item.productId, 1)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200">+</button>
                    </div>
                </div>
            </div>
            <div className="text-left">
                <div className="text-lg font-bold text-indigo-600 cursor-pointer hover:underline decoration-dashed" onClick={() => {
                    const newPrice = prompt("تعديل السعر:", item.price.toString());
                    if(newPrice) actions.updateCartPrice(item.productId, parseFloat(newPrice));
                }}>
                    {formatCurrency(item.price * item.quantity)}
                </div>
                <button onClick={() => actions.removeFromCart(item.productId)} className="text-xs text-red-500 hover:underline mt-1 flex items-center justify-start gap-1"><Trash2 className="w-3 h-3"/> حذف</button>
            </div>
        </div>

        {/* Sub-Components Grid */}
        {item.components && item.components.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Layers className="w-3 h-3"/> المكونات</p>
                <div className="space-y-2">
                    {item.components.map((comp, idx) => (
                        <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                            <input type="number" className="w-12 p-1 text-center bg-slate-50 border border-slate-200 rounded font-bold text-sm" value={comp.quantity} onChange={(e) => actions.updateComponentQty(item.productId, idx, parseInt(e.target.value))} />
                            <input type="text" className="flex-1 p-1 bg-transparent border-none font-medium text-sm text-slate-700" value={comp.name} onChange={(e) => actions.updateComponentName(item.productId, idx, e.target.value)} />
                            <div className="flex gap-1">
                                <button onClick={() => actions.toggleComponentFlag(item.productId, idx, 'isTextile')} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${comp.customizations?.isTextile ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-400'}`}>قماش</button>
                                <button onClick={() => actions.toggleComponentFlag(item.productId, idx, 'isMeasures')} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${comp.customizations?.isMeasures ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-400'}`}>مقاسات</button>
                                <button onClick={() => actions.toggleComponentFlag(item.productId, idx, 'isOther')} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${comp.customizations?.isOther ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-400'}`}>تخصيص</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Customization Flags */}
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <button onClick={() => actions.toggleCartCustomization(item.productId, 'isTextile')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-all ${item.customizations?.isTextile ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}><Scissors className="w-3 h-3"/> قماش</button>
                <button onClick={() => actions.toggleCartCustomization(item.productId, 'isMeasures')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-all ${item.customizations?.isMeasures ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}><Ruler className="w-3 h-3"/> مقاسات</button>
                <button onClick={() => actions.toggleCartCustomization(item.productId, 'isOther')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-all ${item.customizations?.isOther ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500'}`}><HelpCircle className="w-3 h-3"/> تخصيص آخر</button>
            </div>
            <Input placeholder="إضافة ملاحظات تخصيص..." value={item.customizations?.note || ''} onChange={(e) => actions.updateCartCustomizationNote(item.productId, e.target.value)} className="text-sm" />
        </div>
    </div>
);

export default CartItemRow;
