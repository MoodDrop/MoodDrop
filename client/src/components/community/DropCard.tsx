// client/src/components/community/DropCard.tsx

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Drop } from "@/types/community";
import { supabase } from "@/lib/supabaseClient";
import { canManageDrop } from "@/lib/ownership";
// your MoodDrop PNG droplet
import ownerDroplet from "../../assets/droplet.png";

type Props = {
  drop: Drop;
  currentVibeId: string;
  onReply: (id: string, text: string) => void;
  onReaction: (id: string) => void;
  onUpdated?: (updated: Drop) => void;
  onDeleted?: (deletedId: string) => void;
};

export default function DropCard({
  drop,
  currentVibeId,
  onReply,
  onReaction,
  onUpdated,
  onDeleted,
}: Props) {
  // Can this user edit/delete? (author OR owner mode)
  const manageable = canManageDrop({
    currentVibeId,
    dropVibeId: drop.vibeId,
  });

  const isOwnerDrop = drop.vibeId === "Charae 💧";

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(drop.text);
  const [isBusy, setIsBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Reply composer state
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // ---- Edit handlers ----
  async function handleSaveEdit() {
    const newText = editText.trim();
    if (!newText) return;
    setIsBusy(true);
    try {
      const { data, error } = await supabase
        .from("drops")
        .update({ text: newText })
        .eq("id", drop.id)
        .select()
        .single();
      if (error) throw error;

      // let parent update the list
      onUpdated?.({
        ...drop,
        text: data.text,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Could not save your change. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }

  // ---- Delete handler (soft delete: visible=false) ----
  async function handleDelete() {
    setIsBusy(true);
    try {
      const { error } = await supabase
        .from("drops")
        .update({ visible: false })
        .eq("id", drop.id);
      if (error) throw error;

      onDeleted?.(drop.id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete this drop. Please try again.");
    } finally {
      setIsBusy(false);
      setConfirmingDelete(false);
    }
  }

  // ---- Reply handler ----
  function handleSendReply() {
    const text = replyText.trim();
    if (!text) return;
    onReply(drop.id, text);
    setReplyText("");
    setReplyOpen(false);
  }

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{
        background: "#fff7f8",
        border: "1px solid #f6e8ea",
        boxShadow: "0 2px 10px rgba(246, 232, 234, 0.6)",
      }}
    >
      {/* Vibe ID row */}
      <div className="mb-1 text-sm text-[#4a3f41] font-semibold flex items-center gap-2">
        {isOwnerDrop && (
          <img
            src={ownerDroplet}
            alt=""
            className="w-4 h-4 rounded-full object-contain"
          />
        )}
        <span>{drop.vibeId}</span>
      </div>

      {/* Main body */}
      <div className="flex flex-col gap-2">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full rounded-xl p-3 outline-none border"
              style={{ borderColor: "#f2d9de", background: "#fff" }}
              rows={3}
              maxLength={1000}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              disabled={isBusy}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={isBusy}
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: "#f4cbd2",
                  color: "#4a3f41",
                  opacity: isBusy ? 0.6 : 1,
                  boxShadow: "0 2px 6px rgba(246, 232, 234, 0.6)",
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(drop.text);
                }}
                disabled={isBusy}
                className="px-3 py-1.5 rounded-full"
                style={{ background: "#f8eef0", color: "#6d5e61" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="leading-relaxed text-[15px] text-[#4a3f41]">
            {drop.text}
          </p>
        )}

        {/* Time + actions row */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm select-none">
          <span className="text-[#8b7b7e]">
            {formatDistanceToNow(new Date(drop.createdAt), { addSuffix: true })}
          </span>

          {/* Drop a Note = open reply composer */}
          <button
            type="button"
            onClick={() => setReplyOpen((v) => !v)}
            className="rounded-full px-4 py-1.5"
            style={{
              background: "#ffffff",
              border: "1px solid #f2d9de",
              boxShadow: "0 2px 6px rgba(246, 232, 234, 0.6)",
              color: "#4a3f41",
            }}
          >
            Drop a Note
          </button>

          {/* Feels with bigger droplet */}
          <button
            type="button"
            onClick={() => onReaction(drop.id)}
            className="rounded-full px-4 py-1.5 flex items-center gap-1"
            style={{
              background: "#ffffff",
              border: "1px solid #f2d9de",
              boxShadow: "0 2px 6px rgba(246, 232, 234, 0.6)",
              color: "#4a3f41",
            }}
            title="I feel this"
          >
            <span className="text-lg">💧</span>
            <span>Feels {drop.reactions ?? 0}</span>
          </button>

          {/* Edit/Delete only for author or owner */}
          {manageable && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 rounded-full"
                style={{
                  background: "#fde7eb",
                  color: "#4a3f41",
                  boxShadow: "0 2px 6px rgba(246, 232, 234, 0.6)",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmingDelete(true)}
                className="px-4 py-1.5 rounded-full"
                style={{
                  background: "#f9d2d9",
                  color: "#4a3f41",
                  boxShadow: "0 2px 6px rgba(246, 232, 234, 0.6)",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* Inline reply composer */}
        {replyOpen && (
          <div
            className="mt-3 p-3 rounded-xl"
            style={{ background: "#fff", border: "1px solid #f2d9de" }}
          >
            <textarea
              className="w-full rounded-xl p-3 outline-none border"
              style={{ borderColor: "#f2d9de", background: "#fff" }}
              rows={3}
              placeholder="Drop a note back…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={1000}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setReplyOpen(false);
                  setReplyText("");
                }}
                className="px-3 py-1.5 rounded-full"
                style={{ background: "#f8eef0", color: "#6d5e61" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: "#f4cbd2",
                  color: "#4a3f41",
                  boxShadow: "0 2px 6px rgba(246, 232, 234, 0.6)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Existing replies: Reply Vibes */}
        {drop.replies && drop.replies.length > 0 && (
          <div
            className="mt-4 pt-3 border-t"
            style={{ borderColor: "#f6e8ea" }}
          >
            <div className="text-xs font-semibold text-[#8b7b7e] mb-2">
              Reply Vibes
            </div>

            <div className="space-y-2">
              {drop.replies.map((reply) => {
                const isOwnerReply = reply.vibeId === "Charae 💧";
                return (
                  <div
                    key={reply.id}
                    className="rounded-2xl px-3 py-2"
                    style={{ background: "#fff" }}
                  >
                    <div className="text-xs font-semibold text-[#4a3f41] mb-0.5 flex items-center gap-1">
                      {isOwnerReply && (
                        <img
                          src={ownerDroplet}
                          alt=""
                          className="w-3.5 h-3.5 rounded-full object-contain"
                        />
                      )}
                      <span>{reply.vibeId}</span>
                    </div>
                    <div className="text-[13px] text-[#4a3f41] leading-relaxed">
                      {reply.text}
                    </div>
                    <div className="text-[11px] text-[#8b7b7e] mt-0.5">
                      {formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Delete confirmation bar */}
        {confirmingDelete && (
          <div
            className="mt-3 p-3 rounded-xl flex items-center justify-between"
            style={{ background: "#fff", border: "1px solid #f2d9de" }}
          >
            <span className="text-sm text-[#4a3f41]">
              Delete this drop? This can’t be undone.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="px-3 py-1.5 rounded-full"
                style={{ background: "#f8eef0", color: "#6d5e61" }}
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: "#f1aeb8",
                  color: "#432f34",
                  opacity: isBusy ? 0.6 : 1,
                }}
                disabled={isBusy}
              >
                Yes, delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
