import { Link } from "react-router-dom";

interface Coupon {
  id: number;
  couponCode: string;
  couponType: string;
  discountAmount: number;
  minOrderAmount: number;
  maximumDiscountAmount: number;
  expiryAt: string;
  perUserLimit: number;
  globalUsageLimit: number;
  isActive: boolean;
  calculatedStatus: string;
}

interface Props {
  c: Coupon;
  toggleCouponStatus: (id: number, active: boolean) => void;
}

export default function CouponCard({ c, toggleCouponStatus }: Props) {
  return (

    <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 shadow-lg hover:border-yellow-500 transition">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold text-yellow-400">
          {c.couponCode}
        </h2>

        {c.calculatedStatus === "EXPIRED" ? (
          <span className="text-yellow-400 font-semibold">
            EXPIRED
          </span>
        ) : c.isActive ? (
          <span className="text-green-400 font-semibold">
            ACTIVE
          </span>
        ) : (
          <span className="text-red-400 font-semibold">
            INACTIVE
          </span>
        )}

      </div>

      {/* Coupon Details */}
      <div className="space-y-2 text-sm text-gray-300">

        <p><span className="text-gray-400">Type:</span> {c.couponType}</p>

        <p>
          <span className="text-gray-400">Discount:</span> {c.discountAmount}
          {c.couponType === "PERCENTAGE" ? "%" : " ₹"}
        </p>

        <p>
          <span className="text-gray-400">Minimum Order:</span> ₹{c.minOrderAmount}
        </p>

        <p>
          <span className="text-gray-400">Maximum Discount:</span> ₹{c.maximumDiscountAmount}
        </p>

        <p>
          <span className="text-gray-400">Expiry:</span> {new Date(c.expiryAt).toLocaleDateString()}
        </p>

      </div>

      {/* Limits */}
      <div className="flex justify-between mt-4 text-sm text-gray-400 border-t border-gray-800 pt-3">

        <span>Per User: {c.perUserLimit}</span>

        <span>Global Limit: {c.globalUsageLimit}</span>

      </div>

      {/* Actions */}
      {c.calculatedStatus !== "EXPIRED" && (

        <div className="flex items-center justify-between mt-5">

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={c.isActive}
              onChange={() => toggleCouponStatus(c.id, c.isActive)}
              className="sr-only peer"
            />

            <div className="w-11 h-6 bg-gray-600 rounded-full 
            peer-checked:bg-green-500
            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:border after:rounded-full after:h-5 after:w-5
            after:transition-all peer-checked:after:translate-x-full">
            </div>
          </label>

          <Link
            to={`/admin/coupons/edit/${c.id}`}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Edit
          </Link>

        </div>

      )}

    </div>
  );
}