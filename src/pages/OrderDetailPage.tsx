import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderAPI, reviewAPI } from "./../api/service";
import { LoadingPage } from "../components/ui";
import { formatPrice, formatDate } from "../utils";
import type { Order } from "../types";
import toast from "react-hot-toast";
import {
  MapPin,
  CreditCard,
  ArrowLeft,
  Star,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  Tag,
} from "lucide-react";

// ─────────────────────────────────────────
// DYNAMIC ORDER PROGRESS TIMELINE
// ─────────────────────────────────────────

const PROGRESS_STEPS = [
  { key: "PENDING",   label: "Order Placed", icon: ShoppingBag },
  { key: "CONFIRMED", label: "Confirmed",    icon: CheckCircle2 },
  { key: "SHIPPED",   label: "Shipped",      icon: Truck },
  { key: "DELIVERED", label: "Delivered",    icon: PackageCheck },
];

const OrderProgress = ({ status }: { status: string }) => {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <XCircle size={18} className="text-red-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-400">Order Cancelled</p>
          <p className="text-xs text-obsidian-500 mt-0.5">
            This order has been cancelled
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = PROGRESS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="relative">
      {/* Vertical connector line behind the steps */}
      <div className="absolute left-[17px] top-5 bottom-5 w-[2px] bg-obsidian-800" />

      <div className="space-y-5">
        {PROGRESS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex items-center gap-4 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-obsidian-900 border-obsidian-700 text-obsidian-600"
                } ${isCurrent ? "ring-2 ring-green-500/30 ring-offset-2 ring-offset-[#111]" : ""}`}
              >
                <Icon size={15} />
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    isDone ? "text-white" : "text-obsidian-600"
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-green-400 mt-0.5">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// STAR RATING PICKER
// ─────────────────────────────────────────

const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "text-gold-400 fill-gold-400"
                : "text-obsidian-600"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-obsidian-400 self-center">
        {["", "Terrible", "Poor", "Average", "Good", "Excellent"][hovered || value]}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────
// REVIEW FORM — isolated state per item
// ─────────────────────────────────────────

const ReviewForm = ({
  item,
  orderId,
}: {
  item: any;
  orderId: number;
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please write a comment before submitting");
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.create({
        productId: item.productId,
        orderItemId: item.id,
        orderId: orderId,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
        <CheckCircle2 size={18} className="text-green-400" />
        <div>
          <p className="text-sm font-medium text-green-400">Review submitted!</p>
          <p className="text-xs text-obsidian-500 mt-0.5">
            Thank you for your feedback
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-obsidian-800 pt-5 space-y-4">
      <h3 className="font-medium text-sm text-obsidian-300 uppercase tracking-wider">
        Write a Review
      </h3>

      <StarPicker value={rating} onChange={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        className="w-full bg-obsidian-900 border border-obsidian-700 focus:border-gold-500 focus:outline-none p-3 rounded-xl text-sm resize-none transition-colors placeholder:text-obsidian-600"
      />

      <button
        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={submitting || !comment.trim()}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────
// ORDER DETAIL PAGE
// ─────────────────────────────────────────

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id ? Number(id) : null;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!orderId || isNaN(orderId)) {
      toast.error("Invalid order ID");
      setLoading(false);
      return;
    }
    try {
      const res = await orderAPI.getById(orderId);
      setOrder(res.data);
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <LoadingPage />;
  if (!order)
    return (
      <div className="container-wide max-w-7xl py-10">
        <p className="text-obsidian-500">Order not found.</p>
      </div>
    );

  const itemsTotal =
    order.items?.reduce(
      (sum, item) =>
        sum + (item.price ?? item.price ?? 0) * item.quantity,
      0
    ) ?? 0;

  const deliveryCharge = itemsTotal >= 499 ? 0 : 50;
  const discount = order.discountAmount ?? 0;

  return (
    <div>
      <div className="container-wide max-w-7xl py-8">

        {/* BACK + HEADER */}
        <div className="mb-8">
          <button
            className="flex items-center gap-2 text-sm text-obsidian-500 hover:text-white transition mb-4"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={16} />
            Back to Orders
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title text-3xl font-display">
                Order #{order.id}
              </h1>
              <p className="text-obsidian-500 text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            {/* STATUS PILL */}
            <div
              className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                order.orderStatus === "DELIVERED"
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : order.orderStatus === "CANCELLED"
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : order.orderStatus === "SHIPPED"
                  ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                  : "border-blue-500/40 bg-blue-500/10 text-blue-400"
              }`}
            >
              {order.orderStatus}
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-8">

          {/* LEFT — ITEMS */}
          <div className="col-span-2 space-y-5">
            {order.items?.map((item, i) => (
              <div
                key={item.id ?? i}
                className="card border border-obsidian-800 p-6 rounded-xl"
              >
                {/* PRODUCT ROW */}
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-obsidian-900 shrink-0">
                    {item.productImageUrl ? (
                      <img
                        src={`http://localhost:8080${item.productImageUrl}`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={24} className="text-obsidian-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base">{item.productName}</p>
                    <p className="text-sm text-obsidian-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-obsidian-600 mt-1">
                      Unit price:{" "}
                      {formatPrice(item.price ?? item.price ?? 0)}
                    </p>
                  </div>

                  <p className="text-lg font-semibold text-gold-400 shrink-0">
                    {formatPrice(
                      (item.price ?? item.price ?? 0) * item.quantity
                    )}
                  </p>
                </div>

                {/* REVIEW FORM — only on DELIVERED */}
                {order.orderStatus === "DELIVERED" && orderId ? (
                  <ReviewForm item={item} orderId={orderId} />
                ) : (
                  order.orderStatus !== "CANCELLED" && (
                    <p className="text-xs text-obsidian-600 mt-5 border-t border-obsidian-800 pt-4">
                      Review can be added after delivery
                    </p>
                  )
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            {/* ✅ ORDER PROGRESS — moved here, one common card for all items */}
            <div className="card border border-obsidian-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} className="text-obsidian-500" />
                <h3 className="font-display text-base">Order Progress</h3>
              </div>
              <OrderProgress status={order.orderStatus} />

              {order.estimatedDeliveryDate && order.orderStatus !== "DELIVERED" && (
                <div className="mt-4 pt-4 border-t border-obsidian-800">
                  <p className="text-xs text-obsidian-500">Estimated Delivery</p>
                  <p className="text-sm text-green-400 font-medium mt-0.5">
                    {formatDate(order.estimatedDeliveryDate)}
                  </p>
                </div>
              )}
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="card border border-obsidian-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} className="text-obsidian-500" />
                <h3 className="font-display text-base">Delivery Address</h3>
              </div>

              {order.address ? (
                <div className="text-sm space-y-1 text-obsidian-400">
                  <p className="font-medium text-white">
                    {order.address.fullName}
                  </p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine1 && (
                    <p>{order.address.addressLine1}</p>
                  )}
                  {order.address.landmark && (
                    <p className="text-obsidian-500">
                      Near {order.address.landmark}
                    </p>
                  )}
                  <p>
                    {order.address.city}, {order.address.state} —{" "}
                    {order.address.postalCode}
                  </p>
                  <p>{order.address.country}</p>
                  <p className="text-obsidian-500 pt-1">
                    📞 {order.address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-obsidian-500">
                  Address not available
                </p>
              )}
            </div>

            {/* PAYMENT DETAILS */}
            <div className="card border border-obsidian-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={15} className="text-obsidian-500" />
                <h3 className="font-display text-base">Payment</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Method</span>
                  <span>{order.paymentMethod ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Status</span>
                  <span
                    className={
                      order.paymentStatus === "SUCCESS"
                        ? "text-green-400"
                        : order.paymentStatus === "FAILED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {order.paymentStatus ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="card border border-obsidian-800 p-5 rounded-xl">
              <h3 className="font-display text-base mb-4">Price Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian-500">Items Total</span>
                  <span>{formatPrice(itemsTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-obsidian-500">Delivery</span>
                  <span
                    className={deliveryCharge === 0 ? "text-green-400" : ""}
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1.5">
                      <Tag size={12} />
                      {order.coupon?.couponCode
                        ? `Coupon (${order.coupon.couponCode})`
                        : "Coupon Discount"}
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t border-obsidian-800 pt-3 mt-1 flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span className="text-gold-400 text-base">
                    {formatPrice(order.totalAmount ?? 0)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;