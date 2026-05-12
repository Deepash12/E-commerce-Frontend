import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { reviewAPI } from "@/api/service";
import type { Review, RatingSummary } from "@/types";
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

type FilterType = "MOST_HELPFUL" | "LATEST" | "POSITIVE" | "NEGATIVE";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const avatarColor = (name: string) => {
  const colors = [
    "bg-amber-600","bg-emerald-700","bg-sky-700",
    "bg-rose-700","bg-violet-700","bg-teal-700","bg-orange-700",
  ];
  if (!name) return colors[0];
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitials = (name: string) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// ─────────────────────────────────────────────────────────────
// STAR DISPLAY
// ─────────────────────────────────────────────────────────────

const StarDisplay = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= rating ? "text-gold-400 fill-gold-400" : "text-obsidian-700"}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// RATING BAR
// ─────────────────────────────────────────────────────────────

const RatingBar = ({ star, count, total }: { star: number; count: number; total: number }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 cursor-default">
      <div className="flex items-center gap-1 w-6 shrink-0">
        <span className="text-xs text-obsidian-400">{star}</span>
        <Star size={10} className="text-gold-400 fill-gold-400" />
      </div>
      <div className="flex-1 h-[6px] bg-obsidian-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            star >= 4 ? "bg-green-500" : star === 3 ? "bg-yellow-400" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-obsidian-500 w-4 text-right shrink-0">{count}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// REVIEW CARD
// ─────────────────────────────────────────────────────────────

const ReviewCard = ({ review }: { review: Review }) => {
  const r = review as any;

  const resolvedId: number | undefined = r.reviewId ?? r.id ?? r.review_id;

  // ✅ Initialize from backend's userAction field (persists across refresh)
  // userAction = "LIKE" | "DISLIKE" | null
  const [liked,    setLiked]    = useState<boolean>(r.userAction === "LIKE");
  const [disliked, setDisliked] = useState<boolean>(r.userAction === "DISLIKE");
  const [likeCount,    setLikeCount]    = useState<number>(r.likes    ?? r.like    ?? 0);
  const [dislikeCount, setDislikeCount] = useState<number>(r.dislikes ?? r.dislike ?? 0);
  const [loading, setLoading] = useState(false);

  const username = r.user?.username ?? r.userName ?? "Anonymous";

  const handleLike = async () => {
    if (loading || !resolvedId) return;
    setLoading(true);

    const wasLiked    = liked;
    const wasDisliked = disliked;

    try {
      await reviewAPI.updateLikes(resolvedId, "LIKE");

      if (wasLiked) {
        // Toggle OFF — undo like
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        // Like
        setLiked(true);
        setLikeCount((c) => c + 1);
        // If was disliked, remove dislike
        if (wasDisliked) {
          setDisliked(false);
          setDislikeCount((c) => Math.max(0, c - 1));
        }
      }
    } catch (err: any) {
      toast.error(
        err?.response?.status === 401
          ? "Please log in to vote."
          : "Failed to update. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (loading || !resolvedId) return;
    setLoading(true);

    const wasLiked    = liked;
    const wasDisliked = disliked;

    try {
      await reviewAPI.updateLikes(resolvedId, "DISLIKE");

      if (wasDisliked) {
        // Toggle OFF — undo dislike
        setDisliked(false);
        setDislikeCount((c) => Math.max(0, c - 1));
      } else {
        // Dislike
        setDisliked(true);
        setDislikeCount((c) => c + 1);
        // If was liked, remove like
        if (wasLiked) {
          setLiked(false);
          setLikeCount((c) => Math.max(0, c - 1));
        }
      }
    } catch (err: any) {
      toast.error(
        err?.response?.status === 401
          ? "Please log in to vote."
          : "Failed to update. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-obsidian-800 last:border-0 py-5 space-y-3 group">
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full ${avatarColor(username)} flex items-center justify-center text-white text-xs font-semibold shrink-0`}
          >
            {getInitials(username)}
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-tight">
              {username}
            </p>
            <p className="text-xs text-obsidian-500 mt-0.5">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarDisplay rating={review.rating} size={13} />
      </div>

      {/* COMMENT */}
      <p className="text-sm text-obsidian-300 leading-relaxed pl-12">
        {review.comment}
      </p>

      {/* HELPFUL ROW */}
      <div className="flex items-center gap-4 pl-12 pt-1">
        <span className="text-xs text-obsidian-600">Helpful?</span>

        {/* LIKE BUTTON */}
        <button
          onClick={handleLike}
          disabled={loading}
          title={liked ? "Click to undo like" : "Mark as helpful"}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            liked
              ? "border-green-500/60 bg-green-500/10 text-green-400"
              : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500 hover:text-obsidian-300"
          }`}
        >
          <ThumbsUp size={12} className={liked ? "fill-green-400" : ""} />
          <span>{likeCount}</span>
        </button>

        {/* DISLIKE BUTTON */}
        <button
          onClick={handleDislike}
          disabled={loading}
          title={disliked ? "Click to undo dislike" : "Mark as not helpful"}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            disliked
              ? "border-red-500/60 bg-red-500/10 text-red-400"
              : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500 hover:text-obsidian-300"
          }`}
        >
          <ThumbsDown size={12} className={disliked ? "fill-red-400" : ""} />
          <span>{dislikeCount}</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: "MOST_HELPFUL", label: "Most Helpful" },
  { key: "LATEST",       label: "Latest"       },
  { key: "POSITIVE",     label: "Positive"     },
  { key: "NEGATIVE",     label: "Negative"     },
];

const ProductReviewsPage = () => {
  const { id } = useParams();
  const [reviews, setReviews]           = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("LATEST");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewRes, ratingRes] = await Promise.all([
          reviewAPI.getProductReviews(+id!),
          reviewAPI.getRatingSummary(+id!),
        ]);
        setReviews(reviewRes.data.data.content ?? []);
        setRatingSummary(ratingRes.data.data);
      } catch (err) {
        console.error("fetchData error:", err);
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredReviews = useCallback(() => {
    const copy = [...reviews];
    switch (activeFilter) {
      case "MOST_HELPFUL":
        return copy.sort((a, b) => ((b as any).likes ?? 0) - ((a as any).likes ?? 0));
      case "LATEST":
        return copy.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "POSITIVE":
        return copy.filter((r) => r.rating >= 4).sort((a, b) => b.rating - a.rating);
      case "NEGATIVE":
        return copy.filter((r) => r.rating <= 2).sort((a, b) => a.rating - b.rating);
      default:
        return copy;
    }
  }, [reviews, activeFilter])();

  const avg   = ratingSummary?.averageRating ?? 0;
  const total = ratingSummary?.totalReviews  ?? 0;

  return (
    <div className="container-wide max-w-5xl py-10">
      <h1 className="page-title mb-8">Ratings &amp; Reviews</h1>

      <div className="grid md:grid-cols-3 gap-10">

        {/* LEFT PANEL */}
        <div className="md:col-span-1">
          <div className="card border border-obsidian-800 p-6 rounded-xl sticky top-6">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-5xl font-display text-gold-400 leading-none">
                {avg > 0 ? avg.toFixed(1) : "—"}
              </span>
              <div className="pb-1">
                <StarDisplay rating={Math.round(avg)} size={16} />
              </div>
            </div>
            <p className="text-sm text-obsidian-500 mb-6">
              {total} {total === 1 ? "review" : "reviews"}
            </p>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar
                  key={star}
                  star={star}
                  count={ratingSummary?.ratingBreakdown?.[star] ?? 0}
                  total={total}
                />
              ))}
            </div>
            {total > 0 && (
              <div className="mt-6 pt-5 border-t border-obsidian-800">
                <p className="text-xs text-obsidian-500 mb-2">Sentiment</p>
                <div className="flex gap-2 flex-wrap">
                  {avg >= 4 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                      Mostly Positive
                    </span>
                  )}
                  {avg >= 2 && avg < 4 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      Mixed
                    </span>
                  )}
                  {avg < 2 && avg > 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                      Mostly Negative
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-2">
          <div className="flex gap-2 mb-6 flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  activeFilter === f.key
                    ? "bg-gold-500 border-gold-500 text-black"
                    : "border-obsidian-700 text-obsidian-400 hover:border-obsidian-500 hover:text-obsidian-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-obsidian-800 pb-5 space-y-3 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-obsidian-800" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-28 bg-obsidian-800 rounded" />
                      <div className="h-2 w-20 bg-obsidian-800 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-full bg-obsidian-800 rounded ml-12" />
                  <div className="h-3 w-2/3 bg-obsidian-800 rounded ml-12" />
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare size={40} className="text-obsidian-700 mb-4" />
              <p className="text-obsidian-400 font-medium">No reviews here</p>
              <p className="text-obsidian-600 text-sm mt-1">
                {activeFilter === "POSITIVE"
                  ? "No positive reviews yet"
                  : activeFilter === "NEGATIVE"
                  ? "No negative reviews yet"
                  : "Be the first to review this product"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-obsidian-600 mb-4">
                {filteredReviews.length}{" "}
                {filteredReviews.length === 1 ? "review" : "reviews"}
              </p>
              {filteredReviews.map((r) => (
                <ReviewCard
                  key={(r as any).reviewId ?? (r as any).id}
                  review={r}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsPage;