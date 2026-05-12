import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag, Clock, ShoppingBag } from "lucide-react";
import { couponAPI } from "./../api/services";
import toast from "react-hot-toast";

interface Coupon {
  couponCode: string;
  couponType: string;
  description: string;
  discountAmount: number;
  maximumDiscountAmount: number;
  minOrderAmount: number;
  expiryAt: string;
  isActive: boolean;
  calculatedStatus: string;
  alreadyUsed: boolean;
}

const CouponViewPage: React.FC = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (!id) return;

    couponAPI
      .viewActiveCoupon(Number(id))
      .then((res: any) => setCoupon(res.data))
      .catch(() => toast.error("Failed to load coupon"));
  }, [id]);

  if (!coupon) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="flex justify-center">
      <div className="max-w-xl w-full py-8">

        {/* Coupon Card */}
        <div className="bg-obsidian-900 border border-gold-400/30 rounded-xl p-8 shadow-xl">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Tag className="text-gold-400" />
            <h1 className="text-2xl font-semibold text-gold-400">
              {coupon.couponCode}
            </h1>
          </div>

          {/* Discount */}
          <div className="text-center mb-8">
            <p className="text-5xl font-bold text-white">
              ₹{coupon.discountAmount}
            </p>
            <p className="text-sm text-obsidian-400 mt-1">
              OFF on orders above ₹{coupon.minOrderAmount}
            </p>
          </div>

          {/* Description */}
          <p className="text-center text-obsidian-300 mb-8">
            {coupon.description}
          </p>

          {/* Details */}
          <div className="space-y-3 text-sm text-obsidian-400">

            <div className="flex items-center gap-2">
              <ShoppingBag size={16} />
              Minimum Order: ₹{coupon.minOrderAmount}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} />
              Expires: {new Date(coupon.expiryAt).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              Status:
              <span className="text-green-400 font-medium">
                {coupon.calculatedStatus}
              </span>
            </div>


            {coupon.alreadyUsed && (
              <p className="text-red-500 text-xs mt-1">
                Already Used
              </p>
            )}



          </div>

        </div>
      </div>
    </div>
  );
};

export default CouponViewPage;