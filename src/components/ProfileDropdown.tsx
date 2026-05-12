import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, Settings, Link } from "lucide-react";

type Props = {
  username: string;
  onLogout: () => void;
  isAdmin?: boolean;
};

export default function ProfileDropdown({ username, onLogout, isAdmin }: Props) {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost px-3 py-2.5 gap-1.5 flex items-center"
      >
        <User size={16} />
        <span className="hidden sm:block text-xs">{username}</span>
        <ChevronDown size={12} />
      </button>

      {open && (

        <div className="absolute right-0 mt-2 w-56 bg-obsidian-900 border border-obsidian-700 rounded-md shadow-xl z-[999]">

          {isAdmin ? (

            <>
              {/* ADMIN MENU */}
              <button
                onClick={() => navigate("/admin/products")}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                <Settings size={14} />
                Admin Portal
              </button>

              <div className="border-t border-obsidian-700"></div>

              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20"
              >
                Logout
              </button>
            </>

          ) : (

            <>
              {/* USER MENU */}
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                Profile Information
              </button>

              <button
                onClick={() => navigate("/profile/orders")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                My Orders
              </button>

              <button
                onClick={() => navigate("/profile/addresses")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                My Addresses
              </button>

              {/* <button
                onClick={() => navigate("/profile/payment-methods")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                Payment Methods
              </button> */}

              <button
                onClick={() => navigate("/profile/reviews")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                My Reviews
              </button>

              <button
                onClick={() => navigate("/profile/coupons")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                My Coupons
              </button>

              <button
                onClick={() => navigate("/profile/wishlist")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                Wishlist
              </button>

              <button
                onClick={() => navigate("/profile/change-password")}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-obsidian-800"
              >
                Change Password
              </button>

              <div className="border-t border-obsidian-700"></div>

              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20"
              >
                Logout
              </button>
            </>

          )}

        </div>

      )}
    </div>
  );
}