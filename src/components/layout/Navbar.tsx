import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Lock, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Diary', path: '/diary' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">Serenity</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.name === 'Diary' && <Lock className="w-3 h-3 inline mr-1" />}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side - Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-xl gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button className="rounded-xl">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name === 'Diary' && <Lock className="w-3 h-3 inline mr-1" />}
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-border pt-3 mt-2">
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
