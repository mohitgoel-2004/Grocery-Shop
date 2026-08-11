import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
// import "react-hot-toast/dist/index.css";

import { CartProvider } from "./Context/context";
import { AddressProvider } from "./Context/AddressContext";
import { NotificationProvider } from "./Context/NotificationContext";
import { ProductProvider } from "./Context/ProductContext";
import { CategoryProvider } from "./Context/CategoryContext";
import { CustomerProvider } from "./Context/CustomerContext";
import { OrdersProvider } from "./Context/OrderContext";
// import { DashboardProvider } from "./Context/dashboardContext";
import { AdminProfileProvider } from "./Context/AdminProfileContext";
import { AdminNotificationProvider } from "./Context/AdminNotificationContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <AddressProvider>
          <NotificationProvider>
            <AdminNotificationProvider>
            <AdminProfileProvider>
            {/* <DashboardProvider> */}
            <CategoryProvider>
              <OrdersProvider>
                <CustomerProvider>
                  <CartProvider>
                    <App />
                    <Toaster position="top-center" />
                  </CartProvider>
                </CustomerProvider>
              </OrdersProvider>
            </CategoryProvider>
            {/* </DashboardProvider> */}
            </AdminProfileProvider>
            </AdminNotificationProvider>
          </NotificationProvider>
        </AddressProvider>
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);
        
