import { Link } from 'react-router-dom';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Diary', path: '/diary' },
  { name: 'Contact', path: '/contact' },
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
            <Link to="/" className="inline-flex items-center gap-2 mb-2 sm:mb-4 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground">Serenity</span>
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
              © {currentYear} Serenity
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