import { CheckSquare, Tag, Calendar, BarChart, Zap, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description: 'Create, organize, and prioritize tasks with an intuitive interface designed for productivity.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Tag,
    title: 'Tags & Categories',
    description: 'Organize tasks with custom tags and categories. Find anything instantly with powerful filtering.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Set due dates, recurring tasks, and get reminded at the perfect time. Never miss a deadline.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart,
    title: 'Progress Analytics',
    description: 'Visualize your productivity with detailed insights. Track completion rates and build better habits.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Zap,
    title: 'AI-Powered Assistant',
    description: 'Get intelligent suggestions for task priorities, auto-categorization, and smart task breakdown.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. We use industry-standard security to keep your information safe.',
    color: 'from-indigo-500 to-violet-500',
  },
];

export default function FeaturesShowcase() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-void-950">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 mb-3">
            Features
          </p>
          <h2 className="text-4xl font-bold text-text-heading dark:text-mist-100 mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-lg text-text-secondary dark:text-mist-300 leading-relaxed">
            Powerful features wrapped in a simple, beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-violet-50 dark:bg-void-800 border border-violet-100 dark:border-violet-600/20 hover:border-violet-600/40 dark:hover:border-violet-600/60 transition-all duration-250 hover:shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-250`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-heading dark:text-mist-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary dark:text-mist-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
