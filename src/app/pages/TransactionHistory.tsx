import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { 
  History, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  User
} from 'lucide-react';
import { getTransactionsByDepartment } from '../data/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function TransactionHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');

  if (!user) return null;

  const transactions = getTransactionsByDepartment(user.department);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
        <p className="text-slate-600 mt-1">
          {user.department} Department - {filteredTransactions.length} transactions
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by item name, ID, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-300"
              />
            </div>

            {/* Type Filter */}
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="bg-white border-slate-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="in">Items In</SelectItem>
                  <SelectItem value="out">Items Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
              </div>
              <History className="w-10 h-10 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700">Items In</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {transactions.filter(t => t.type === 'in').length}
                </p>
              </div>
              <ArrowUpRight className="w-10 h-10 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Items Out</p>
                <p className="text-2xl font-bold text-red-900">
                  {transactions.filter(t => t.type === 'out').length}
                </p>
              </div>
              <ArrowDownRight className="w-10 h-10 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No transactions found</p>
              <p className="text-slate-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.type === 'in'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }
                        >
                          <div className="flex items-center gap-1">
                            {transaction.type === 'in' ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {transaction.type === 'in' ? 'In' : 'Out'}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{transaction.itemName}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {transaction.quantity} {transaction.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {transaction.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <User className="w-4 h-4" />
                          {transaction.performedBy}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {transaction.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
