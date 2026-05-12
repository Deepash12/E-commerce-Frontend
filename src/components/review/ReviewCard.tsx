import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, ShieldCheck, Pencil, Trash2 } from "lucide-react";
import type { Review } from "../../types";

interface Props {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (id: number) => void;
}

// ── helpers ──────────────────────────────────────────────────

const avatarColor = (name: string) => {
  const palette = [
    "bg-amber-700", "bg-emerald-700", "bg-sky-700",
    "bg-rose-700",  "bg-violet-700",  "bg-teal-700", "bg-orange-700",
  ];
  if (!name) return palette[0];
  return palette[name.charCodeAt(0) % palette.length];
};

const getInitials = (name: string) =>
  (name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ── component ────────────────────────────────────────────────

const ReviewCard: React.FC<Props> = ({ review, onEdit, onDelete }) => {
  const [liked,    setLiked]    = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes,    setLikes]    = useState<number>(review.likes    ?? 0);
  const [dislikes, setDislikes] = useState<number>(review.dislikes ?? 0);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLikes((c) => c + 1);
    if (disliked) { setDisliked(false); setDislikes((c) => Math.max(0, c - 1)); }
  };

  const handleDislike = () => {
    if (disliked) return;
    setDisliked(true);
    setDislikes((c) => c + 1);
    if (liked) { setLiked(false); setLikes((c) => Math.max(0, c - 1)); }
  };

  // FIX: backend sends flat `userName` string — NOT a nested `user` object
  // OLD (crashes): review.user.username
  // NEW (correct):  review.userName
  const displayName = review.userName ?? "Anonymous";

  return (
    <div className="flex gap-4 border-b border-obsidian-800 py-5 last:border-0 group">

      {/* PRODUCT IMAGE */}
      {review.productImage && (
        <div className="w-16 h-20 rounded-lg overflow-hidden bg-obsidian-900 shrink-0">
          <img
            src={review.productImage}
            alt={review.productName ?? "Product"}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 space-y-2">

        {/* Product name */}
        {review.productName && (
          <p className="text-xs text-obsidian-500 truncate">
            {review.productName}
          </p>
        )}

        {/* Rating + title */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${
              review.rating >= 4
                ? "bg-green-500/15 text-green-400"
                : review.rating === 3
                ? "bg-yellow-500/15 text-yellow-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            <Star size={10} className="fill-current" />
            {review.rating}
          </span>
          {review.title && (
            <span className="font-semibold text-sm text-white truncate">
              {review.title}
            </span>
          )}
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-obsidian-300 leading-relaxed">
            {review.comment}
          </p>
        )}

        {/* User info row */}
        {/* FIX: use review.userName directly, not review.user.username */}
        <div className="flex items-center gap-2 text-xs text-obsidian-500">
          <div
            className={`w-5 h-5 rounded-full ${avatarColor(displayName)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
          >
            {getInitials(displayName)}
          </div>

          <span className="font-medium text-obsidian-400">{displayName}</span>

          {review.verified && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-green-400 font-medium">
                <ShieldCheck size={11} />
                Certified Buyer
              </span>
            </>
          )}

          {review.createdAt && (
            <>
              <span>•</span>
              {/* FIX: only createdAt goes to formatDate, never userName */}
              <span>{formatDate(review.createdAt)}</span>
            </>
          )}
        </div>

        {/* Edit / Delete actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-3 pt-1">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="flex items-center gap-1 text-xs text-obsidian-500 hover:text-gold-400 transition-colors"
              >
                <Pencil size={11} />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                className="flex items-center gap-1 text-xs text-obsidian-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={11} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* LIKE / DISLIKE */}
      <div className="flex flex-col items-center justify-start gap-2 pt-1 shrink-0">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${
            liked
              ? "border-green-500/50 bg-green-500/10 text-green-400"
              : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500 hover:text-obsidian-300"
          }`}
        >
          <ThumbsUp size={13} />
          <span>{likes}</span>
        </button>

        <button
          onClick={handleDislike}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${
            disliked
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-obsidian-700 text-obsidian-500 hover:border-obsidian-500 hover:text-obsidian-300"
          }`}
        >
          <ThumbsDown size={13} />
          <span>{dislikes}</span>
        </button>
      </div>

    </div>
  );
};

export default ReviewCard;