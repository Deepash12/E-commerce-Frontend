
import React, { useCallback, useEffect, useState } from "react";
import { couponAPI } from "@/api/service";
import toast from "react-hot-toast";

type CouponType = "FLAT" | "PERCENTAGE";

type CouponStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "NOT_YET_STARTED"
  | "EXPIRED"
  | "USAGE_LIMIT_REACHED";

interface Coupon {
  id: number;
  couponCode: string;
  couponType: CouponType;
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
  calculatedStatus: CouponStatus;
}

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

const emptyForm: CouponForm = {
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
};

const getErrorMessage = (error: any): string => {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;

  return "Something went wrong";
};

const statusLabel = (status: CouponStatus): string => {
  return status === "NOT_YET_STARTED"
    ? "SCHEDULED"
    : status;
};

const statusColor = (status: CouponStatus): string => {
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

const AddCouponPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CouponForm>(emptyForm);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);

    try {
      const response = await couponAPI.getAll({
        pageNumber: page,
        pageSize: 12,
      });

      setCoupons(response.data.content ?? []);
      setTotalPages(response.data.totalPages ?? 1);
    } catch (error) {
      console.error("Failed to load coupons", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const setField = <K extends keyof CouponForm>(
    key: K,
    value: CouponForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !form.couponCode.trim() ||
      !form.description.trim() ||
      !form.validFrom ||
      !form.expiryAt
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    const minOrder = Number(form.minOrderAmount);
    const discount = Number(form.discountAmount);
    const maxDiscount = Number(form.maximumDiscountAmount);
    const perUser = Number(form.perUserLimit);
    const globalLimit = Number(form.globalUsageLimit);

    if (
      !Number.isFinite(minOrder) ||
      !Number.isFinite(discount) ||
      !Number.isFinite(maxDiscount) ||
      minOrder <= 0 ||
      discount <= 0 ||
      maxDiscount <= 0
    ) {
      toast.error("Amounts must be greater than zero");
      return false;
    }

    if (
      !Number.isInteger(perUser) ||
      !Number.isInteger(globalLimit) ||
      perUser < 1 ||
      globalLimit < 1
    ) {
      toast.error("Usage limits must be positive integers");
      return false;
    }

    if (form.couponType === "PERCENTAGE" && discount > 100) {
      toast.error("Percentage discount cannot exceed 100");
      return false;
    }

    if (
      form.couponType === "FLAT" &&
      discount !== maxDiscount
    ) {
      toast.error(
        "For FLAT coupons, discount and maximum discount must match"
      );
      return false;
    }

    if (
      new Date(form.expiryAt).getTime() <=
      new Date(form.validFrom).getTime()
    ) {
      toast.error("Expiry must be after Valid From");
      return false;
    }

    if (
      new Date(form.expiryAt).getTime() <= Date.now()
    ) {
      toast.error("Expiry must be in the future");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (saving || !validateForm()) return;

    setSaving(true);

    try {
      const payload = {
        couponCode: form.couponCode.trim().toUpperCase(),
        couponType: form.couponType,
        description: form.description.trim(),
        minOrderAmount: Number(form.minOrderAmount),
        discountAmount: Number(form.discountAmount),
        maximumDiscountAmount: Number(
          form.maximumDiscountAmount
        ),
        validFrom: form.validFrom,
        expiryAt: form.expiryAt,
        perUserLimit: Number(form.perUserLimit),
        globalUsageLimit: Number(form.globalUsageLimit),
        isActive: form.isActive,
      };

      await couponAPI.create(payload);

      toast.success("Coupon created successfully");

      setForm(emptyForm);
      setShowForm(false);

      if (page !== 0) {
        setPage(0);
      } else {
        await fetchCoupons();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    if (updatingId !== null) return;

    const expired =
      new Date(coupon.expiryAt).getTime() <= Date.now();

    if (expired) {
      toast.error("Expired coupons cannot be reactivated");
      return;
    }

    setUpdatingId(coupon.id);

    try {
      const response = await couponAPI.toggle(coupon.id);

      toast.success(
        typeof response.data === "string"
          ? response.data
          : "Coupon status updated successfully"
      );

      await fetchCoupons();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.couponCode
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" ||
      coupon.calculatedStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const inputClass = "input w-full";

  return (
    <div className="container-wide py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">Manage Coupons</h1>
          <p className="text-obsidian-500 mt-2">
            Create and manage discount coupons
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Create Coupon"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            Create New Coupon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Coupon Code</label>
              <input
                className={inputClass}
                value={form.couponCode}
                onChange={(e) =>
                  setField("couponCode", e.target.value.toUpperCase())
                }
                placeholder="WELCOME50"
              />
            </div>

            <div>
              <label className="text-sm">Coupon Type</label>
              <select
                className={inputClass}
                value={form.couponType}
                onChange={(e) =>
                  setField(
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
                  setField("description", e.target.value)
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
                  setField("minOrderAmount", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm">
                Discount Amount
                {form.couponType === "PERCENTAGE"
                  ? " (%)"
                  : " (₹)"}
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={inputClass}
                value={form.discountAmount}
                onChange={(e) =>
                  setField("discountAmount", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm">
                Maximum Discount Amount (₹)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={inputClass}
                value={form.maximumDiscountAmount}
                onChange={(e) =>
                  setField(
                    "maximumDiscountAmount",
                    e.target.value
                  )
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
                  setField("perUserLimit", e.target.value)
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
                  setField("globalUsageLimit", e.target.value)
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
                  setField("validFrom", e.target.value)
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
                  setField("expiryAt", e.target.value)
                }
              />
            </div>

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setField("isActive", e.target.checked)
                }
              />
              Enable Coupon
            </label>
          </div>

          <button
            className="btn btn-primary w-full mt-6"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          className="input flex-1"
          placeholder="Search coupon code on current page"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="NOT_YET_STARTED">Scheduled</option>
          <option value="EXPIRED">Expired</option>
          <option value="USAGE_LIMIT_REACHED">
            Usage Limit Reached
          </option>
        </select>
      </div>

      <div className="card p-6 overflow-x-auto">
        {loading ? (
          <p className="text-center py-8">Loading coupons...</p>
        ) : (
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min Order</th>
                <th className="px-4 py-3">Max Discount</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCoupons.map((coupon) => {
                const expired =
                  new Date(coupon.expiryAt).getTime() <=
                  Date.now();

                return (
                  <tr
                    key={coupon.id}
                    className="border-b border-gray-800"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={`/admin/coupons/view/${coupon.id}`}
                        className="text-yellow-400 hover:underline"
                      >
                        {coupon.couponCode}
                      </a>
                    </td>

                    <td className="px-4 py-4">
                      {coupon.couponType}
                    </td>

                    <td className="px-4 py-4">
                      {coupon.couponType === "PERCENTAGE"
                        ? `${coupon.discountAmount}%`
                        : `₹${coupon.discountAmount}`}
                    </td>

                    <td className="px-4 py-4">
                      ₹{coupon.minOrderAmount}
                    </td>

                    <td className="px-4 py-4">
                      ₹{coupon.maximumDiscountAmount}
                    </td>

                    <td className="px-4 py-4">
                      {new Date(
                        coupon.expiryAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`font-semibold ${statusColor(
                          coupon.calculatedStatus
                        )}`}
                      >
                        {statusLabel(coupon.calculatedStatus)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {!expired ? (
                          <>
                            <button
                              className="btn btn-outline"
                              disabled={updatingId !== null}
                              onClick={() => handleToggle(coupon)}
                            >
                              {updatingId === coupon.id
                                ? "Updating..."
                                : coupon.isActive
                                ? "Disable"
                                : "Enable"}
                            </button>

                            <a
                              href={`/admin/coupons/edit/${coupon.id}`}
                              className="btn btn-primary"
                            >
                              Edit
                            </a>
                          </>
                        ) : (
                          <span className="text-gray-500">
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCoupons.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-400"
                  >
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className="btn btn-outline"
          disabled={page === 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>

        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddCouponPage;
