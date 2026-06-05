// src/pages/FeedPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePublicChannels, useMyChannels, createChannel, joinChannel } from "../hooks/useChannels";

export default function FeedPage() {
  const { currentUser } = useAuth();
  const { channels: publicChannels, loading: pubLoading } = usePublicChannels();
  const { myChannels } = useMyChannels();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Channel Form State
  const [newChanName, setNewChanName] = useState("");
  const [newChanDesc, setNewChanDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if(!newChanName.trim() || !currentUser) return;
    setIsCreating(true);
    try {
      const id = await createChannel(newChanName, newChanDesc, null, isPrivate, currentUser.uid);
      setShowCreateModal(false);
      navigate(`/c/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create channel");
    }
    setIsCreating(false);
  };

  const handleJoin = async (channelId, isPriv) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await joinChannel(channelId, currentUser.uid, isPriv);
      if(!isPriv) navigate(`/c/${channelId}`);
      else alert("Requested to join. Waiting for admin approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to join");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9e9] relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-20 w-[550px] h-[550px] rounded-full bg-pink-200 opacity-30 blur-3xl will-change-transform"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="px-4 pt-10 max-w-2xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#3f0009]">Channels</h1>
          {currentUser && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:bg-pink-700 transition"
            >
              + Create
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search channels..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-300 shadow-sm font-semibold text-slate-700"
          />
        </div>

        {/* Channel List */}
        <div className="space-y-4">
          {searchQuery.trim() === "" ? (
            /* Show My Channels Default View (WhatsApp Style) */
            <>
              {myChannels.length === 0 ? (
                <div className="text-center text-slate-500 py-10 font-bold">You haven't joined any channels yet.<br/><span className="text-sm font-normal">Use the search bar above to explore public channels.</span></div>
              ) : (
                myChannels.map(c => (
                  <Link key={c.id} to={`/c/${c.id}`} className="block p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center gap-4 shadow-sm hover:shadow-md transition">
                    <img src={c.pfpUrl} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-lg truncate flex items-center gap-1">
                        {c.name}
                        {c.isPrivate && <span title="Private Channel" className="text-sm">🔒</span>}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">{c.description || "No description"}</p>
                    </div>
                    <div className="text-pink-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </Link>
                ))
              )}
            </>
          ) : (
            /* Show Search Results */
            <>
              {pubLoading ? <div className="text-slate-500 font-bold">Loading...</div> : (
                <>
                  {publicChannels
                    .filter(c => !myChannels.find(mc => mc.id === c.id))
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map(c => (
                    <div key={c.id} className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <img src={c.pfpUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-slate-800 flex items-center gap-1">
                            {c.name}
                            {c.isPrivate && <span title="Private Channel" className="text-xs">🔒</span>}
                          </h3>
                          <p className="text-xs text-slate-500">{c.description || "No description"}</p>
                        </div>
                      </div>
                      <button onClick={() => handleJoin(c.id, c.isPrivate)} className="px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg text-sm shrink-0">
                        {c.isPrivate ? "Request" : "Join"}
                      </button>
                    </div>
                  ))}
                  
                  {myChannels
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map(c => (
                    <Link key={c.id} to={`/c/${c.id}`} className="block p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center justify-between shadow-sm opacity-70 hover:opacity-100">
                      <div className="flex items-center gap-4">
                        <img src={c.pfpUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-slate-800 flex items-center gap-1">
                            {c.name}
                            {c.isPrivate && <span title="Private Channel" className="text-xs">🔒</span>}
                          </h3>
                          <p className="text-xs text-slate-500">{c.description || "No description"}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Joined</span>
                    </Link>
                  ))}

                  {publicChannels.filter(c => !myChannels.find(mc => mc.id === c.id)).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))).length === 0 && 
                   myChannels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))).length === 0 && (
                     <div className="text-slate-500 font-bold text-center py-10">No channels match your search.</div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-[#3f0009]">Create Channel</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Channel Name</label>
                <input required value={newChanName} onChange={e=>setNewChanName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pink-200" placeholder="e.g. DU Confessions" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                <textarea value={newChanDesc} onChange={e=>setNewChanDesc(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 resize-none h-20" placeholder="What is this channel about?" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="priv" checked={isPrivate} onChange={e=>setIsPrivate(e.target.checked)} className="w-4 h-4 text-pink-600" />
                <label htmlFor="priv" className="text-sm font-bold text-slate-600">Make Private (Invite & Approve Only)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 p-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 p-3 rounded-xl font-bold text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50">Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
