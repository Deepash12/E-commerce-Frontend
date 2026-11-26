import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { LoadingPage, EmptyState } from "../components/ui";
import {
  formatPrice,
  formatPriceWithDecimals,
} from "../utils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getImageUrl = (url?: string | null) => {
  if (!url) return "/placeholder.png";

  const cleanUrl = url.trim();

  if (!cleanUrl || cleanUrl === "null" || cleanUrl === "undefined") {
    return "/placeholder.png";
  }

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `${BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`;
};

const CartPage: React.FC = () => {
  const {
    cart,
    cartLoading,
    updateQuantity,
    removeItem,
    fetchCart,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(true);
  }, [fetchCart]);

  const items = useMemo(() => cart?.items ?? [], [cart?.items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return Number(
      cart?.grandTotal ??
      items.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0
      )
    );
  }, [cart?.grandTotal, items]);

  const appliedCouponCode = cart?.appliedCouponCode;

  const discountAmount = appliedCouponCode
    ? Number(cart?.discountAmount ?? 0)
    : 0;

  const finalAmount = appliedCouponCode
    ? Number(
      cart?.finalAmount ??
      Math.max(0, subtotal - discountAmount)
    )
    : subtotal;

  const unroundedPayable = Math.max(
    0,
    Math.round(finalAmount * 100) / 100
  );

  const roundedPayable = Math.round(unroundedPayable);

  const roundOffAdjustment = Number(
    (roundedPayable - unroundedPayable).toFixed(2)
  );

  const handleDecrease = async (productId: number, quantity: number) => {
    const newQty = quantity - 1;

    if (newQty <= 0) {
      await removeItem(productId);
      return;
    }

    await updateQuantity(productId, newQty);
  };

  const handleIncrease = async (productId: number, quantity: number) => {
    await updateQuantity(productId, quantity + 1);
  };

  if (cartLoading && items.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div>
      <div className="container-wide py-2">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={56} />}
            title="Your cart is empty"
            description="Add items from our collection to get started"
            action={
              <Link to="/products" className="btn btn-primary">
                Browse Collection
              </Link>
            }
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="page-title">Shopping Cart</h1>

              <p className="text-obsidian-500 mt-2">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-3">
                {items.map((item) => {
                  return (
                    <div
                      key={item.productId}
                      className="card border-obsidian-800 p-5 flex gap-5 items-start hover:border-obsidian-700"
                    >
                      <div className="w-20 h-20 rounded-sm overflow-hidden bg-obsidian-800">
                        <img
                          src={getImageUrl(item.productImageUrl)}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(
                              "Cart image failed:",
                              e.currentTarget.src
                            );
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-medium">
                          {item.productName}
                        </h3>

                        <p className="text-gold-400">
                          {formatPrice(item.finalPrice)} each
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className="text-lg font-medium">
                          {formatPriceWithDecimals(
                            item.finalPrice * item.quantity
                          )}
                        </span>

                        <div className="flex items-center border border-obsidian-700 rounded-sm">
                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(item.productId, item.quantity)
                            }
                            className="px-2 py-1 text-obsidian-500 hover:text-white"
                          >
                            <Minus size={12} />
                          </button>

                          <span className="px-3 text-sm min-w-[32px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(item.productId, item.quantity)
                            }
                            className="px-2 py-1 text-obsidian-500 hover:text-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-obsidian-600 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card border-obsidian-700 p-6 sticky top-24">
                <h3 className="mb-5 text-lg font-medium">Order Summary</h3>

                <div className="space-y-2 mb-5">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-obsidian-500 truncate">
                        {item.productName} x {item.quantity}
                      </span>

                      <span>
                        {formatPrice(item.finalPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-obsidian-800 my-4" />

                <div className="space-y-3 mb-6">

                  <div className="flex justify-between">
                    <span className="text-obsidian-400">
                      Subtotal
                    </span>

                    <span>
                      {formatPriceWithDecimals(subtotal)}
                    </span>
                  </div>

                  {appliedCouponCode && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-obsidian-400">
                          Applied Coupon
                        </span>

                        <span className="text-green-400 font-medium">
                          {appliedCouponCode}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-obsidian-400">
                          Coupon Discount
                        </span>

                        <span className="text-green-400">
                          -{formatPriceWithDecimals(discountAmount)}
                        </span>
                      </div>
                    </>
                  )}

                  {roundOffAdjustment !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian-400">
                        Round-off Adjustment
                      </span>

                      <span>
                        {roundOffAdjustment > 0 ? "+" : "-"}
                        {formatPriceWithDecimals(
                          Math.abs(roundOffAdjustment)
                        )}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-obsidian-800 my-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">
                      Total Payable
                    </span>

                    <span className="text-2xl text-gold-400">
                      {formatPrice(roundedPayable)}
                    </span>
                  </div>

                </div>

                <button
                  className="btn btn-primary w-full flex justify-center gap-2"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </button>

                <Link
                  to="/products"
                  className="btn btn-ghost w-full mt-2 text-center text-obsidian-400"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;