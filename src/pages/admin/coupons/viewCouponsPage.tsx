
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { couponAPI } from "@/api/service";
import toast from "react-hot-toast";

interface Coupon {
  id: number;
  couponCode: string;
  couponType: "FLAT" | "PERCENTAGE";
  description: string;
  minOrderAmount: number;
  discountAmount: number;
  maximumDiscountAmount: number;
  validFrom: string;
  expiryAt: string;
  isActive: boolean;
  perUserLimit: number;
  globalUsageLimit: number;
  usedCount: number;
  remainingUsage: number;
  calculatedStatus: string;
}

const ViewCouponPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      const couponId = Number(id);

      if (!id || !Number.isSafeInteger(couponId) || couponId <= 0) {
        toast.error("Invalid coupon ID");
        setLoading(false);
        return;
      }

      try {
        const response = await couponAPI.getById(couponId);
        setCoupon(response.data);
      } catch (error) {
        console.error("Failed to fetch coupon", error);
        toast.error("Failed to load coupon");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-400";
      case "INACTIVE":
        return "bg-red-500/20 text-red-400";
      case "NOT_YET_STARTED":
        return "bg-blue-500/20 text-blue-400";
      case "EXPIRED":
        return "bg-yellow-500/20 text-yellow-400";
      case "USAGE_LIMIT_REACHED":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="pt-28 text-center">
        Loading coupon...
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="pt-28 text-center">
        <p className="mb-4">Coupon not found</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/coupons")}
        >
          Back to Coupons
        </button>
      </div>
    );
  }

  const expired =
    new Date(coupon.expiryAt).getTime() <= Date.now();

  return (
    <div className="flex justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-3xl bg-[#141414] border border-gray-800 rounded-xl shadow-xl p-8">

        <div className="flex justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              {coupon.couponCode}
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              {coupon.description}
            </p>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
              coupon.calculatedStatus
            )}`}
          >
            {coupon.calculatedStatus === "NOT_YET_STARTED"
              ? "SCHEDULED"
              : coupon.calculatedStatus}
          </span>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-lg font-semibold mb-4">
            Coupon Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Coupon Type</p>
              <p className="font-semibold">
                {coupon.couponType}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Discount</p>
              <p className="text-green-400 text-lg font-bold">
                {coupon.couponType === "PERCENTAGE"
                  ? `${coupon.discountAmount}%`
                  : `₹${coupon.discountAmount}`}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Minimum Order Amount
              </p>
              <p className="font-semibold">
                ₹{coupon.minOrderAmount}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Maximum Discount
              </p>
              <p className="font-semibold">
                ₹{coupon.maximumDiscountAmount}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Valid From</p>
              <p className="font-semibold">
                {formatDate(coupon.validFrom)}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Expiry At</p>
              <p className="font-semibold">
                {formatDate(coupon.expiryAt)}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Enabled</p>
              <p className="font-semibold">
                {coupon.isActive ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <h2 className="text-lg font-semibold mb-4">
            Usage Information
          </h2>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Per User Limit</p>
              <p className="font-semibold">
                {coupon.perUserLimit}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Global Usage Limit
              </p>
              <p className="font-semibold">
                {coupon.globalUsageLimit}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Used Count</p>
              <p className="font-semibold">
                {coupon.usedCount}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Remaining Usage
              </p>
              <p className="font-semibold text-yellow-400">
                {coupon.remainingUsage}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex justify-between">
          <button
            onClick={() => navigate("/admin/coupons")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            Back
          </button>

          {!expired && (
            <Link
              to={`/admin/coupons/edit/${coupon.id}`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Edit Coupon
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCouponPage;
