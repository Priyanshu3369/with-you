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
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Brand */}
        <div className="mb-6 md:mb-8">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-bold text-foreground">Serenity</span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-md">
            Your safe space for mental wellness. Express your feelings, 
            access grounding exercises, and receive compassionate support anytime.
          </p>
        </div>

        {/* Links and Social - Compact on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Connect</h4>
            <div className="flex gap-2 md:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar - More compact on mobile */}
        <div className="border-t border-border pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {currentYear} Serenity. All rights reserved.
          </p>
          <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}