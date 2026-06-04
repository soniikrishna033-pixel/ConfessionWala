// src/pages/FeedPage.jsx
// Main public screen — single continuous scrolling feed of all approved confessions.
// No category filters. Clean minimalist design with glassmorphism.

import { useState } from "react";
import { motion } from "framer-motion";
import { useApprovedConfessions } from "../hooks/useConfessions";
import ConfessionCard from "../components/ConfessionCard";
import ComposeModal from "../components/ComposeModal";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function FeedPage() {
  const { confessions, loading } = useApprovedConfessions();
  const [composeOpen, setComposeOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#fff9e9] relative">
      {/* Background shapes for glass refraction */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-20 w-[550px] h-[550px] rounded-full bg-pink-200 opacity-30 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-orange-100 opacity-25 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Hero */}
      <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-extrabold text-[#3f0009] mb-1">
            Confessions
          </h1>
          <p className="text-xs text-slate-500">
            Anonymous thoughts from our community
          </p>
        </motion.div>
      </div>

      {/* Feed */}
      <div className="px-4 pb-28 max-w-2xl mx-auto space-y-4 relative z-10">
        {loading ? (
          // Skeleton loader
          [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/60 shadow-lg p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="w-20 h-3 bg-slate-200 rounded animate-pulse" />
                  <div className="w-14 h-2 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-slate-200 rounded animate-pulse" />
                <div className="w-4/5 h-3 bg-slate-200 rounded animate-pulse" />
                <div className="w-3/5 h-3 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="w-16 h-7 bg-slate-200 rounded-xl animate-pulse" />
                <div className="w-16 h-7 bg-slate-200 rounded-xl animate-pulse" />
                <div className="w-16 h-7 bg-slate-200 rounded-xl animate-pulse" />
              </div>
            </motion.div>
          ))
        ) : confessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              No confessions yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Be the first to share your secret
            </p>
          </motion.div>
        ) : (
          confessions.map((confession, i) => (
            <ConfessionCard 
              key={confession.id} 
              confession={confession} 
              index={i} 
              dynamicNum={confessions.length - i}
            />
          ))
        )}
      </div>

      {/* Floating compose button or Login prompt */}
      {currentUser ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setComposeOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-xl shadow-pink-600/30 hover:bg-pink-700 hover:shadow-2xl hover:shadow-pink-600/40 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.button>
      ) : (
        <Link to="/login">
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="fixed bottom-6 right-6 z-40 px-6 py-4 rounded-2xl bg-[#3f0009] text-white flex items-center justify-center shadow-xl shadow-[#3f0009]/30 hover:opacity-90 transition-all cursor-pointer font-bold text-sm"
          >
            Log in to confess
          </motion.div>
        </Link>
      )}

      <ComposeModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} />
    </div>
  );
}
