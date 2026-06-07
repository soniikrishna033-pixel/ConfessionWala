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
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (currentUser?.isAnonymous) {
      navigate("/login");
    } else {
      setShowCreateModal(true);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if(!newChanName.trim() || !currentUser) return;
    setIsCreating(true);
    try {
      const id = await createChannel(newChanName, currentUser.uid);
      setShowCreateModal(false);
      navigate(`/c/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create channel");
    }
    setIsCreating(false);
  };

  const handleJoin = async (channelId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await joinChannel(channelId, currentUser.uid);
      navigate(`/c/${channelId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to join");
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#fff9e9] relative">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-20 w-[550px] h-[550px] rounded-full bg-pink-200 opacity-30 blur-3xl will-change-transform"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="px-4 pt-10 max-w-2xl mx-auto relative z-10 flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <h1 className="text-3xl font-extrabold text-[#3f0009]">Rooms</h1>
          {currentUser && (
            <button 
              onClick={handleCreateClick}
              className="px-4 py-2 bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:bg-pink-700 transition"
            >
              + Create
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6 shrink-0">
          <input 
            type="text" 
            placeholder="Search rooms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-300 shadow-sm font-semibold text-slate-700"
          />
        </div>

        {/* Navigate Bar Ad */}
        <div className="w-full flex justify-center mb-4 shrink-0">
          <iframe 
            title="Nav Ad"
            src="/ad-nav.html"
            width="100%"
            height="60"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
          />
        </div>

        {/* Room List */}
        <div className="space-y-4 overflow-y-auto flex-1 pb-24 pr-1">
          {searchQuery.trim() === "" ? (
            /* Show My Rooms Default View (WhatsApp Style) */
            <>
              {myChannels.length === 0 ? (
                <div className="text-center text-slate-500 py-10 font-bold">You haven't joined any rooms yet.<br/><span className="text-sm font-normal">Use the search bar above to explore public rooms.</span></div>
              ) : (
                myChannels.map(c => (
                  <Link key={c.id} to={`/c/${c.id}`} className="block p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center gap-4 shadow-sm hover:shadow-md transition">
                    <img src={c.pfpUrl} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-lg truncate flex items-center gap-1">
                        {c.name}
                      </h3>
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
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(c => (
                    <div key={c.id} className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <img src={c.pfpUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-slate-800 flex items-center gap-1">
                            {c.name}
                          </h3>
                        </div>
                      </div>
                      <button onClick={() => handleJoin(c.id)} className="px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg text-sm shrink-0">
                        Join
                      </button>
                    </div>
                  ))}
                  
                  {myChannels
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(c => (
                    <Link key={c.id} to={`/c/${c.id}`} className="block p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center justify-between shadow-sm opacity-70 hover:opacity-100">
                      <div className="flex items-center gap-4">
                        <img src={c.pfpUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-slate-800 flex items-center gap-1">
                            {c.name}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Joined</span>
                    </Link>
                  ))}

                  {publicChannels.filter(c => !myChannels.find(mc => mc.id === c.id)).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && 
                   myChannels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                     <div className="text-slate-500 font-bold text-center py-10">No rooms match your search.</div>
                  )}
                </>
              )}
            </>
          )}

          {/* Mobile Banner Ad at bottom of feed */}
          <div className="md:hidden w-full flex justify-center mt-8 pb-4">
            <iframe 
              title="Mobile Banner Ad"
              src="/ad-banner.html"
              width="300"
              height="250"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
            />
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-[#3f0009]">Create Room</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Room Name</label>
                <input required value={newChanName} onChange={e=>setNewChanName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-pink-200" placeholder="e.g. DU Confessions" />
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
