
import React, { useState } from 'react';
import { Plus, Search, MapPin, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { InventoryItem, ProductCategory } from '../../types';
import { db } from '../../services/database';
import { Button, Input, PageHeader, Select, Card } from '../../components/common/UIComponents';
import { CLASSES } from '../../styles/designSystem';
import ProductModal from './components/ProductModal';
import ProductGrid from './components/ProductGrid';

interface InventoryProps {
    selectedBranchId: string;
    productCategories?: ProductCategory[];
}

const Inventory: React.FC<InventoryProps> = ({ selectedBranchId, productCategories = [] }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => db.inventory.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const branchItems = selectedBranchId === 'HQ' ? items : items.filter(i => i.branchId === selectedBranchId);
  const filteredItems = branchItems.filter(i => 
      (catFilter === 'All' || i.category === catFilter) &&
      (i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Inventory Statistics
  const totalValue = filteredItems.reduce((sum, i) => sum + (i.price * i.stock), 0);
  const totalCost = filteredItems.reduce((sum, i) => sum + ((i.costPrice || 0) * i.stock), 0);
  const potentialProfit = totalValue - totalCost;
  const lowStockCount = filteredItems.filter(i => i.stock <= 5).length;

  const handleSaveItem = (item: Partial<InventoryItem>) => {
      let updated;
      if (item.id) {
          updated = items.map(i => i.id === item.id ? { ...i, ...item } as InventoryItem : i);
      } else {
          const newItem: InventoryItem = {
              id: `INV-${Date.now()}`,
              name: item.name!, sku: item.sku!, category: item.category || 'عام', price: item.price || 0,
              stock: item.stock || 0, description: item.description || '', media: [], material: '',
              branchId: selectedBranchId === 'HQ' ? 'NY' : selectedBranchId, components: [],
              costPrice: item.costPrice || 0,
              ...item
          };
          updated = [newItem, ...items];
      }
      setItems(updated);
      db.inventory.save(updated);
  };

  return (
    <div className={CLASSES.pageContainer}>
      <PageHeader 
        title="إدارة المخزون" 
        subtitle={
           <div className="flex items-center gap-2">
            <span>تتبع المخزون وإدارة المنتجات. عرض:</span>
            <span className="font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedBranchId}</span>
          </div>
        }
        actions={<Button onClick={() => setIsModalOpen(true)}><Plus className="w-5 h-5 ml-2" /> إضافة منتج</Button>}
      />

      {/* Inventory KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="p-4" className="bg-indigo-50 border-indigo-100">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Package className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase">إجمالي الأصناف</p>
                      <p className="text-xl font-bold text-indigo-900">{filteredItems.length}</p>
                  </div>
              </div>
          </Card>
          <Card padding="p-4" className="bg-emerald-50 border-emerald-100">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><DollarSign className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase">القيمة البيعية</p>
                      <p className="text-xl font-bold text-emerald-700">${totalValue.toLocaleString()}</p>
                  </div>
              </div>
          </Card>
          <Card padding="p-4" className="bg-blue-50 border-blue-100">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-blue-500 uppercase">الربح المتوقع</p>
                      <p className="text-xl font-bold text-blue-700">${potentialProfit.toLocaleString()}</p>
                  </div>
              </div>
          </Card>
          <Card padding="p-4" className="bg-amber-50 border-amber-100">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertTriangle className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-amber-500 uppercase">مخزون منخفض</p>
                      <p className="text-xl font-bold text-amber-700">{lowStockCount} أصناف</p>
                  </div>
              </div>
          </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input className="pr-10" placeholder="بحث بالاسم أو الكود (SKU)..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="w-full md:w-64">
              <Select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="All">كل الأقسام</option>
                  {productCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
          </div>
      </div>

      <ProductGrid items={filteredItems} />

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} categories={productCategories} />
    </div>
  );
};

export default Inventory;
