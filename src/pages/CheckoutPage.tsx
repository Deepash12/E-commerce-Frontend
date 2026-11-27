import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  MapPin,
  Plus,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { addressAPI, orderAPI, couponAPI } from "../api/service";
import { useCart } from "../context/CartContext";
import { LoadingPage } from "../components/ui";
import AddressForm from "../components/address/AddressForm";
import { formatPrice, formatPriceWithDecimals, cn } from "../utils";
import type { Address } from "../types";
import toast from "react-hot-toast";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    cart,
    cartLoading,
    updatingItems,
    fetchCart,
  } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCartLoading, setInitialCartLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [removingCoupon, setRemovingCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const items = cart?.items ?? [];

  const unavailableItemsCount = items.filter(
    (item) => item.isAvailable !== true
  ).length;

  const hasUnavailableItems =
    cart.hasUnavailableItems === true ||
    unavailableItemsCount > 0;

  const isCartUpdating = Object.values(updatingItems).some(
    (updating) => updating === true
  );

  const isCartBusy =
    initialCartLoading ||
    cartLoading ||
    isCartUpdating;

  const canCheckout =
    cart.canCheckout === true &&
    items.length > 0 &&
    !hasUnavailableItems &&
    !isCartBusy;

  const isOperationInProgress =
    placing ||
    applyingCoupon ||
    removingCoupon;

  const couponCode = cart.appliedCouponCode ?? null;

  const discount = couponCode
    ? Number(cart.discountAmount ?? 0)
    : 0;

  const grandTotal = Number(cart.grandTotal ?? 0);

  const finalTotal = couponCode
    ? Number(
        cart.finalAmount ??
          Math.max(0, grandTotal - discount)
      )
    : grandTotal;

  const unroundedPayable = Math.max(
    0,
    Math.round(finalTotal * 100) / 100
  );

  const roundedPayable = Math.round(unroundedPayable);

  const roundOffAdjustment = Number(
    (roundedPayable - unroundedPayable).toFixed(2)
  );

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      setInitialCartLoading(true);

      try {
        await fetchCart(true);
      } finally {
        if (!cancelled) {
          setInitialCartLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [fetchCart]);

  const fetchAddresses = async () => {
    try {
      const res = await addressAPI.view();
      const responseData = res.data?.data ?? [];

      const list: Address[] = Array.isArray(responseData)
        ? responseData
        : [];

      setAddresses(list);

      const def =
        list.find((address) => address.isDefault) ??
        list[0];

      setSelectedId(def?.id ?? null);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleApplyCoupon = async () => {
    if (isOperationInProgress || isCartBusy) return;

    if (!canCheckout) {
      toast.error(
        "Resolve cart availability issues before applying a coupon."
      );
      return;
    }

    if (couponCode) {
      toast.error("Remove the existing coupon first.");
      return;
    }

    if (!couponInput.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    setApplyingCoupon(true);

    try {
      const res = await couponAPI.apply(
        couponInput.trim()
      );

      const discountAmount =
        res.data?.discountAmount ??
        res.data?.data?.discountAmount ??
        0;

      setCouponInput("");

      await fetchCart(true);

      toast.success(
        `Coupon applied! You saved ${formatPriceWithDecimals(
          Number(discountAmount)
        )}`
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Invalid coupon"
      );

      setCouponInput("");

      await fetchCart(true);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (
      isOperationInProgress ||
      isCartBusy ||
      !couponCode
    ) {
      return;
    }

    setRemovingCoupon(true);

    try {
      await couponAPI.remove();

      setCouponInput("");

      await fetchCart(true);

      toast.success("Coupon removed");
    } catch {
      toast.error("Failed to remove coupon");

      await fetchCart(true);
    } finally {
      setRemovingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (isOperationInProgress || isCartBusy) {
      return;
    }

    if (items.length === 0) {
      toast.error(
        "Your cart is empty. Please add products first."
      );
      return;
    }

    if (hasUnavailableItems) {
      toast.error(
        "Remove unavailable products or adjust their quantities before checkout."
      );
      return;
    }

    if (!canCheckout) {
      toast.error(
        "Cart availability could not be confirmed. Please refresh your cart."
      );
      return;
    }

    if (finalTotal <= 0 || roundedPayable <= 0) {
      toast.error("Invalid order amount");
      return;
    }

    if (!selectedId) {
      toast.error("Please select a delivery address");
      return;
    }

    setPlacing(true);

    try {
      const res = await orderAPI.checkout(
        selectedId,
        couponCode
      );

      const checkout = res?.data?.data;
      const amount = Number(checkout?.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error("Invalid amount from server");
        return;
      }

      toast.success("Checkout successful!");

      navigate("/payment", {
        state: {
          checkoutData: checkout,
        },
      });
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      )?.response?.data?.message;

      toast.error(msg || "Failed to place order");

      await fetchCart(true);
    } finally {
      setPlacing(false);
    }
  };

  if (loading || initialCartLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="page-wrapper">
      <div className="container-wide py-10">
        <h1 className="page-title mb-10">
          Checkout
        </h1>

        {items.length === 0 && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4"
          >
            <AlertTriangle
              size={20}
              className="text-amber-400 shrink-0"
            />

            <div className="flex-1">
              <p className="font-medium text-amber-400">
                No products available for checkout
              </p>

              <p className="mt-1 text-sm text-obsidian-400">
                Your cart is empty or could not be loaded.
                Return to your cart or refresh to continue.
              </p>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="mt-3 flex items-center gap-2 text-sm text-gold-400"
              >
                <ArrowLeft size={14} />
                Return to Cart
              </button>
            </div>
          </div>
        )}

        {hasUnavailableItems && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4"
          >
            <AlertTriangle
              size={20}
              className="text-amber-400 shrink-0"
            />

            <div className="flex-1">
              <p className="font-medium text-amber-400">
                {unavailableItemsCount} unavailable product
                {unavailableItemsCount !== 1 ? "s" : ""} in your cart
              </p>

              <p className="mt-1 text-sm text-obsidian-400">
                Remove unavailable products or adjust their
                quantities before applying a coupon or
                proceeding to payment.
              </p>

              <button
                type="button"
                disabled={isOperationInProgress}
                onClick={() => navigate("/cart")}
                className="mt-3 flex items-center gap-2 text-sm text-gold-400 disabled:opacity-50"
              >
                <ArrowLeft size={14} />
                Return to Cart
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ADDRESS SECTION */}

          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                Delivery Address
              </h2>

              {addresses.length < 5 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm gap-1.5"
                  onClick={() => setShowForm(!showForm)}
                  disabled={placing}
                >
                  <Plus size={12} />
                  Add New
                </button>
              )}
            </div>

            {showForm && (
              <div className="card border-obsidian-700 p-6 mb-5">
                <h3 className="section-title mb-5 text-lg">
                  New Address
                </h3>

                <AddressForm
                  onSuccess={() => {
                    setShowForm(false);
                    fetchAddresses();
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="card border-obsidian-800 p-10 text-center">
                <MapPin
                  size={32}
                  className="text-obsidian-700 mx-auto mb-3"
                />

                <p className="text-obsidian-500 text-sm">
                  No addresses saved. Please add one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      if (!placing) {
                        setSelectedId(addr.id);
                      }
                    }}
                    className={cn(
                      "card p-5 cursor-pointer flex gap-4",
                      selectedId === addr.id
                        ? "border-gold-400 bg-gold-400/5"
                        : "border-obsidian-800"
                    )}
                  >
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                      {selectedId === addr.id && (
                        <CheckCircle size={12} />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {addr.fullName}
                      </p>

                      <p className="text-xs text-obsidian-500">
                        {addr.addressLine1}, {addr.city}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}

          <div className="card border-obsidian-700 p-6 sticky top-24">
            <h3 className="section-title mb-5">
              Order Summary
            </h3>

            {/* COUPON SECTION */}

            {couponCode ? (
              <div className="flex items-center justify-between bg-green-400/10 border border-green-400/30 rounded px-3 py-2 mb-5">
                <div>
                  <p className="text-green-400 text-sm font-medium">
                    🏷️ {couponCode} applied
                  </p>

                  <p className="text-green-300 text-xs">
                    You save {formatPriceWithDecimals(discount)}
                  </p>
                </div>

                <button
                  type="button"
                  className="text-obsidian-400 hover:text-red-400 text-xs underline ml-3 disabled:opacity-50"
                  onClick={handleRemoveCoupon}
                  disabled={
                    isOperationInProgress ||
                    isCartBusy
                  }
                >
                  {removingCoupon
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            ) : (
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    disabled={
                      !canCheckout ||
                      isOperationInProgress
                    }
                    className="input flex-1 disabled:opacity-50"
                  />

                  <button
                    type="button"
                    className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleApplyCoupon}
                    disabled={
                      !canCheckout ||
                      isOperationInProgress
                    }
                  >
                    {applyingCoupon
                      ? "Applying..."
                      : "Apply"}
                  </button>
                </div>

                {hasUnavailableItems && (
                  <p className="mt-2 text-xs text-amber-400">
                    Resolve unavailable products before
                    applying a coupon.
                  </p>
                )}
              </div>
            )}

            {/* CART ITEMS */}

            <div className="space-y-2.5 mb-5">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between gap-2 text-sm"
                >
                  <div className="flex-1">
                    <span>
                      {item.productName} x {item.quantity}
                    </span>

                    {item.isAvailable !== true && (
                      <p className="mt-1 text-xs text-red-400">
                        {item.availabilityMessage ||
                          "Product availability could not be confirmed."}
                      </p>
                    )}
                  </div>

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

            <div className="h-px bg-obsidian-800 mb-4" />

            {/* SUBTOTAL */}

            <div className="flex justify-between text-sm text-obsidian-400 mb-2">
              <span>
                {hasUnavailableItems
                  ? "Eligible Subtotal"
                  : "Subtotal"}
              </span>

              <span>
                {formatPriceWithDecimals(grandTotal)}
              </span>
            </div>

            {/* DISCOUNT */}

            {discount > 0 && (
              <div className="flex justify-between text-green-400 mb-2 text-sm font-medium">
                <span>
                  Discount ({couponCode})
                </span>

                <span>
                  -{formatPriceWithDecimals(discount)}
                </span>
              </div>
            )}

            {/* ROUND-OFF ADJUSTMENT */}

            {roundOffAdjustment !== 0 && (
              <div className="flex justify-between text-sm text-obsidian-400 mb-2">
                <span>
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

            <div className="h-px bg-obsidian-800 mb-4" />

            {/* FINAL PAYABLE */}

            <div className="flex justify-between mb-1">
              <span className="font-medium">
                Total Payable
              </span>

              <span className="text-gold-400 text-2xl">
                {formatPrice(roundedPayable)}
              </span>
            </div>

            {/* SAVINGS */}

            {discount > 0 ? (
              <p className="text-right text-green-400 text-xs mb-5">
                🎉 You save {formatPriceWithDecimals(discount)} with {couponCode}
              </p>
            ) : (
              <div className="mb-5" />
            )}

            {/* CHECKOUT AVAILABILITY */}

            {!canCheckout && (
              <p
                role="status"
                className="mb-3 text-sm text-amber-400"
              >
                {isCartBusy
                  ? "Updating cart. Please wait..."
                  : items.length === 0
                    ? "Add products or refresh your cart before checkout."
                    : hasUnavailableItems
                      ? "Resolve unavailable products before placing your order."
                      : "Cart availability could not be confirmed. Please refresh your cart."}
              </p>
            )}

            {!canCheckout &&
              !isCartBusy &&
              !isOperationInProgress && (
                <button
                  type="button"
                  onClick={() => fetchCart(true)}
                  className="btn btn-ghost w-full mb-2"
                >
                  Refresh Cart
                </button>
              )}

            {/* PLACE ORDER */}

            <button
              type="button"
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={
                isOperationInProgress ||
                !canCheckout ||
                !selectedId ||
                finalTotal <= 0 ||
                roundedPayable <= 0
              }
            >
              {placing
                ? "Placing Order..."
                : "Place Order"}
            </button>

            {!canCheckout && (
              <button
                type="button"
                disabled={isOperationInProgress}
                onClick={() => navigate("/cart")}
                className="btn btn-ghost w-full mt-2 disabled:opacity-50"
              >
                Return to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;