-- Create enum for mood types
CREATE TYPE public.mood_type AS ENUM ('happy', 'sad', 'anxious', 'angry', 'lonely', 'overwhelmed', 'neutral', 'custom');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create mood_entries table for mood tracking
CREATE TABLE public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood mood_type NOT NULL,
  custom_mood TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10) DEFAULT 5,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Chat',
  mood mood_type,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  is_crisis_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create grounding_exercises table for logging usage
CREATE TABLE public.grounding_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_type TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grounding_exercises ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can view their own mood entries"
ON public.mood_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
ON public.mood_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
ON public.mood_entries FOR DELETE
USING (auth.uid() = user_id);

-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions"
ON public.chat_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions"
ON public.chat_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
ON public.chat_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
ON public.chat_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages"
ON public.chat_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
ON public.chat_messages FOR DELETE
USING (auth.uid() = user_id);

-- Grounding exercises policies
CREATE POLICY "Users can view their own grounding exercises"
ON public.grounding_exercises FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grounding exercises"
ON public.grounding_exercises FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON public.mood_entries(created_at DESC);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);