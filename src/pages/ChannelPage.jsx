// src/pages/ChannelPage.jsx
import React, { useState } from "react";
import { useParams, Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useChannel, deleteChannel } from "../hooks/useChannels";
import { useChannelConfessions } from "../hooks/useConfessions";
import ConfessionCard from "../components/ConfessionCard";
import ComposeModal from "../components/ComposeModal";
import { useAuth } from "../context/AuthContext";

export default function ChannelPage() {
  const { channelId } = useParams();
  const { channel, loading: channelLoading } = useChannel(channelId);
  const { confessions, loading: confLoading } = useChannelConfessions(channelId);
  const [composeOpen, setComposeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useAuth();
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to completely delete this room?")) return;
    try {
      await deleteChannel(channelId);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete room.");
    }
  };

  if (channelLoading) {
    return <div className="min-h-screen bg-[#fff9e9] flex items-center justify-center font-bold text-pink-600">Loading room...</div>;
  }

  if (!channel) {
    return <div className="min-h-screen bg-[#fff9e9] flex items-center justify-center font-bold text-slate-600">Room not found.</div>;
  }

  const isOwner = currentUser?.uid === channel.ownerId;

  return (
    <div className="min-h-screen bg-[#fff9e9] relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-20 w-[550px] h-[550px] rounded-full bg-pink-200 opacity-30 blur-3xl will-change-transform"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-4 pt-4 relative z-10 flex justify-start">
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 text-[#3f0009]/70 hover:text-pink-600 transition-colors bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      </div>

      {/* Channel Header */}
      <div className="px-4 pt-4 pb-4 max-w-2xl mx-auto relative z-10 flex flex-col items-center">
        <img src={channel.pfpUrl} alt="pfp" className="w-24 h-24 rounded-full shadow-lg border-4 border-white mb-4 object-cover" />
        <h1 className="text-2xl font-extrabold text-[#3f0009] mb-1">{channel.name}</h1>
        <p className="text-sm font-bold text-slate-500 mb-4">@{channel.id}</p>
        
        <div className="flex gap-3 mt-2">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }} 
            className="px-4 py-2 bg-white text-pink-600 rounded-full text-sm font-bold shadow-sm border border-pink-200 hover:bg-pink-50 transition flex items-center gap-2"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            )}
            {copied ? "Copied!" : "Share Link"}
          </button>
          {isOwner && (
            <button onClick={handleDelete} className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold shadow hover:bg-red-200 transition">
              Delete Room
            </button>
          )}
        </div>
      </div>


      {/* Feed */}
      <div className="px-4 pb-28 max-w-2xl mx-auto space-y-4 relative z-10 mt-6">
        {confLoading ? (
          <div className="text-center text-slate-500 font-bold">Loading confessions...</div>
        ) : confessions.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No confessions in this room yet.</div>
        ) : (
          confessions.map((confession, i) => (
            <React.Fragment key={confession.id}>
              <ConfessionCard 
                confession={confession} 
                index={i} 
                dynamicNum={confessions.length - i}
                isChannelOwner={isOwner}
              />
            </React.Fragment>
          ))
        )}

      </div>

      {currentUser ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setComposeOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-xl hover:bg-pink-700 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.button>
      ) : (
        <Link to="/login" state={{ returnTo: location.pathname + location.search }}>
          <div className="fixed bottom-6 right-6 z-40 px-6 py-4 rounded-2xl bg-[#3f0009] text-white flex items-center justify-center shadow-xl font-bold text-sm">
            Log in to confess
          </div>
        </Link>
      )}

      {composeOpen && <ComposeModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} channelId={channelId} />}
    </div>
  );
}
