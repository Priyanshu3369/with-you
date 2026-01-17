import { useState } from 'react';
import { Heart, LogOut, Menu, X, Leaf, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenGrounding: () => void;
  onOpenHistory?: () => void;
}

export function Header({ onOpenGrounding, onOpenHistory }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Serenity</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={onOpenGrounding}
              className="rounded-xl gap-2"
            >
              <Leaf className="w-4 h-4" />
              Grounding
            </Button>
            
            {user && onOpenHistory && (
              <Button
                variant="ghost"
                onClick={onOpenHistory}
                className="rounded-xl gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="max-w-[100px] truncate text-sm">
                      {user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem className="gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                onOpenGrounding();
                setMobileMenuOpen(false);
              }}
              className="justify-start rounded-xl gap-2"
            >
              <Leaf className="w-4 h-4" />
              Grounding Exercises
            </Button>
            
            {user && onOpenHistory && (
              <Button
                variant="ghost"
                onClick={() => {
                  onOpenHistory();
                  setMobileMenuOpen(false);
                }}
                className="justify-start rounded-xl gap-2"
              >
                <History className="w-4 h-4" />
                Chat History
              </Button>
            )}

            {user && (
              <>
                <div className="border-t my-2" />
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="justify-start rounded-xl gap-2 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
