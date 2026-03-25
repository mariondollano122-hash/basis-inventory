import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Download, 
  BookOpen,
  Database,
  RefreshCw,
  Save,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

export default function Settings() {
  const { user } = useAuth();
  const [isBackingUp, setIsBackingUp] = useState(false);

  if (!user) return null;

  const handleBackup = () => {
    setIsBackingUp(true);
    
    // Simulate backup process
    setTimeout(() => {
      // In a real application, this would generate and download backup files
      const backupData = {
        department: user.department,
        generatedBy: user.username,
        date: new Date().toISOString(),
        inventory: [], // Would include actual inventory data
        transactions: [], // Would include actual transaction data
      };

      console.log('Backup data:', backupData);
      
      toast.success('Backup completed successfully! Ready for USB export.');
      setIsBackingUp(false);
    }, 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your account and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={user.username}
                  disabled
                  className="bg-slate-50 border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-slate-50 border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  type="text"
                  value={user.department}
                  disabled
                  className="bg-slate-50 border-slate-300"
                />
              </div>

              <p className="text-sm text-slate-500">
                Contact your administrator to update profile information
              </p>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="bg-white border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-white border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-white border-slate-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sustainability Module */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                3-Month Transition Phase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                During the 3-month transition period, we provide resources to help you adapt to the new digital system.
              </p>

              <Separator />

              {/* User Manual */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">Digital User Manual</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Comprehensive guide covering all system features and best practices
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View User Manual
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>B.A.S.I.S. User Manual</DialogTitle>
                        <DialogDescription>
                          Comprehensive guide for the Balintawak Automated Storage and Inventory System
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <section>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Getting Started</h3>
                          <p className="text-sm text-slate-600">
                            Welcome to B.A.S.I.S. This system replaces manual record-keeping with an efficient digital solution
                            for managing inventory across all barangay committees.
                          </p>
                        </section>

                        <Separator />

                        <section>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Dashboard Overview</h3>
                          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>View real-time inventory statistics</li>
                            <li>Monitor low stock alerts</li>
                            <li>Track recent transactions</li>
                            <li>Generate department reports</li>
                          </ul>
                        </section>

                        <Separator />

                        <section>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Recording Transactions</h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                            <li>Navigate to "New Transaction" from the sidebar</li>
                            <li>Select transaction type (Items In or Items Out)</li>
                            <li>Enter item details including name, category, quantity, and unit</li>
                            <li>Add optional notes for context</li>
                            <li>Review and submit the transaction</li>
                          </ol>
                        </section>

                        <Separator />

                        <section>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Managing Inventory</h3>
                          <p className="text-sm text-slate-600 mb-2">
                            The Inventory List provides a comprehensive view of all items in your department's custody.
                          </p>
                          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Search items by name or ID</li>
                            <li>View current stock levels</li>
                            <li>Monitor stock status (In Stock, Low Stock, Out of Stock)</li>
                            <li>Check last update dates</li>
                          </ul>
                        </section>

                        <Separator />

                        <section>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Best Practices</h3>
                          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>Record transactions immediately when items are received or distributed</li>
                            <li>Double-check quantities before submitting</li>
                            <li>Use consistent naming for items</li>
                            <li>Add notes to provide context for unusual transactions</li>
                            <li>Regularly review low stock alerts</li>
                            <li>Generate monthly reports for record-keeping</li>
                          </ul>
                        </section>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* System Backup */}
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <HardDrive className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">System Backup (USB Export)</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Export your department's data for offline storage and backup purposes
                  </p>
                  <Button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Create Backup
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="bg-gradient-to-br from-navy-700 to-navy-900 text-white border-0">
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Status</span>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <span className="text-slate-300">Role</span>
                <span className="font-semibold">Committee Member</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Access Level</span>
                <span className="font-semibold">{user.department}</span>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-800">
              <p>
                If you encounter any issues or have questions about using the system, please contact:
              </p>
              <div className="bg-white/50 rounded p-3 space-y-1">
                <p className="font-semibold">System Administrator</p>
                <p className="text-xs">Barangay Balintawak IT Office</p>
                <p className="text-xs">Email: admin@balintawak.gov.ph</p>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Version</span>
                <span className="font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Updated</span>
                <span className="font-semibold">March 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Transition Phase</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
