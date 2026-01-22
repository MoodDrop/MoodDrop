import { motion, AnimatePresence } from "framer-motion";

export default function HeldOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center px-6"
          >
            <div
              className="text-[26px] italic"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "rgba(35,28,28,0.85)",
              }}
            >
              It’s been held.
            </div>

            <div
              className="mt-3 text-[13px] italic"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "rgba(35,28,28,0.55)",
              }}
            >
              Your words are resting safely in your Echo Vault.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
