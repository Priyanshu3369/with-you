import { Link } from 'react-router-dom';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Diary', path: '/diary' },
];

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/priyanshu-chourasiya-1b54ab253/' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/Priyanshu3369/' },
  { name: 'Email', icon: Mail, href: 'mailto:priyanshuchaurasiya32198@gmail.com' },
];
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8 lg:mb-12">
          {/* Brand Section - Spans full width on mobile */}
          <div className="col-span-2 lg:col-span-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg
                  viewBox="0 0 200 200"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="200" y2="200">
                      <stop offset="0%" stopColor="#00BFA5" />
                      <stop offset="100%" stopColor="#26A69A" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M100 180L85 165C45 125 25 105 25 75C25 50 45 30 70 30C85 30 95 40 100 50C105 40 115 30 130 30C155 30 175 50 175 75C175 105 155 125 115 165L100 180Z"
                    fill="url(#heartGradient)"
                  />

                  <path
                    d="M100 70C85 55 75 55 65 70C55 85 65 115 100 145C135 115 145 85 135 70C125 55 115 55 100 70Z"
                    fill="white"
                    opacity="0.2"
                  />

                  <path
                    d="M85 85C85 85 90 80 100 80C110 80 115 85 115 85"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">Saathi</span>
            </Link>
            <p className="text-muted-foreground text-xs sm:text-base leading-relaxed max-w-sm">
              Your safe space for mental wellness and compassionate support.
            </p>
          </div>

          {/* Quick Links - Takes half width on mobile */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-foreground mb-2 sm:mb-4 text-sm sm:text-lg">Links</h4>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary text-xs sm:text-base transition-colors inline-block hover:translate-x-1 transition-transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section - Takes half width on mobile */}
          <div className="lg:col-span-4">
            <h4 className="font-semibold text-foreground mb-2 sm:mb-4 text-sm sm:text-lg">Connect</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Compact on mobile */}
        <div className="border-t border-border pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-6">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Saathi
            </p>
            <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <span className="text-border">•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}