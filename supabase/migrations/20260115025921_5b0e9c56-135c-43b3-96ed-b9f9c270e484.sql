-- Add UPDATE policy for mood_entries table
CREATE POLICY "Users can update their own mood entries"
ON public.mood_entries
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);