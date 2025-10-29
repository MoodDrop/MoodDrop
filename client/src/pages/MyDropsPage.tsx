import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Trash2, Undo2, Flower2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { moods, type MoodKey } from "@/lib/moods";
import { format } from "date-fns";

interface Drop {
  id: number;
  content: string;
  emotion: MoodKey;
  timestamp: string;
}

interface DeletedDrop {
  drop: Drop;
  index: number;
}

const EMOTION_COLORS: Record<string, string> = {
  Calm: "#93c5fd",
  Grounded: "#86efac",
  Joyful: "#fde68a",
  Tender: "#fca5a5",
  Overwhelmed: "#c7d2fe",
  Frustrated: "#fca5a5",
};

function getMoodColor(emotion?: string) {
  if (!emotion) return "#94a3b8";
  return moods[emotion as MoodKey]?.color || EMOTION_COLORS[emotion] || "#94a3b8";
}

export default function MyDropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [deletedDrop, setDeletedDrop] = useState<DeletedDrop | null>(null);

  useEffect(() => {
    loadDrops();
  }, []);

  const loadDrops = () => {
    try {
      const stored = localStorage.getItem('moodDrops') || localStorage.getItem('mooddrop_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        setDrops(parsed.reverse());
      }
    } catch (error) {
      console.error('Error loading drops:', error);
    }
  };

  const handleDelete = (drop: Drop, index: number) => {
    const newDrops = drops.filter((_, i) => i !== index);
    setDrops(newDrops);
    setDeletedDrop({ drop, index });

    try {
      localStorage.setItem('moodDrops', JSON.stringify(newDrops.reverse()));
      localStorage.setItem('mooddrop_messages', JSON.stringify(newDrops.reverse()));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    setTimeout(() => {
      setDeletedDrop(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (!deletedDrop) return;

    const restoredDrops = [...drops];
    restoredDrops.splice(deletedDrop.index, 0, deletedDrop.drop);
    setDrops(restoredDrops);
    setDeletedDrop(null);

    try {
      localStorage.setItem('moodDrops', JSON.stringify(restoredDrops.reverse()));
      localStorage.setItem('mooddrop_messages', JSON.stringify(restoredDrops.reverse()));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, h:mm a");
    } catch {
      return "Recently";
    }
  };

  const moodCounts = drops.reduce((acc, drop) => {
    acc[drop.emotion] = (acc[drop.emotion] || 0) + 1;
    return acc;
  }, {} as Record<MoodKey, number>);

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
          <h1 className="text-2xl font-semibold text-warm-gray-700">
            View My Drops
          </h1>
          <p className="text-warm-gray-600 text-sm">
            Your emotional journey, one drop at a time.
          </p>
        </div>
      </div>

      {/* Undo Banner */}
      <AnimatePresence>
        {deletedDrop && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {drops.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-blush-100 rounded-full flex items-center justify-center">
            <Flower2 className="text-blush-400" size={32} />
          </div>
          <p className="text-warm-gray-600 text-lg">
            No drops yet. After you press Drop It, they'll appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Drops List */}
          <div className="space-y-4 mb-12">
            <AnimatePresence mode="popLayout">
              {drops.map((drop, index) => {
                return (
                  <motion.div
                    key={drop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-warm-gray-100 hover:shadow-md transition-shadow"
                    data-testid={`drop-${drop.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-6 h-6 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getMoodColor(drop.emotion) }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-warm-gray-700">
                                {drop.emotion}
                              </span>
                              <span className="text-xs text-warm-gray-500">
                                {formatDate(drop.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-warm-gray-600 leading-relaxed pl-9">
                          {drop.content}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(drop, index)}
                        className="flex-shrink-0 p-2 text-warm-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        data-testid={`button-delete-${drop.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Mood Garden Visualization */}
          <div className="bg-gradient-to-br from-cream-50 to-blush-50 rounded-2xl p-8 border border-blush-100">
            <h2 className="text-xl font-semibold text-warm-gray-700 mb-6 text-center">
              Your Mood Garden 🌸
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {Object.entries(moodCounts).map(([emotion, count]) => {
                const color = getMoodColor(emotion);
                return (
                  <motion.div
                    key={emotion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.random() * 0.3,
                      duration: 0.6,
                    }}
                    className="group relative"
                    data-testid={`flower-${emotion}`}
                  >
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                      className="relative"
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 4px 20px ${color}40`,
                        }}
                      >
                        <Flower2 className="text-white" size={28} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-semibold text-warm-gray-700 shadow-sm border border-warm-gray-200">
                        {count}
                      </div>
                    </motion.div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-warm-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                        <p className="font-medium">{emotion}</p>
                        <p className="text-warm-gray-300">
                          {count} {count === 1 ? 'drop' : 'drops'}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-warm-gray-800 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-warm-gray-500 text-sm mt-6">
              Each flower represents your emotional expressions. Watch your garden bloom! 🌿
            </p>
          </div>
        </>
      )}
    </div>
  );
}
