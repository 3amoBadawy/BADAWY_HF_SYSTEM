
import React, { useState } from 'react';
import { MapPin, Plus, Truck, ShoppingBag, CheckCircle, Archive, Factory } from 'lucide-react';
import { Supplier, PurchaseOrder, Branch, InventoryItem, Transaction } from '../../types';
import { db } from '../../services/database';
import { CLASSES } from '../../styles/designSystem';
import { PageHeader, Button, Table, Modal, Input, Card, Badge, Select } from '../../components/common/UIComponents';

interface PurchasingProps {
    selectedBranchId: string;
    branches: Branch[];
}

const Purchasing: React.FC<PurchasingProps> = ({ selectedBranchId, branches }) => {
    const [activeTab, setActiveTab] = useState<'pos' | 'suppliers'>('pos');
    const [suppliers, setSuppliers] = useState<Supplier[]>(() => db.suppliers.getAll());
    const [pos, setPos] = useState<PurchaseOrder[]>(() => db.pos.getAll());
    const [inventory, setInventory] = useState<InventoryItem[]>(() => db.inventory.getAll());
    const [transactions, setTransactions] = useState<Transaction[]>(() => db.transactions.getAll());

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});

    const [isPOModalOpen, setIsPOModalOpen] = useState(false);
    const [newPO, setNewPO] = useState<Partial<PurchaseOrder>>({ items: [] });
    const [poItemProd, setPoItemProd] = useState('');
    const [poItemQty, setPoItemQty] = useState(1);
    const [poItemCost, setPoItemCost] = useState(0);

    const filteredPos = selectedBranchId === 'HQ' ? pos : pos.filter(p => p.branchId === selectedBranchId);

    // --- SUPPLIER HANDLERS ---
    const handleSaveSupplier = () => {
        if(!newSupplier.name) return;
        const sup: Supplier = {
            id: `sup_${Date.now()}`,
            name: newSupplier.name!,
            contactPerson: newSupplier.contactPerson || '',
            email: newSupplier.email || '',
            phone: newSupplier.phone || '',
            address: newSupplier.address || ''
        };
        const updated = [...suppliers, sup];
        setSuppliers(updated);
        db.suppliers.save(updated);
        setIsSupplierModalOpen(false);
        setNewSupplier({});
    };

    // --- PO HANDLERS ---
    const addPOItem = () => {
        if(!poItemProd) return;
        const prod = inventory.find(i => i.id === poItemProd);
        if(!prod) return;
        
        const item = {
            productId: prod.id,
            productName: prod.name,
            quantity: poItemQty,
            unitCost: poItemCost
        };
        
        setNewPO({ ...newPO, items: [...(newPO.items || []), item] });
        setPoItemProd(''); setPoItemQty(1); setPoItemCost(0);
    };

    const handleSavePO = () => {
        if(!newPO.supplierId || !newPO.items?.length) return;
        const supplier = suppliers.find(s => s.id === newPO.supplierId);
        
        const po: PurchaseOrder = {
            id: `PO-${Date.now()}`,
            poNumber: `PO-${Math.floor(Math.random() * 10000)}`,
            supplierId: newPO.supplierId!,
            supplierName: supplier?.name || 'غير معروف',
            date: new Date().toISOString().split('T')[0],
            status: 'Ordered',
            branchId: selectedBranchId === 'HQ' ? 'NY' : selectedBranchId,
            items: newPO.items!,
            totalCost: newPO.items!.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0)
        };
        
        const updated = [po, ...pos];
        setPos(updated);
        db.pos.save(updated);
        setIsPOModalOpen(false);
        setNewPO({ items: [] });
    };

    const handleReceivePO = (po: PurchaseOrder) => {
        if(confirm(`استلام المخزون للطلب ${po.poNumber}؟ سيتم تحديث المخزون وتسجيل المصروف.`)) {
            // 1. Update Stock
            let updatedInventory = [...inventory];
            po.items.forEach(item => {
                updatedInventory = updatedInventory.map(inv => 
                    inv.id === item.productId ? { ...inv, stock: inv.stock + item.quantity } : inv
                );
            });
            setInventory(updatedInventory);
            db.inventory.save(updatedInventory);

            // 2. Create Expense
            const tx: Transaction = {
                id: `EXP-PO-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description: `شراء بضاعة: ${po.poNumber} (${po.supplierName})`,
                amount: po.totalCost,
                type: 'Expense',
                category: 'مشتريات بضاعة',
                status: 'Completed',
                branchId: po.branchId,
                paymentMethod: 'تحويل بنكي (CIB)' // Default or add selector
            };
            const updatedTx = [tx, ...transactions];
            setTransactions(updatedTx);
            db.transactions.save(updatedTx);

            // 3. Update PO Status
            const updatedPos = pos.map(p => p.id === po.id ? { ...p, status: 'Received' as const } : p);
            setPos(updatedPos);
            db.pos.save(updatedPos);
            
            alert("تم استلام المخزون وتحديث الكميات!");
        }
    };

    return (
        <div className={CLASSES.pageContainer}>
            <PageHeader 
                title="سلسلة التوريد" 
                subtitle={
                    <div className="flex items-center gap-2">
                        <span>إدارة المشتريات والموردين. عرض:</span>
                        <span className="font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedBranchId}</span>
                    </div>
                }
                actions={
                    <div className="flex gap-2">
                        <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1">
                            <button onClick={() => setActiveTab('pos')} className={`px-3 py-1.5 text-sm font-medium rounded ${activeTab === 'pos' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>أوامر الشراء</button>
                            <button onClick={() => setActiveTab('suppliers')} className={`px-3 py-1.5 text-sm font-medium rounded ${activeTab === 'suppliers' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>الموردين</button>
                        </div>
                        {activeTab === 'pos' ? 
                            <Button onClick={() => setIsPOModalOpen(true)}><Plus className="w-4 h-4 ml-2"/> طلب شراء جديد</Button> : 
                            <Button onClick={() => setIsSupplierModalOpen(true)}><Plus className="w-4 h-4 ml-2"/> إضافة مورد</Button>
                        }
                    </div>
                }
            />

            {activeTab === 'suppliers' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suppliers.map(s => (
                        <Card key={s.id} className="hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Factory className="w-6 h-6"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{s.name}</h3>
                                    <p className="text-xs text-slate-500 mb-2">{s.address}</p>
                                    <div className="text-sm space-y-1">
                                        <p className="text-slate-600"><strong>مسؤول الاتصال:</strong> {s.contactPerson}</p>
                                        <p className="text-slate-600"><strong>الهاتف:</strong> {s.phone}</p>
                                        <p className="text-indigo-600">{s.email}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'pos' && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <Table 
                        data={filteredPos}
                        columns={[
                            { header: 'رقم الطلب', accessor: 'poNumber', render: (p: PurchaseOrder) => <span className="font-mono font-bold text-indigo-600">{p.poNumber}</span> },
                            { header: 'التاريخ', accessor: 'date' },
                            { header: 'المورد', accessor: 'supplierName' },
                            { header: 'الحالة', render: (p: PurchaseOrder) => <Badge variant={p.status === 'Received' ? 'success' : 'warning'}>{p.status === 'Received' ? 'مستلم' : 'جاري'}</Badge> },
                            { header: 'الأصناف', render: (p: PurchaseOrder) => <span className="text-xs">{p.items.length} صنف</span> },
                            { header: 'التكلفة', align: 'left', render: (p: PurchaseOrder) => <span className="font-bold">${p.totalCost.toLocaleString()}</span> },
                            { header: 'إجراء', align: 'left', render: (p: PurchaseOrder) => (
                                p.status !== 'Received' ? 
                                <Button variant="secondary" className="text-xs h-8" onClick={() => handleReceivePO(p)}>استلام المخزون</Button> : 
                                <span className="text-emerald-600 flex items-center justify-end gap-1 text-xs font-bold"><CheckCircle className="w-3 h-3"/> تم الاستلام</span>
                            )}
                        ]}
                        emptyMessage="لا توجد أوامر شراء."
                    />
                </div>
            )}

            {/* Add Supplier Modal */}
            <Modal isOpen={isSupplierModalOpen} onClose={() => setIsSupplierModalOpen(false)} title="إضافة مورد جديد">
                <div className="p-6 space-y-4">
                    <Input label="اسم الشركة" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="الشخص المسؤول" value={newSupplier.contactPerson} onChange={e => setNewSupplier({...newSupplier, contactPerson: e.target.value})} />
                        <Input label="الهاتف" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} />
                    </div>
                    <Input label="البريد الإلكتروني" value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} />
                    <Input label="العنوان" value={newSupplier.address} onChange={e => setNewSupplier({...newSupplier, address: e.target.value})} />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={() => setIsSupplierModalOpen(false)}>إلغاء</Button>
                        <Button onClick={handleSaveSupplier}>حفظ</Button>
                    </div>
                </div>
            </Modal>

            {/* Create PO Modal */}
            <Modal isOpen={isPOModalOpen} onClose={() => setIsPOModalOpen(false)} title="إنشاء أمر شراء" maxWidth="max-w-4xl">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="المورد" value={newPO.supplierId} onChange={e => setNewPO({...newPO, supplierId: e.target.value})}>
                            <option value="">اختر المورد...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                        <Input type="date" label="تاريخ التوقع" value={newPO.expectedDate} onChange={e => setNewPO({...newPO, expectedDate: e.target.value})} />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-2">إضافة أصناف</h4>
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <Select label="المنتج" value={poItemProd} onChange={e => setPoItemProd(e.target.value)}>
                                    <option value="">اختر المنتج...</option>
                                    {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </Select>
                            </div>
                            <div className="w-24">
                                <Input type="number" label="الكمية" value={poItemQty} onChange={e => setPoItemQty(parseInt(e.target.value))} />
                            </div>
                            <div className="w-32">
                                <Input type="number" label="التكلفة ($)" value={poItemCost} onChange={e => setPoItemCost(parseFloat(e.target.value))} />
                            </div>
                            <Button onClick={addPOItem} className="mb-[1px]">إضافة</Button>
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-500">
                                <tr><th className="p-2 text-right">المنتج</th><th className="p-2 text-left">الكمية</th><th className="p-2 text-left">سعر الوحدة</th><th className="p-2 text-left">الإجمالي</th></tr>
                            </thead>
                            <tbody>
                                {newPO.items?.map((item, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        <td className="p-2 text-right">{item.productName}</td>
                                        <td className="p-2 text-left">{item.quantity}</td>
                                        <td className="p-2 text-left">${item.unitCost}</td>
                                        <td className="p-2 text-left font-bold">${item.quantity * item.unitCost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!newPO.items || newPO.items.length === 0) && <div className="p-4 text-center text-slate-400 italic">لم يتم إضافة أصناف.</div>}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <div className="text-lg font-bold">الإجمالي: <span className="text-indigo-600">${newPO.items?.reduce((s, i) => s + (i.quantity * i.unitCost), 0).toLocaleString()}</span></div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setIsPOModalOpen(false)}>إلغاء</Button>
                            <Button onClick={handleSavePO} disabled={!newPO.supplierId || !newPO.items?.length}>تأكيد الطلب</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Purchasing;
