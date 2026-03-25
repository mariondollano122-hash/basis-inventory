import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const { user, canAccessAllCommittees, canEdit, canPrint } = useAuth();
  const { getInventoryByDepartment, getLowStockItems, getTransactionsByDepartment } = useInventory();
  const navigate = useNavigate();

  if (!user) return null;

  // Get data based on access level
  const inventory = canAccessAllCommittees() 
    ? getInventoryByDepartment(undefined as any) // All departments
    : getInventoryByDepartment(user.department!);
    
  const lowStockItems = getLowStockItems(10);
  
  const transactions = canAccessAllCommittees()
    ? getTransactionsByDepartment(undefined as any)
    : getTransactionsByDepartment(user.department!);
    
  const recentTransactions = transactions.slice(0, 5);

  const totalItems = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockCount = lowStockItems.filter(item => 
    canAccessAllCommittees() ? true : item.department === user.department
  ).length;

  const handleGenerateReport = () => {
    // Mock report generation
    const reportData = {
      role: user.role,
      department: user.department || 'All Committees',
      generatedBy: user.username,
      date: new Date().toLocaleDateString(),
      totalItems,
      totalStock,
      lowStockCount,
      inventory,
      transactions: recentTransactions,
    };

    // In a real application, this would generate a PDF or export to CSV
    console.log('Generating report:', reportData);
    alert(`Report generated for ${user.department || 'All Committees'}!\\n\\nTotal Items: ${totalItems}\\nTotal Stock: ${totalStock}\\nLow Stock Alerts: ${lowStockCount}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          {canAccessAllCommittees() 
            ? `${user.role} - All Committees Overview` 
            : `${user.department} Committee Overview`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Stock */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Current Stock
            </CardTitle>
            <Package className="w-5 h-5 text-navy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalStock}</div>
            <p className="text-xs text-slate-500 mt-1">
              Across {totalItems} items
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        {/* Items In (This Week) */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Recent Items In
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {transactions.filter(t => t.type === 'stock-in').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Incoming transactions
            </p>
          </CardContent>
        </Card>

        {/* Items Out (This Week) */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Recent Items Out
            </CardTitle>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {transactions.filter(t => t.type === 'stock-out').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Outgoing transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts Section */}
      {lowStockCount > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems
                .filter(item => canAccessAllCommittees() ? true : item.department === user.department)
                .slice(0, 5)
                .map((item, index) => (
                <div
                  key={`${item.itemName}-${item.department}-${index}`}
                  className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.itemName}</p>
                    <p className="text-sm text-slate-600">
                      {item.department} - Current: {item.currentStock} units
                    </p>
                  </div>
                  {canEdit() && (
                    <Button
                      size="sm"
                      onClick={() => navigate('/dashboard/new-transaction')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Restock
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/transactions')}
            className="border-slate-300"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No recent transactions</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === 'stock-in'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.type === 'stock-in' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{transaction.itemName}</p>
                      <p className="text-sm text-slate-600">
                        {transaction.type === 'stock-in' ? 'Stock In' : 'Stock Out'}: {transaction.quantity} units • {transaction.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">{new Date(transaction.date).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">by {transaction.addedBy}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Report Button - Only visible for Secretary */}
      {canPrint() && (
        <Card className="bg-gradient-to-br from-navy-700 to-navy-900 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Generate Summary Report
                </h3>
                <p className="text-slate-300">
                  Export comprehensive summary across all committees
                </p>
              </div>
              <Button
                onClick={handleGenerateReport}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <FileText className="w-5 h-5 mr-2" />
                Print Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}