// src/pages/LoginPage.jsx
// Glassmorphic auth page with "Sign in with Google" button.

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

// Animated floating orbs for background refraction
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large pink orb */}
      <motion.div
        className="absolute rounded-full bg-pink-200 opacity-40 blur-3xl"
        style={{ width: "500px", height: "500px", left: "10%", top: "15%" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Peach orb */}
      <motion.div
        className="absolute rounded-full bg-orange-100 opacity-35 blur-3xl"
        style={{ width: "400px", height: "400px", right: "5%", top: "50%" }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle rose orb */}
      <motion.div
        className="absolute rounded-full bg-rose-100 opacity-30 blur-3xl"
        style={{ width: "350px", height: "350px", left: "50%", top: "60%" }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function LoginPage() {
  const { currentUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in with Google.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#FAF9F6] p-4">
      <FloatingOrbs />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="relative w-full max-w-sm"
      >
        {/* Glass card */}
        <div className="rounded-3xl backdrop-blur-xl bg-white/30 border border-white/60 shadow-lg p-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-2xl bg-pink-600 flex items-center justify-center shadow-xl shadow-pink-600/25 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-extrabold text-pink-700 mb-2"
          >
            Confession Wala
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-500 mb-8 leading-relaxed"
          >
            Your secrets are safe here.
            <br />
            Share anonymously, connect authentically.
          </motion.p>

          {/* Google Sign In */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg hover:shadow-xl transition-shadow text-sm font-semibold text-slate-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-red-100 text-red-600 text-xs font-semibold"
            >
              {error}
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-[11px] text-slate-400 leading-relaxed"
          >
            By signing in, you agree to our community guidelines.
            <br />
            Your confessions will always remain anonymous.
          </motion.p>
        </div>

        {/* Decorative glow */}
        <div className="absolute -inset-4 -z-10 rounded-3xl bg-pink-200/20 blur-2xl" />
      </motion.div>
    </div>
  );
}
