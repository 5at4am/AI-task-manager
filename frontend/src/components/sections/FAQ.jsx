import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'Is TaskFlow really free to use?',
    answer: 'Yes! TaskFlow offers a generous free plan that includes up to 50 tasks, basic priorities, due dates, and mobile access. You can upgrade anytime for more features.',
  },
  {
    question: 'Can I use TaskFlow on multiple devices?',
    answer: 'Absolutely. Your tasks sync seamlessly across all your devices - desktop, tablet, and mobile. Access your tasks anywhere, anytime.',
  },
  {
    question: 'How do the AI-powered features work?',
    answer: 'Our AI helps you organize tasks smarter. It can suggest priorities, auto-categorize tasks, and even help break down complex projects into manageable steps.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information.',
  },
  {
    question: 'Can I collaborate with my team?',
    answer: 'Yes! Our Team plan includes shared workspaces, task assignments, and real-time collaboration features to keep everyone on the same page.',
  },
  {
    question: 'What happens if I exceed the free plan limits?',
    answer: "You'll receive a friendly notification when approaching your limits. You can continue using the free features or upgrade to unlock unlimited tasks and advanced features.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-20 bg-violet-50 dark:bg-void-900">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 mb-3">
            FAQ
          </p>
          <h2 className="text-4xl font-bold text-text-heading dark:text-mist-100 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-text-secondary dark:text-mist-300 leading-relaxed">
            Everything you need to know about TaskFlow. Can't find the answer? Contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-void-800 rounded-xl border border-violet-200 dark:border-violet-600/20 overflow-hidden transition-all duration-250 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-text-heading dark:text-mist-100 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-violet-600 dark:text-mist-300 flex-shrink-0 transition-transform duration-250 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-250 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-text-secondary dark:text-mist-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
