import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { cartAPI } from "../api/service";
import type { CartItem } from "../types";
import { useAuth } from "./AuthContext";

interface Cart {
  items: CartItem[];
  grandTotal: number;
  totalItems: number;
  appliedCouponCode?: string | null;
  discountAmount?: number;
  finalAmount?: number;
}

interface CartContextType {
  cart: Cart;
  cartLoading: boolean;
  updatingItems: Record<number, boolean>;
  fetchCart: (showLoader?: boolean) => Promise<void>;
  clearCart: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
}

const defaultCart: Cart = {
  items: [],
  grandTotal: 0,
  totalItems: 0,
  appliedCouponCode: null,
  discountAmount: 0,
  finalAmount: 0,
};

const CartContext = createContext<CartContextType | null>(null);

const recalculateCart = (items: CartItem[]): Cart => {
  const grandTotal = items.reduce(
    (total, item) => total + item.finalPrice * item.quantity,
    0
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return {
    ...defaultCart,
    items,
    grandTotal,
    totalItems,
    finalAmount: grandTotal,
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();

  const [cart, setCart] = useState<Cart>(defaultCart);
  const [cartLoading, setCartLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Record<number, boolean>>(
    {}
  );

  const fetchCart = useCallback(
    async (showLoader = true) => {
      if (!user || isAdmin) {
        setCart(defaultCart);
        setCartLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setCartLoading(true);
        }

        const res = await cartAPI.view();
        const responseData = res.data?.data ?? res.data;

        setCart(responseData as Cart);
      } catch (error) {
        console.error("Cart fetch failed:", error);
        setCart(defaultCart);
      } finally {
        if (showLoader) {
          setCartLoading(false);
        }
      }
    },
    [user, isAdmin]
  );

  const clearCart = useCallback(() => {
    setCart(defaultCart);
  }, []);

  useEffect(() => {
    if (!user || isAdmin) {
      setCart(defaultCart);
      setCartLoading(false);
      return;
    }

    fetchCart(true);
  }, [user, isAdmin, fetchCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!user || isAdmin) return;

    setUpdatingItems((prev) => ({
      ...prev,
      [productId]: true,
    }));

    try {
      await cartAPI.add(productId, quantity);
      await fetchCart(false);
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user || isAdmin) return;

    const previousCart = cart;

    const updatedItems = cart.items
      .map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(recalculateCart(updatedItems));

    setUpdatingItems((prev) => ({
      ...prev,
      [productId]: true,
    }));

    try {
      await cartAPI.update(productId, quantity);
      await fetchCart(false);
    } catch (error) {
      console.error("Quantity update failed:", error);
      setCart(previousCart);
      throw error;
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  const removeItem = async (productId: number) => {
    if (!user || isAdmin) return;

    const previousCart = cart;

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    setCart(recalculateCart(updatedItems));

    setUpdatingItems((prev) => ({
      ...prev,
      [productId]: true,
    }));

    try {
      await cartAPI.remove(productId);
      await fetchCart(false);
    } catch (error) {
      console.error("Remove item failed:", error);
      setCart(previousCart);
      throw error;
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        updatingItems,
        fetchCart,
        clearCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
};