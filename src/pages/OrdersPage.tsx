// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Package,
//   ChevronDown,
//   ChevronUp,
//   Search,
//   Filter,
//   Clock,
//   CheckCircle2,
//   Truck,
//   XCircle,
//   Archive,
// } from "lucide-react";
// import { orderAPI } from "../api/service";
// import { LoadingPage, EmptyState, StatusBadge } from "../components/ui";
// import { formatPrice, formatDate } from "../utils";
// import type { Order } from "../types";
// import toast from "react-hot-toast";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// // ─────────────────────────────────────────
// // STATUS CONFIG
// // ─────────────────────────────────────────

// const STATUS_CONFIG: Record<
//   string,
//   { label: string; color: string; icon: React.ReactNode }
// > = {
//   ALL: {
//     label: "All Orders",
//     color: "text-obsidian-300",
//     icon: <Archive size={14} />,
//   },
//   PENDING: {
//     label: "Pending",
//     color: "text-yellow-400",
//     icon: <Clock size={14} />,
//   },
//   CONFIRMED: {
//     label: "Confirmed",
//     color: "text-blue-400",
//     icon: <CheckCircle2 size={14} />,
//   },
//   SHIPPED: {
//     label: "Shipped",
//     color: "text-purple-400",
//     icon: <Truck size={14} />,
//   },
//   DELIVERED: {
//     label: "Delivered",
//     color: "text-green-400",
//     icon: <CheckCircle2 size={14} />,
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     color: "text-red-400",
//     icon: <XCircle size={14} />,
//   },
// };

// // ─────────────────────────────────────────
// // ORDER TIMELINE
// // ─────────────────────────────────────────

// const TIMELINE_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

// const OrderTimeline = ({ status }: { status: string }) => {
//   // If cancelled, show a distinct cancelled state
//   if (status === "CANCELLED") {
//     return (
//       <div className="flex items-center gap-2 mt-4">
//         <div className="w-3 h-3 rounded-full bg-red-500" />
//         <div className="flex-1 h-[2px] bg-obsidian-700" />
//         <span className="text-xs text-red-400 font-medium">Order Cancelled</span>
//       </div>
//     );
//   }

//   const currentIndex = TIMELINE_STEPS.indexOf(status);

//   return (
//     <div className="flex items-center gap-0 mt-4">
//       {TIMELINE_STEPS.map((step, index) => (
//         <div key={step} className="flex items-center flex-1">
//           <div className="flex flex-col items-center gap-1">
//             <div
//               className={`w-3 h-3 rounded-full transition-colors ${
//                 index <= currentIndex ? "bg-green-500" : "bg-obsidian-700"
//               }`}
//             />
//             <span
//               className={`text-[10px] whitespace-nowrap ${
//                 index <= currentIndex
//                   ? "text-green-400"
//                   : "text-obsidian-600"
//               }`}
//             >
//               {step.charAt(0) + step.slice(1).toLowerCase()}
//             </span>
//           </div>
//           {index < TIMELINE_STEPS.length - 1 && (
//             <div
//               className={`flex-1 h-[2px] mb-3 ${
//                 index < currentIndex ? "bg-green-500" : "bg-obsidian-700"
//               }`}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// // ─────────────────────────────────────────
// // ORDER CARD
// // ─────────────────────────────────────────

