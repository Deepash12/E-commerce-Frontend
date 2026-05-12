import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/client";

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
  description: string;
  validFrom: string;
  perUserLimit: number;
  globalUsageLimit: number;
  usedCount: number;
  remainingUsage: number;
  
}

const ViewCouponPage: React.FC = () => {

  const { id } = useParams();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const navigate = useNavigate();

  const fetchCoupon = async () => {

    try {

      const res = await apiClient.get(`/coupon/view/${id}`);
      setCoupon(res.data);

    } catch (error) {
      console.error("Failed to fetch coupon", error);
    }

  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  if (!coupon) {
    return <div className="pt-28 text-center">Loading...</div>;
  }

  return (

<div className="flex justify-center pt-28 pb-16">

  <div className="w-full max-w-3xl bg-[#141414] border border-gray-800 rounded-xl shadow-xl p-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-yellow-400">
          {coupon.couponCode}
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          {coupon.description}
        </p>
      </div>

      <span
        className={`px-4 py-1.5 rounded-full text-sm font-semibold
        ${coupon.calculatedStatus === "EXPIRED"
            ? "bg-yellow-500/20 text-yellow-400"
            : coupon.calculatedStatus === "ACTIVE"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
      >
        {coupon.calculatedStatus}
      </span>

    </div>

    {/* Divider */}
    <div className="border-t border-gray-800 mb-8"></div>

    {/* Coupon Details Grid */}
    <div className="grid grid-cols-2 gap-6 text-sm">

      <div>
        <p className="text-gray-400">Coupon Type</p>
        <p className="font-semibold">{coupon.couponType}</p>
      </div>

      <div>
        <p className="text-gray-400">Discount</p>
        <p className="text-green-400 text-lg font-bold">
          {coupon.discountAmount}
          {coupon.couponType === "PERCENTAGE" ? "%" : " ₹"}
        </p>
      </div>

      <div>
        <p className="text-gray-400">Minimum Order Amount</p>
        <p className="font-semibold">₹{coupon.minOrderAmount}</p>
      </div>

      <div>
        <p className="text-gray-400">Maximum Discount</p>
        <p className="font-semibold">₹{coupon.maximumDiscountAmount}</p>
      </div>

      <div>
        <p className="text-gray-400">Valid From</p>
        <p className="font-semibold">
          {new Date(coupon.validFrom).toLocaleDateString()}
        </p>
      </div>

      <div>
        <p className="text-gray-400">Expiry Date</p>
        <p className="font-semibold">
          {new Date(coupon.expiryAt).toLocaleDateString()}
        </p>
      </div>

    </div>

    {/* Usage Section */}
    <div className="border-t border-gray-800 mt-8 pt-6">

      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        Usage Information
      </h2>

      <div className="grid grid-cols-3 gap-6 text-sm">

        <div>
          <p className="text-gray-400">Per User Limit</p>
          <p className="font-semibold">{coupon.perUserLimit}</p>
        </div>

        <div>
          <p className="text-gray-400">Global Usage Limit</p>
          <p className="font-semibold">{coupon.globalUsageLimit}</p>
        </div>

        <div>
          <p className="text-gray-400">Used Count</p>
          <p className="font-semibold">{coupon.usedCount}</p>
        </div>

        <div>
          <p className="text-gray-400">Remaining Usage</p>
          <p className="font-semibold text-yellow-400">
            {coupon.remainingUsage}
          </p>
        </div>

      </div>

    </div>

    {/* Actions */}
    <div className="border-t border-gray-800 mt-8 pt-6 flex justify-between">

      <button
        onClick={() => navigate("/admin/coupons")}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
      >
        Back
      </button>

      {coupon.calculatedStatus !== "EXPIRED" && (
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