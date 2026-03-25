import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import InventoryList from "./pages/InventoryList";
import TransactionHistory from "./pages/TransactionHistory";
import NewTransaction from "./pages/NewTransaction";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: InventoryList },
      { path: "transactions", Component: TransactionHistory },
      { path: "new-transaction", Component: NewTransaction },
      { path: "users", Component: UserManagement },
      { path: "settings", Component: Settings },
    ],
  },
]);