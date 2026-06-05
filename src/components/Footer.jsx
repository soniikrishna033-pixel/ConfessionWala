// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#3f0009] text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="col-span-2 md:col-span-1 mb-2 md:mb-0">
          <h3 className="font-bold text-lg mb-4 text-pink-200">ConfessionWala</h3>
          <p className="text-sm text-pink-100/70">
            A safe, anonymous space to share your secrets, thoughts, and confessions.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4 text-pink-200">Company</h3>
          <ul className="space-y-2 text-sm text-pink-100/80">
            <li><Link to="/about" className="hover:text-white transition">↗ About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">↗ Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4 text-pink-200">Legal</h3>
          <ul className="space-y-2 text-sm text-pink-100/80">
            <li><Link to="/privacy" className="hover:text-white transition">↗ Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">↗ Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-pink-200">Navigation</h3>
          <ul className="space-y-2 text-sm text-pink-100/80">
            <li><Link to="/" className="hover:text-white transition">↗ Explore</Link></li>
            <li><Link to="/login" className="hover:text-white transition">↗ Login / Signup</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-pink-100/50 text-center gap-2">
        <p>© {new Date().getFullYear()} ConfessionWala. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0">Proudly Made In Bharat</p>
      </div>
    </footer>
  );
}
