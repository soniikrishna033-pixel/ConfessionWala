// src/pages/StaticPage.jsx
import { motion } from "framer-motion";

export default function StaticPage({ title }) {
  return (
    <div className="min-h-screen bg-[#fff9e9] pt-24 px-4 pb-10">
      <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-[#3f0009] mb-4"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 text-slate-700 leading-relaxed"
        >
          <p>
            Welcome to the {title} page. This is a placeholder for future content. 
            You can update this text with actual information related to {title.toLowerCase()}.
          </p>
          <p>
            Confession Wala is a safe space for the community to share thoughts 
            anonymously and connect with others in a glassmorphic aesthetic environment.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
