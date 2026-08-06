import { Routes, Route } from "react-router-dom";

// Customer Pages
import LoginPage from "./pages/Login";
import Auth from "./pages/Auth";
import Otp from "./pages/Otp";
import Location from "./pages/Location";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Profile from "./pages/ProfilePage";
import Orders from "./pages/Orders";
// import OrderDetails from "./pages/OrderDetails";
import TrackOrder from "./pages/TrackOrder";
import AddressManagementPage from "./pages/AddressManagementPage";
import NotificationPage from "./pages/NotificationPage";

// Admin Layout
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts, {
  AddProductPage,
  EditProductPage,
} from "./pages/admin/Products";

import AdminCategories, {
  AddCategoryPage,
  EditCategoryPage,
} from "./pages/admin/Categories";

import OrdersPage, {
  OrderDetailsPage,
  PendingOrdersPage,
  ProcessingOrdersPage,
  ShippedOrdersPage,
  DeliveredOrdersPage,
  CancelledOrdersPage,
  ReturnedOrdersPage,
  RefundOrdersPage,
} from "./pages/admin/Orders";

import CustomersPage, {
  DeletedCustomersPage,
  CustomerDetailsPage,
  ActiveCustomersPage,
  BlockedCustomersPage,
  PremiumCustomersPage,
  AddCustomerPage,
  EditCustomerPage,
} from "./pages/admin/Customer";

import Settings from "./pages/admin/Setting/Settings";

import AdminNotifications from "./pages/admin/Notification";
import AdminProfile from "./pages/admin/Profile";

// Dashboard Provider
import { DashboardProvider } from "./Context/dashboardContext";

function App() {
  return (
    <Routes>

      {/* ================= CUSTOMER ================= */}

      <Route path="/" element={<LoginPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/location" element={<Location />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/products" element={<ProductDetails />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
{/* <Route path="/orders/:id" element={<OrderDetails />} /> */}
<Route path="/orders/:id/track" element={<TrackOrder />} />
      <Route path="/addresses" element={<AddressManagementPage />} />
      <Route path="/notifications" element={<NotificationPage />} />

      {/* ================= ADMIN LOGIN ================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= ADMIN PANEL ================= */}

      <Route path="/admin" element={<AdminLayout />}>

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={
            <DashboardProvider>
              <AdminDashboard />
            </DashboardProvider>
          }
        />

        {/* Products */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />

        {/* Categories */}
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/add" element={<AddCategoryPage />} />
        <Route path="categories/edit/:id" element={<EditCategoryPage />} />

        {/* Orders */}
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/pending" element={<PendingOrdersPage />} />
        <Route path="orders/processing" element={<ProcessingOrdersPage />} />
        <Route path="orders/shipped" element={<ShippedOrdersPage />} />
        <Route path="orders/delivered" element={<DeliveredOrdersPage />} />
        <Route path="orders/cancelled" element={<CancelledOrdersPage />} />
        <Route path="orders/returned" element={<ReturnedOrdersPage />} />
        <Route path="orders/refund" element={<RefundOrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />

        {/* Customers */}
        <Route path="customers" element={<CustomersPage />} />

<Route path="customers/add" element={<AddCustomerPage />} />

<Route path="customers/edit/:id" element={<EditCustomerPage />} />

<Route path="customers/active" element={<ActiveCustomersPage />} />

<Route path="customers/blocked" element={<BlockedCustomersPage />} />

<Route path="customers/premium" element={<PremiumCustomersPage />} />

<Route path="settings" element={<Settings />} />

{/* ✅ ADD THIS ROUTE */}
<Route
   path="customers/deleted"
   element={<DeletedCustomersPage />} />


{/* KEEP THIS ALWAYS LAST */}
<Route path="customers/:id" element={<CustomerDetailsPage />} />


        {/* Notifications */}
        <Route path="notification" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

    </Routes>
  );
}

export default App;