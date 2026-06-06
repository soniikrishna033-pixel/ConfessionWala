// src/components/AdCard.jsx
import { useEffect, useRef } from 'react';

export default function AdCard() {
  const adRef = useRef(null);

  useEffect(() => {
    // Inject the navigate bar script
    if (adRef.current && !adRef.current.querySelector('script')) {
      const script = document.createElement("script");
      script.src = "https://outrightphiladelphia.com/d531c3d63a248990fa7432602f8d341b/invoke.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full bg-white/40 backdrop-blur-md border border-pink-200/50 shadow-sm rounded-3xl p-4 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden my-4">
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 absolute top-3 right-4">Advertisement</div>
      
      {/* Navigate Bar Ad Container */}
      <div ref={adRef} className="w-full flex items-center justify-center mt-4 min-h-[50px]">
        <div id="container-d531c3d63a248990fa7432602f8d341b"></div>
      </div>

      {/* Smart Direct Link Button */}
      <a 
        href="https://outrightphiladelphia.com/wyginqbn?key=421818159b7053fd3253e4e79abd1b0b" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-6 mb-2 block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm text-center py-3.5 rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] transition-all"
      >
        🌟 Unlock Exclusive Content & Offers
      </a>
    </div>
  );
}
