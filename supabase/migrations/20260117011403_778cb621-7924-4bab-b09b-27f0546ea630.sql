-- Create table for diary entries
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for diary settings (password hash)
CREATE TABLE public.diary_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for diary_entries
CREATE POLICY "Users can view their own diary entries" 
ON public.diary_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries" 
ON public.diary_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" 
ON public.diary_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" 
ON public.diary_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for diary_settings
CREATE POLICY "Users can view their own diary settings" 
ON public.diary_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary settings" 
ON public.diary_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary settings" 
ON public.diary_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_diary_entries_updated_at
BEFORE UPDATE ON public.diary_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diary_settings_updated_at
BEFORE UPDATE ON public.diary_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();