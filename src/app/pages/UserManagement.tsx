import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAllUsers, 
  exportUsersToCSV, 
  exportUsersToJSON,
  importUsersFromJSON,
  resetUsersToDefault,
  User 
} from '../data/users';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Download, 
  Upload, 
  RefreshCw,
  Shield,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export default function UserManagement() {
  const { user: currentUser, canPrint } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Only Secretary can access this page
    if (!canPrint()) {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [canPrint, navigate]);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  const handleExportCSV = () => {
    try {
      const csv = exportUsersToCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BASIS_Users_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('User database exported to CSV successfully!');
    } catch (error) {
      toast.error('Failed to export users to CSV');
    }
  };

  const handleExportJSON = () => {
    try {
      const json = exportUsersToJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BASIS_Users_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('User database exported to JSON successfully!');
    } catch (error) {
      toast.error('Failed to export users to JSON');
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const success = importUsersFromJSON(text);
        
        if (success) {
          loadUsers();
          toast.success('User database imported successfully!');
        } else {
          toast.error('Failed to import users. Please check the file format.');
        }
      } catch (error) {
        toast.error('Failed to read file');
      }
    };
    input.click();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all users to default? This will overwrite any changes made.')) {
      resetUsersToDefault();
      loadUsers();
      toast.success('User database reset to default settings');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Barangay Captain':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Secretary':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Committee Head':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (!canPrint()) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">
            Manage all authorized users in the B.A.S.I.S. system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleImportJSON}
            className="border-slate-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
          <Button
            variant="outline"
            onClick={handleExportJSON}
            className="border-slate-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="w-5 h-5" />
            Excel Import Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900">
          <div>
            <p className="font-semibold mb-2">To import user data from Excel:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Click "Export CSV" to download the current user database</li>
              <li>Open the CSV file in Microsoft Excel</li>
              <li>Edit the user information as needed (keep the same columns)</li>
              <li>Save the file in Excel</li>
              <li>Save As &gt; CSV (Comma delimited) format</li>
              <li>Convert the CSV to JSON using an online converter (csv2json.com)</li>
              <li>Click "Import JSON" to upload the updated file</li>
            </ol>
          </div>
          <div className="border-t border-blue-300 pt-3">
            <p className="font-semibold">Note:</p>
            <p>The system requires exactly 10 users at all times. Make sure your file contains all 10 authorized users.</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Committee Heads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {users.filter(u => u.role === 'Committee Head').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {users.filter(u => u.role === 'Secretary' || u.role === 'Barangay Captain').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.lastLogin).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>Complete list of authorized system users</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleResetToDefault}
              className="border-slate-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-navy-100 rounded-full">
                    <Shield className="w-6 h-6 text-navy-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{user.fullName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      {user.department && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                          {user.department}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {user.username}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.contactNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {user.lastLogin 
                      ? `Last login: ${new Date(user.lastLogin).toLocaleDateString()}`
                      : 'Never logged in'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Card */}
      <Card className="bg-gradient-to-br from-navy-700 to-navy-900 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Database Backup</h3>
              <p className="text-slate-300">
                Regularly export your user database to maintain backups
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportCSV}
                className="bg-white text-navy-900 hover:bg-slate-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Backup to CSV
              </Button>
              <Button
                onClick={handleExportJSON}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Backup to JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
