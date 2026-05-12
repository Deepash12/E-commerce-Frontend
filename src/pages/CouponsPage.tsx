import React, { useState, useEffect } from "react";
import { Tag, Copy, Check, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { couponAPI } from "@/api/service";

import{ EmptyState, LoadingPage } from "@/components/ui";


import { formatDate } from "../utils";
import type { Coupon } from "../types";
import toast from "react-hot-toast";

const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ Load all active coupons
  useEffect(() => {
    couponAPI
      .getAllActiveCoupons()
      .then((res: any) => {
        const data = res.data as { content?: Coupon[] };
        setCoupons(data.content ?? res.data ?? []);
      })
      .catch(() => toast.error("Failed to load coupons"))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(code);
    toast.success("Copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div className="container-wide max-w-2xl py-5">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="page-title">Coupons</h1>
          <p className="text-obsidian-500 mt-3">
            Available coupons from admin
          </p>
        </div>

        {coupons.length === 0 ? (
          <EmptyState
            icon={<Tag size={48} />}
            title="No active coupons"
            description="Check back later for exclusive offers"
          />
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => {
              const code = c.couponCode ?? c.code ?? "";

              return (

                <div
                  key={c.id}
                  onClick={() => navigate(`/profile/coupons/${c.id}`)}
                  className="group relative cursor-pointer rounded-lg border border-obsidian-800 bg-obsidian-900 hover:border-gold-400/40 transition overflow-hidden"
                >

                  {/* Gold side strip */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gold-400" />

                  <div className="p-5 flex items-center gap-5">

                    {/* Discount Icon */}
                    <div className="w-14 h-14 bg-gold-400/10 border border-gold-400/20 rounded-md flex items-center justify-center flex-shrink-0">
                      <Tag size={24} className="text-gold-400" />
                    </div>

                    {/* Coupon Info */}
                    <div className="flex-1 min-w-0">

                      {/* Code */}
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xl font-semibold text-white tracking-wide">
                          {code}
                        </span>

                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          {c.calculatedStatus}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-obsidian-400 text-sm mb-2">
                        {c.description}
                      </p>

                      {/* Min order */}
                      <div className="flex items-center gap-2 text-sm text-obsidian-400">
                        <ShoppingBag size={14} />
                        Minimum order ₹{c.minOrderAmount}
                      </div>

                      {/* Expiry */}
                      {c.expiryAt && (
                        <p className="text-xs text-obsidian-500 mt-1">
                          Expires {formatDate(c.expiryAt)}
                        </p>
                      )}

                      {c.alreadyUsed && (
                        <p className="text-red-500 text-xs mt-1">
                          Already Used
                        </p>
                      )}

                    </div>

                    {/* Copy Button */}
                    <button
                      className="flex items-center gap-2 border border-obsidian-700 px-3 py-1.5 rounded-md text-sm hover:bg-gold-400 hover:text-black transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(code);
                      }}
                    >
                      {copied === code ? (
                        <>
                          <Check size={14} className="text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>

                  </div>

                </div>

              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;