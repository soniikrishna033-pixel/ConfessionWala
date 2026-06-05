// src/pages/ContactPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fff9e9] pt-24 px-4 pb-16 font-sans text-[#3f0009]">
      <div className="max-w-2xl mx-auto bg-white/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl border border-white/60 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto bg-pink-100/50 rounded-full flex items-center justify-center mb-6 border-2 border-pink-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-pink-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
          
          <div className="space-y-6 text-slate-800 leading-relaxed mb-10 text-lg">
            <p>
              If you have questions or comments about this Privacy Policy, your data, or our moderation practices, please do not hesitate to contact us.
            </p>
            
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-inner">
              <div className="mb-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Email Support</span>
                <a href="mailto:confessionwala71@gmail.com" className="text-xl font-bold text-pink-600 hover:text-pink-700 transition-colors break-all">
                  confessionwala71@gmail.com
                </a>
              </div>
              
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Our Location</span>
                <p className="text-lg font-semibold text-[#3f0009]">
                  Ahmedabad, Gujarat, India
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Link to="/" className="inline-block px-8 py-3 rounded-xl bg-[#3f0009] text-white font-bold text-sm shadow-xl hover:bg-pink-900 transition-colors">
              Return to Feed
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
