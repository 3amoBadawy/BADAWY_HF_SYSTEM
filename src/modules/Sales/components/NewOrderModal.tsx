
import React from 'react';
import { User, Calendar, Hash, Upload, ShoppingCart, Plus, Check, UserPlus } from 'lucide-react';
import { OrderItem, Customer, Employee, OrderItemCustomization } from '../../../types';
import { Modal, Button, Input, Select, Card } from '../../../components/common/UIComponents';
import { CLASSES } from '../../../styles/designSystem';
import CartItemRow from './CartItemRow';

interface NewOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    nextSystemId: number;
    customers: Customer[];
    employees: Employee[];
    cart: OrderItem[];
    cartTotal: number;
    
    // Form States & Handlers
    selectedCustomerId: string;
    setSelectedCustomerId: (id: string) => void;
    salesRepId: string;
    setSalesRepId: (id: string) => void;
    systemDate: string;
    setSystemDate: (date: string) => void;
    showroomDate: string;
    setShowroomDate: (date: string) => void;
    deliveryDate: string;
    setDeliveryDate: (date: string) => void;
    orderScope: string;
    setOrderScope: (scope: string) => void;
    manualContractId: string;
    setManualContractId: (id: string) => void;
    contractSnapshot: string;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    
    // Cart Handlers
    onOpenProductPicker: () => void;
    onOpenAddCustomer: () => void;
    updateCartQty: (id: string, delta: number) => void;
    updateCartPrice: (id: string, price: number) => void;
    removeFromCart: (id: string) => void;
    toggleCartCustomization: (id: string, field: keyof OrderItemCustomization) => void;
    updateCartCustomizationNote: (id: string, note: string) => void;
    updateComponentQty: (prodId: string, idx: number, qty: number) => void;
    updateComponentName: (prodId: string, idx: number, name: string) => void;
    toggleComponentFlag: (prodId: string, idx: number, field: keyof OrderItemCustomization) => void;
    
    onSubmit: () => void;
    formatCurrency: (val: number) => string;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
    isOpen, onClose, nextSystemId, customers, employees, cart, cartTotal,
    selectedCustomerId, setSelectedCustomerId, salesRepId, setSalesRepId,
    systemDate, setSystemDate, showroomDate, setShowroomDate, deliveryDate, setDeliveryDate,
    orderScope, setOrderScope, manualContractId, setManualContractId, contractSnapshot, handleFileChange,
    onOpenProductPicker, onOpenAddCustomer, onSubmit, formatCurrency,
    ...cartActions
}) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`طلب مبيعات جديد #${nextSystemId}`} maxWidth="max-w-6xl">
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COL: Form Data */}
                <div className="lg:col-span-4 space-y-6">
                    <Card padding="p-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" /> العميل والمندوب
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Select label="العميل" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                                        <option value="">اختر العميل...</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Select>
                                </div>
                                <Button className="mb-[1px] p-3" onClick={onOpenAddCustomer}><UserPlus className="w-5 h-5" /></Button>
                            </div>
                            <Select label="مندوب المبيعات" value={salesRepId} onChange={e => setSalesRepId(e.target.value)}>
                                <option value="">بدون / حساب المعرض</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </Select>
                        </div>
                    </Card>

                    <Card padding="p-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" /> الجدول الزمني
                        </h3>
                        <div className="space-y-4">
                            <Input type="date" label="تاريخ النظام" value={systemDate} onChange={e => setSystemDate(e.target.value)} />
                            <Input type="date" label="تاريخ المعرض" value={showroomDate} onChange={e => setShowroomDate(e.target.value)} />
                            <Input type="date" label="تاريخ التوصيل" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                            <Input label="نطاق الطلب" placeholder="مثال: غرفة المعيشة" value={orderScope} onChange={e => setOrderScope(e.target.value)} />
                        </div>
                    </Card>

                    <Card padding="p-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-indigo-500" /> بيانات العقد
                        </h3>
                        <div className="space-y-4">
                            <Input label="رقم العقد اليدوي" placeholder="مثال: 10452" value={manualContractId} onChange={e => setManualContractId(e.target.value)} />
                            <div>
                                <label className={CLASSES.label}>صورة العقد الموقع</label>
                                <label className="flex items-center gap-3 w-full p-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Upload className="w-4 h-4"/></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-700">{contractSnapshot ? 'تم إرفاق العقد' : 'رفع صورة'}</p>
                                        {contractSnapshot && <p className="text-xs text-emerald-600 font-medium">جاهز للإرسال</p>}
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COL: Cart */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> عناصر الطلب ({cart.length})
                            </h3>
                            <div className="text-right">
                                <span className="text-xs text-slate-500 uppercase font-bold ml-2">الإجمالي</span>
                                <span className="text-xl font-bold text-slate-900">{formatCurrency(cartTotal)}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-slate-50/30 min-h-[400px]">
                            {cart.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <ShoppingCart className="w-12 h-12 mb-3 opacity-20"/>
                                    <p>السلة فارغة</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {cart.map((item) => (
                                        <CartItemRow key={item.productId} item={item} formatCurrency={formatCurrency} actions={cartActions} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                            <Button variant="secondary" className="w-full py-4 border-dashed border-2 border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100" onClick={onOpenProductPicker}>
                                <Plus className="w-5 h-5 ml-2"/> إضافة منتج للطلب
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl mt-auto">
                <Button variant="secondary" onClick={onClose}>إلغاء</Button>
                <Button onClick={onSubmit} disabled={cart.length === 0 || !selectedCustomerId}>
                    <Check className="w-5 h-5 ml-2" /> تأكيد وإنشاء الطلب
                </Button>
            </div>
        </Modal>
    );
};

export default NewOrderModal;
