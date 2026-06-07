// src/components/Navbar.jsx
// Top navigation bar with glassmorphic styling, branding, and a slide-out drawer menu.

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function TypewriterLogo() {
  const [text, setText] = useState("");
  const fullText = "Confession Wala";

  useEffect(() => {
    let timeout;
    let isDeleting = false;
    let currentIndex = 0;

    function tick() {
      setText(fullText.substring(0, currentIndex));

      if (isDeleting) {
        currentIndex--;
        if (currentIndex < 0) {
          isDeleting = false;
          timeout = setTimeout(tick, 1000); // 1s pause before typing again
        } else {
          timeout = setTimeout(tick, 75); // 75ms deleting speed
        }
      } else {
        currentIndex++;
        if (currentIndex > fullText.length) {
          isDeleting = true;
          timeout = setTimeout(tick, 4500); // Hold for 4.5s when complete
        } else {
          timeout = setTimeout(tick, 150); // 150ms typing speed
        }
      }
    }

    timeout = setTimeout(tick, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <h1 className="text-lg font-bold text-[#3f0009] flex items-center min-w-[145px]">
      {text}
      <span className="font-normal opacity-50 animate-pulse -ml-[1px]">|</span>
    </h1>
  );
}

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-30 backdrop-blur-xl bg-white/30 border-b border-white/60 shadow-sm"
      >
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Branding */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Confession Wala Logo" className="h-10 w-auto" />
            <TypewriterLogo />
          </Link>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#3f0009]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Drawer Overlay & Panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-screen w-[80vw] max-w-[360px] bg-[#fff9e9]/70 backdrop-blur-xl border-l border-white/40 shadow-2xl flex flex-col font-sans"
            >
              {/* Header: Close Button */}
              <div className="flex justify-end p-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full bg-white/50 text-[#3f0009] hover:bg-white border border-white/60 shadow-sm transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* User Profile Card */}
              {currentUser && !currentUser.isAnonymous && (
                <div className="px-6 pb-6 mb-2 border-b border-pink-200/50 flex items-center gap-4">
                  <img
                    src={currentUser.photoURL || ""}
                    alt="Profile"
                    className="w-14 h-14 rounded-full border-2 border-pink-300 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-lg font-bold text-[#3f0009] truncate">{currentUser.displayName}</span>
                    <span className="text-sm font-medium text-slate-500 truncate">{currentUser.email}</span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-2 overflow-y-auto flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-semibold transition-colors border-b border-transparent ${location.pathname === '/' ? 'bg-pink-100/50 text-pink-700' : 'text-[#3f0009] hover:bg-pink-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Home
                </Link>



                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="mt-4 px-4 py-4 rounded-2xl text-base font-bold text-pink-700 bg-pink-100/50 hover:bg-pink-200/50 transition-colors shadow-sm"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Auth Action directly under links */}
                <div className="mt-8 pt-4 border-t border-pink-200/50">
                  {currentUser && !currentUser.isAnonymous ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="w-full py-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-base font-bold shadow-sm hover:bg-red-100 transition-colors"
                    >
                      Log Out
                    </motion.button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-center py-3.5 rounded-2xl bg-[#3f0009] text-white text-base font-bold shadow-xl shadow-pink-900/20 hover:bg-pink-900 transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
