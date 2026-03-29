import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UIButton from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

const TASKS = [
  { label: 'Design system review',  tag: 'Work',     done: true,  tagColor: 'text-violet-400 bg-violet-400/10', delay: '0s'   },
  { label: 'Ship v2.0 release 🚀',  tag: 'Priority', done: false, tagColor: 'text-[#EF9F27] bg-[#EF9F27]/10',  delay: '0.08s', hot: true },
  { label: 'Grocery run',           tag: 'Personal', done: false, tagColor: 'text-[#5DCAA5] bg-[#5DCAA5]/10',  delay: '0.16s' },
  { label: 'Read 20 pages',         tag: 'Growth',   done: true,  tagColor: 'text-mist-300 bg-mist-300/10',    delay: '0.24s' },
  { label: 'Team standup @ 10am',   tag: 'Work',     done: false, tagColor: 'text-violet-400 bg-violet-400/10', delay: '0.32s' },
];

const AVATARS = ['A', 'B', 'C', 'D'];

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-violet-50 dark:bg-void-900">

      {/* Background orbs — light */}
      <div className="absolute inset-0 pointer-events-none dark:hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-300 opacity-25 blur-[100px] -top-32 -left-24" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-violet-400 opacity-15 blur-[80px] bottom-0 right-[5%]" />
        <div className="absolute w-[250px] h-[250px] rounded-full bg-violet-200 opacity-30 blur-[60px] top-[45%] left-[40%]" />
      </div>

      {/* Background orbs — dark */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-600 opacity-[.12] blur-[100px] -top-40 -left-28" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-400 opacity-[.07] blur-[90px] bottom-0 right-[8%]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-400 opacity-[.10] blur-[80px] top-[40%] right-[25%]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,111,224,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,224,.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col gap-7 animate-fade-up">

          {/* Overline badge */}
          <div className="flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border border-violet-200 dark:border-violet-600/30 bg-violet-50 dark:bg-violet-600/12 text-violet-600 dark:text-mist-300 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3 h-3 animate-pulse-glow" />
            Focused. Fast. Effortless.
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-text-heading dark:text-mist-100 m-0">
            Stop juggling.<br />
            <span className="bg-linear-to-br from-violet-600 to-violet-400 bg-clip-text text-transparent">
              Start doing.
            </span>
          </h1>

          {/* Body */}
          <p className="text-lg text-text-body dark:text-mist-300 leading-[1.75] max-w-md m-0">
            One place for every task, deadline, and priority. Built for people who want clarity — not complexity.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-3 flex-wrap">
            {user ? (
              <Link to="/dashboard">
                <UIButton size="lg">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </UIButton>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <UIButton size="lg">
                    Get started free <ArrowRight className="w-4 h-4" />
                  </UIButton>
                </Link>
                <Link to="/login">
                  <UIButton variant="ghost" size="lg">Sign in</UIButton>
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {AVATARS.map((l, i) => (
                <Avatar
                  key={i}
                  initials={l}
                  size="sm"
                  className={`border-2 border-white dark:border-void-900 ${i > 0 ? '-ml-2' : ''}`}
                />
              ))}
            </div>
            <p className="text-sm text-text-secondary dark:text-mist-500 m-0">
              Trusted by <span className="font-semibold text-text-body dark:text-mist-300">12,000+</span> productive people
            </p>
          </div>
        </div>

        {/* ── RIGHT: Floating task cards ── */}
        <div
          className="flex justify-center items-center animate-slide-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="w-full max-w-sm flex flex-col gap-3">

            {/* Header card */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-void-800 border border-violet-200 dark:border-violet-600/20 shadow-sm dark:shadow-none">
              <span className="text-sm font-semibold text-text-heading dark:text-mist-100">My Tasks</span>
              <Badge>5 tasks</Badge>
            </div>

            {/* Task rows */}
            {TASKS.map((task, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-250 hover:translate-x-1 cursor-default animate-fade-up
                  bg-white dark:bg-void-800
                  border-violet-200 dark:border-violet-600/20
                  hover:border-violet-400 dark:hover:border-violet-600/40
                  shadow-xs dark:shadow-none
                  ${task.hot ? 'ring-1 ring-violet-600/30' : ''}
                `}
                style={{ animationDelay: task.delay }}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-150
                    ${task.done
                      ? 'bg-violet-600 border-violet-600'
                      : 'border-violet-300 dark:border-violet-600/50'
                    }`}
                >
                  {task.done && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <span className={`flex-1 text-sm font-medium ${task.done ? 'line-through text-text-muted dark:text-mist-500' : 'text-text-body dark:text-mist-100'}`}>
                  {task.label}
                </span>

                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${task.tagColor}`}>
                  {task.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
