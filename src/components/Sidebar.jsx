// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyChannels } from "../hooks/useChannels";
import { useEffect, useRef } from "react";

export default function Sidebar() {
  const { currentUser, isAdmin } = useAuth();
  const { myChannels, loading } = useMyChannels();
  const location = useLocation();
  // Using iframe to ensure the ad script runs properly
  const adIframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; }</style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : '523502e7e7c53a05d026f46b2d64851c',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script src="https://outrightphiladelphia.com/523502e7e7c53a05d026f46b2d64851c/invoke.js"></script>
      </body>
    </html>
  `;

  if (!currentUser) return null;

  return (
    <div className="hidden md:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white/60 backdrop-blur-md border-r border-white/60 shadow-lg p-4 z-40 overflow-y-auto">
      <Link 
        to="/" 
        className={`flex items-center gap-3 p-3 rounded-xl mb-4 transition font-bold ${location.pathname === '/' ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-white/50'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Home
      </Link>

      <div className="mb-2 px-3 text-xs font-extrabold tracking-wider text-slate-400 uppercase">
        My Joined Rooms
      </div>

      <div className="flex-1 space-y-1">
        {loading ? (
          <div className="px-3 text-sm text-slate-400">Loading...</div>
        ) : myChannels.length === 0 ? (
          <div className="px-3 text-sm text-slate-400">No rooms joined.</div>
        ) : (
          myChannels.map(c => {
            const isActive = location.pathname === `/c/${c.id}`;
            return (
              <Link 
                key={c.id} 
                to={`/c/${c.id}`} 
                className={`flex items-center gap-3 p-2 rounded-xl transition ${isActive ? 'bg-pink-600 text-white shadow-md' : 'text-slate-700 hover:bg-white'}`}
              >
                <img src={c.pfpUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-white" />
                <span className="font-bold text-sm truncate">{c.name}</span>
              </Link>
            )
          })
        )}
      </div>

      {isAdmin && (
        <Link 
          to="/admin" 
          className={`flex items-center gap-3 p-3 rounded-xl mt-4 transition font-bold ${location.pathname === '/admin' ? 'bg-[#3f0009] text-white' : 'text-red-700 bg-red-50 hover:bg-red-100'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Super Admin
        </Link>
      )}

      {/* Banner Ad */}
      <div className="mt-8 flex justify-center w-full min-h-[600px]">
        <iframe
          title="Sidebar Ad"
          srcDoc={adIframeContent}
          width="160"
          height="600"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
        />
      </div>
    </div>
  );
}
