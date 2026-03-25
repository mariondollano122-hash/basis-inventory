import { Department } from '../context/AuthContext';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medical' | 'Equipment' | 'Supplies' | 'Educational' | 'Sports' | 'Agricultural' | 'Construction' | 'Office';
  quantity: number;
  unit: 'pcs' | 'boxes' | 'sets' | 'kg' | 'liters' | 'units';
  lowStockThreshold: number;
  department: Department;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out';
  quantity: number;
  unit: 'pcs' | 'boxes' | 'sets' | 'kg' | 'liters' | 'units';
  date: string;
  performedBy: string;
  notes?: string;
  department: Department;
}

// Mock inventory data for different departments
export const mockInventoryData: InventoryItem[] = [
  // Health
  { id: 'H001', name: 'First Aid Kits', category: 'Medical', quantity: 25, unit: 'boxes', lowStockThreshold: 10, department: 'Health', lastUpdated: '2026-03-08' },
  { id: 'H002', name: 'Face Masks', category: 'Medical', quantity: 500, unit: 'pcs', lowStockThreshold: 200, department: 'Health', lastUpdated: '2026-03-07' },
  { id: 'H003', name: 'Hand Sanitizer', category: 'Medical', quantity: 8, unit: 'liters', lowStockThreshold: 15, department: 'Health', lastUpdated: '2026-03-06' },
  { id: 'H004', name: 'Medical Gloves', category: 'Medical', quantity: 300, unit: 'pcs', lowStockThreshold: 100, department: 'Health', lastUpdated: '2026-03-08' },
  
  // Education
  { id: 'E001', name: 'Notebooks', category: 'Educational', quantity: 150, unit: 'pcs', lowStockThreshold: 50, department: 'Education', lastUpdated: '2026-03-08' },
  { id: 'E002', name: 'Pencils', category: 'Educational', quantity: 200, unit: 'pcs', lowStockThreshold: 100, department: 'Education', lastUpdated: '2026-03-07' },
  { id: 'E003', name: 'Whiteboards', category: 'Equipment', quantity: 12, unit: 'pcs', lowStockThreshold: 5, department: 'Education', lastUpdated: '2026-03-05' },
  { id: 'E004', name: 'Books', category: 'Educational', quantity: 85, unit: 'pcs', lowStockThreshold: 30, department: 'Education', lastUpdated: '2026-03-08' },
  
  // Justice
  { id: 'J001', name: 'Legal Forms', category: 'Office', quantity: 500, unit: 'pcs', lowStockThreshold: 200, department: 'Justice', lastUpdated: '2026-03-08' },
  { id: 'J002', name: 'Filing Cabinets', category: 'Equipment', quantity: 8, unit: 'units', lowStockThreshold: 3, department: 'Justice', lastUpdated: '2026-03-06' },
  { id: 'J003', name: 'Document Folders', category: 'Office', quantity: 150, unit: 'pcs', lowStockThreshold: 50, department: 'Justice', lastUpdated: '2026-03-07' },
  
  // Appropriation
  { id: 'A001', name: 'Office Supplies', category: 'Office', quantity: 75, unit: 'sets', lowStockThreshold: 25, department: 'Appropriation', lastUpdated: '2026-03-08' },
  { id: 'A002', name: 'Printer Paper', category: 'Office', quantity: 30, unit: 'boxes', lowStockThreshold: 15, department: 'Appropriation', lastUpdated: '2026-03-07' },
  { id: 'A003', name: 'Budget Forms', category: 'Office', quantity: 400, unit: 'pcs', lowStockThreshold: 100, department: 'Appropriation', lastUpdated: '2026-03-08' },
  
  // Peace and Order
  { id: 'P001', name: 'Flashlights', category: 'Equipment', quantity: 20, unit: 'pcs', lowStockThreshold: 10, department: 'Peace and Order', lastUpdated: '2026-03-08' },
  { id: 'P002', name: 'Whistles', category: 'Equipment', quantity: 35, unit: 'pcs', lowStockThreshold: 15, department: 'Peace and Order', lastUpdated: '2026-03-07' },
  { id: 'P003', name: 'Reflective Vests', category: 'Equipment', quantity: 5, unit: 'pcs', lowStockThreshold: 12, department: 'Peace and Order', lastUpdated: '2026-03-06' },
  { id: 'P004', name: 'Two-Way Radios', category: 'Equipment', quantity: 8, unit: 'units', lowStockThreshold: 6, department: 'Peace and Order', lastUpdated: '2026-03-08' },
  
  // Sports
  { id: 'S001', name: 'Basketballs', category: 'Sports', quantity: 15, unit: 'pcs', lowStockThreshold: 8, department: 'Sports', lastUpdated: '2026-03-08' },
  { id: 'S002', name: 'Volleyballs', category: 'Sports', quantity: 12, unit: 'pcs', lowStockThreshold: 6, department: 'Sports', lastUpdated: '2026-03-07' },
  { id: 'S003', name: 'Sports Cones', category: 'Sports', quantity: 40, unit: 'pcs', lowStockThreshold: 20, department: 'Sports', lastUpdated: '2026-03-08' },
  { id: 'S004', name: 'Jump Ropes', category: 'Sports', quantity: 25, unit: 'pcs', lowStockThreshold: 15, department: 'Sports', lastUpdated: '2026-03-07' },
  
  // Agriculture
  { id: 'AG001', name: 'Seedlings', category: 'Agricultural', quantity: 200, unit: 'pcs', lowStockThreshold: 50, department: 'Agriculture', lastUpdated: '2026-03-08' },
  { id: 'AG002', name: 'Fertilizer', category: 'Agricultural', quantity: 8, unit: 'kg', lowStockThreshold: 20, department: 'Agriculture', lastUpdated: '2026-03-06' },
  { id: 'AG003', name: 'Gardening Tools', category: 'Equipment', quantity: 18, unit: 'sets', lowStockThreshold: 8, department: 'Agriculture', lastUpdated: '2026-03-07' },
  { id: 'AG004', name: 'Watering Cans', category: 'Equipment', quantity: 22, unit: 'pcs', lowStockThreshold: 10, department: 'Agriculture', lastUpdated: '2026-03-08' },
  
  // Infrastructure
  { id: 'I001', name: 'Cement', category: 'Construction', quantity: 45, unit: 'boxes', lowStockThreshold: 20, department: 'Infrastructure', lastUpdated: '2026-03-08' },
  { id: 'I002', name: 'Paint', category: 'Construction', quantity: 6, unit: 'liters', lowStockThreshold: 15, department: 'Infrastructure', lastUpdated: '2026-03-05' },
  { id: 'I003', name: 'Tools Set', category: 'Equipment', quantity: 12, unit: 'sets', lowStockThreshold: 6, department: 'Infrastructure', lastUpdated: '2026-03-07' },
  { id: 'I004', name: 'Safety Helmets', category: 'Equipment', quantity: 18, unit: 'pcs', lowStockThreshold: 10, department: 'Infrastructure', lastUpdated: '2026-03-08' },
];