// const OrderCard = ({
//   order,
//   onCancel,
// }: {
//   order: Order;
//   onCancel: (id: number) => void;
// }) => {
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [details, setDetails] = useState<Order | null>(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   // FIX: Use first item safely
//   const firstItem = order.items?.[0];

//   const canCancel =
//     order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED";

//   const handleExpand = async (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (!expanded && !details) {
//       setLoadingDetails(true);
//       try {
//         const res = await orderAPI.getById(order.id);
//         setDetails(res.data);
//       } catch {
//         toast.error("Failed to load order details");
//       } finally {
//         setLoadingDetails(false);
//       }
//     }

//     setExpanded((prev) => !prev);
//   };

//   return (
//     <div
//       className="bg-[#111] border border-obsidian-800 rounded-xl p-5 hover:border-obsidian-600 transition-all duration-200 cursor-pointer group"
//       onClick={() => navigate(`/orders/${order.id}`)}
//     >
//       {/* TOP ROW */}
//       <div className="flex items-start justify-between gap-4">
//         {/* PRODUCT INFO */}
//         <div className="flex items-center gap-4 flex-1 min-w-0">
//           <div className="w-16 h-16 rounded-lg overflow-hidden bg-obsidian-900 shrink-0">
//             {firstItem?.productImageUrl ? (
//               <img
//                 src={`${BASE_URL}${firstItem.productImageUrl}`}
//                 alt={firstItem?.productName}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = "/placeholder.png";
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <Package size={20} className="text-obsidian-600" />
//               </div>
//             )}
//           </div>

//           <div className="min-w-0">
//             <p className="font-medium text-base truncate">
//               {firstItem?.productName ?? "Product"}
//             </p>
//             {/* FIX: Show item count if multiple */}
//             {(order.items?.length ?? 0) > 1 && (
//               <p className="text-xs text-obsidian-500 mt-0.5">
//                 +{(order.items?.length ?? 1) - 1} more item
//                 {(order.items?.length ?? 1) - 1 > 1 ? "s" : ""}
//               </p>
//             )}
//             <p className="text-xs text-obsidian-500 mt-1">
//               Order #{order.id} • {formatDate(order.createdAt)}
//             </p>
//           </div>
//         </div>

//         {/* PRICE */}
//         <div className="text-right shrink-0">
//           <p className="text-lg font-display text-gold-400">
//             {formatPrice(order.totalAmount ?? 0)}
//           </p>
//           {/* FIX: Show discount if present */}
//           {(order.discountAmount ?? 0) > 0 && (
//             <p className="text-xs text-green-400 mt-0.5">
//               -{formatPrice(order.discountAmount ?? 0)} off
//             </p>
//           )}
//         </div>

//         {/* STATUS + ACTIONS */}
//         <div
//           className="flex flex-col items-end gap-2 shrink-0"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <StatusBadge status={order.orderStatus} />

//           {canCancel && (
//             <button
//               className="text-xs border border-red-500/60 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/10 transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onCancel(order.id);
//               }}
//             >
//               Cancel
//             </button>
//           )}
//         </div>

//         {/* EXPAND TOGGLE */}
//         <button
//           className="p-2 hover:bg-obsidian-800 rounded-lg transition shrink-0"
//           onClick={handleExpand}
//         >
//           {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//         </button>
//       </div>

//       {/* TIMELINE */}
//       <OrderTimeline status={order.orderStatus} />

//       {/* EXPANDED ITEMS */}
//       {expanded && (
//         <div className="mt-5 pt-4 border-t border-obsidian-800">
//           {loadingDetails ? (
//             <div className="text-center py-4 text-obsidian-500 text-sm">
//               Loading...
//             </div>
//           ) : details?.items?.length ? (
//             <div className="space-y-3">
//               {details.items.map((item: any, idx: number) => (
//                 <div
//                   key={item.id ?? idx}
//                   className="flex justify-between items-center"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={`${BASE_URL}${item.productImageUrl}`}
//                       className="w-10 h-10 rounded-lg object-cover bg-obsidian-900"
//                       alt={item.productName}
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = "/placeholder.png";
//                       }}
//                     />
//                     <span className="text-sm text-obsidian-300">
//                       {item.productName} × {item.quantity}
//                     </span>
//                   </div>
//                   {/* FIX: Backend sends priceAtPurchase, not price */}
//                   <span className="text-sm font-medium">
//                     {formatPrice((item.priceAtPurchase ?? item.price ?? 0) * item.quantity)}
//                   </span>
//                 </div>
//               ))}

//               {/* COUPON IN EXPANDED */}
//               {(details.discountAmount ?? 0) > 0 && (
//                 <div className="pt-3 mt-2 border-t border-obsidian-800 flex justify-between text-sm">
//                   <span className="text-green-400">
//                     Coupon ({details.coupon?.couponCode})
//                   </span>
//                   <span className="text-green-400">
//                     -{formatPrice(details.discountAmount ?? 0)}
//                   </span>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <p className="text-sm text-obsidian-500 text-center py-2">
//               No items found
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────
// // ORDERS PAGE
// // ─────────────────────────────────────────

// const OrdersPage = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const fetchOrders = async () => {
//     try {
//       const res = await orderAPI.getAll();
//       setOrders(res.data.content ?? []);
//     } catch {
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleCancel = async (id: number) => {
//     if (!window.confirm("Cancel this order?")) return;
//     try {
//       await orderAPI.cancel(id);
//       toast.success("Order cancelled");
//       fetchOrders();
//     } catch {
//       toast.error("Cannot cancel order");
//     }
//   };

//   if (loading) return <LoadingPage />;

//   // FIX: Count per status for sidebar badges
//   const countByStatus = orders.reduce<Record<string, number>>((acc, o) => {
//     acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
//     return acc;
//   }, {});

//   const filteredOrders = orders
//     .filter((o) => statusFilter === "ALL" || o.orderStatus === statusFilter)
//     .filter((o) => {
//       const name = o.items?.[0]?.productName?.toLowerCase() ?? "";
//       const q = search.toLowerCase();
//       return o.id.toString().includes(q) || name.includes(q);
//     });

//   return (
//     <div>
//       <div className="container-wide max-w-6xl py-8">

//         {/* PAGE HEADER */}
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h1 className="page-title">My Orders</h1>
//             <p className="text-obsidian-500 mt-1 text-sm">
//               {orders.length} total order{orders.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//         </div>

//         {/* LAYOUT — FIX: col-span-3 + col-span-9 = 12 (was 2 + 9 = 11) */}
//         <div className="grid grid-cols-12 gap-8 items-start">

//           {/* LEFT SIDEBAR */}
//           <div className="col-span-3">
//             <div className="card border border-obsidian-800 p-4 rounded-xl sticky top-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Filter size={14} className="text-obsidian-500" />
//                 <h3 className="font-display text-sm text-obsidian-400 uppercase tracking-wider">
//                   Filter by Status
//                 </h3>
//               </div>

//               <div className="flex flex-col gap-1">
//                 {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
//                   const count =
//                     status === "ALL"
//                       ? orders.length
//                       : (countByStatus[status] ?? 0);
//                   const isActive = statusFilter === status;

//                   return (
//                     <button
//                       key={status}
//                       onClick={() => setStatusFilter(status)}
//                       className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
//                         isActive
//                           ? "bg-gold-500 text-black font-medium"
//                           : "hover:bg-obsidian-800 text-obsidian-300"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={isActive ? "text-black" : cfg.color}
//                         >
//                           {cfg.icon}
//                         </span>
//                         {cfg.label}
//                       </div>
//                       {count > 0 && (
//                         <span
//                           className={`text-xs px-1.5 py-0.5 rounded-full ${
//                             isActive
//                               ? "bg-black/20 text-black"
//                               : "bg-obsidian-800 text-obsidian-400"
//                           }`}
//                         >
//                           {count}
//                         </span>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="col-span-9 space-y-5">

//             {/* SEARCH */}
//             <div className="relative">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Search by order ID or product name..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#111] border border-obsidian-800 focus:outline-none focus:border-gold-500 text-sm transition-colors"
//               />
//             </div>

//             {/* RESULTS COUNT */}
//             {search || statusFilter !== "ALL" ? (
//               <p className="text-xs text-obsidian-500">
//                 Showing {filteredOrders.length} result
//                 {filteredOrders.length !== 1 ? "s" : ""}
//                 {statusFilter !== "ALL" ? ` · ${STATUS_CONFIG[statusFilter]?.label}` : ""}
//               </p>
//             ) : null}

//             {/* ORDERS LIST */}
//             {filteredOrders.length === 0 ? (
//               <EmptyState
//                 icon={<Package size={56} />}
//                 title="No orders found"
//                 description={
//                   search
//                     ? `No results for "${search}"`
//                     : "No orders in this category"
//                 }
//                 action={
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => navigate("/products")}
//                   >
//                     Start Shopping
//                   </button>
//                 }
//               />
//             ) : (
//               <div className="space-y-4">
//                 {filteredOrders.map((order) => (
//                   <OrderCard
//                     key={order.id}
//                     order={order}
//                     onCancel={handleCancel}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Archive,
} from "lucide-react";
import { orderAPI } from "../api/service";
import { LoadingPage, EmptyState, StatusBadge } from "../components/ui";
import { formatPrice, formatDate } from "../utils";
import type { Order } from "../types";
import toast from "react-hot-toast";

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

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  ALL: {
    label: "All Orders",
    color: "text-obsidian-300",
    icon: <Archive size={14} />,
  },
  PENDING: {
    label: "Pending",
    color: "text-yellow-400",
    icon: <Clock size={14} />,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-400",
    icon: <CheckCircle2 size={14} />,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-400",
    icon: <Truck size={14} />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-400",
    icon: <CheckCircle2 size={14} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-400",
    icon: <XCircle size={14} />,
  },
};

