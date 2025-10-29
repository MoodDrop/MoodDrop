import * as React from "react";
import { Link } from "wouter";
import { ArrowLeft, Trash2, Undo2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Flower } from "@/components/Flower";

type Drop = {
  id: number;
  content: string;
  emotion: string;
  timestamp: string;
  color?: string;
};

const EMOTION_COLORS: Record<string, string> = {
  Grounded: "#86efac",
  Calm: "#93c5fd",
  Joyful: "#fde68a",
  Reflective: "#fca5a5",
  Anxious: "#c7d2fe",
  Tender: "#F6C1B4",
  Overwhelmed: "#C9C7D2",
  Frustrated: "#E98A7A",
};

const getColor = (emotion?: string, saved?: string) =>
  saved ?? (emotion ? EMOTION_COLORS[emotion] : undefined) ?? "#94a3b8";

function loadDrops(): Drop[] {
  const a = JSON.parse(localStorage.getItem("moodDrops") || "[]");
  const b = JSON.parse(localStorage.getItem("mooddrop_messages") || "[]");

  const coerce = (x: any): Drop => ({
    id: Number(x.id ?? Date.now()),
    content: String(x.content ?? x.text ?? ""),
    emotion: String(x.emotion ?? x.mood?.label ?? x.mood ?? "Unknown"),
    timestamp: String(x.timestamp ?? x.date ?? new Date().toISOString()),
    color: getColor(x.emotion ?? x.mood?.label ?? x.mood, x.color ?? x.mood?.color),
  });

  const merged = [...a.map(coerce), ...b.map(coerce)];
  merged.sort((p, q) => new Date(q.timestamp).getTime() - new Date(p.timestamp).getTime());
  return merged;
}

// Generate stable random position for each flower based on its ID
function getFlowerPosition(id: number, index: number, total: number) {
  const seed = id * 9301 + 49297;
  const rng = () => ((seed * 9301 + 49297) % 233280) / 233280;
  
  return {
    left: `${10 + (rng() * 80)}%`,
    top: `${10 + (rng() * 80)}%`,
    size: 0.8 + rng() * 0.4,
    rotation: -15 + rng() * 30,
    delay: index * 0.1,
  };
}

// Butterfly component
function Butterfly({ delay = 0 }: { delay?: number }) {
  const [path] = React.useState(() => {
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    return { startX, startY };
  });

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ left: `${path.startX}%`, top: `${path.startY}%`, opacity: 0 }}
      animate={{
        left: [`${path.startX}%`, `${(path.startX + 50) % 100}%`, `${path.startX}%`],
        top: [`${path.startY}%`, `${(path.startY + 30) % 100}%`, `${path.startY}%`],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <span className="text-2xl">🦋</span>
    </motion.div>
  );
}

export default function MyDropsPage() {
  const [items, setItems] = React.useState<Drop[]>([]);
  const [openId, setOpenId] = React.useState<number | null>(null);
  const [deletedDrop, setDeletedDrop] = React.useState<{ drop: Drop; index: number } | null>(null);

  React.useEffect(() => {
    setItems(loadDrops());
  }, []);

  const handleDelete = (drop: Drop, index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setDeletedDrop({ drop, index });

    try {
      localStorage.setItem("moodDrops", JSON.stringify(newItems));
      localStorage.setItem("mooddrop_messages", JSON.stringify(newItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    setTimeout(() => {
      setDeletedDrop(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (!deletedDrop) return;

    const restoredItems = [...items];
    restoredItems.splice(deletedDrop.index, 0, deletedDrop.drop);
    setItems(restoredItems);
    setDeletedDrop(null);

    try {
      localStorage.setItem("moodDrops", JSON.stringify(restoredItems));
      localStorage.setItem("mooddrop_messages", JSON.stringify(restoredItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (hours < 24) return "Recently";
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <button
            className="w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center hover:bg-blush-200 transition-colors"
            data-testid="button-back-home"
          >
            <ArrowLeft className="text-blush-600" size={18} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-warm-gray-700">View My Drops</h1>
          <p className="text-warm-gray-600 text-sm">
            Your emotional journey, one drop at a time.
          </p>
        </div>
      </div>

      {/* Undo Banner */}
      {deletedDrop && (
        <div
          className="mb-6 p-4 bg-warm-gray-100 border border-warm-gray-200 rounded-xl flex items-center justify-between"
          data-testid="undo-banner"
        >
          <p className="text-warm-gray-700 text-sm">
            Drop deleted. <strong>Undo?</strong>
          </p>
          <button
            onClick={handleUndo}
            className="flex items-center gap-2 px-4 py-2 bg-blush-300 text-white rounded-lg hover:bg-blush-400 transition-colors"
            data-testid="button-undo"
          >
            <Undo2 size={16} />
            Undo
          </button>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-blush-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🌸</span>
          </div>
          <p className="text-warm-gray-600 text-lg">
            No drops yet. After you press Drop It, they'll appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Drops List */}
          <div className="space-y-3 mb-8">
            {items.map((item, index) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-warm-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`drop-${item.id}`}
                >
                  {/* Header Row - Always Visible */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-warm-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getColor(item.emotion, item.color) }}
                    />
                    <div className="flex-1 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-warm-gray-700">{item.emotion}</span>
                        <span className="text-xs text-warm-gray-500">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-warm-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-warm-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Body - Shows Full Text */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-warm-gray-100">
                      <div className="flex items-start justify-between gap-3">
                        <p className="flex-1 text-warm-gray-600 leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item, index);
                          }}
                          className="flex-shrink-0 p-2 text-warm-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Natural Mood Garden */}
          <section className="mt-6 rounded-2xl border border-blush-100 bg-gradient-to-b from-sky-100 via-green-50 to-amber-50 p-5 overflow-hidden">
            <h3 className="text-center text-lg font-semibold text-warm-gray-900">
              Your Mood Garden <span className="ml-1">🌸</span>
            </h3>
            <p className="mt-1 text-center text-sm text-warm-gray-600">
              Each flower represents a drop. Watch your garden bloom!
            </p>

            {/* Garden Container */}
            <div className="relative mt-6 rounded-xl bg-gradient-to-b from-green-100/30 to-green-200/40 border border-green-200/50" style={{ minHeight: "400px" }}>
              {/* Decorative grass blades at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 text-green-600 text-2xl"
                    style={{ left: `${i * 5}%` }}
                    animate={{
                      rotate: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  >
                    🌿
                  </motion.div>
                ))}
              </div>

              {/* Butterflies */}
              {items.length > 3 && (
                <>
                  <Butterfly delay={0} />
                  <Butterfly delay={5} />
                  {items.length > 10 && <Butterfly delay={10} />}
                </>
              )}

              {/* Scattered Flowers */}
              {items.map((d, index) => {
                const pos = getFlowerPosition(d.id, index, items.length);
                return (
                  <div
                    key={d.id}
                    className="absolute"
                    style={{
                      left: pos.left,
                      top: pos.top,
                    }}
                  >
                    <Flower
                      color={getColor(d.emotion, d.color)}
                      title={`${d.emotion} — ${new Date(d.timestamp).toLocaleString()}`}
                      onClick={() => setOpenId(openId === d.id ? null : d.id)}
                      size={pos.size}
                      rotation={pos.rotation}
                      delay={pos.delay}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
