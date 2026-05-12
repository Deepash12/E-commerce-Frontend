import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, MapPin, Plus } from "lucide-react";
import { addressAPI, orderAPI, couponAPI } from "../api/service";
import { useCart } from "../context/CartContext";
import { LoadingPage } from "../components/ui";
import AddressForm from "../components/address/AddressForm";
import { formatPrice, cn } from "../utils";
import type { Address } from "../types";
import toast from "react-hot-toast";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  const [addresses, setAddresses]           = useState<Address[]>([]);
  const [selectedId, setSelectedId]         = useState<number | null>(null);
  const [loading, setLoading]               = useState(true);
  const [placing, setPlacing]               = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [removingCoupon, setRemovingCoupon] = useState(false);
  const [couponInput, setCouponInput]       = useState("");

  // Local coupon state — apply API response se set hota hai
  const [appliedDiscount, setAppliedDiscount]     = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  // Flag: kya user ne is session mein coupon apply kiya?
  // False = page reload/back case, True = user ne abhi apply kiya
  const couponAppliedThisSession = useRef(false);

  /* ── FETCH FRESH CART on page load ── */
  useEffect(() => {
    fetchCart();
  }, []);

  /* ── FETCH ADDRESSES ── */
  const fetchAddresses = async () => {
    try {
      const res  = await addressAPI.view();
      const list = res.data?.data ?? [];
      setAddresses(Array.isArray(list) ? list : []);
      const def = list.find((a: Address) => a.isDefault) ?? list[0];
      if (def) setSelectedId(def.id);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  // ✅ Cart sync useEffect:
  // - Page reload / back aane pe: cart.appliedCouponCode se state set karo
  // - Apply karne ke baad fetchCart: couponAppliedThisSession=true toh override MAT karo
  useEffect(() => {
    if (!cart) return;

    if (cart.appliedCouponCode) {
      // Agar user ne abhi apply kiya hai toh local state already sahi hai — override mat karo
      if (!couponAppliedThisSession.current) {
        // Page reload / back navigation case
        // Backend se discountAmount aa raha hai (after our backend fix)
        setAppliedCouponCode(cart.appliedCouponCode);
        setAppliedDiscount(cart.discountAmount ?? 0);
      }
    } else {
      // Coupon nahi hai — remove ke baad ya fresh cart
      if (!couponAppliedThisSession.current) {
        setAppliedCouponCode(null);
        setAppliedDiscount(0);
      }
    }
  }, [cart?.appliedCouponCode, cart?.discountAmount]);

  /* ── APPLY COUPON ── */
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) { toast.error("Enter coupon code"); return; }
    setApplyingCoupon(true);
    try {
      const res = await couponAPI.apply(couponInput.trim());

      // Apply API se directly discount lo — yeh 100% reliable hai
      const discountAmount =
        res.data?.discountAmount ??
        res.data?.data?.discountAmount ??
        0;

      const savedCode = couponInput.trim();

      // ✅ Flag set karo — ab useEffect cart sync se override nahi hoga
      couponAppliedThisSession.current = true;

      setAppliedDiscount(discountAmount);
      setAppliedCouponCode(savedCode);
      setCouponInput("");

      toast.success(`Coupon applied! You saved ₹${discountAmount}`);

      // Background mein cart refresh karo
      fetchCart();

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid coupon");
      setCouponInput("");
    } finally {
      setApplyingCoupon(false);
    }
  };

  /* ── REMOVE COUPON ── */
  const handleRemoveCoupon = async () => {
    setRemovingCoupon(true);
    try {
      await couponAPI.remove();

      // ✅ Flag reset karo — ab cart sync se state update ho sakta hai
      couponAppliedThisSession.current = false;

      setAppliedDiscount(0);
      setAppliedCouponCode(null);
      setCouponInput("");

      await fetchCart();
      toast.success("Coupon removed");
    } catch {
      toast.error("Failed to remove coupon");
    } finally {
      setRemovingCoupon(false);
    }
  };

  /* ── PLACE ORDER ── */
  const handlePlaceOrder = async () => {
    if (!selectedId) { toast.error("Please select a delivery address"); return; }

    setPlacing(true);
    try {
      const validCoupon = appliedCouponCode ?? cart?.appliedCouponCode ?? null;
      const res         = await orderAPI.checkout(selectedId, validCoupon);

      toast.success("Order placed!");

      const checkout = res?.data?.data;
      const amount   = checkout?.amount;

      if (!amount) {
        toast.error("Invalid amount from server");
        return;
      }

      navigate("/payment", { state: { checkoutData: checkout } });

    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
      toast.error(msg || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const discount   = appliedDiscount;
  const couponCode = appliedCouponCode;
  const grandTotal = cart?.grandTotal ?? 0;
  const finalTotal = grandTotal - discount;

  if (loading) return <LoadingPage />;

  return (
    <div className="page-wrapper">
      <div className="container-wide py-10">
        <h1 className="page-title mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── ADDRESS SECTION ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Delivery Address</h2>
              {addresses.length < 5 && (
                <button
                  className="btn btn-outline btn-sm gap-1.5"
                  onClick={() => setShowForm(!showForm)}
                >
                  <Plus size={12} /> Add New
                </button>
              )}
            </div>

            {showForm && (
              <div className="card border-obsidian-700 p-6 mb-5">
                <h3 className="section-title mb-5 text-lg">New Address</h3>
                <AddressForm
                  onSuccess={() => { setShowForm(false); fetchAddresses(); }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="card border-obsidian-800 p-10 text-center">
                <MapPin size={32} className="text-obsidian-700 mx-auto mb-3" />
                <p className="text-obsidian-500 text-sm">
                  No addresses saved. Please add one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedId(addr.id)}
                    className={cn(
                      "card p-5 cursor-pointer flex gap-4",
                      selectedId === addr.id
                        ? "border-gold-400 bg-gold-400/5"
                        : "border-obsidian-800"
                    )}
                  >
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                      {selectedId === addr.id && <CheckCircle size={12} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{addr.fullName}</p>
                      <p className="text-xs text-obsidian-500">
                        {addr.addressLine1}, {addr.city}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="card border-obsidian-700 p-6 sticky top-24">
            <h3 className="section-title mb-5">Order Summary</h3>

            {/* COUPON SECTION */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-400/10 border border-green-400/30 rounded px-3 py-2 mb-5">
                <div>
                  <p className="text-green-400 text-sm font-medium">
                    🏷️ {couponCode} applied
                  </p>
                  <p className="text-green-300 text-xs">
                    You save {formatPrice(discount)}
                  </p>
                </div>
                <button
                  className="text-obsidian-400 hover:text-red-400 text-xs underline ml-3"
                  onClick={handleRemoveCoupon}
                  disabled={removingCoupon}
                >
                  {removingCoupon ? "Removing..." : "Remove"}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="input flex-1"
                />
                <button
                  className="btn btn-outline"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                >
                  {applyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
            )}

            {/* ITEMS */}
            <div className="space-y-2.5 mb-5">
              {(cart?.items ?? []).map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productName} x {item.quantity}</span>
                  <span>{formatPrice(item.finalPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-obsidian-800 mb-4" />

            {/* Subtotal */}
            <div className="flex justify-between text-sm text-obsidian-400 mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            {/* Discount row */}
            {discount > 0 && (
              <div className="flex justify-between text-green-400 mb-2 text-sm font-medium">
                <span>Discount ({couponCode})</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}

            <div className="h-px bg-obsidian-800 mb-4" />

            {/* Final Total */}
            <div className="flex justify-between mb-1">
              <span className="font-medium">Total</span>
              <span className="text-gold-400 text-2xl">
                {formatPrice(finalTotal)}
              </span>
            </div>

            {/* Savings line */}
            {discount > 0 ? (
              <p className="text-right text-green-400 text-xs mb-5">
                🎉 You save {formatPrice(discount)} with {couponCode}
              </p>
            ) : (
              <div className="mb-5" />
            )}

            <button
              className="btn btn-primary w-full"
              onClick={handlePlaceOrder}
              disabled={placing || !selectedId}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;