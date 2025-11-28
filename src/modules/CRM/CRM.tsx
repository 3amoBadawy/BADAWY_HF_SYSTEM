
import React, { useState } from 'react';
import { Customer, GeoRegion, PaymentMethod, SalesOrder, Transaction } from '../../types';
import { db } from '../../services/database';
import AddCustomerModal from '../Shared/AddCustomerModal';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';

interface CRMProps {
    selectedBranchId: string;
    geoConfig: GeoRegion[];
    paymentMethods: PaymentMethod[];
}

const CRM: React.FC<CRMProps> = ({ selectedBranchId, geoConfig }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => db.customers.getAll());
  const [orders, setOrders] = useState<SalesOrder[]>(() => db.orders.getAll());
  const [transactions, setTransactions] = useState<Transaction[]>(() => db.transactions.getAll());
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCustomers = customers.filter(c => selectedBranchId === 'HQ' || c.branchId === selectedBranchId);

  const handleAdd = (c: Customer) => {
      const updated = [c, ...customers];
      setCustomers(updated);
      db.customers.save(updated);
      setIsAddModalOpen(false);
      setSelectedCustomer(c);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      <CustomerList 
        customers={filteredCustomers} 
        selectedId={selectedCustomer?.id} 
        onSelect={setSelectedCustomer} 
        onAdd={() => setIsAddModalOpen(true)} 
        branchName={selectedBranchId} 
      />
      <div className="w-full md:w-2/3 overflow-y-auto">
          <CustomerDetail 
            customer={selectedCustomer} 
            orders={orders}
            transactions={transactions}
          />
      </div>
      <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAdd} geoConfig={geoConfig} selectedBranchId={selectedBranchId}/>
    </div>
  );
};

export default CRM;
