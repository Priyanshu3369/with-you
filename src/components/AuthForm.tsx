import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpData = z.infer<typeof signUpSchema>;
type SignInData = z.infer<typeof signInSchema>;

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', displayName: '' },
  });

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.displayName);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome! 💚',
        description: 'Your account has been created successfully.',
      });
      onSuccess?.();
    }
  };

  const handleSignIn = async (data: SignInData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back! 💚',
        description: 'Good to see you again.',
      });
      onSuccess?.();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">
          {mode === 'signin' ? 'Welcome Back' : 'Create Your Safe Space'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {mode === 'signin'
            ? 'Sign in to continue your journey'
            : 'Join us for compassionate support'}
        </p>
      </div>

      {mode === 'signup' ? (
        <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Name (optional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="displayName"
                placeholder="How should we call you?"
                className="pl-10 rounded-xl"
                {...signUpForm.register('displayName')}
              />
            </div>
            {signUpForm.formState.errors.displayName && (
              <p className="text-sm text-destructive">
                {signUpForm.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 rounded-xl"
                {...signUpForm.register('email')}
              />
            </div>
            {signUpForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {signUpForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 rounded-xl"
                {...signUpForm.register('password')}
              />
            </div>
            {signUpForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {signUpForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Create Account
          </Button>
        </form>
      ) : (
        <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 rounded-xl"
                {...signInForm.register('email')}
              />
            </div>
            {signInForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {signInForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                className="pl-10 rounded-xl"
                {...signInForm.register('password')}
              />
            </div>
            {signInForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {signInForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Sign In
          </Button>
        </form>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm text-primary hover:underline"
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>

      <p className="mt-8 text-xs text-center text-muted-foreground">
        Your data is encrypted and private. We never share your conversations.
      </p>
    </div>
  );
}
