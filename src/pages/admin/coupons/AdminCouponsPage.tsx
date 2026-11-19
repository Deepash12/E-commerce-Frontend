
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { couponAPI } from "@/api/service";
import toast from "react-hot-toast";

interface Coupon {
  id: number;
  couponCode: string;
  couponType: string;
  discountAmount: number;
  minOrderAmount: number;
  maximumDiscountAmount: number;
  calculatedStatus: string;
  isActive: boolean;
  expiryAt: string;
}

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await couponAPI.getAll({
        pageNumber: 0,
        pageSize: 5,
      });

      setCoupons(res.data.content ?? []);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  // Enable / Disable coupon
  const toggleCouponStatus = async (id: number) => {
    if (updatingId !== null) return;

    setUpdatingId(id);

    try {
      const response = await couponAPI.toggle(id);

      toast.success(
        typeof response.data === "string"
          ? response.data
          : "Coupon status updated successfully"
      );

      // Reload coupons after successful toggle
      await fetchCoupons();
    } catch (error: any) {
      console.error("Failed to update coupon status", error);

      const errorMessage = error?.response?.data?.message;

      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : typeof error?.response?.data === "string"
          ? error.response.data
          : "Failed to update coupon status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Status text
  const getStatusLabel = (status: string) => {
    if (status === "NOT_YET_STARTED") {
      return "SCHEDULED";
    }

    return status;
  };

  // Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400";

      case "INACTIVE":
        return "text-red-400";

      case "NOT_YET_STARTED":
        return "text-blue-400";

      case "EXPIRED":
        return "text-yellow-400";

      case "USAGE_LIMIT_REACHED":
        return "text-orange-400";

      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex justify-center pt-28 pb-16">
      <div className="w-full max-w-6xl px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Manage Coupons
          </h1>

          <Link
            to="/admin/coupons/add"
            className="btn btn-primary"
          >
            Add Coupon
          </Link>
        </div>

        <div className="card p-6 overflow-x-auto">

          {loading ? (
            <p className="text-center py-8">
              Loading coupons...
            </p>
          ) : (
            <table className="w-full min-w-[1050px] text-left">

              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Minimum Order</th>
                  <th className="px-6 py-3">Maximum Discount</th>
                  <th className="px-6 py-3">Expiry</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-8 text-gray-400"
                    >
                      No coupons found
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => {
                    // Actual expiry check
                    const isExpired =
                      new Date(c.expiryAt).getTime() <= Date.now();

                    return (
                      <tr
                        key={c.id}
                        className="border-b border-gray-800 hover:bg-gray-900 transition"
                      >

                        {/* Coupon Code */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/admin/coupons/view/${c.id}`}
                            className="text-yellow-400 hover:underline"
                          >
                            {c.couponCode}
                          </Link>
                        </td>

                        {/* Coupon Type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.couponType}
                        </td>

                        {/* Discount */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.discountAmount}
                        </td>

                        {/* Minimum Order */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.minOrderAmount}
                        </td>

                        {/* Maximum Discount */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.maximumDiscountAmount}
                        </td>

                        {/* Expiry Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(c.expiryAt).toLocaleDateString()}
                        </td>

                        {/* Coupon Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`font-semibold ${getStatusColor(
                              c.calculatedStatus
                            )}`}
                          >
                            {getStatusLabel(c.calculatedStatus)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">

                            {/* Toggle only for non-expired coupons */}
                            {!isExpired && (
                              <label
                                className={`relative inline-flex items-center ${
                                  updatingId !== null
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                title={
                                  c.isActive
                                    ? "Disable coupon"
                                    : "Enable coupon"
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={c.isActive}
                                  onChange={() =>
                                    toggleCouponStatus(c.id)
                                  }
                                  disabled={updatingId !== null}
                                  aria-label={`Toggle coupon ${c.couponCode}`}
                                  className="sr-only peer"
                                />

                                <div
                                  className="w-11 h-6 bg-gray-600 rounded-full
                                    peer-checked:bg-green-500
                                    after:content-['']
                                    after:absolute
                                    after:top-[2px]
                                    after:left-[2px]
                                    after:bg-white
                                    after:border
                                    after:rounded-full
                                    after:h-5
                                    after:w-5
                                    after:transition-all
                                    peer-checked:after:translate-x-full"
                                />
                              </label>
                            )}

                            {/* Edit only non-expired coupons */}
                            {!isExpired && (
                              <Link
                                to={`/admin/coupons/edit/${c.id}`}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded"
                              >
                                Edit
                              </Link>
                            )}

                            {isExpired && (
                              <span className="text-gray-500 text-sm">
                                Expired
                              </span>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
