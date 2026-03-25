import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </InventoryProvider>
    </AuthProvider>
  );
}