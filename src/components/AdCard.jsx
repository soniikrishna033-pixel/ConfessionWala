// src/components/AdCard.jsx
import { useEffect, useRef } from 'react';

export default function AdCard() {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.hasChildNodes()) {
      const script1 = document.createElement("script");
      script1.src = "https://pl29651249.effectivecpmnetwork.com/c2/05/ee/c205eee306d143bcb5e2cdba5c3aa010.js";
      script1.async = true;
      adRef.current.appendChild(script1);
    }
  }, []);

  return (
    <div className="w-full bg-white/40 backdrop-blur-md border border-pink-200/50 shadow-sm rounded-3xl p-4 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden my-4">
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 absolute top-3 right-4">Advertisement</div>
      
      {/* Banner Ad Container */}
      <div ref={adRef} className="w-full flex items-center justify-center mt-4"></div>

      {/* Smart Direct Link Button */}
      <a 
        href="https://www.effectivecpmnetwork.com/wu30npp31?key=57c795acd9c0171a49f90a72b0cc691f" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-6 mb-2 block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm text-center py-3.5 rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] transition-all"
      >
        🌟 Unlock Exclusive Content & Offers
      </a>
    </div>
  );
}
