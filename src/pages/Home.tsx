import { useState, useEffect } from 'react';
import { Heart, ArrowRight, Shield, Brain, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { MoodSelector } from '@/components/MoodSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { GroundingExercises } from '@/components/GroundingExercises';
import { MoodHistory } from '@/components/MoodHistory';
import { useAuth } from '@/hooks/useAuth';
import { MoodType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

type AppState = 'landing' | 'mood-select' | 'chatting';

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [groundingOpen, setGroundingOpen] = useState(false);

  // Handle user state changes
  useEffect(() => {
    if (!loading) {
      if (user && appState === 'landing') {
        setAppState('mood-select');
      } else if (!user && (appState === 'chatting' || appState === 'mood-select')) {
        setAppState('landing');
      }
    }
  }, [user, loading, appState]);

  const handleStartChat = async (mood: MoodType) => {
    if (!user) return;

    setSelectedMood(mood);

    try {
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Check-in`,
          mood: mood,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood: mood,
        intensity: 5,
      });

      setSessionId(session.id);
      setAppState('chatting');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleNewChat = () => {
    setSelectedMood(null);
    setSessionId(null);
    setAppState('mood-select');
  };

  if (loading) {
    return (
      <Layout hideFooter>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading your safe space...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Landing Page (not logged in)
  if (appState === 'landing' && !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Safe, private & compassionate
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Mental Wellness
              <span className="text-gradient block">Companion</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A safe space to express your feelings, access grounding exercises, 
              and receive compassionate support-anytime you need it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="rounded-xl h-14 px-8 text-lg shadow-soft hover:shadow-card transition-all"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setGroundingOpen(true)}
                className="rounded-xl h-14 px-8 text-lg"
              >
                Try Grounding Exercises
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto stagger-children">
            <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Empathetic AI Support</h3>
              <p className="text-muted-foreground text-sm">
                Chat with Serenity, an AI companion trained to listen without judgment and offer gentle guidance.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Grounding Exercises</h3>
              <p className="text-muted-foreground text-sm">
                Access breathing techniques, 5-4-3-2-1 grounding, and journaling prompts when you need calm.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mood Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Track your emotional journey over time and gain insights into your mental wellness patterns.
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Your conversations are encrypted and private
            </p>
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" /> End-to-end encrypted
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> No data selling
              </span>
            </div>
          </div>
        </div>

        <GroundingExercises open={groundingOpen} onOpenChange={setGroundingOpen} />
      </Layout>
    );
  }

  // Mood Selection (logged in)
  if (appState === 'mood-select' && user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                How are you feeling today?
              </h1>
              <p className="text-muted-foreground">
                Select your current mood to start a supportive conversation
              </p>
            </div>

            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={handleStartChat}
            />

            <div className="mt-12">
              <MoodHistory />
            </div>
          </div>
        </div>

        <GroundingExercises open={groundingOpen} onOpenChange={setGroundingOpen} />
      </Layout>
    );
  }

  // Chat Interface (logged in with active session)
  if (appState === 'chatting' && user && sessionId && selectedMood) {
    return (
      <Layout hideFooter>
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar with mood history (desktop) */}
          <aside className="hidden lg:block w-80 border-r bg-card/50 p-4 overflow-y-auto">
            <div className="mb-4">
              <Button
                onClick={handleNewChat}
                className="w-full rounded-xl"
                variant="outline"
              >
                + New Check-in
              </Button>
            </div>
            <MoodHistory />
          </aside>

          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatInterface
              sessionId={sessionId}
              userId={user.id}
              mood={selectedMood}
            />
          </div>
        </div>

        <GroundingExercises open={groundingOpen} onOpenChange={setGroundingOpen} />
      </Layout>
    );
  }

  return null;
}
