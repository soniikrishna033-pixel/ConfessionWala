// src/App.jsx
// Root application component with routing.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import ChannelPage from "./pages/ChannelPage";
import AntiAdBlocker from "./components/AntiAdBlocker";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col">
          <AntiAdBlocker />
          <Navbar />
          <div className="flex flex-1 pt-16">
            <Sidebar />
            <main className="flex-1 md:pl-64 min-w-0">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/explore" element={<FeedPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/c/:channelId" element={<ChannelPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
              <Footer />
            </main>
          </div>
          <Analytics />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
