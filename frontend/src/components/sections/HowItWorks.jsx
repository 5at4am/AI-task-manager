import { ListTodo, Bell, BarChart3 } from 'lucide-react';

const STEPS = [
  {
    icon: ListTodo,
    step: '01',
    title: 'Create Your Tasks',
    description: 'Add tasks in seconds with our intuitive interface. Set titles, descriptions, and organize with tags.',
  },
  {
    icon: Bell,
    step: '02',
    title: 'Set Priorities & Reminders',
    description: 'Mark important tasks with priorities and never miss a deadline with smart reminders.',
  },
  {
    icon: BarChart3,
    step: '03',
    title: 'Track Your Progress',
    description: 'Watch your productivity grow with visual insights and celebrate completed tasks.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-void-950">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 mb-3">
            How It Works
          </p>
          <h2 className="text-4xl font-bold text-text-heading dark:text-mist-100 mb-4">
            Master your tasks in 3 simple steps
          </h2>
          <p className="text-lg text-text-secondary dark:text-mist-300 leading-relaxed">
            Getting organized has never been easier. Start being productive in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <div key={step.step} className="relative">
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-violet-200 to-violet-600/20 dark:from-violet-600/20 dark:to-violet-600/40" />
              )}
              <div className="relative bg-white dark:bg-void-800 rounded-2xl p-8 border border-violet-200 dark:border-violet-600/20 shadow-sm hover:shadow-md transition-all duration-250 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-5xl font-bold text-violet-100 dark:text-void-700">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-text-heading dark:text-mist-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary dark:text-mist-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
