// src/components/ConfessionCard.jsx
// Glassmorphic confession card with Like, Reply, Share, Report interactions.
// Clean minimalist design — no emojis, no categories.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toggleLike, reportConfession, addReply, deleteReply, updateConfessionStatus, hardDeleteConfession } from "../hooks/useConfessions";
import { generateShareImageBlob } from "../utils/generateImage";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal";

function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const d = date.toDate ? date.toDate() : new Date(date);
  const seconds = Math.floor((now - d) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 24 },
  },
};

export default function ConfessionCard({ confession, index, dynamicNum, isChannelOwner }) {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reported, setReported] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isHidden = confession.status === "hidden";
  const displayContent = isHidden 
    ? "This message is hidden by the admin."
    : (confession.content || confession.text);

  const isLiked = currentUser && confession.likedBy?.includes(currentUser.uid);
  const hasReported = currentUser && confession.reportedBy?.includes(currentUser.uid);

  const requireAuth = useCallback(
    () => {
      if (!currentUser) {
        navigate("/login");
        return false;
      }
      return true;
    },
    [currentUser, navigate]
  );

  async function handleLike() {
    if (!requireAuth()) return;
    await toggleLike(confession.id, currentUser.uid, isLiked);
  }

  function handleOpenReport() {
    if (!requireAuth()) return;
    if (hasReported || reported) return;
    setIsReportModalOpen(true);
  }

  async function handleReply() {
    if (!requireAuth()) return;
    if (!replyText.trim() || submittingReply) return;
    
    setSubmittingReply(true);
    
    try {
      await addReply(confession.id, currentUser.uid, replyText.trim());
      setReplyText("");
    } catch (error) {
      console.error("Reply failed", error);
      alert("Firebase blocked the reply. Please check your rules.");
    } finally {
      setSubmittingReply(false);
    }
  }

  async function handleDeleteReply(reply) {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteReply(confession.id, reply);
    } catch (error) {
      console.error("Failed to delete reply", error);
    }
  }

  async function handleShare() {
    if (isHidden) return;
    
    const textToShare = displayContent;
    const cNum = dynamicNum || confession.confessionNum || "N/A";
    
    try {
      setIsSharing(true);
      
      // Generate the image locally in the browser
      const blob = await generateShareImageBlob(textToShare, cNum);
      const file = new File([blob], `confession_${cNum}.png`, { type: "image/png" });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Confession Wala - A shared thought",
          text: "Read this anonymous confession on Confession Wala:",
          files: [file],
        });
      } else {
        // Fallback for browsers that do not support native file sharing
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `confession_${cNum}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Something went wrong while generating the share image. Please try again later.");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => {
          setIsReportModalOpen(false);
          setReported(true);
        }}
        confessionId={confession.id}
        userId={currentUser?.uid}
      />
      
      <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      whileHover={{ y: -2 }}
      className="relative rounded-2xl backdrop-blur-md bg-white/40 border border-white/60 shadow-lg overflow-hidden will-change-transform"
    >
      {/* Subtle top accent line */}
      <div className="h-[2px] bg-pink-600/30" />

      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Phase 1: Sequential Counting UI */}
            {(dynamicNum || confession.confessionNum) && (
              <div className="px-3 py-1 rounded-full bg-[#3f0009] text-[#fff9e9] shadow-sm">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  Confession #{dynamicNum || confession.confessionNum}
                </span>
              </div>
            )}
            <p className="text-[10px] font-medium text-slate-400">
              {timeAgo(confession.timestamp || confession.createdAt)}
            </p>
          </div>
          
          {/* Right side empty for future actions (e.g. 3-dots menu) */}
          <div className="flex gap-2">
            {(isAdmin || isChannelOwner) && !isHidden && (
              <button onClick={() => updateConfessionStatus(confession.id, "hidden")} className="text-[10px] text-orange-500 font-bold uppercase hover:underline">Hide</button>
            )}
            {(isAdmin || isChannelOwner) && isHidden && (
              <button onClick={() => updateConfessionStatus(confession.id, "approved")} className="text-[10px] text-emerald-500 font-bold uppercase hover:underline">Unhide</button>
            )}
            {(isAdmin || isChannelOwner) && (
              <button onClick={() => { if(window.confirm('Delete confession permanently?')) hardDeleteConfession(confession.id); }} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Delete</button>
            )}
          </div>
        </div>

        {/* Body */}
        {((index + 1) % 4 === 0) ? (
          <a 
            href="https://outrightphiladelphia.com/wyginqbn?key=421818159b7053fd3253e4e79abd1b0b" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block mb-4 hover:opacity-80 transition-opacity"
            title="Sponsored Link"
          >
            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isHidden ? 'italic font-bold text-slate-400' : 'text-slate-800'}`}>
              {displayContent}
            </p>
          </a>
        ) : (
          <p className={`text-sm leading-relaxed mb-4 whitespace-pre-wrap ${isHidden ? 'italic font-bold text-slate-400' : 'text-slate-800'}`}>
            {displayContent}
          </p>
        )}

        {/* Action bar */}
        <div className={`flex items-center gap-1 border-t border-white/40 pt-3 -mx-1 ${isHidden ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isLiked
                ? "bg-pink-100 text-pink-700"
                : "text-slate-500 hover:bg-white/50"
            }`}
          >
            <motion.span
              key={isLiked ? "liked" : "notliked"}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 ${isLiked ? "fill-pink-600 text-pink-600" : "text-slate-400"}`} viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </motion.span>
            <span>{confession.likes || 0}</span>
          </motion.button>

          {/* Reply toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowReplies(!showReplies)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              showReplies
                ? "bg-pink-100 text-pink-700"
                : "text-slate-500 hover:bg-white/50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            <span>{confession.replies?.length || 0}</span>
          </motion.button>

          {/* Share */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            disabled={isSharing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isSharing ? "text-pink-400 opacity-70 cursor-wait" : "text-slate-500 hover:bg-white/50"
            }`}
          >
            {isSharing ? (
              <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            )}
            {isSharing ? "Generating..." : "Share"}
          </motion.button>

          {/* Report */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenReport}
            disabled={hasReported || reported}
            className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              hasReported || reported
                ? "text-red-400 cursor-not-allowed opacity-60"
                : "text-slate-400 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            {hasReported || reported ? "Reported" : "Report"}
          </motion.button>
        </div>

        {/* Replies thread */}
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/40 space-y-2">
                {confession.replies?.map((reply, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-2 pl-3 border-l-2 border-pink-300"
                  >
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Anonymous Reply
                      </p>
                      <p className="text-xs text-slate-600">{reply.text}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                      <span className="text-[10px] text-slate-400">
                        {timeAgo(reply.createdAt)}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteReply(reply)}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Reply input */}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <textarea
                    rows={1}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                    placeholder="Write a reply..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-shadow resize-none break-words whitespace-pre-wrap overflow-hidden"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReply}
                    disabled={submittingReply || !replyText.trim()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-600/20 hover:bg-pink-700 disabled:opacity-50 transition-all shrink-0"
                  >
                    {submittingReply ? "..." : "Send"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
    </>
  );
}
