// src/pages/AboutPage.jsx
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fff9e9] pt-24 px-4 pb-16 font-sans text-[#3f0009]">
      <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl border border-white/60">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold mb-4 text-center">About Confession Wala</h1>
          <p className="text-lg font-semibold text-slate-600 text-center mb-10">
            The Heart of Our Community: A safe, anonymous space to share thoughts, secrets, and untold stories without the fear of judgment.
          </p>

          <div className="space-y-8 text-slate-800 leading-relaxed">
            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">1. Our Genesis & Creative Vision</h3>
              <p className="mb-3">
                In an era dominated by hyper-curated feeds, algorithmic validation, and the constant pressure to maintain a flawless digital persona, genuine human vulnerability has become a rare commodity. Modern social networks have gradually evolved into performing stages. They are places where individuals showcase only their highlights, leaving their anxieties, mistakes, hidden joys, and unexpressed thoughts tightly locked away behind a screen.
              </p>
              <p className="mb-3">
                <strong>Confession Wala</strong> was forged as a direct, structural antidote to this digital superficiality. We envisioned a modern, virtual sanctuary—a blank canvas stripped entirely of social status, follower counts, and vanity metrics. This platform is not just an application; it is an active social experiment built to answer a fundamental question: <em>How beautifully and authentically can a community connect when you strip away the biases of identity?</em>
              </p>
              <p>
                Whether it is a long-hidden truth weighing heavily on your conscience, a hilarious hidden memory from a college lecture hall, a secret crush you haven't found the words to tell, or a deep apology you cannot deliver face-to-face, Confession Wala provides the conduit. We bridge the gap between what you feel inside and what the world is allowed to hear, giving you a voice when you want to be heard, but absolutely prefer to remain unseen.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">2. The Anonymity Paradigm & Structural Privacy</h3>
              <p className="mb-3">
                True privacy is the baseline requirement of our platform. We understand that sharing your raw, unfiltered thoughts requires an ironclad layer of trust. Therefore, our core framework is architected from the ground up to isolate your public confessions completely from your personal identity.
              </p>
              <p className="mb-3">
                When you post to our feed, your digital footprint is systematically masked. Visitors browsing the main stream interact strictly with an elegant, anonymous interface. Because there are no profile pictures, user handles, or popularity scores attached to the posts, your public presence is entirely equalized. Every single post stands solely on the weight of its words, completely independent of the person behind it.
              </p>
              <p>
                Behind the scenes, we prioritize data minimization. We do not track your personal social graphs, and your peace of mind is our utmost priority. We want you to write freely, knowing that your secret stays exactly that—a secret.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">3. The Ethical Charter & Proactive Moderation</h3>
              <p className="mb-3">
                Anonymity is a powerful catalyst for raw honesty, but we also recognize that without ethical oversight, it can be misused. Confession Wala is passionately dedicated to maintaining a wholesome, safe, and emotionally secure space. We draw a sharp, non-negotiable boundary between authentic self-expression and harmful digital behavior.
              </p>
              <p className="mb-3">
                To uphold this high standard, our administration ecosystem utilizes a strict review and moderation pipeline. We actively monitor the community feed and immediately eliminate content that violates our core safety parameters. To ensure this remains a trusted platform, we maintain a zero-tolerance policy for the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li><strong>Targeted Harassment & Bullying:</strong> We strictly prohibit using anonymity to attack, demean, or target specific private individuals, classmates, or peers.</li>
                <li><strong>Hate Speech & Discrimination:</strong> Posts containing slurs, promotion of violence, or hate speech toward any demographic, religion, or community are permanently banned.</li>
                <li><strong>Explicit or Adult Content:</strong> To maintain a universally accessible platform that complies with global web standards, graphic text descriptions or mature explicit themes are filtered out.</li>
                <li><strong>Deceptive Practices:</strong> Any phishing attempts, spam links, illegal activities, or fraudulent claims are instantly neutralized.</li>
              </ul>
              <p>
                Our structural commitment to moderation ensures that users can browse our community feed comfortably, trusting that they are entering an empathetic digital space designed for genuine storytelling rather than malicious internet hostility.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">4. Building a Culture of Empathy</h3>
              <p className="mb-3">
                Ultimately, Confession Wala is not just a technology platform; it is a thriving digital collective. When you interact with our application—whether by submitting a confession, reading through the feed, or offering silent support—you are contributing directly to a culture rooted in shared empathy.
              </p>
              <p className="mb-3">
                Reading through our platform reveals a profound truth: despite our diverse backgrounds, we all face incredibly similar internal battles. We experience the same silent heartbreaks, the same unexpressed hopes, and the same humorous daily awkwardness. By reading other people's untold stories, we learn to look at the people around us with a deeper sense of understanding and kindness.
              </p>
              <p>
                We invite you to use this space with respect, honesty, and an open heart. Share the thoughts you have carried alone for too long, laugh along with your peers, and help us curate a premium, safe environment where truth is celebrated and no one is forced to suffer through their private journeys in complete isolation.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3f0009] mb-3">5. Contact Our Operations Team</h3>
              <p className="mb-3">
                Confession Wala is built with continuous iterative improvement in mind. We value the feedback of our community above all else.
              </p>
              <p>
                If you are a user who wishes to formally flag content, report a bug, suggest a new feature, or simply get in touch with our administrative team, our core operations desk is completely accessible. We review all inquiries promptly to ensure our platform remains the safest space on the internet for anonymous expression.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
