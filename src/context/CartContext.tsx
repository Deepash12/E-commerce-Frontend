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

// ✅ Cart type with coupon fields
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
  fetchCart: () => Promise<void>;
  clearCart: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
}

// ✅ defaultCart with coupon fields initialized
const defaultCart: Cart = {
  items: [],
  grandTotal: 0,
  totalItems: 0,
  appliedCouponCode: null,
  discountAmount: 0,
  finalAmount: 0,
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setCartLoading(true);
      const res = await cartAPI.view();
      // ✅ Backend response mein coupon fields bhi honge ab — directly set karo
      setCart(res.data as Cart);
    } catch {
      setCart(defaultCart);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  // ✅ Instantly resets cart state to zero — no network call needed
  const clearCart = useCallback(() => {
    setCart(defaultCart);
  }, []);

  // Reset cart when user logs out
  useEffect(() => {
    if (!user) {
      setCart(defaultCart);
    } else {
      fetchCart();
    }
  }, [user]);

  const addToCart = async (productId: number, quantity = 1) => {
    await cartAPI.add(productId, quantity);
    await fetchCart();
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    await cartAPI.update(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (productId: number) => {
    await cartAPI.remove(productId);
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
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
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};