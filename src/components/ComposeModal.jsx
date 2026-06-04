// src/components/ComposeModal.jsx
// Floating compose modal for writing new confessions.
// Categories removed — all confessions go to "general".

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { submitConfession } from "../hooks/useConfessions";
import { useNavigate } from "react-router-dom";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
};

export default function ComposeModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    setErrorMsg("");
    
    try {
      await submitConfession(currentUser.uid, text.trim(), "general");
      setSuccess(true);
      setText("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to submit in ComposeModal", error);
      setErrorMsg("Firebase blocked the upload. Please update your Firestore Security Rules to allow writes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl backdrop-blur-xl bg-white/30 border border-white/60 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-pink-700">
                  Share Your Confession
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-xs text-slate-500">
                Your identity stays completely anonymous
              </p>
            </div>

            {/* Text area */}
            <div className="px-6 pb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind? Spill it here..."
                rows={5}
                maxLength={1000}
                className="w-full text-sm px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none transition-shadow"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-400">
                  {text.length}/1000
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                {errorMsg ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full py-3 rounded-2xl bg-red-100 text-red-600 text-center text-xs font-semibold px-4"
                  >
                    {errorMsg}
                  </motion.div>
                ) : success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full py-3 rounded-2xl bg-emerald-500 text-white text-center text-sm font-semibold"
                  >
                    Submitted — Awaiting approval
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!text.trim() || submitting}
                    className="w-full py-3 rounded-2xl bg-pink-600 text-white text-sm font-bold shadow-lg shadow-pink-600/25 hover:bg-pink-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </span>
                    ) : (
                      "Confess Anonymously"
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