const TIMELINE_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const OrderTimeline = ({ status }: { status: string }) => {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 mt-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="flex-1 h-[2px] bg-obsidian-700" />
        <span className="text-xs text-red-400 font-medium">
          Order Cancelled
        </span>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-4">
      {TIMELINE_STEPS.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentIndex ? "bg-green-500" : "bg-obsidian-700"
              }`}
            />

            <span
              className={`text-[10px] whitespace-nowrap ${
                index <= currentIndex ? "text-green-400" : "text-obsidian-600"
              }`}
            >
              {step.charAt(0) + step.slice(1).toLowerCase()}
            </span>
          </div>

          {index < TIMELINE_STEPS.length - 1 && (
            <div
              className={`flex-1 h-[2px] mb-3 ${
                index < currentIndex ? "bg-green-500" : "bg-obsidian-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const OrderCard = ({
  order,
  onCancel,
}: {
  order: Order;
  onCancel: (id: number) => void;
}) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState<Order | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const firstItem = order.items?.[0];

  const canCancel =
    order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED";

  const handleExpand = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!expanded && !details) {
      setLoadingDetails(true);

      try {
        const res = await orderAPI.getById(order.id);
        const apiResponse: any = res.data;

        setDetails(apiResponse?.data ?? apiResponse);
      } catch (error) {
        console.error("Order details fetch error:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoadingDetails(false);
      }
    }

    setExpanded((prev) => !prev);
  };

  return (
    <div
      className="bg-[#111] border border-obsidian-800 rounded-xl p-5 hover:border-obsidian-600 transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-obsidian-900 shrink-0">
            {firstItem?.productImageUrl ? (
              <img
                src={getImageUrl(firstItem.productImageUrl)}
                alt={firstItem?.productName || "Product"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Order image failed:", e.currentTarget.src);
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={20} className="text-obsidian-600" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-medium text-base truncate">
              {firstItem?.productName ?? "Product"}
            </p>

            {(order.items?.length ?? 0) > 1 && (
              <p className="text-xs text-obsidian-500 mt-0.5">
                +{(order.items?.length ?? 1) - 1} more item
                {(order.items?.length ?? 1) - 1 > 1 ? "s" : ""}
              </p>
            )}

            <p className="text-xs text-obsidian-500 mt-1">
              Order #{order.id} • {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-display text-gold-400">
            {formatPrice(order.totalAmount ?? 0)}
          </p>

          {(order.discountAmount ?? 0) > 0 && (
            <p className="text-xs text-green-400 mt-0.5">
              -{formatPrice(order.discountAmount ?? 0)} off
            </p>
          )}
        </div>

        <div
          className="flex flex-col items-end gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusBadge status={order.orderStatus} />

          {canCancel && (
            <button
              className="text-xs border border-red-500/60 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/10 transition"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(order.id);
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <button
          className="p-2 hover:bg-obsidian-800 rounded-lg transition shrink-0"
          onClick={handleExpand}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <OrderTimeline status={order.orderStatus} />

      {expanded && (
        <div className="mt-5 pt-4 border-t border-obsidian-800">
          {loadingDetails ? (
            <div className="text-center py-4 text-obsidian-500 text-sm">
              Loading...
            </div>
          ) : details?.items?.length ? (
            <div className="space-y-3">
              {details.items.map((item: any, idx: number) => (
                <div
                  key={item.id ?? idx}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.productImageUrl)}
                      className="w-10 h-10 rounded-lg object-cover bg-obsidian-900"
                      alt={item.productName || "Product"}
                      onError={(e) => {
                        console.log("Order expanded image failed:", e.currentTarget.src);
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />

                    <span className="text-sm text-obsidian-300">
                      {item.productName} × {item.quantity}
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {formatPrice(
                      (item.priceAtPurchase ?? item.price ?? 0) * item.quantity
                    )}
                  </span>
                </div>
              ))}

              {(details.discountAmount ?? 0) > 0 && (
                <div className="pt-3 mt-2 border-t border-obsidian-800 flex justify-between text-sm">
                  <span className="text-green-400">
                    Coupon ({details.coupon?.couponCode})
                  </span>

                  <span className="text-green-400">
                    -{formatPrice(details.discountAmount ?? 0)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-obsidian-500 text-center py-2">
              No items found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderAPI.getAll();
      const apiResponse: any = res.data;

      const data = apiResponse?.data?.content ?? apiResponse?.content ?? [];

      setOrders(data);
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await orderAPI.cancel(id);
      toast.success("Order cancelled");
      fetchOrders();
    } catch {
      toast.error("Cannot cancel order");
    }
  };

  if (loading) return <LoadingPage />;

  const countByStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
    return acc;
  }, {});

  const filteredOrders = orders
    .filter((o) => statusFilter === "ALL" || o.orderStatus === statusFilter)
    .filter((o) => {
      const name = o.items?.[0]?.productName?.toLowerCase() ?? "";
      const q = search.toLowerCase();

      return o.id.toString().includes(q) || name.includes(q);
    });

  return (
    <div>
      <div className="container-wide max-w-6xl py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="page-title">My Orders</h1>

            <p className="text-obsidian-500 mt-1 text-sm">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-3">
            <div className="card border border-obsidian-800 p-4 rounded-xl sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={14} className="text-obsidian-500" />

                <h3 className="font-display text-sm text-obsidian-400 uppercase tracking-wider">
                  Filter by Status
                </h3>
              </div>

              <div className="flex flex-col gap-1">
                {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                  const count =
                    status === "ALL" ? orders.length : countByStatus[status] ?? 0;

                  const isActive = statusFilter === status;

                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                        isActive
                          ? "bg-gold-500 text-black font-medium"
                          : "hover:bg-obsidian-800 text-obsidian-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={isActive ? "text-black" : cfg.color}>
                          {cfg.icon}
                        </span>

                        {cfg.label}
                      </div>

                      {count > 0 && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-black/20 text-black"
                              : "bg-obsidian-800 text-obsidian-400"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-9 space-y-5">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500"
              />

              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#111] border border-obsidian-800 focus:outline-none focus:border-gold-500 text-sm transition-colors"
              />
            </div>

            {search || statusFilter !== "ALL" ? (
              <p className="text-xs text-obsidian-500">
                Showing {filteredOrders.length} result
                {filteredOrders.length !== 1 ? "s" : ""}
                {statusFilter !== "ALL"
                  ? ` · ${STATUS_CONFIG[statusFilter]?.label}`
                  : ""}
              </p>
            ) : null}

            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={<Package size={56} />}
                title="No orders found"
                description={
                  search ? `No results for "${search}"` : "No orders in this category"
                }
                action={
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/products")}
                  >
                    Start Shopping
                  </button>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;