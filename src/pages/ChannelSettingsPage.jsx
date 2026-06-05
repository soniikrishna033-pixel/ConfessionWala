// src/pages/ChannelSettingsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChannel } from "../hooks/useChannels";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function ChannelSettingsPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { channel, loading } = useChannel(channelId);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPriv, setIsPriv] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (channel) {
      setName(channel.name);
      setDesc(channel.description || "");
      setIsPriv(channel.isPrivate);
      fetchMembers();
    }
  }, [channel]);

  async function fetchMembers() {
    const q = query(collection(db, "channel_members"), where("channelId", "==", channelId));
    const snap = await getDocs(q);
    setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;
  if (!channel || channel.ownerId !== currentUser?.uid) {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized.</div>;
  }

  const handleSave = async () => {
    await updateDoc(doc(db, "channels", channelId), {
      name,
      description: desc,
      isPrivate: isPriv
    });
    alert("Saved");
  };

  const handleApprove = async (memberId) => {
    await updateDoc(doc(db, "channel_members", memberId), { status: "approved" });
    fetchMembers();
  };

  const handleKick = async (memberId) => {
    if(!window.confirm("Kick this member?")) return;
    await deleteDoc(doc(db, "channel_members", memberId));
    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-[#fff9e9] pt-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl shadow-xl">
        <h1 className="text-2xl font-extrabold text-[#3f0009] mb-6">Channel Settings</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Channel Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none" />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="priv2" checked={isPriv} onChange={e=>setIsPriv(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="priv2" className="text-sm font-bold text-slate-600">Private Channel</label>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl shadow hover:bg-pink-700">Save Changes</button>
            <button onClick={() => navigate(`/c/${channelId}`)} className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl shadow hover:bg-slate-300">Cancel</button>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-[#3f0009] mb-4">Members</h2>
        <div className="space-y-2">
          {members.map(m => (
            <div key={m.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 text-sm">User {m.userId.slice(0, 5)}...</p>
                <p className="text-xs text-slate-500">Status: {m.status}</p>
              </div>
              <div className="flex gap-2">
                {m.status === "pending" && (
                  <button onClick={() => handleApprove(m.id)} className="px-3 py-1 bg-emerald-500 text-white rounded font-bold text-xs">Approve</button>
                )}
                {m.userId !== channel.ownerId && (
                  <button onClick={() => handleKick(m.id)} className="px-3 py-1 bg-red-500 text-white rounded font-bold text-xs">Kick</button>
                )}
              </div>
            </div>
          ))}
          {members.length === 0 && <p className="text-slate-500 text-sm">No members yet.</p>}
        </div>
      </div>
    </div>
  );
}
