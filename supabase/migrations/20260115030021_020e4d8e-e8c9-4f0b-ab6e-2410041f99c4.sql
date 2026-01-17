-- Add UPDATE policy for chat_messages table (defense in depth)
CREATE POLICY "Users can update their own chat messages"
ON public.chat_messages
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);