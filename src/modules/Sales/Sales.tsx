
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { SalesOrder, OrderItem, InventoryItem, Customer, PaymentMethod, ProductCategory, GeoRegion, Employee, Branch, AccountCategory, OrderItemCustomization, Transaction, SystemConfig } from '../../types';
import { db } from '../../services/database';
import AddCustomerModal from '../Shared/AddCustomerModal';
import NewOrderModal from './components/NewOrderModal';
import OrderDetailModal from './components/OrderDetailModal';
import OrderList from './components/OrderList';
import ProductPicker from './components/ProductPicker';
import { Button, Input, Select, PageHeader } from '../../components/common/UIComponents';
import { CLASSES } from '../../styles/designSystem';

interface SalesProps {
    selectedBranchId: string;
    paymentMethods: PaymentMethod[];
    productCategories?: ProductCategory[];
    geoConfig: GeoRegion[];
    branches: Branch[];
    accountCategories: AccountCategory[];
    systemConfig?: SystemConfig;
}

const Sales: React.FC<SalesProps> = ({ selectedBranchId, productCategories = [], geoConfig, branches, paymentMethods, accountCategories, systemConfig }) => {
  const [orders, setOrders] = useState<SalesOrder[]>(() => db.orders.getAll());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.inventory.getAll());
  const [customers, setCustomers] = useState<Customer[]>(() => db.customers.getAll());
  const [employees, setEmployees] = useState<Employee[]>(() => db.employees.getAll());
  const [transactions, setTransactions] = useState<Transaction[]>(() => db.transactions.getAll());
  
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // New Order Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [salesRepId, setSalesRepId] = useState('');
  const [orderScope, setOrderScope] = useState('');
  const [systemDate, setSystemDate] = useState(new Date().toISOString().split('T')[0]);
  const [showroomDate, setShowroomDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [manualContractId, setManualContractId] = useState(''); 
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [contractSnapshot, setContractSnapshot] = useState('');

  // --- FILTERING LOGIC ---
  const branchOrders = selectedBranchId === 'HQ' ? orders : orders.filter(o => o.branchId === selectedBranchId);
  const branchInventory = selectedBranchId === 'HQ' ? inventory : inventory.filter(i => i.branchId === selectedBranchId);
  const branchCustomers = selectedBranchId === 'HQ' ? customers : customers.filter(c => c.branchId === selectedBranchId);

  const filteredOrders = branchOrders.filter(o => 
      (statusFilter === 'All' || o.status === statusFilter) && 
      (o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.systemOrderId.toString().includes(searchTerm))
  );

  // --- HANDLERS ---
  const handleAddToCart = (item: InventoryItem) => {
      const existing = cart.find(x => x.productId === item.id);
      const itemComponents = item.components ? item.components.map(c => ({ ...c, customizations: { isTextile: false, isMeasures: false, isOther: false, note: '' } })) : [];
      
      if (existing) {
          setCart(cart.map(x => x.productId === item.id ? { ...x, quantity: x.quantity + 1 } : x));
      } else {
          setCart([...cart, { 
              productId: item.id, 
              productName: item.name, 
              price: item.price, 
              quantity: 1, 
              components: itemComponents, 
              customizations: { isTextile: false, isMeasures: false, isOther: false, note: '' } 
          }]);
      }
      setIsProductPickerOpen(false);
  };

  const updateCartQty = (id: string, delta: number) => {
      setCart(cart.map(item => item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const updateCartPrice = (id: string, price: number) => {
      setCart(cart.map(item => item.productId === id ? { ...item, price } : item));
  };

  const removeFromCart = (id: string) => setCart(cart.filter(x => x.productId !== id));

  const toggleCartCustomization = (id: string, field: keyof OrderItemCustomization) => {
      setCart(cart.map(item => item.productId === id ? { ...item, customizations: { ...item.customizations, [field]: !item.customizations?.[field] } } as OrderItem : item));
  };

  const updateCartCustomizationNote = (id: string, note: string) => {
      setCart(cart.map(item => item.productId === id ? { ...item, customizations: { ...item.customizations, note } } as OrderItem : item));
  };

  const updateComponentQty = (prodId: string, idx: number, qty: number) => {
      setCart(cart.map(item => item.productId === prodId && item.components ? { ...item, components: item.components.map((c, i) => i === idx ? { ...c, quantity: Math.max(0, qty) } : c) } : item));
  };

  const updateComponentName = (prodId: string, idx: number, name: string) => {
      setCart(cart.map(item => item.productId === prodId && item.components ? { ...item, components: item.components.map((c, i) => i === idx ? { ...c, name } : c) } : item));
  };

  const toggleComponentFlag = (prodId: string, idx: number, field: keyof OrderItemCustomization) => {
      setCart(cart.map(item => item.productId === prodId && item.components ? { ...item, components: item.components.map((c, i) => i === idx ? { ...c, customizations: { ...c.customizations, [field]: !c.customizations?.[field] } as OrderItemCustomization } : c) } : item));
  };

  const handleCompleteSale = () => {
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (!customer) return;
      
      const nextSystemId = orders.reduce((max, o) => Math.max(max, o.systemOrderId || 0), 1000) + 1;
      const prefix = systemConfig?.orderPrefix || 'ORD';
      
      const orderBranchId = selectedBranchId === 'HQ' ? (branches[0]?.id || 'NY') : selectedBranchId;

      const newOrder: SalesOrder = {
          id: `${prefix}-${Date.now()}`, 
          systemOrderId: nextSystemId, 
          manualContractId,
          date: systemDate, 
          showroomDate, 
          deliveryDate, 
          customerId: customer.id, 
          customerName: customer.name, 
          salesRepId,
          items: cart, 
          totalAmount: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0), 
          paidAmount: 0, 
          status: 'Pending',
          paymentMethod: 'On Account', 
          branchId: orderBranchId, 
          scope: orderScope || 'عام', 
          contractSnapshot
      };
      
      const updated = [newOrder, ...orders];
      setOrders(updated); 
      db.orders.save(updated);
      
      const updatedCustomers = customers.map(c => c.id === customer.id ? { ...c, totalSales: c.totalSales + newOrder.totalAmount } : c);
      setCustomers(updatedCustomers);
      db.customers.save(updatedCustomers);
      
      setIsNewOrderModalOpen(false); 
      setCart([]); 
      setManualContractId('');
      setOrderScope('');
      setContractSnapshot('');
      
      alert(`تم إنشاء الطلب #${newOrder.systemOrderId} للفرع ${orderBranchId}`);
  };

  const handleAddCustomer = (c: Customer) => {
      const updated = [c, ...customers];
      setCustomers(updated);
      db.customers.save(updated);
      setSelectedCustomerId(c.id);
      setIsAddCustomerModalOpen(false);
  };
  
  const handleAddExpense = (amount: number, description: string, category: string, paymentMethod: string) => {
      if (!selectedOrder) return;
      
      const tx: Transaction = {
          id: `EXP-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `مصروفات طلب #${selectedOrder.systemOrderId}: ${description}`,
          amount,
          type: 'Expense',
          category,
          status: 'Completed',
          branchId: selectedOrder.branchId,
          orderId: selectedOrder.id,
          paymentMethod
      };
      
      const updated = [tx, ...transactions];
      setTransactions(updated);
      db.transactions.save(updated);
  };

  return (
    <div className={CLASSES.pageContainer}>
      <PageHeader 
        title="طلبات المبيعات" 
        subtitle={
            <div className="flex items-center gap-2">
                <span>إدارة العمليات لفرع:</span>
                <span className="font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                    {selectedBranchId}
                </span>
            </div>
        }
        actions={<Button onClick={() => setIsNewOrderModalOpen(true)}><Plus className="w-5 h-5 ml-2" /> طلب جديد</Button>}
      />

      <div className={`${CLASSES.section} p-4 flex flex-col md:flex-row gap-4`}>
          <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <Input className="pr-10 w-full" placeholder="بحث في الطلبات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="md:w-48">
              <option value="All">كل الحالات</option>
              <option value="Pending">قيد الانتظار</option>
              <option value="Completed">مكتمل</option>
          </Select>
      </div>

      <OrderList orders={filteredOrders} onSelectOrder={setSelectedOrder} />

      <NewOrderModal 
        isOpen={isNewOrderModalOpen} onClose={() => setIsNewOrderModalOpen(false)}
        nextSystemId={orders.reduce((max, o) => Math.max(max, o.systemOrderId || 0), 1000) + 1} 
        customers={branchCustomers} employees={employees} cart={cart} cartTotal={cart.reduce((s, i) => s + (i.price*i.quantity), 0)}
        selectedCustomerId={selectedCustomerId} setSelectedCustomerId={setSelectedCustomerId}
        salesRepId={salesRepId} setSalesRepId={setSalesRepId}
        systemDate={systemDate} setSystemDate={setSystemDate}
        showroomDate={showroomDate} setShowroomDate={setShowroomDate}
        deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate}
        orderScope={orderScope} setOrderScope={setOrderScope}
        manualContractId={manualContractId} setManualContractId={setManualContractId}
        contractSnapshot={contractSnapshot} handleFileChange={(e) => {
            if(e.target.files?.[0]) {
                const r = new FileReader();
                r.onload = () => setContractSnapshot(r.result as string);
                r.readAsDataURL(e.target.files[0]);
            }
        }}
        onOpenProductPicker={() => setIsProductPickerOpen(true)} onOpenAddCustomer={() => setIsAddCustomerModalOpen(true)}
        updateCartQty={updateCartQty} updateCartPrice={updateCartPrice} removeFromCart={removeFromCart} 
        toggleCartCustomization={toggleCartCustomization} updateCartCustomizationNote={updateCartCustomizationNote}
        updateComponentQty={updateComponentQty} updateComponentName={updateComponentName} toggleComponentFlag={toggleComponentFlag}
        onSubmit={handleCompleteSale} formatCurrency={(v) => v.toLocaleString()}
      />

      <ProductPicker 
          isOpen={isProductPickerOpen} 
          onClose={() => setIsProductPickerOpen(false)} 
          inventory={branchInventory}
          onAddToCart={handleAddToCart}
      />

      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onUpdateStatus={(s) => { if(selectedOrder) { const updated = orders.map(o => o.id === selectedOrder.id ? {...o, status: s} as SalesOrder : o); setOrders(updated); db.orders.save(updated); setSelectedOrder({...selectedOrder, status: s}); } }}
        onPrint={() => { setTimeout(() => window.print(), 100); }} 
        transactions={transactions.filter(t => t.orderId === selectedOrder?.id)}
        onAddExpense={handleAddExpense}
        accountCategories={accountCategories}
        paymentMethods={paymentMethods}
      />
      
      <AddCustomerModal isOpen={isAddCustomerModalOpen} onClose={() => setIsAddCustomerModalOpen(false)} onSave={handleAddCustomer} geoConfig={geoConfig} selectedBranchId={selectedBranchId}/>
    </div>
  );
};

export default Sales;
