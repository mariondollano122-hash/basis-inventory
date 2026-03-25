import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, AlertTriangle, Package, Calendar } from 'lucide-react';
import { getInventoryByDepartment } from '../data/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export default function InventoryList() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const inventory = getInventoryByDepartment(user.department);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700 border-red-200' };
    if (quantity <= threshold) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory List</h1>
          <p className="text-slate-600 mt-1">
            {user.department} Department - {filteredInventory.length} items
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-300"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            All Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No items found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item.quantity, item.lowStockThreshold);
                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell className="font-semibold">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-300">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={item.quantity <= item.lowStockThreshold ? 'text-amber-600 font-semibold' : ''}>
                            {item.quantity}
                          </span>
                          {item.quantity <= item.lowStockThreshold && (
                            <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-600" />
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600">{item.unit}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {item.lastUpdated}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Items</p>
                <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
              </div>
              <Package className="w-10 h-10 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700">In Stock</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {inventory.filter(i => i.quantity > i.lowStockThreshold).length}
                </p>
              </div>
              <Package className="w-10 h-10 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700">Low/Out of Stock</p>
                <p className="text-2xl font-bold text-amber-900">
                  {inventory.filter(i => i.quantity <= i.lowStockThreshold).length}
                </p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
