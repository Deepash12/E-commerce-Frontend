import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { couponAPI } from "@/api/service";
// import { couponAPI } from "./../../../api/services";
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
}

const AdminCouponsPage: React.FC = () => {

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchCoupons = async () => {

    try {

      const res = await couponAPI.getAll({
        pageNumber: 0,
        pageSize: 5
      });

      setCoupons(res.data.content);

    } catch (err) {

      console.error("Failed to fetch coupons", err);

    }

  };

  const toggleCouponStatus = async (id: number, currentStatus: boolean) => {
    try {

      await apiClient.patch(`/coupon/toggle/${id}`, {
        isActive: !currentStatus
      }
      );

      fetchCoupons(); // reload list

    } catch (error) {
      console.error("Failed to update coupon status", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (

    <div className="flex justify-center pt-28 pb-16">

      <div className="w-full max-w-6xl">

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

        <div className="card p-6">

          {/* <table className="w-full text-left"> */}
          <table className="w-full table-fixed">

            {/* <thead>
              <tr className="border-b border-obsidian-700">
                <th className="py-3">Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Minimum Order</th>
                <th>Maximum Discount</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead> */}

            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Discount</th>
                <th className="px-6 py-3">Minimum Order</th>
                <th className="px-6 py-3">Maximum Discount</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 w-[150px]">Action</th>
              </tr>
            </thead>


            <tbody>

              {coupons.map((c) => (

                <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-900 transition">

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/admin/coupons/view/${c.id}`}
                      className="text-yellow-400 hover:underline"
                    >
                      {c.couponCode}
                    </Link>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.couponType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.discountAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.minOrderAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.maximumDiscountAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(c.expiryAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">

                    {c.calculatedStatus === "EXPIRED" ? (
                      <span className="text-yellow-400 font-semibold">EXPIRED</span>
                    ) : c.isActive ? (
                      <span className="text-green-400 font-semibold">ACTIVE</span>
                    ) : (
                      <span className="text-red-400 font-semibold">INACTIVE</span>
                    )}

                  </td>

                  <td className="px-6 py-4 flex items-center gap-4">

                    {/* Toggle only if NOT expired */}
                    {c.calculatedStatus !== "EXPIRED" && (

                      <label
                        className="relative inline-flex items-center cursor-pointer"
                        title={c.isActive ? "Enabled" : "Disabled"}
                      >
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

                    )}

                    {/* Edit button only if NOT expired */}
                    {c.calculatedStatus !== "EXPIRED" && (

                      <Link
                        to={`/admin/coupons/edit/${c.id}`}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </Link>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
};

export default AdminCouponsPage;