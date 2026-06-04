// src/pages/PrivacyPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fff9e9] pt-24 px-4 pb-16 font-sans text-[#3f0009]">
      <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl border border-white/60">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold mb-2 text-center">Privacy Policy</h1>
          <p className="text-sm font-semibold text-slate-500 text-center mb-10">
            Effective Date: {currentDate}
          </p>

          <div className="space-y-8 text-slate-800 leading-relaxed">
            <p>
              Welcome to Confession Wala. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application and use our services.
            </p>
            <p className="font-semibold text-[#3f0009]">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">1. Information We Collect</h3>
              <p className="mb-3">
                We collect information that you voluntarily provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, or otherwise contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Data:</strong> To submit a confession, you must log in using Google Authentication. We collect your basic Google profile information (such as your email address and an encrypted User ID).</li>
                <li><strong>User-Generated Content:</strong> We collect the text, timestamps, and status of the confessions you submit.</li>
                <li><strong>Automatically Collected Data:</strong> When you visit, use, or navigate the Site, we automatically collect certain information. This does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, referring URLs, and information about how and when you use our Site.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">2. How We Maintain Your Anonymity</h3>
              <p className="mb-3">The core purpose of Confession Wala is anonymous expression.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Public Feed:</strong> When you post a confession, your email address, name, and profile picture are never displayed to the public or other users.</li>
                <li><strong>Backend Security:</strong> Your account identifier is securely stored in our backend database strictly for moderation purposes, spam prevention, and to allow you to manage your own posts.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">3. Google AdSense and Advertising Cookies</h3>
              <p className="mb-3">
                We use Google AdSense to display advertisements to our users. Google's advertising requirements can be summed up by Google’s Advertising Principles, which are put in place to provide a positive experience for users.
              </p>
              <p className="mb-3">As a condition of using Google AdSense, we disclose the following regarding third-party ad serving:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our Site and/or other sites on the Internet.</li>
                <li><strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">www.aboutads.info</a>.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">4. Use of Cookies and Tracking Technologies</h3>
              <p className="mb-3">
                We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Used by our backend provider (Firebase) to keep you securely logged in.</li>
                <li><strong>Analytics Cookies:</strong> We may use third-party analytics to track and analyze website traffic and volume.</li>
                <li><strong>Advertising Cookies:</strong> Used by Google and its partners to deliver targeted advertisements to you as described in Section 3.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">5. Sharing Your Information</h3>
              <p className="mb-3">
                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.
              </p>
              <p>
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency), or to strictly enforce our community moderation guidelines regarding illegal or harmful content.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">6. Data Security</h3>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. Our database is secured using strict database rules that prevent unauthorized third parties from accessing user profiles or identifying the authors of approved confessions. However, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">7. Children's Privacy</h3>
              <p>
                Our Site is not intended for children under the age of 13. We do not knowingly solicit information from or market to children under 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">8. Changes to This Privacy Policy</h3>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Effective Date" of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the Site.
              </p>
            </section>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-[#3f0009] text-white font-bold text-sm shadow-xl hover:bg-pink-900 transition-colors">
              Return to Feed
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
