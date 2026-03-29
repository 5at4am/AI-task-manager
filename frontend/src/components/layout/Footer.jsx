import { Link } from 'react-router-dom';
import { Check, Globe, Link as LinkIcon, User } from 'lucide-react';

const PRODUCT = ['Features', 'How It Works', 'FAQ', 'About'];
const COMPANY = ['About', 'Blog', 'Careers', 'Contact'];
const SOCIAL_LINKS = [
  { icon: Globe, href: 'https://example.com', label: 'Website' },
  { icon: LinkIcon, href: 'https://github.com', label: 'GitHub' },
  { icon: User, href: 'https://twitter.com', label: 'Twitter' },
];

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    e.target.reset();
  };

  return (
    <footer className="bg-void-950 border-t border-violet-600/10">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-mist-100 font-display">TaskFlow</span>
            </Link>
            <p className="text-sm text-mist-500 leading-relaxed max-w-[200px]">
              The modern task manager built for focused, productive people.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-violet-600/20 flex items-center justify-center text-mist-500 hover:text-mist-300 hover:border-violet-600/40 transition-colors duration-150"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mist-500 mb-4">Product</p>
            <ul className="space-y-3">
              {PRODUCT.map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-mist-300 hover:text-mist-100 transition-colors duration-150">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mist-500 mb-4">Company</p>
            <ul className="space-y-3">
              {COMPANY.map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-mist-300 hover:text-mist-100 transition-colors duration-150">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-mist-500 mb-4">Stay updated</p>
            <p className="text-sm text-mist-500 mb-4 leading-relaxed">Get product updates and tips in your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="flex-1 min-w-0 border border-violet-600/25 focus:border-violet-600/60 rounded-lg px-3 py-2 text-sm text-mist-100 bg-void-700 placeholder:text-mist-500 outline-none transition-colors duration-150"
                required
              />
              <button type="submit" className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-150 shrink-0 cursor-pointer">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-violet-600/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-mist-500">© 2026 TaskFlow. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-xs text-mist-500 hover:text-mist-300 transition-colors duration-150">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
