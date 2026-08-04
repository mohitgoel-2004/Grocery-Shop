import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { getDeliverySettings } from "../services/deliverySettingsService";

import {
  addCartItem,
  clearCart as clearCartRequest,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const getProductId = (item) => {
  const product = item?.product;

  if (product && typeof product === "object") {
    return String(product._id || product.id || item.productId || item.id || "");
  }

  return String(product || item.productId || item.id || "");
};

const normalizeCartItem = (item) => {
  const product = item.product || {};
  const productId = getProductId(item);

  return {
    id: productId,
    productId,
    name: item.name || product.name || "",
    image: item.image || product.image || "",
    price: Number(item.price ?? product.price ?? 0),
    weight: item.weight || product.weight || "",
    qty: Number(item.quantity ?? item.qty ?? 1),
  };
};

const normalizeCart = (cart) => {
  if (!cart?.items) {
    return [];
  }

  return cart.items.map(normalizeCartItem);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [deliverySettings, setDeliverySettings] = useState(null);

  const syncCartFromServer = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    setIsLoadingCart(true);

    try {
      const response = await fetchCart();
      setCart(normalizeCart(response.data.cart));
    } catch (error) {
      setCart([]);
    } finally {
      setIsLoadingCart(false);
    }
  };


  
  useEffect(() => {
    syncCartFromServer();

    const handleAuthChanged = () => {
      syncCartFromServer();
    };

    window.addEventListener("auth:changed", handleAuthChanged);

    return () => {
      window.removeEventListener("auth:changed", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const settings = await getDeliverySettings();

      setDeliverySettings(settings);
    } catch (error) {
      console.error(
        "Failed to fetch delivery settings:",
        error
      );

      setDeliverySettings(null);
    }
  };

  fetchSettings();
}, []);

  useEffect(() => {
    if (!isLoadingCart) {
      return;
    }

    return undefined;
  }, [isLoadingCart]);

  const applyCartResponse = (response) => {
    const serverCart = response?.data?.cart;
    setCart(normalizeCart(serverCart));
    return serverCart;
  };

  const addToCart = async (product, quantity = 1) => {
    const productId = product?._id || product?.id;

    if (!productId) {
      toast.error("Invalid product");
      return null;
    }

    try {
      const response = await addCartItem({ productId, quantity });
      applyCartResponse(response);
      toast.success("Added to cart");
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add item");
      return null;
    }
  };

  const findCartItem = (id) =>
    cart.find(
      (cartItem) => String(cartItem.id) === String(id) || String(cartItem.productId) === String(id)
    );

  const updateQty = async (id, nextQuantity) => {
    const item = findCartItem(id);

    if (!item) {
       
      return;
    }

    try {
      const response = await updateCartItem({
        productId: item.productId || item.id,
        quantity: nextQuantity,
      });
      applyCartResponse(response);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update item";

      if (String(errorMessage).toLowerCase().includes("cart item not found")) {
        await syncCartFromServer();

        const refreshedItem = findCartItem(id);

        if (refreshedItem) {
          try {
            const retryResponse = await updateCartItem({
              productId: refreshedItem.productId || refreshedItem.id,
              quantity: nextQuantity,
            });

            applyCartResponse(retryResponse);
            return;
          } catch (retryError) {
            toast.error(
              retryError?.response?.data?.message || retryError?.message || "Failed to update item"
            );
            return;
          }
        }
      }

      toast.error(errorMessage);
    }
  };

  const increaseQty = async (id) => {
    const item = findCartItem(id);

    if (!item) {
      return;
    }

    await updateQty(id, item.qty + 1);
  };

  const decreaseQty = async (id) => {
    const item = findCartItem(id);

    if (!item) {
      return;
    }

    await updateQty(id, item.qty - 1);
  };

  const removeItem = async (id) => {
    try {
      const response = await removeCartItem({ productId: id });
      applyCartResponse(response);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const response = await clearCartRequest();
      applyCartResponse(response);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to clear cart");
    }
  };

  // --------------------------
  // Totals
  // --------------------------
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price =
        typeof item.price === "string"
          ? Number(item.price.replace(/[^\d.]/g, ""))
          : Number(item.price);

      return sum + price * item.qty;
    }, 0);
  }, [cart]);

  const minimumOrderValue = Number(
  deliverySettings?.minimumOrderValue || 0
);

 const deliveryCharge = useMemo(() => {
  if (!deliverySettings) {
    return 0;
  }

  // Admin ne delivery charge OFF kiya hai
  if (!deliverySettings.isDeliveryChargeEnabled) {
    return 0;
  }

  // Free delivery threshold
  const freeDeliveryThreshold = Number(
    deliverySettings.freeDeliveryThreshold || 0
  );

  if (
    freeDeliveryThreshold > 0 &&
    subtotal >= freeDeliveryThreshold
  ) {
    return 0;
  }

  // Admin configured delivery charge
  return Number(
    deliverySettings.deliveryCharge || 0
  );
}, [subtotal, deliverySettings]);

const discount = subtotal >= 1000 ? 100 : 0;

const tax = useMemo(() => {
  return Math.round(subtotal * 0.05);
}, [subtotal]);

const total = useMemo(() => {
  return (
    subtotal +
    deliveryCharge +
    tax -
    discount
  );
}, [
  subtotal,
  deliveryCharge,
  tax,
  discount,
]);

  const value = {
  cart,
  setCart,

  addToCart,
  increaseQty,
  decreaseQty,
  updateQty,
  removeItem,
  clearCart,
  refreshCart: syncCartFromServer,
  isLoadingCart,

  totalItems,
  subtotal,

  deliverySettings,
   minimumOrderValue,
  deliveryCharge,

  tax,
  discount,
  total,
};

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};