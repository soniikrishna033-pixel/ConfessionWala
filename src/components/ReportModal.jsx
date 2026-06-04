import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitDetailedReport } from "../hooks/useConfessions";

const REPORT_REASONS = [
  "Harassment or Bullying",
  "Hate Speech or Discrimination",
  "Defamation or False Information",
  "Invasion of Privacy"
];

export default function ReportModal({ isOpen, onClose, onSuccess, confessionId, userId }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await submitDetailedReport(confessionId, userId, selectedReason);
      alert("Report submitted for review.");
      onSuccess();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl font-sans"
          >
            <h2 className="text-xl font-bold text-[#3f0009] mb-4 text-center">Report Confession</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {REPORT_REASONS.map((reason) => (
                <label 
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === reason 
                      ? "bg-white/60 border-pink-400 shadow-sm" 
                      : "bg-white/20 border-white/40 hover:bg-white/40"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-[#3f0009]">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-white/50 text-[#3f0009] font-bold shadow-sm hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-[#3f0009] text-[#fff9e9] font-bold shadow-md hover:bg-pink-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
