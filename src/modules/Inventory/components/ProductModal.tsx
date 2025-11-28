
import React, { useState, useEffect } from 'react';
import { InventoryItem, ProductCategory, ProductMedia, SalesOrder, PurchaseOrder, InventoryComponent } from '../../../types';
import { Modal, Button, Input, Select, Table, Badge } from '../../../components/common/UIComponents';
import { Upload, Image as ImageIcon, X, Video, Star, Layers, Trash2, PlayCircle, History, AlertCircle, Edit2, Package, Check, ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';
import { db } from '../../../services/database';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Partial<InventoryItem>) => void;
    categories: ProductCategory[];
    initialData?: Partial<InventoryItem>;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, categories, initialData }) => {
    const [formData, setFormData] = useState<Partial<InventoryItem>>({});
    const [activeTab, setActiveTab] = useState<'details' | 'media' | 'components' | 'history'>('details');
    const [isOptimizing, setIsOptimizing] = useState(false);
    
    // Component Editing State
    const [editingComp, setEditingComp] = useState<Partial<InventoryComponent> | null>(null);
    
    // History State
    const [productOrders, setProductOrders] = useState<SalesOrder[]>([]);
    const [productPOs, setProductPOs] = useState<PurchaseOrder[]>([]);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || { 
                name: '', price: 0, priceAfterDiscount: 0, discountPercentage: 0, costPrice: 0, stock: 1000, sku: '', category: categories[0]?.name || 'عام',
                media: [], components: []
            });
            setActiveTab('details');
            setEditingComp(null);
            
            if (initialData?.id) {
                // Fetch history
                const allOrders = db.orders.getAll();
                const allPOs = db.pos.getAll();
                
                setProductOrders(allOrders.filter(o => o.items.some(i => i.productId === initialData.id)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setProductPOs(allPOs.filter(p => p.items.some(i => i.productId === initialData.id)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } else {
                setProductOrders([]);
                setProductPOs([]);
            }
        }
    }, [initialData, isOpen, categories]);

    // Pricing Logic - Auto Calculate Percentage
    useEffect(() => {
        if (formData.price && formData.price > 0 && formData.priceAfterDiscount && formData.priceAfterDiscount > 0) {
            const discount = ((formData.price - formData.priceAfterDiscount) / formData.price) * 100;
            setFormData(prev => ({ ...prev, discountPercentage: parseFloat(discount.toFixed(1)) }));
        } else if (formData.price && formData.price > 0 && (!formData.priceAfterDiscount || formData.priceAfterDiscount === 0)) {
             setFormData(prev => ({ ...prev, discountPercentage: 0 }));
        }
    }, [formData.price, formData.priceAfterDiscount]);

    const optimizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 800;
                    const scale = MAX / img.width;
                    const w = Math.min(MAX, img.width);
                    const h = img.height * (img.width > MAX ? scale : 1);
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
            };
        });
    };

    // Generic Media Handler (Used for both Product and Components)
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'component') => {
        if (e.target.files) {
            setIsOptimizing(true);
            const newMedia: ProductMedia[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                let url = '';
                const isVideo = file.type.startsWith('video');
                
                if (isVideo) {
                    if(file.size > 100*1024*1024) { 
                        alert(`الفيديو "${file.name}" كبير جداً (الحد الأقصى 100 ميجا). تم تجاهله.`); 
                        continue; 
                    }
                    url = await new Promise(r => {
                        const fr = new FileReader();
                        fr.onload = () => r(fr.result as string);
                        fr.readAsDataURL(file);
                    });
                } else {
                    // For images, optimize
                    url = await optimizeImage(file);
                }

                newMedia.push({
                    id: `m_${Date.now()}_${i}`, 
                    type: isVideo ? 'video' : 'image', 
                    url,
                    isPrimary: target === 'product' ? (!formData.media?.length && i === 0) : (!editingComp?.media?.length && i === 0)
                });
            }

            if (target === 'product') {
                setFormData(prev => ({ ...prev, media: [...(prev.media || []), ...newMedia] }));
            } else if (target === 'component' && editingComp) {
                setEditingComp(prev => ({ ...prev!, media: [...(prev?.media || []), ...newMedia] }));
            }
            setIsOptimizing(false);
        }
    };

    const reorderMedia = (index: number, direction: 'left' | 'right', target: 'product' | 'component') => {
        const list = target === 'product' ? [...(formData.media || [])] : [...(editingComp?.media || [])];
        if (direction === 'left' && index > 0) {
            [list[index], list[index - 1]] = [list[index - 1], list[index]];
        } else if (direction === 'right' && index < list.length - 1) {
            [list[index], list[index + 1]] = [list[index + 1], list[index]];
        }

        if (target === 'product') {
            setFormData({ ...formData, media: list });
        } else {
            setEditingComp({ ...editingComp!, media: list });
        }
    };

    const removeMedia = (id: string, target: 'product' | 'component') => {
        if (target === 'product') {
            setFormData(prev => ({ ...prev, media: prev.media?.filter(m => m.id !== id) }));
        } else {
            setEditingComp(prev => ({ ...prev!, media: prev?.media?.filter(m => m.id !== id) }));
        }
    };

    const setPrimary = (id: string, target: 'product' | 'component') => {
        if (target === 'product') {
            setFormData(prev => ({ ...prev, media: prev.media?.map(m => ({ ...m, isPrimary: m.id === id })) }));
        } else {
            setEditingComp(prev => ({ ...prev!, media: prev?.media?.map(m => ({ ...m, isPrimary: m.id === id })) }));
        }
    };

    // --- COMPONENT LOGIC ---
    const saveComponent = () => {
        if(!editingComp?.name) return;
        
        const newComp = {
            id: editingComp.id || `comp_${Date.now()}`,
            name: editingComp.name,
            quantity: editingComp.quantity || 1,
            category: editingComp.category,
            media: editingComp.media || []
        };

        let updatedComps = [...(formData.components || [])];
        const existingIdx = updatedComps.findIndex(c => c.id === newComp.id);
        
        if(existingIdx >= 0) {
            updatedComps[existingIdx] = newComp;
        } else {
            updatedComps.push(newComp);
        }

        setFormData(prev => ({ ...prev, components: updatedComps }));
        setEditingComp(null);
    };

    const editComponent = (comp: InventoryComponent) => {
        setEditingComp(comp);
    };

    const removeComponent = (id: string) => {
        setFormData(prev => ({ ...prev, components: prev.components?.filter(c => c.id !== id) }));
    };

    // --- AUTO SKU GENERATION ---
    const generateSKU = () => {
        const categoryPrefixMap: Record<string, string> = {
            'غرف النوم': 'BED',
            'غرف المعيشة': 'LIV',
            'غرف السفرة': 'DIN',
            'أثاث مكتبي': 'OFF',
            'أثاث خارجي': 'OUT',
            'عام': 'GEN'
        };
        
        const prefix = categoryPrefixMap[formData.category || 'عام'] || 'ITM';
        const existingItems = db.inventory.getAll().filter(i => i.category === formData.category && i.sku.startsWith(prefix));
        
        // Find max number logic
        let maxNum = 0;
        existingItems.forEach(item => {
            const parts = item.sku.split('-');
            const num = parseInt(parts[parts.length - 1]);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        });

        const nextNum = maxNum + 1;
        const sku = `${prefix}-${String(nextNum).padStart(4, '0')}`;
        
        setFormData(prev => ({ ...prev, sku }));
    };

    const handleSave = () => {
        if(!formData.name) return alert('اسم المنتج مطلوب');
        
        // If SKU is empty, generate it
        const finalSKU = formData.sku || `ITM-${Date.now().toString().slice(-4)}`;
        
        onSave({ 
            ...formData, 
            sku: finalSKU, 
            stock: 1000 // Hidden stock default
        });
        onClose();
    };

    // Combine history for view
    const combinedHistory = [
        ...productOrders.map(o => ({
            date: o.date,
            type: 'Sale',
            ref: `#${o.systemOrderId}`,
            qty: o.items.find(i => i.productId === initialData?.id)?.quantity || 0,
            user: o.customerName
        })),
        ...productPOs.filter(p => p.status === 'Received').map(p => ({
            date: p.date,
            type: 'Purchase',
            ref: p.poNumber,
            qty: p.items.find(i => i.productId === initialData?.id)?.quantity || 0,
            user: p.supplierName
        }))
    ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Get all subcategories from all main categories (Dynamic Flattening)
    const allSubCategories = Array.from(new Set(categories.flatMap(c => c.subCategories || []))).sort();

    // Reusable Media Grid Component
    const MediaGrid = ({ media, target }: { media: ProductMedia[], target: 'product' | 'component' }) => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto custom-scrollbar p-1">
            {media?.map((m, idx) => (
                <div key={m.id} className={`relative aspect-square bg-slate-100 rounded-xl overflow-hidden group border-2 shadow-sm transition-all ${m.isPrimary ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-300'}`}>
                    {m.type === 'image' ? (
                        <img src={m.url} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                            <PlayCircle className="w-8 h-8 mb-2 opacity-80"/>
                            <span className="text-[10px] uppercase font-bold tracking-wider">فيديو</span>
                        </div>
                    )}
                    
                    {/* Badges */}
                    {m.isPrimary && <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">الرئيسية</div>}
                    {m.type === 'video' && <div className="absolute top-2 left-2 bg-slate-900/80 text-white p-1 rounded-full"><Video className="w-3 h-3"/></div>}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <div className="flex gap-2 w-full justify-center">
                            <button onClick={() => reorderMedia(idx, 'right', target)} className="p-1 bg-white/20 hover:bg-white/40 rounded text-white" title="تحريك لليمين"><ArrowRight className="w-4 h-4"/></button>
                            <button onClick={() => reorderMedia(idx, 'left', target)} className="p-1 bg-white/20 hover:bg-white/40 rounded text-white" title="تحريك لليسار"><ArrowLeft className="w-4 h-4"/></button>
                        </div>
                        <button 
                            onClick={() => setPrimary(m.id, target)} 
                            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${m.isPrimary ? 'bg-indigo-500 text-white cursor-default' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                        >
                            <Star className={`w-3 h-3 ${m.isPrimary ? 'fill-current' : ''}`}/> {m.isPrimary ? 'الرئيسية' : 'تعيين كرئيسية'}
                        </button>
                        <button onClick={() => removeMedia(m.id, target)} className="px-3 py-1.5 bg-white text-red-600 rounded-full text-xs font-bold hover:bg-red-50 flex items-center gap-1">
                            <Trash2 className="w-3 h-3"/> حذف
                        </button>
                    </div>
                </div>
            ))}
            {!media?.length && (
                <div className="col-span-full py-8 text-center text-slate-400 italic border-2 border-dashed border-slate-100 rounded-xl">
                    لا توجد وسائط حتى الآن.
                </div>
            )}
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={formData.id ? 'تعديل المنتج' : 'إضافة منتج جديد'} maxWidth="max-w-4xl">
            <div className="flex border-b border-slate-100 bg-slate-50 px-6 overflow-x-auto">
                <button onClick={() => setActiveTab('details')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>التفاصيل</button>
                <button onClick={() => setActiveTab('media')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'media' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    الوسائط <span className="mr-1 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{formData.media?.length || 0}</span>
                </button>
                <button onClick={() => setActiveTab('components')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'components' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    المكونات <span className="mr-1 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{formData.components?.length || 0}</span>
                </button>
                {formData.id && <button onClick={() => setActiveTab('history')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>السجل</button>}
            </div>

            <div className="p-6 min-h-[400px]">
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Input label="اسم المنتج" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Select label="القسم" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </Select>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">كود المنتج (SKU)</label>
                                        <input 
                                            value={formData.sku || ''} 
                                            onChange={e => setFormData({...formData, sku: e.target.value})} 
                                            className="bg-transparent font-mono font-bold text-indigo-600 w-full outline-none"
                                            placeholder="تلقائي..."
                                        />
                                    </div>
                                    <button onClick={generateSKU} className="text-slate-400 hover:text-indigo-600 p-1" title="توليد تلقائي">
                                        <Wand2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                <Input type="number" label="سعر البيع الأساسي ($)" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                                <Input type="number" label="سعر التكلفة ($)" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} placeholder="0.00" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                <Input type="number" label="السعر بعد الخصم ($)" value={formData.priceAfterDiscount} onChange={e => setFormData({...formData, priceAfterDiscount: parseFloat(e.target.value)})} placeholder="اختياري" />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">نسبة الخصم</label>
                                    <div className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-2.5 font-bold text-center">
                                        {formData.discountPercentage ? <span className="text-emerald-600">{formData.discountPercentage}%</span> : <span className="text-slate-300">-</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-slate-400 text-sm">
                            <Package className="w-12 h-12 mb-2 opacity-20" />
                            <p>إدارة المخزون (الكميات) متوقفة حالياً.</p>
                            <p className="text-xs mt-1">يتم افتراض توفر المنتج دائماً.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            يدعم صور (HEIC, JPG, PNG) وفيديو (MP4, MOV). الحد الأقصى للفيديو 100 ميجا.
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className={`border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl p-6 flex flex-col items-center justify-center transition-all hover:bg-indigo-50 hover:border-indigo-300 ${isOptimizing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}>
                                <div className="p-3 bg-white text-indigo-600 rounded-full mb-2 shadow-sm"><ImageIcon className="w-6 h-6"/></div>
                                <span className="text-sm font-bold text-indigo-900">{isOptimizing ? 'جاري التحسين...' : 'رفع صور / فيديو'}</span>
                                <span className="text-xs text-indigo-400 mt-1">Images & Videos</span>
                                <input type="file" multiple accept="image/*,video/*,.heic,.heif,.mov" className="hidden" onChange={e => handleMediaUpload(e, 'product')} disabled={isOptimizing} />
                            </label>
                        </div>

                        <MediaGrid media={formData.media || []} target="product" />
                    </div>
                )}

                {activeTab === 'components' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Component List */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600"/> المكونات ({formData.components?.length || 0})</h3>
                                <Button onClick={() => setEditingComp({ name: '', quantity: 1, media: [] })} className="text-xs h-8"><Upload className="w-3 h-3 ml-1"/> إضافة مكون</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[350px] custom-scrollbar p-1">
                                {formData.components?.map((comp) => (
                                    <div key={comp.id} onClick={() => editComponent(comp)} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 cursor-pointer transition-all group relative">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-100">
                                            {comp.media?.[0] ? <img src={comp.media[0].url} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-slate-300 m-auto mt-4"/>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 truncate">{comp.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="neutral">العدد: {comp.quantity}</Badge>
                                                {comp.category && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">{comp.category}</span>}
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ))}
                                {!formData.components?.length && (
                                    <div className="col-span-full p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                                        لا توجد مكونات مضافة.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Editor Panel */}
                        {editingComp && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full animate-in slide-in-from-right-4 fade-in">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Edit2 className="w-4 h-4 text-indigo-600"/> {editingComp.id ? 'تعديل مكون' : 'مكون جديد'}
                                </h4>
                                <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar p-1">
                                    <Input label="اسم المكون" value={editingComp.name} onChange={e => setEditingComp({...editingComp, name: e.target.value})} />
                                    
                                    {allSubCategories.length > 0 && (
                                        <Select label="تصنيف المكون" value={editingComp.category || ''} onChange={e => setEditingComp({...editingComp, category: e.target.value})}>
                                            <option value="">اختر التصنيف...</option>
                                            {allSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </Select>
                                    )}

                                    <Input label="الكمية" type="number" value={editingComp.quantity} onChange={e => setEditingComp({...editingComp, quantity: parseInt(e.target.value)})} />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">وسائط المكون</label>
                                        <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-white hover:border-indigo-300 transition-all relative overflow-hidden ${isOptimizing ? 'opacity-50' : ''}`}>
                                            <ImageIcon className="w-6 h-6 text-slate-400 mb-1"/>
                                            <span className="text-[10px] text-slate-500">{isOptimizing ? 'جاري المعالجة...' : 'رفع وسائط'}</span>
                                            <input type="file" multiple accept="image/*,video/*,.heic,.heif,.mov" className="hidden" onChange={e => handleMediaUpload(e, 'component')} disabled={isOptimizing} />
                                        </label>
                                        <div className="mt-3">
                                            <MediaGrid media={editingComp.media || []} target="component" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                                    <Button variant="secondary" className="flex-1" onClick={() => setEditingComp(null)}>إلغاء</Button>
                                    <Button className="flex-1" onClick={saveComponent} disabled={!editingComp.name}><Check className="w-4 h-4 ml-1"/> حفظ</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><History className="w-4 h-4 text-indigo-600"/> سجل الحركات</h3>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar border rounded-xl">
                            <Table
                                data={combinedHistory}
                                columns={[
                                    { header: 'التاريخ', accessor: 'date', render: h => <span className="text-slate-500 text-xs">{h.date}</span> },
                                    { header: 'النوع', render: h => h.type === 'Sale' ? <Badge variant="warning">صادر</Badge> : <Badge variant="success">وارد</Badge> },
                                    { header: 'المرجع', accessor: 'ref', render: h => <span className="font-mono font-bold text-indigo-600">{h.ref}</span> },
                                    { header: 'الجهة', accessor: 'user' },
                                    { header: 'الكمية', align: 'left', render: h => <span className={`font-bold ${h.type === 'Sale' ? 'text-red-600' : 'text-emerald-600'}`}>{h.type === 'Sale' ? '-' : '+'}{h.qty}</span> }
                                ]}
                                emptyMessage="لا يوجد سجل حركات."
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                <Button variant="secondary" onClick={onClose}>إلغاء</Button>
                <Button onClick={handleSave}>حفظ التغييرات</Button>
            </div>
        </Modal>
    );
};

export default ProductModal;
