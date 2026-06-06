// src/pages/ChannelPage.jsx
import React, { useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useChannel, joinChannel, leaveChannel, useMyChannels } from "../hooks/useChannels";
import { useChannelConfessions } from "../hooks/useConfessions";
import ConfessionCard from "../components/ConfessionCard";
import ComposeModal from "../components/ComposeModal";
import { useAuth } from "../context/AuthContext";

export default function ChannelPage() {
  const { channelId } = useParams();
  const { channel, loading: channelLoading } = useChannel(channelId);
  const { confessions, loading: confLoading } = useChannelConfessions(channelId);
  const [composeOpen, setComposeOpen] = useState(false);
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [searchParams] = useSearchParams();
  const [joining, setJoining] = useState(false);
  const { myChannels } = useMyChannels();
  const navigate = useNavigate();

  const inviteCode = searchParams.get("inviteCode");
  const inviteName = searchParams.get("name");

  const handleRequestJoin = () => {
    if (!currentUser) return alert("Please log in first.");
    setJoining(true);
    joinChannel(channelId, currentUser.uid, true)
      .then(() => alert("Request sent! Waiting for admin approval."))
      .catch(e => {
        console.error(e);
        alert("Failed to send request.");
      })
      .finally(() => setJoining(false));
  };

  const copyInvite = () => {
    let url = window.location.href.split('?')[0];
    if (channel.inviteCode) url += `?inviteCode=${channel.inviteCode}&name=${encodeURIComponent(channel.name)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this room?")) return;
    try {
      await leaveChannel(channelId, currentUser.uid);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to leave room.");
    }
  };

  if (channelLoading) {
    return <div className="min-h-screen bg-[#fff9e9] flex items-center justify-center font-bold text-pink-600">Loading room...</div>;
  }

  if (!channel) {
    if (inviteCode) {
      return (
        <div className="min-h-screen bg-[#fff9e9] flex flex-col items-center justify-center p-4">
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-8 max-w-sm w-full text-center">
            <h1 className="text-2xl font-extrabold text-[#3f0009] mb-2">{inviteName || "Private Room"}</h1>
            <p className="text-slate-500 text-sm mb-6">This room requires approval to join.</p>
            {currentUser ? (
              <button 
                onClick={handleRequestJoin}
                disabled={joining}
                className="w-full py-3.5 rounded-xl bg-pink-600 text-white font-bold shadow-lg hover:bg-pink-700 disabled:opacity-50 transition"
              >
                {joining ? "Processing..." : "Request to Join"}
              </button>
            ) : (
              <Link to="/login" className="block w-full py-3.5 rounded-xl bg-[#3f0009] text-white font-bold shadow-lg hover:bg-pink-900 transition">
                Log In to Request
              </Link>
            )}
          </div>
        </div>
      );
    }
    return <div className="min-h-screen bg-[#fff9e9] flex items-center justify-center font-bold text-slate-600">Room not found or private.</div>;
  }

  const isOwner = currentUser?.uid === channel.ownerId;
  const isMember = myChannels.some(c => c.id === channelId);

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
        <p className="text-sm text-slate-600 mb-4 text-center">{channel.description}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={copyInvite}
            className="px-4 py-2 bg-white rounded-full text-sm font-bold shadow text-pink-600 hover:bg-pink-50 transition"
          >
            {copied ? "Copied!" : "Copy Invite Link"}
          </button>
          {isOwner ? (
            <Link to={`/c/${channelId}/settings`} className="px-4 py-2 bg-slate-800 text-white rounded-full text-sm font-bold shadow hover:bg-slate-700 transition">
              Settings
            </Link>
          ) : isMember ? (
            <button onClick={handleLeave} className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold shadow hover:bg-red-200 transition">
              Leave Room
            </button>
          ) : null}
        </div>
      </div>

      {/* Navigate Bar Ad */}
      <div className="max-w-2xl mx-auto px-4 w-full flex justify-center mb-2 relative z-10">
        <iframe 
          title="Nav Ad"
          src="/ad-nav.html"
          width="100%"
          height="60"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
        />
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

        {/* Mobile Banner Ad at bottom of feed */}
        <div className="md:hidden w-full flex justify-center mt-8 pt-4 border-t border-pink-200/50">
          <iframe 
            title="Mobile Banner Ad"
            src="/ad-banner.html"
            width="160"
            height="600"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
          />
        </div>
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
        <Link to="/login">
          <div className="fixed bottom-6 right-6 z-40 px-6 py-4 rounded-2xl bg-[#3f0009] text-white flex items-center justify-center shadow-xl font-bold text-sm">
            Log in to confess
          </div>
        </Link>
      )}

      {composeOpen && <ComposeModal isOpen={composeOpen} onClose={() => setComposeOpen(false)} channelId={channelId} />}
    </div>
  );
}