// Mock transaction data
export const mockTransactionData: Transaction[] = [
  { id: 'T001', itemId: 'H001', itemName: 'First Aid Kits', type: 'in', quantity: 10, unit: 'boxes', date: '2026-03-08', performedBy: 'Admin', department: 'Health', notes: 'Monthly restock' },
  { id: 'T002', itemId: 'H002', itemName: 'Face Masks', type: 'out', quantity: 50, unit: 'pcs', date: '2026-03-07', performedBy: 'Health Officer', department: 'Health', notes: 'Community distribution' },
  { id: 'T003', itemId: 'E001', itemName: 'Notebooks', type: 'in', quantity: 100, unit: 'pcs', date: '2026-03-07', performedBy: 'Education Admin', department: 'Education', notes: 'School supplies' },
  { id: 'T004', itemId: 'S001', itemName: 'Basketballs', type: 'out', quantity: 3, unit: 'pcs', date: '2026-03-06', performedBy: 'Sports Coordinator', department: 'Sports', notes: 'Youth program' },
  { id: 'T005', itemId: 'I001', itemName: 'Cement', type: 'in', quantity: 20, unit: 'boxes', date: '2026-03-06', performedBy: 'Infrastructure Head', department: 'Infrastructure', notes: 'Road repair project' },
];

// Helper function to get inventory by department
export const getInventoryByDepartment = (department?: Department): InventoryItem[] => {
  if (!department) return mockInventoryData; // Return all if undefined
  return mockInventoryData.filter(item => item.department === department);
};

// Helper function to get transactions by department
export const getTransactionsByDepartment = (department?: Department): Transaction[] => {
  if (!department) return mockTransactionData; // Return all if undefined
  return mockTransactionData.filter(transaction => transaction.department === department);
};

// Helper function to get low stock items
export const getLowStockItems = (department?: Department): InventoryItem[] => {
  if (!department) {
    // Return all low stock items across all departments
    return mockInventoryData.filter(item => item.quantity <= item.lowStockThreshold);
  }
  return mockInventoryData.filter(
    item => item.department === department && item.quantity <= item.lowStockThreshold
  );
};