import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  PlusCircle, 
  Settings as SettingsIcon, 
  LogOut,
  Building2,
  Menu,
  X,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';

export default function DashboardLayout() {
  const { user, logout, canEdit, canPrint } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/inventory', icon: Package, label: 'Inventory List' },
    { path: '/dashboard/transactions', icon: History, label: 'Transaction History' },
    // Only show New Transaction if user can edit (not Captain)
    ...(canEdit() ? [{ path: '/dashboard/new-transaction', icon: PlusCircle, label: 'New Transaction' }] : []),
    // Only show User Management for Secretary
    ...(canPrint() ? [{ path: '/dashboard/users', icon: Users, label: 'User Management' }] : []),
    { path: '/dashboard/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-white flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-slate-800">
          <Logo size="sm" showText={true} variant="light" showOfficialLogos={false} />
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="font-semibold truncate">{user.username}</p>
            <p className="text-xs text-emerald-400 mt-1">{user.department}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${
                isActive(item.path)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white z-50 border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h1 className="font-bold">B.A.S.I.S.</h1>
          </div>
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="ghost"
            size="sm"
            className="text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="md:hidden fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-40 pt-16"
          >
            <div className="p-4 border-b border-slate-800">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="font-semibold truncate">{user.username}</p>
                <p className="text-xs text-emerald-400 mt-1">{user.department}</p>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  variant={isActive(item.path) ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive(item.path)
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 pt-16 md:pt-0">
        {/* Top Header with Official Logos */}
        <div className="bg-white border-b border-slate-200 py-4 px-6 md:px-8">
          <Logo size="sm" showText={true} variant="dark" showOfficialLogos={true} />
        </div>
        
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}