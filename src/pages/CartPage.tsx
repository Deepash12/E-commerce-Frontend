import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LoadingPage, EmptyState } from '../components/ui';
import { formatPrice } from '../utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const CartPage: React.FC = () => {

  // ✅ added fetchCart
  const { cart, cartLoading, updateQuantity, removeItem, fetchCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items ?? [];

  // 🔥 FIX 1: Always sync cart when page opens
  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 FIX 2: Safety check (optional but strong)
  useEffect(() => {
    if (!cartLoading && items.length > 0) {
      // revalidate once (helps avoid stale UI after checkout redirect)
      fetchCart();
    }
  }, []);

  if (cartLoading) return <LoadingPage />;

  return (
    <div>
      <div className="container-wide py-2">

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={56} />}
            title="Your cart is empty"
            description="Add items from our collection to get started"
            action={
              <Link to="/products" className="btn btn-primary">
                Browse Collection
              </Link>
            }
          />
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="page-title">Shopping Cart</h1>
              <p className="text-obsidian-500 mt-2">
                {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

              {/* CART ITEMS */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="card border-obsidian-800 p-5 flex gap-5 items-start hover:border-obsidian-700"
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="w-20 h-20 rounded-sm overflow-hidden bg-obsidian-800">
                      <img
                        src={`${BASE_URL}${item.productImageUrl}`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.productName}</h3>
                      <p className="text-gold-400">
                        {formatPrice(item.finalPrice)} each
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-lg font-medium">
                        {formatPrice(item.finalPrice * item.quantity)}
                      </span>

                      {/* QUANTITY */}
                      <div className="flex items-center border border-obsidian-700 rounded-sm">
                        <button
                          onClick={() => {
                            const newQty = item.quantity - 1;

                            if (newQty <= 0) {
                              removeItem(item.productId); // 🔥 fix edge case
                            } else {
                              updateQuantity(item.productId, newQty);
                            }
                          }}
                          className="px-2 py-1 text-obsidian-500 hover:text-white"
                        >
                          <Minus size={12} />
                        </button>

                        <span className="px-3 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2 py-1 text-obsidian-500 hover:text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-obsidian-600 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ORDER SUMMARY */}
              <div className="card border-obsidian-700 p-6 sticky top-24">
                <h3 className="mb-5 text-lg font-medium">Order Summary</h3>

                <div className="space-y-2 mb-5">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-obsidian-500 truncate">
                        {item.productName} x {item.quantity}
                      </span>
                      <span>
                        {formatPrice(item.finalPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-obsidian-800 my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl text-gold-400">
                    {formatPrice(cart.grandTotal)}
                  </span>
                </div>

                <button
                  className="btn btn-primary w-full flex justify-center gap-2"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </button>

                <Link
                  to="/products"
                  className="btn btn-ghost w-full mt-2 text-center text-obsidian-400"
                >
                  Continue Shopping
                </Link>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;




