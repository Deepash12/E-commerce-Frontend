
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { couponAPI } from "@/api/service";
import toast from "react-hot-toast";

type CouponType = "FLAT" | "PERCENTAGE";

interface CouponForm {
  couponCode: string;
  couponType: CouponType;
  description: string;
  minOrderAmount: string;
  discountAmount: string;
  maximumDiscountAmount: string;
  validFrom: string;
  expiryAt: string;
  perUserLimit: string;
  globalUsageLimit: string;
  isActive: boolean;
}

const EditCouponPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<CouponForm>({
    couponCode: "",
    couponType: "PERCENTAGE",
    description: "",
    minOrderAmount: "",
    discountAmount: "",
    maximumDiscountAmount: "",
    validFrom: "",
    expiryAt: "",
    perUserLimit: "",
    globalUsageLimit: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        const data = response.data;

        setForm({
          couponCode: data.couponCode ?? "",
          couponType: data.couponType ?? "PERCENTAGE",
          description: data.description ?? "",
          minOrderAmount: String(data.minOrderAmount ?? ""),
          discountAmount: String(data.discountAmount ?? ""),
          maximumDiscountAmount: String(
            data.maximumDiscountAmount ?? ""
          ),
          validFrom: data.validFrom?.slice(0, 16) ?? "",
          expiryAt: data.expiryAt?.slice(0, 16) ?? "",
          perUserLimit: String(data.perUserLimit ?? ""),
          globalUsageLimit: String(data.globalUsageLimit ?? ""),
          isActive: Boolean(data.isActive),
        });
      } catch (error) {
        console.error("Failed to fetch coupon", error);
        toast.error("Failed to load coupon");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const updateField = <K extends keyof CouponForm>(
    field: K,
    value: CouponForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    const couponId = Number(id);

    if (!id || !Number.isSafeInteger(couponId) || couponId <= 0) {
      toast.error("Invalid coupon ID");
      return;
    }

    if (
      !form.couponCode.trim() ||
      !form.description.trim() ||
      !form.validFrom ||
      !form.expiryAt
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const minOrder = Number(form.minOrderAmount);
    const discount = Number(form.discountAmount);
    const maxDiscount = Number(form.maximumDiscountAmount);
    const perUser = Number(form.perUserLimit);
    const globalLimit = Number(form.globalUsageLimit);

    if (
      !form.minOrderAmount ||
      !form.discountAmount ||
      !form.maximumDiscountAmount ||
      minOrder <= 0 ||
      discount <= 0 ||
      maxDiscount <= 0
    ) {
      toast.error("Amounts must be greater than zero");
      return;
    }

    if (
      !form.perUserLimit ||
      !form.globalUsageLimit ||
      !Number.isInteger(perUser) ||
      !Number.isInteger(globalLimit) ||
      perUser < 1 ||
      globalLimit < 1
    ) {
      toast.error("Usage limits must be positive integers");
      return;
    }

    if (form.couponType === "PERCENTAGE" && discount > 100) {
      toast.error("Percentage cannot exceed 100");
      return;
    }

    if (form.couponType === "FLAT" && discount !== maxDiscount) {
      toast.error(
        "FLAT coupon discount and maximum discount must match"
      );
      return;
    }

    if (
      new Date(form.expiryAt).getTime() <=
      new Date(form.validFrom).getTime()
    ) {
      toast.error("Expiry must be after Valid From");
      return;
    }

    setSaving(true);

    try {
      await couponAPI.update(couponId, {
        couponCode: form.couponCode.trim().toUpperCase(),
        couponType: form.couponType,
        description: form.description.trim(),
        minOrderAmount: minOrder,
        discountAmount: discount,
        maximumDiscountAmount: maxDiscount,
        validFrom: form.validFrom,
        expiryAt: form.expiryAt,
        perUserLimit: perUser,
        globalUsageLimit: globalLimit,
        isActive: form.isActive,
      });

      toast.success("Coupon updated successfully");
      navigate("/admin/coupons");
    } catch (error: any) {
      console.error("Update failed", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update coupon"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 text-center">
        Loading coupon...
      </div>
    );
  }

  const inputClass = "input w-full";

  return (
    <div className="flex justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-3xl card p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Edit Coupon
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Coupon Code</label>
            <input
              className={inputClass}
              value={form.couponCode}
              onChange={(e) =>
                updateField("couponCode", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Coupon Type</label>
            <select
              className={inputClass}
              value={form.couponType}
              onChange={(e) =>
                updateField(
                  "couponType",
                  e.target.value as CouponType
                )
              }
            >
              <option value="FLAT">FLAT</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Description</label>
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Minimum Order Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className={inputClass}
              value={form.minOrderAmount}
              onChange={(e) =>
                updateField("minOrderAmount", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Discount Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className={inputClass}
              value={form.discountAmount}
              onChange={(e) =>
                updateField("discountAmount", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">
              Maximum Discount Amount
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className={inputClass}
              value={form.maximumDiscountAmount}
              onChange={(e) =>
                updateField(
                  "maximumDiscountAmount",
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label className="text-sm">Valid From</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.validFrom}
              onChange={(e) =>
                updateField("validFrom", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Expiry At</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.expiryAt}
              onChange={(e) =>
                updateField("expiryAt", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Per User Limit</label>
            <input
              type="number"
              min="1"
              step="1"
              className={inputClass}
              value={form.perUserLimit}
              onChange={(e) =>
                updateField("perUserLimit", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Global Usage Limit</label>
            <input
              type="number"
              min="1"
              step="1"
              className={inputClass}
              value={form.globalUsageLimit}
              onChange={(e) =>
                updateField("globalUsageLimit", e.target.value)
              }
            />
          </div>

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                updateField("isActive", e.target.checked)
              }
            />
            Active Coupon
          </label>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="btn btn-outline flex-1"
            onClick={() => navigate("/admin/coupons")}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary flex-1"
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCouponPage;
