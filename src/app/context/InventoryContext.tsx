import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, InventoryItem, Department, TransactionType } from '../types/inventory';

interface InventoryContextType {
  transactions: Transaction[];
  inventoryItems: InventoryItem[];
  addTransaction: (
    type: TransactionType,
    itemName: string,
    quantity: number,
    date: string,
    department: Department,
    addedBy: string
  ) => void;
  getInventoryByDepartment: (department: Department) => InventoryItem[];
  getTransactionsByDepartment: (department: Department) => Transaction[];
  getAllInventory: () => InventoryItem[];
  getLowStockItems: (threshold?: number) => InventoryItem[];
  deleteTransaction: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('basis_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    // Sample data matching the Excel file
    return [
      {
        id: '1',
        type: 'stock-in',
        itemName: 'First Aid kits',
        quantity: 20,
        date: '2026-03-23',
        department: 'Health',
        addedBy: 'secretary',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'stock-in',
        itemName: 'facemasks',
        quantity: 20,
        date: '2026-03-23',
        department: 'Health',
        addedBy: 'secretary',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        type: 'stock-in',
        itemName: 'hand sanitizer',
        quantity: 20,
        date: '2026-03-23',
        department: 'Health',
        addedBy: 'secretary',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        type: 'stock-out',
        itemName: 'facemasks',
        quantity: 5,
        date: '2026-03-23',
        department: 'Health',
        addedBy: 'health_head',
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('basis_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Calculate inventory items from transactions
  const calculateInventory = (): InventoryItem[] => {
    const itemMap = new Map<string, InventoryItem>();

    transactions.forEach((transaction) => {
      const key = `${transaction.itemName}-${transaction.department}`;
      
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          itemName: transaction.itemName,
          department: transaction.department,
          totalStockIn: 0,
          totalStockOut: 0,
          currentStock: 0,
          lastUpdated: transaction.date
        });
      }

      const item = itemMap.get(key)!;
      
      if (transaction.type === 'stock-in') {
        item.totalStockIn += transaction.quantity;
      } else {
        item.totalStockOut += transaction.quantity;
      }
      
      item.currentStock = item.totalStockIn - item.totalStockOut;
      
      // Update last updated date if this transaction is more recent
      if (new Date(transaction.date) > new Date(item.lastUpdated)) {
        item.lastUpdated = transaction.date;
      }
    });

    return Array.from(itemMap.values());
  };

  const inventoryItems = calculateInventory();

  const addTransaction = (
    type: TransactionType,
    itemName: string,
    quantity: number,
    date: string,
    department: Department,
    addedBy: string
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      itemName,
      quantity,
      date,
      department,
      addedBy,
      createdAt: new Date().toISOString()
    };

    setTransactions([...transactions, newTransaction]);
  };

  const getInventoryByDepartment = (department: Department): InventoryItem[] => {
    return inventoryItems.filter(item => item.department === department);
  };

  const getTransactionsByDepartment = (department: Department): Transaction[] => {
    return transactions.filter(t => t.department === department);
  };

  const getAllInventory = (): InventoryItem[] => {
    return inventoryItems;
  };

  const getLowStockItems = (threshold: number = 10): InventoryItem[] => {
    return inventoryItems.filter(item => item.currentStock <= threshold && item.currentStock > 0);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        transactions,
        inventoryItems,
        addTransaction,
        getInventoryByDepartment,
        getTransactionsByDepartment,
        getAllInventory,
        getLowStockItems,
        deleteTransaction
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
