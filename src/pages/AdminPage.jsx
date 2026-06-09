// src/pages/AdminPage.jsx
// Protected admin dashboard for confession content management.
// Only accessible to users with role: "admin" in Firestore.
// Performs client-side join to deanonymize confessors.

import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  useAllUsers,
} from "../hooks/useConfessions";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { deleteChannel } from "../hooks/useChannels";

// Helper for relative time
function timeAgo(date) {
  if (!date) return "—";
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



// Main Page Component
export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { users, loading: usersLoading } = useAllUsers();
  
  const [selectedWriter, setSelectedWriter] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannelDetails, setSelectedChannelDetails] = useState(null);
  const [channelMembers, setChannelMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      getDocs(collection(db, "channels")).then(snap => {
        setChannels(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }
  }, [isAdmin]);

  const handleDeleteChannel = async (id) => {
    if (window.confirm("Delete this room forever? This will also delete all its confessions.")) {
      await deleteChannel(id);
      setChannels(c => c.filter(x => x.id !== id));
    }
  };

  const handleViewChannelDetails = async (channel) => {
    setSelectedChannelDetails(channel);
    setLoadingMembers(true);
    const q = query(collection(db, "channel_members"), where("channelId", "==", channel.id));
    const snap = await getDocs(q);
    setChannelMembers(snap.docs.map(d => d.data()));
    setLoadingMembers(false);
  };

  // Unauthorized Screen
  if (!authLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#fff9e9] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#3f0009] mb-2">Unauthorized Access</h1>
          <p className="text-sm font-medium text-slate-600 mb-6">
            You do not have the required administrative privileges to view this page.
          </p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-[#3f0009] text-white font-bold text-sm shadow-xl shadow-pink-900/20 hover:bg-pink-900 transition-colors">
            Return to Feed
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9e9]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-8 h-8 border-3 border-[#3f0009] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9e9] relative font-sans text-[#3f0009]">
      {/* Background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-pink-200 opacity-30 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full bg-orange-100 opacity-40 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold mb-1">Admin Dashboard</h1>
          <p className="text-sm font-medium text-slate-500">Moderate content and manage the community safely.</p>
        </motion.div>

        <h2 className="text-xl font-extrabold mb-4">All Rooms</h2>
          <div className="space-y-4">
            {channels.map(c => {
              const owner = users[c.ownerId] || { displayName: "Unknown", email: "" };
              return (
              <div key={c.id} className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4 overflow-hidden w-full sm:w-auto">
                  <img src={c.pfpUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{c.name || "Untitled Room"} {c.isPrivate ? "🔒" : ""}</h3>
                    <p className="text-xs text-slate-500 truncate">{c.description || "No description"}</p>
                    <p className="text-[10px] text-pink-600 font-bold mt-1 truncate">Owner: {owner.displayName} ({owner.email})</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button onClick={() => handleViewChannelDetails(c)} className="px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg text-sm hover:bg-pink-200 text-center flex-1 sm:flex-none">Details</button>
                  <Link to={`/c/${c.id}`} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm text-center flex-1 sm:flex-none">View</Link>
                  <button onClick={() => handleDeleteChannel(c.id)} className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-lg text-sm hover:bg-red-200 text-center flex-1 sm:flex-none">Delete</button>
                </div>
              </div>
            )})}
            {channels.length === 0 && <div className="text-center py-20 opacity-50 font-bold">No rooms found.</div>}
          </div>
      </div>

      {/* Writer Details Modal */}
      <AnimatePresence>
        {selectedWriter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedWriter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#fff9e9]/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/50 text-center"
            >
              <h2 className="text-2xl font-extrabold text-[#3f0009] mb-6">Writer Details</h2>
              <img 
                src={selectedWriter.photoURL || "/logo.png"} 
                alt="Profile" 
                className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg mb-4 object-cover bg-white"
                referrerPolicy="no-referrer"
              />
              <p className="text-xl font-bold text-[#3f0009] mb-1">{selectedWriter.displayName || "Unknown User"}</p>
              <p className="text-sm font-semibold text-slate-500 mb-8">{selectedWriter.email || "No email available"}</p>
              
              <button
                onClick={() => setSelectedWriter(null)}
                className="w-full py-3.5 rounded-xl bg-[#3f0009] text-white font-bold text-sm shadow-xl shadow-pink-900/20 hover:bg-pink-900 transition-colors"
              >
                Close Window
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Channel Details Modal */}
      <AnimatePresence>
        {selectedChannelDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedChannelDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#fff9e9]/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-pink-200 pb-4 shrink-0">
                <img src={selectedChannelDetails.pfpUrl} alt="" className="w-16 h-16 rounded-full object-cover bg-white" />
                <div>
                  <h2 className="text-2xl font-extrabold text-[#3f0009]">{selectedChannelDetails.name || "Untitled Room"}</h2>
                  <p className="text-sm font-semibold text-slate-500">{selectedChannelDetails.isPrivate ? "Private Room" : "Public Room"}</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                <div>
                  <h3 className="font-bold text-[#3f0009] mb-2 uppercase tracking-widest text-xs">Owner</h3>
                  {(() => {
                    const owner = users[selectedChannelDetails.ownerId] || { displayName: "Unknown", email: "No email" };
                    return (
                      <div className="p-3 bg-white/50 rounded-xl flex items-center gap-3">
                        <img src={owner.photoURL || "/logo.png"} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                          <p className="font-bold text-sm text-slate-800">{owner.displayName}</p>
                          <p className="text-xs text-slate-500">{owner.email}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-[#3f0009] uppercase tracking-widest text-xs">Members</h3>
                    <span className="text-xs font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{channelMembers.length} Total</span>
                  </div>
                  {loadingMembers ? (
                    <p className="text-sm text-slate-500">Loading members...</p>
                  ) : (
                    <div className="space-y-2">
                      {channelMembers.map(m => {
                        const user = users[m.userId] || { displayName: "Unknown", email: "No email" };
                        return (
                          <div key={m.userId} className="p-3 bg-white/50 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img src={user.photoURL || "/logo.png"} className="w-8 h-8 rounded-full shrink-0" alt="" />
                              <div className="truncate">
                                <p className="font-bold text-sm text-slate-800 truncate">{user.displayName}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0 ml-2">
                              {m.role === "owner" && <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded">OWNER</span>}
                              <span className={`text-[10px] font-bold px-2 py-1 rounded ${m.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {m.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedChannelDetails(null)}
                className="w-full mt-6 py-3.5 rounded-xl bg-[#3f0009] text-white font-bold text-sm shadow-xl shadow-pink-900/20 hover:bg-pink-900 transition-colors shrink-0"
              >
                Close Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
