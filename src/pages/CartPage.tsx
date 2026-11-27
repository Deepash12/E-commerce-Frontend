import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import type { CartItem } from "../types";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { LoadingPage, EmptyState } from "../components/ui";
import {
  formatPrice,
  formatPriceWithDecimals,
} from "../utils";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
    updatingItems,
    updateQuantity,
    removeItem,
    fetchCart,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(true);
  }, [fetchCart]);

  const items = useMemo(() => cart?.items ?? [], [cart?.items]);

  const totalItems = cart.totalItems;

  const subtotal = Number(cart.grandTotal ?? 0);

  const unavailableItemsCount = items.filter(
    (item) => item.isAvailable !== true
  ).length;

  const hasUnavailableItems =
    cart.hasUnavailableItems === true ||
    unavailableItemsCount > 0;

  const isCartUpdating = Object.values(updatingItems).some(
    (updating) => updating === true
  );

  const canCheckout =
    cart.canCheckout === true &&
    items.length > 0 &&
    !hasUnavailableItems &&
    !cartLoading &&
    !isCartUpdating;

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

  const handleRemove = async (productId: number) => {
    if (cartLoading || isCartUpdating) return;

    try {
      await removeItem(productId);
    } catch (error) {
      toast.error("Unable to remove product. Please try again.");
    }
  };

  const handleDecrease = async (item: CartItem) => {
    if (cartLoading || isCartUpdating) return;

    if (item.quantity <= 1) {
      await handleRemove(item.productId);
      return;
    }

    if (
      item.isActiveProduct !== true ||
      !(item.stockQuantity > 0)
    ) {
      return;
    }

    const newQty = Math.min(
      item.quantity - 1,
      item.stockQuantity
    );

    try {
      await updateQuantity(item.productId, newQty);
    } catch (error) {
      toast.error("Unable to update quantity. Please try again.");
    }
  };

  const handleIncrease = async (item: CartItem) => {
    if (
      cartLoading ||
      isCartUpdating ||
      item.isAvailable !== true ||
      item.isActiveProduct !== true ||
      !(item.quantity < item.stockQuantity)
    ) {
      return;
    }

    try {
      await updateQuantity(
        item.productId,
        item.quantity + 1
      );
    } catch (error) {
      toast.error("Unable to increase quantity. Please try again.");
    }
  };

  const handleReduceToAvailableStock = async (
    item: CartItem
  ) => {
    if (
      cartLoading ||
      isCartUpdating ||
      item.isActiveProduct !== true ||
      !(item.stockQuantity > 0) ||
      item.quantity <= item.stockQuantity
    ) {
      return;
    }

    try {
      await updateQuantity(
        item.productId,
        item.stockQuantity
      );
    } catch (error) {
      toast.error("Unable to update quantity. Please try again.");
    }
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

            {hasUnavailableItems && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4"
              >
                <AlertTriangle
                  size={20}
                  className="text-amber-400 shrink-0"
                />

                <div>
                  <p className="font-medium text-amber-400">
                    {unavailableItemsCount} unavailable product
                    {unavailableItemsCount !== 1 ? "s" : ""} in your cart
                  </p>

                  <p className="mt-1 text-sm text-obsidian-400">
                    Remove unavailable products or adjust their
                    quantities before proceeding to checkout.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-3">
                {items.map((item) => {
                  const isAvailable =
                    item.isAvailable === true;

                  const controlsDisabled =
                    cartLoading || isCartUpdating;

                  const canIncrease =
                    !controlsDisabled &&
                    isAvailable &&
                    item.isActiveProduct === true &&
                    item.quantity < item.stockQuantity;

                  const canDecrease =
                    !controlsDisabled &&
                    (
                      item.quantity <= 1 ||
                      (
                        item.isActiveProduct === true &&
                        item.stockQuantity > 0
                      )
                    );

                  const canReduceToAvailableStock =
                    item.availabilityStatus === "INSUFFICIENT_STOCK" &&
                    item.isActiveProduct === true &&
                    item.stockQuantity > 0 &&
                    item.quantity > item.stockQuantity;

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

                        {!isAvailable && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium text-red-400">
                              {item.availabilityMessage ||
                                "Product availability could not be confirmed."}
                            </p>

                            <p className="text-xs text-obsidian-400">
                              This product is excluded from your subtotal.
                            </p>

                            {canReduceToAvailableStock && (
                              <button
                                type="button"
                                disabled={controlsDisabled}
                                onClick={() =>
                                  handleReduceToAvailableStock(item)
                                }
                                className="text-sm text-amber-400 underline disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reduce quantity to {item.stockQuantity}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={`text-lg font-medium ${
                            !isAvailable
                              ? "line-through text-obsidian-500"
                              : ""
                          }`}
                        >
                          {formatPriceWithDecimals(
                            item.totalPrice ??
                              item.finalPrice * item.quantity
                          )}
                        </span>

                        <div className="flex items-center border border-obsidian-700 rounded-sm">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.productName}`}
                            disabled={!canDecrease}
                            onClick={() => handleDecrease(item)}
                            className="px-2 py-1 text-obsidian-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus size={12} />
                          </button>

                          <span className="px-3 text-sm min-w-[32px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.productName}`}
                            disabled={!canIncrease}
                            onClick={() => handleIncrease(item)}
                            className="px-2 py-1 text-obsidian-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.productName} from cart`}
                          disabled={controlsDisabled}
                          onClick={() =>
                            handleRemove(item.productId)
                          }
                          className="text-obsidian-600 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={14} />
                        </button>

                        {updatingItems[item.productId] && (
                          <span className="text-xs text-obsidian-400">
                            Updating...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card border-obsidian-700 p-6 sticky top-24">
                <h3 className="mb-5 text-lg font-medium">
                  Order Summary
                </h3>

                <div className="space-y-2 mb-5">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-obsidian-500 truncate">
                        {item.productName} x {item.quantity}
                      </span>

                      {item.isAvailable === true ? (
                        <span className="shrink-0">
                          {formatPriceWithDecimals(
                            item.totalPrice ??
                              item.finalPrice * item.quantity
                          )}
                        </span>
                      ) : (
                        <span className="text-red-400 shrink-0">
                          Excluded
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-obsidian-800 my-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">
                      {hasUnavailableItems
                        ? "Eligible Subtotal"
                        : "Subtotal"}
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

                {!canCheckout && (
                  <p
                    role="status"
                    className="mb-3 text-sm text-amber-400"
                  >
                    {cartLoading || isCartUpdating
                      ? "Updating cart. Please wait..."
                      : hasUnavailableItems
                        ? "Resolve unavailable products before checkout."
                        : "Cart availability could not be confirmed. Refresh your cart."}
                  </p>
                )}

                {!canCheckout &&
                  !cartLoading &&
                  !isCartUpdating && (
                    <button
                      type="button"
                      onClick={() => fetchCart(true)}
                      className="btn btn-ghost w-full mb-2"
                    >
                      Refresh Cart
                    </button>
                  )}

                <button
                  type="button"
                  disabled={!canCheckout}
                  className="btn btn-primary w-full flex justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (!canCheckout) return;

                    navigate("/checkout");
                  }}
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