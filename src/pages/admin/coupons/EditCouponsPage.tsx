import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "./../../../api/client";

const EditCouponPage: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("PERCENTAGE");
  const [description, setDescription] = useState("");

  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [maximumDiscountAmount, setMaximumDiscountAmount] = useState("");

  const [validFrom, setValidFrom] = useState("");
  const [expiryAt, setExpiryAt] = useState("");

  const [perUserLimit, setPerUserLimit] = useState("");
  const [globalUsageLimit, setGlobalUsageLimit] = useState("");

  const [isActive, setIsActive] = useState(true);

  const fetchCoupon = async () => {
    try {

      const res = await apiClient.get(`/coupon/view/${id}`);
      const data = res.data;

      setCouponCode(data.couponCode);
      setCouponType(data.couponType);
      setDescription(data.description);

      setMinOrderAmount(data.minOrderAmount);
      setDiscountAmount(data.discountAmount);
      setMaximumDiscountAmount(data.maximumDiscountAmount);

      setValidFrom(data.validFrom.slice(0,16));
      setExpiryAt(data.expiryAt.slice(0,16));

      setPerUserLimit(data.perUserLimit);
      setGlobalUsageLimit(data.globalUsageLimit);

      setIsActive(data.isActive);

    } catch (error) {
      console.error("Failed to fetch coupon", error);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  const handleUpdateCoupon = async () => {

    const payload = {
      couponCode,
      couponType,
      description,
      minOrderAmount: Number(minOrderAmount),
      discountAmount: Number(discountAmount),
      maximumDiscountAmount: Number(maximumDiscountAmount),
      validFrom,
      expiryAt,
      isActive,
      perUserLimit: Number(perUserLimit),
      globalUsageLimit: Number(globalUsageLimit)
    };

    try {

      await apiClient.put(`/coupon/updateCoupon/${id}`, payload);

      navigate("/admin/coupons");

    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (

    <div className="flex justify-center pt-28 pb-16">

      <div className="w-full max-w-3xl card p-8">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Edit Coupon
        </h1>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm">Coupon Code</label>
            <input
              className="input"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Coupon Type</label>
            <select
              className="input"
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
            >
              <option value="PERCENTAGE">PERCENTAGE</option>
              <option value="FLAT">FLAT</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm">Description</label>
            <input
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Minimum Order Amount</label>
            <input
              type="number"
              className="input"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Discount Amount</label>
            <input
              type="number"
              className="input"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Maximum Discount Amount</label>
            <input
              type="number"
              className="input"
              value={maximumDiscountAmount}
              onChange={(e) => setMaximumDiscountAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Valid From</label>
            <input
              type="datetime-local"
              className="input"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Expiry At</label>
            <input
              type="datetime-local"
              className="input"
              value={expiryAt}
              onChange={(e) => setExpiryAt(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Per User Limit</label>
            <input
              type="number"
              className="input"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Global Usage Limit</label>
            <input
              type="number"
              className="input"
              value={globalUsageLimit}
              onChange={(e) => setGlobalUsageLimit(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            Active Coupon
          </label>

        </div>

        <button
          onClick={handleUpdateCoupon}
          className="btn btn-primary w-full mt-6"
        >
          Update Coupon
        </button>

      </div>

    </div>
  );
};

export default EditCouponPage;