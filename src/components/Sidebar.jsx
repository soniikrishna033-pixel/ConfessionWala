// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

export default function Sidebar() {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  // Sidebar should always render so users can see the Explore tab

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

      <Link 
        to="/explore" 
        className={`flex items-center gap-3 p-3 rounded-xl mb-4 transition font-bold ${location.pathname === '/explore' ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-white/50'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        Explore Rooms
      </Link>



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

    </div>
  );
}
