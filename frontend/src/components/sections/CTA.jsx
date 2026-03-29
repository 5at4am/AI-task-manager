import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UIButton from '../ui/Button';

export default function CTA() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-violet-900 to-void-900 border-y border-violet-600/20 py-24">
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600 opacity-20 blur-[100px] -top-20 left-[10%]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-400 opacity-15 blur-[80px] bottom-0 right-[15%]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-mist-500 mb-4">Get started today</p>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-mist-100 mb-5 max-w-2xl mx-auto leading-[1.1]">
          Ready to take control of your work?
        </h2>
        <p className="text-lg text-mist-300 leading-[1.75] max-w-lg mx-auto mb-10">
          Join thousands of people who use TaskFlow to stay focused, hit deadlines, and get things done.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {user ? (
            <Link to="/dashboard">
              <UIButton size="xl">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </UIButton>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <UIButton size="xl">
                  Create free account <ArrowRight className="w-4 h-4" />
                </UIButton>
              </Link>
              <Link to="/login">
                <UIButton variant="ghost" size="xl">Sign in</UIButton>
              </Link>
            </>
          )}
        </div>

        <p className="mt-6 text-xs text-mist-500">No credit card required · Free forever plan available</p>
      </div>
    </section>
  );
}
