import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Flower, Mail } from "lucide-react";
import type { Drop } from "@/types/community";
import ReplyComposer from "./ReplyComposer";
import ownerBadge from "@assets/generated_images/Pink_droplet_owner_badge_2824ccfc.png";

interface DropCardProps {
  drop: Drop;
  currentVibeId: string;
  onReply: (parentId: string, text: string) => void;
  onReaction: (dropId: string) => void;
  isNested?: boolean;
}

const OWNER_VIBE_ID = "Charae 💧";

export default function DropCard({
  drop,
  currentVibeId,
  onReply,
  onReaction,
  isNested = false,
}: DropCardProps) {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const timeAgo = formatDistanceToNow(drop.createdAt, { addSuffix: true });
  const isOwner = drop.vibeId === OWNER_VIBE_ID;
  const replyCount = drop.replies?.length ?? 0;

  return (
    <div
      className={`rounded-2xl border border-warm-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow ${isNested ? "ml-8" : ""}`}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {drop.mood && (
            <span className="text-2xl" aria-label="mood">
              {drop.mood}
            </span>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p
                className="font-medium text-warm-gray-800"
                data-testid={`drop-name-${drop.id}`}
              >
                {drop.vibeId}
              </p>
              {isOwner && (
                <img
                  src={ownerBadge}
                  alt="Owner"
                  className="w-4 h-4 opacity-90 hover:opacity-100 transition-opacity"
                  data-testid="owner-badge"
                />
              )}
            </div>
            <p
              className="text-xs text-warm-gray-500"
              data-testid={`drop-time-${drop.id}`}
            >
              {timeAgo}
            </p>
          </div>
        </div>

        {/* Message */}
        <p
          className="text-warm-gray-800 leading-relaxed mb-4"
          data-testid={`drop-text-${drop.id}`}
        >
          {drop.text}
        </p>

        {/* Dual-Action Buttons */}
        {!isNested && (
          <div className="flex items-center gap-3 flex-wrap">
            {false && (
              <>
                <span>I feel this (v2)</span>
                <button
                  onClick={() => onReaction(drop.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 text-warm-gray-700 text-sm transition-colors border border-warm-gray-200"
                  data-testid={`button-feel-this-${drop.id}`}
                >
                  <Flower className="w-4 h-4 text-pink-400" />
                  <span>I feel this</span>
                  <span className="ml-1 text-xs font-medium text-pink-600">
                    {drop.reactions}
                  </span>
                </button>
              </>
            )}

            {/* Drop a Note button */}
            <button
              onClick={() => setShowReplyComposer(!showReplyComposer)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 text-warm-gray-700 text-sm transition-colors border border-warm-gray-200"
              data-testid={`button-drop-note-${drop.id}`}
            >
              <Mail className="w-4 h-4 text-warm-gray-600" />
              <span>Drop a Note</span>
            </button>

            {/* Reply count */}
            {replyCount > 0 && (
              <span className="text-xs text-warm-gray-600">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>
        )}

        {/* Reply Composer */}
        {showReplyComposer && (
          <ReplyComposer
            parentId={drop.id}
            vibeId={currentVibeId}
            onReply={(parentId, text) => {
              onReply(parentId, text);
              setShowReplyComposer(false);
            }}
            onCancel={() => setShowReplyComposer(false)}
          />
        )}
      </div>

      {/* Nested Replies */}
      {!isNested && drop.replies && drop.replies.length > 0 && (
        <div className="border-t border-warm-gray-100 bg-cream-50/30 p-4 space-y-3">
          <p className="text-xs font-medium text-warm-gray-600 uppercase tracking-wide mb-2">
            Reply Vibes
          </p>
          {drop.replies.map((reply) => (
            <DropCard
              key={reply.id}
              drop={reply}
              currentVibeId={currentVibeId}
              onReply={onReply}
              onReaction={onReaction}
              isNested={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
