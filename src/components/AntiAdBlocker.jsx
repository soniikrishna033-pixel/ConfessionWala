// src/components/AntiAdBlocker.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AntiAdBlocker() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    let isDetected = false;

    // Method 1: Network Request Check
    // Adblockers usually block requests to known ad networks like Google Syndication
    const checkNetwork = async () => {
      try {
        await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-store",
        });
      } catch (e) {
        isDetected = true;
        setAdBlockDetected(true);
      }
    };

    // Method 2: DOM Bait Check
    // Adblockers hide elements with common ad-related class names
    const checkDOM = () => {
      if (isDetected) return; // Already detected by network
      const bait = document.createElement("div");
      bait.className = "ad-banner adsbox doubleclick sponsor ad-placement";
      bait.style.position = "absolute";
      bait.style.left = "-9999px";
      bait.style.height = "10px";
      bait.style.width = "10px";
      document.body.appendChild(bait);

      setTimeout(() => {
        if (!isDetected) {
          const isBlocked =
            bait.offsetHeight === 0 ||
            bait.clientHeight === 0 ||
            window.getComputedStyle(bait).display === "none" ||
            window.getComputedStyle(bait).visibility === "hidden";

          if (isBlocked) {
            setAdBlockDetected(true);
          }
        }
        if (document.body.contains(bait)) {
          document.body.removeChild(bait);
        }
      }, 500);
    };

    checkNetwork().then(checkDOM);
  }, []);

  if (!adBlockDetected) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#3f0009]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#fff9e9] max-w-lg w-full rounded-[2rem] p-8 md:p-10 shadow-2xl border-4 border-pink-200 text-center relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50 -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-[#3f0009] mb-4 tracking-tight">Ad Blocker Detected</h2>
          <p className="text-base font-medium text-slate-600 leading-relaxed mb-8">
            It looks like you're using an ad blocker or a privacy browser like <strong>Brave</strong>. 
            We rely on ads to keep our servers running and provide this platform for free. 
            <br/><br/>
            Please <strong className="text-pink-600">disable your ad blocker</strong> or add our site to your allowlist to continue reading and sharing confessions.
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 rounded-xl bg-pink-600 text-white font-extrabold text-lg shadow-xl shadow-pink-600/20 hover:bg-pink-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            I have disabled it, Reload Page
          </button>
        </div>
      </motion.div>
    </div>
  );
}
