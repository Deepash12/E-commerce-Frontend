
import React, { useCallback, useEffect, useState } from "react";
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
  const [error, setError] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch coupons with pagination
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await couponAPI.getAll({
        pageNumber: page,
        pageSize: pageSize,
      });

      const data = res.data;
      const pages = data.totalPages ?? 0;

      setTotalPages(pages);
      setTotalElements(data.totalElements ?? 0);

      // Handle invalid page if total records decrease
      if (page > 0 && page >= pages) {
        setPage(Math.max(0, pages - 1));
        return;
      }

      setCoupons(data.content ?? []);

    } catch (error) {
      console.error("Failed to fetch coupons", error);
      setError(true);
      setCoupons([]);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Fetch coupons whenever pagination changes
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Enable / Disable coupon
  const toggleCouponStatus = async (id: number) => {
    if (updatingId !== null || loading) return;

    setUpdatingId(id);

    try {
      const response = await couponAPI.toggle(id);

      toast.success(
        typeof response.data === "string"
          ? response.data
          : "Coupon status updated successfully"
      );

      // Reload current page
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

  // Pagination controls
  const paginationDisabled =
    loading || updatingId !== null;

  const firstRecord =
    totalElements === 0 ? 0 : page * pageSize + 1;

  const lastRecord = Math.min(
    (page + 1) * pageSize,
    totalElements
  );

  return (
    <div className="flex justify-center pt-28 pb-16">
      <div className="w-full max-w-6xl px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Manage Coupons
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              {error || loading
                ? "Manage your discount coupons"
                : `Total Coupons: ${totalElements}`}
            </p>
          </div>

          <Link
            to="/admin/coupons/add"
            className="btn btn-primary"
          >
            Add Coupon
          </Link>
        </div>

        {/* Coupon Table */}
        <div className="card p-6 overflow-x-auto">

          {loading ? (
            <p className="text-center py-8">
              Loading coupons...
            </p>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">
                Failed to load coupons
              </p>

              <button
                className="btn btn-outline"
                onClick={fetchCoupons}
              >
                Retry
              </button>
            </div>
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
                          {c.couponType === "PERCENTAGE"
                            ? `${c.discountAmount}%`
                            : `₹${c.discountAmount}`}
                        </td>

                        {/* Minimum Order */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{c.minOrderAmount}
                        </td>

                        {/* Maximum Discount */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{c.maximumDiscountAmount}
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
                                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded"
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

        {/* Pagination */}
        {!error && (
          <div className="flex flex-col lg:flex-row items-center
                          justify-between gap-4 mt-6">

            {/* Showing Records */}
            <p className="text-sm text-gray-400">
              {loading
                ? "Loading records..."
                : `Showing ${firstRecord} - ${lastRecord} of ${totalElements} coupons`}
            </p>

            {/* Rows Per Page */}
            <div className="flex items-center gap-3">

              <label
                htmlFor="coupon-page-size"
                className="text-sm text-gray-400 whitespace-nowrap"
              >
                Rows per page:
              </label>

              <select
                id="coupon-page-size"
                className="input w-20"
                value={pageSize}
                disabled={paginationDisabled}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

            </div>

            {/* Previous and Next Buttons */}
            <div className="flex items-center gap-4">

              <button
                className="btn btn-outline
                           disabled:opacity-40
                           disabled:cursor-not-allowed"
                disabled={
                  page === 0 ||
                  paginationDisabled
                }
                onClick={() =>
                  setPage((previous) =>
                    Math.max(0, previous - 1)
                  )
                }
              >
                Previous
              </button>

              <span className="text-sm whitespace-nowrap">
                Page {page + 1} of {Math.max(totalPages, 1)}
              </span>

              <button
                className="btn btn-outline
                           disabled:opacity-40
                           disabled:cursor-not-allowed"
                disabled={
                  page + 1 >= totalPages ||
                  paginationDisabled
                }
                onClick={() =>
                  setPage((previous) =>
                    Math.min(previous + 1, totalPages - 1)
                  )
                }
              >
                Next
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCouponsPage;
