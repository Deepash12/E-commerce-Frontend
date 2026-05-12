import React, { useEffect, useState } from "react";
import { Review } from "@/types";
import ReviewCard from "@/components/review/ReviewCard";
import { reviewAPI } from "@/api/services";

const BASE_URL = "http://localhost:8080"; // 🔥 IMPORTANT FIX

const MyReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await reviewAPI.getMyReviews(page - 1, 5);
      const apiData = res?.data?.data;

      const formattedReviews = (apiData?.content || []).map((item: any) => ({
        id: item.id,

        // 🔥 FIXED IMAGE PATH
        productImage: item.product?.productImageUrl
          ? `http://localhost:8080${item.product.productImageUrl}`
          : "/placeholder.png",

        productName: item.product?.description || "Product Name",

        // 🔥 NEW FIELDS FOR UI
        price: item.product?.price,
        discountPrice: item.product?.discountPrice,

        rating: item.rating,
        title: item.title,
        reviewText: item.comment || "No review provided",
        userName: item.user?.username,
        verified: item.verified,
        date: item.createdAt,
      }));

      setReviews(formattedReviews);
      setTotalPages(apiData?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading reviews...
      </div>
    );
  }

  // 🔥 EMPTY STATE UI
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No reviews yet 😔
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 text-white">
        My Reviews ({reviews.length})
      </h2>

      {/* Review List */}
      <div className="space-y-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-1.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-4 py-1.5 text-gray-400">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-1.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyReviews;