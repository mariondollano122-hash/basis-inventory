import { useState } from 'react';
import { useAuth, Department } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { PlusCircle, ArrowUpRight, ArrowDownRight, Save } from 'lucide-react';
import { toast } from 'sonner';

type TransactionType = 'in' | 'out';
type Unit = 'pcs' | 'boxes' | 'sets' | 'kg' | 'liters' | 'units';
type Category = 'Medical' | 'Equipment' | 'Supplies' | 'Educational' | 'Sports' | 'Agricultural' | 'Construction' | 'Office';

export default function NewTransaction() {
  const { user, canEdit } = useAuth();
  const { addTransaction } = useInventory();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transactionType: 'in' as TransactionType,
    itemName: '',
    quantity: '',
    unit: '' as Unit | '',
    category: '' as Category | '',
    notes: '',
    department: (user?.department || '') as Department | '',
  });

  const [useExistingItem, setUseExistingItem] = useState(true);

  // List of all departments
  const allDepartments: Department[] = [
    'Health',
    'Education',
    'Justice',
    'Appropriation',
    'Peace and Order',
    'Sports',
    'Agriculture',
    'Infrastructure'
  ];

  if (!user) return null;
  
  // Redirect if user cannot edit (e.g., Barangay Captain)
  if (!canEdit()) {
    navigate('/dashboard');
    return null;
  }

  // Check if user is Secretary (can add to any department)
  const isSecretary = user.role === 'Secretary';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.itemName || !formData.quantity || !formData.unit || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get department (from form if Secretary, from user if Committee Head)
    const department = isSecretary ? formData.department : user.department;
    
    if (!department) {
      toast.error('Please select a department');
      return;
    }

    // Convert transaction type to match InventoryContext format
    const transactionType = formData.transactionType === 'in' ? 'stock-in' : 'stock-out';
    const currentDate = new Date().toISOString().split('T')[0];

    // Add transaction to inventory using InventoryContext
    addTransaction(
      transactionType,
      formData.itemName,
      parseInt(formData.quantity),
      currentDate,
      department,
      user.username
    );

    toast.success(
      `Transaction recorded: ${formData.transactionType === 'in' ? 'Added' : 'Removed'} ${formData.quantity} ${formData.unit} of ${formData.itemName}`
    );

    // Reset form
    setFormData({
      transactionType: 'in',
      itemName: '',
      quantity: '',
      unit: '',
      category: '',
      notes: '',
      department: isSecretary ? '' : (user?.department || ''),
    });

    // Navigate to transactions page after short delay
    setTimeout(() => {
      navigate('/dashboard/transactions');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">New Transaction</h1>
        <p className="text-slate-600 mt-1">
          Record incoming or outgoing items for {user.department} department
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Type */}
                <div className="space-y-3">
                  <Label>Transaction Type *</Label>
                  <RadioGroup
                    value={formData.transactionType}
                    onValueChange={(value: TransactionType) =>
                      setFormData({ ...formData, transactionType: value })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex-1">
                      <RadioGroupItem value="in" id="type-in" />
                      <Label htmlFor="type-in" className="flex items-center gap-2 cursor-pointer">
                        <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold">Items In</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-4 flex-1">
                      <RadioGroupItem value="out" id="type-out" />
                      <Label htmlFor="type-out" className="flex items-center gap-2 cursor-pointer">
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                        <span className="font-semibold">Items Out</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Department Selection - Only for Secretary */}
                {isSecretary && (
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value: Department) => setFormData({ ...formData, department: value })}
                      required
                    >
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      Select which department this transaction belongs to
                    </p>
                  </div>
                )}

                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input
                    id="item-name"
                    type="text"
                    placeholder="Enter item name"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="bg-white border-slate-300"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Enter the exact name of the item being transacted
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Category) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="bg-white border-slate-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Supplies">Supplies</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value: Unit) => setFormData({ ...formData, unit: value })}
                      required
                    >
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                        <SelectItem value="sets">Sets</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="units">Units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes or comments..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-white border-slate-300 min-h-24"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Record Transaction
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Transaction Summary */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <CardHeader>
              <CardTitle className="text-lg">Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Department</span>
                <span className="font-semibold">
                  {isSecretary 
                    ? (formData.department || 'Not selected') 
                    : user.department}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Type</span>
                <span
                  className={`font-semibold ${
                    formData.transactionType === 'in' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formData.transactionType === 'in' ? 'Items In' : 'Items Out'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Performed By</span>
                <span className="font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Date</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-800">
              <div className="flex gap-2">
                <span className="font-semibold">•</span>
                <p>Ensure all required fields are filled accurately</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">•</span>
                <p>Double-check quantities before submitting</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">•</span>
                <p>Add notes for special conditions or details</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">•</span>
                <p>For new items, enter the exact item name</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}