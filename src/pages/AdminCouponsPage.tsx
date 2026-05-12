import React, { useState } from "react";
import { couponAPI } from "../api/services";
import toast from "react-hot-toast";

const AdminCouponsPage: React.FC = () => {

  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("Flat");
  const [description, setDescription] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [maximumDiscountAmount, setMaximumDiscountAmount] = useState("");
  const [expiryAt, setExpiryAt] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("");
  const [globalUsageLimit, setGlobalUsageLimit] = useState("");

  const handleCreateCoupon = async () => {
    try {
      await couponAPI.create({
        couponCode,
        couponType,
        description,
        minOrderAmount: Number(minOrderAmount),
        discountAmount: Number(discountAmount),
        maximumDiscountAmount: Number(maximumDiscountAmount),
        expiryAt,
        validFrom,
        isActive: true,
        perUserLimit: Number(perUserLimit),
        globalUsageLimit: Number(globalUsageLimit),
      });

      toast.success("Coupon created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    }
  };

  
  return (

  <div className="container-wide py-16 flex flex-col items-center">

    <h1 className="page-title mt-6 mb-10">Admin Coupons</h1>

    <div className="card p-8 w-full max-w-3xl grid grid-cols-2 gap-4">

      <input
        type="text"
        placeholder="Coupon Code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="input w-full"
      />

      <select
        value={couponType}
        onChange={(e) => setCouponType(e.target.value)}
        className="input w-full"
      >
        <option value="Flat">Flat</option>
        <option value="Percentage">Percentage</option>
      </select>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input w-full col-span-2"
      />

      <input
        type="number"
        placeholder="Minimum Order Amount"
        value={minOrderAmount}
        onChange={(e) => setMinOrderAmount(e.target.value)}
        className="input w-full"
      />

      <input
        type="number"
        placeholder="Discount Amount"
        value={discountAmount}
        onChange={(e) => setDiscountAmount(e.target.value)}
        className="input w-full"
      />

      <input
        type="number"
        placeholder="Maximum Discount Amount"
        value={maximumDiscountAmount}
        onChange={(e) => setMaximumDiscountAmount(e.target.value)}
        className="input w-full"
      />

      <input
        type="number"
        placeholder="Per User Limit"
        value={perUserLimit}
        onChange={(e) => setPerUserLimit(e.target.value)}
        className="input w-full"
      />

      <input
        type="datetime-local"
        value={validFrom}
        onChange={(e) => setValidFrom(e.target.value)}
        className="input w-full"
      />

      <input
        type="datetime-local"
        value={expiryAt}
        onChange={(e) => setExpiryAt(e.target.value)}
        className="input w-full"
      />

      <input
        type="number"
        placeholder="Global Usage Limit"
        value={globalUsageLimit}
        onChange={(e) => setGlobalUsageLimit(e.target.value)}
        className="input w-full col-span-2"
      />

      <button
        className="btn btn-primary col-span-2"
        onClick={handleCreateCoupon}
      >
        Create Coupon
      </button>

    </div>
  </div>
);
};

export default AdminCouponsPage;