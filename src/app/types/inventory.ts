export type Department = 
  | 'Health'
  | 'Education'
  | 'Justice'
  | 'Appropriation'
  | 'Peace and Order'
  | 'Sports'
  | 'Agriculture'
  | 'Infrastructure';

export type TransactionType = 'stock-in' | 'stock-out';

export interface Transaction {
  id: string;
  type: TransactionType;
  itemName: string;
  quantity: number;
  date: string; // ISO date string
  department: Department;
  addedBy: string; // username of who added the transaction
  createdAt: string; // timestamp when transaction was created
}

export interface InventoryItem {
  itemName: string;
  department: Department;
  totalStockIn: number;
  totalStockOut: number;
  currentStock: number;
  lastUpdated: string;
}

export interface InventorySummary {
  totalItems: number;
  totalStockIn: number;
  totalStockOut: number;
  lowStockItems: number;
  recentTransactions: Transaction[];
}
