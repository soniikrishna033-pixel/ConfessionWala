// src/pages/TermsPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fff9e9] pt-24 px-4 pb-16 font-sans text-[#3f0009]">
      <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl border border-white/60">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold mb-2 text-center">Terms of Service</h1>
          <p className="text-sm font-semibold text-slate-500 text-center mb-10">
            Effective Date: 04-06-2026
          </p>

          <div className="space-y-8 text-slate-800 leading-relaxed">
            <p>
              Welcome to Confession Wala. These Terms of Service ("Terms") govern your access to and use of our website located at <strong>confessionwala.in</strong> (the "Site") and any related services we provide.
            </p>
            <p className="font-semibold text-[#3f0009]">
              By accessing or using Confession Wala, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you must not access or use the Site.
            </p>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">1. Description of Service</h3>
              <p>
                Confession Wala is a community platform designed to allow users to anonymously share thoughts, confessions, and stories. While the public interface masks user identities to foster open communication, the platform is strictly moderated to ensure a safe digital environment for all visitors.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">2. User Accounts and Authentication</h3>
              <p className="mb-3">
                To submit a confession, interact with posts, or utilize certain features of the Site, you must authenticate your session using Google Login.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your Google account credentials.</li>
                <li><strong>Accuracy:</strong> You agree that the information linked to your Google account is accurate.</li>
                <li><strong>Platform Rights:</strong> We reserve the right to suspend or terminate your access to the Site at any time, without notice, if we determine that you have violated these Terms.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">3. User-Generated Content (UGC) and Anonymity</h3>
              <p className="mb-3">
                Our platform allows you to post content ("User Content"). You retain all ownership rights to the content you submit; however, by posting on Confession Wala, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content across our platform.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The Anonymity Guarantee:</strong> We guarantee that your name, profile picture, and email address will not be publicly displayed alongside your approved confessions on the public feed.</li>
                <li><strong>Limits of Anonymity:</strong> Your anonymity is a privilege, not a shield for illegal or harmful behavior. Our administration team retains backend access to account identifiers strictly for moderation purposes. We will comply with lawful requests from law enforcement agencies if a user utilizes our platform to facilitate illegal activities.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">4. Prohibited Conduct (Strictly Enforced)</h3>
              <p className="mb-3">
                To maintain a safe environment and comply with our advertising partners (including Google AdSense), you agree NOT to post any content that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Is Harassing or Abusive:</strong> Content that bullies, threatens, or targets specific private individuals, peers, or organizations.</li>
                <li><strong>Contains Hate Speech:</strong> Content that promotes violence, discrimination, or hatred against individuals or groups based on race, ethnic origin, religion, disability, age, nationality, veteran status, sexual orientation, gender, or gender identity.</li>
                <li><strong>Is Explicit or Adult in Nature:</strong> Content containing graphic sexual descriptions, nudity, or adult themes.</li>
                <li><strong>Promotes Illegal Acts:</strong> Content that encourages, instructs, or facilitates illegal activities, including drug use, hacking, or violence.</li>
                <li><strong>Is Spam or Deceptive:</strong> Content containing unauthorized advertising, phishing links, malware, or fraudulent "get-rich-quick" schemes.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">5. Moderation and Administrative Rights</h3>
              <p>
                We actively moderate Confession Wala. We reserve the right, but have no obligation, to monitor, review, hide, or permanently delete any User Content at our sole discretion, at any time, and without prior notice, if we believe it violates these Terms or harms the community.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">6. Intellectual Property</h3>
              <p>
                Aside from User-Generated Content, all original content, features, code (including our Glassmorphic UI design), and functionality on the Site are the exclusive property of Confession Wala and its creators. Our branding, logos, and digital assets may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">7. Third-Party Links and Advertisements</h3>
              <p>
                The Site may contain links to third-party websites or services (including advertisements served by Google AdSense) that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. You access any third-party links at your own risk.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">8. Disclaimer of Warranties</h3>
              <p>
                Confession Wala is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, regarding the operation of the Site, the accuracy of the information, or the permanent storage of your User Content. We do not warrant that the Site will be uninterrupted, completely secure, or bug-free.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">9. Limitation of Liability</h3>
              <p>
                In no event shall Confession Wala, its administrators, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Site, your inability to access the Site, or any content posted by other users.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">10. Governing Law</h3>
              <p>
                These Terms shall be governed and construed in accordance with the laws of India, specifically the jurisdiction of Ahmedabad, Gujarat, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">11. Changes to Terms</h3>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 15 days' notice prior to any new terms taking effect. By continuing to access or use our Site after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">12. Contact Information</h3>
              <p className="mb-3">
                If you have any questions about these Terms, wish to report a violation, or need to contact the administration team, please reach out to us:
              </p>
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-inner inline-block">
                <div className="mb-2">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Email Support</span>
                  <a href="mailto:soniikrishna033@gmail.com" className="font-bold text-pink-600 hover:text-pink-700 transition-colors">
                    soniikrishna033@gmail.com
                  </a>
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Location</span>
                  <p className="font-semibold text-[#3f0009]">
                    Ahmedabad, Gujarat, India
                  </p>
                </div>
              </div>
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
