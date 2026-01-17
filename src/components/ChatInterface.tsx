import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertTriangle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage, MoodType, CRISIS_RESOURCES } from '@/lib/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  sessionId: string;
  userId: string;
  mood?: MoodType;
  initialMessages?: ChatMessage[];
}

export function ChatInterface({ sessionId, userId, mood, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message if no messages
  useEffect(() => {
    if (messages.length === 0 && mood) {
      const moodMessages: Record<MoodType, string> = {
        happy: "I'm so glad you're feeling happy! 😊 What's bringing you joy today? I'd love to hear about it.",
        sad: "I'm here with you. 💙 Feeling sad is okay-it's part of being human. Would you like to share what's on your mind?",
        anxious: "Take a deep breath with me. 🌬️ Anxiety can feel overwhelming, but you're not alone. What's worrying you right now?",
        angry: "I hear you. 💚 Anger often tells us something important. Would you like to talk about what's frustrating you?",
        lonely: "I'm here, and you matter. 🤗 Loneliness can be really hard. What's been going on for you lately?",
        overwhelmed: "Let's slow down together. 🌿 When everything feels like too much, it helps to talk it through. What's weighing on you most?",
        neutral: "Welcome! 🌱 I'm here to listen and support you. How can I help you today?",
        custom: "Thank you for sharing how you're feeling. 💚 I'm here to listen. What would you like to talk about?",
      };

      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: moodMessages[mood] || moodMessages.neutral,
        timestamp: new Date(),
      }]);
    }
  }, [mood, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'user',
        content: userMessage.content,
      });

      // Call AI endpoint
      const response = await supabase.functions.invoke('mental-health-chat', {
        body: {
          messages: messages.concat(userMessage).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mood,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { response: aiResponse, isCrisis } = response.data;

      if (isCrisis) {
        setShowCrisisAlert(true);
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        isCrisisDetected: isCrisis,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: aiResponse,
        is_crisis_detected: isCrisis,
      });
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Connection issue",
        description: "I'm having trouble connecting. Please try again. 💚",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Crisis Alert Banner */}
      {showCrisisAlert && (
        <div className="bg-accent border-b border-accent-foreground/20 p-4 animate-fade-in">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-accent-foreground mb-1">{CRISIS_RESOURCES.title}</h4>
              <p className="text-sm text-accent-foreground/80 mb-2">{CRISIS_RESOURCES.description}</p>
              <div className="flex flex-wrap gap-2">
                {CRISIS_RESOURCES.resources.slice(0, 3).map((resource) => (
                  <span key={resource.name} className="text-xs bg-background/50 px-2 py-1 rounded-lg">
                    {resource.name}: <strong>{resource.contact}</strong>
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setShowCrisisAlert(false)}
              className="text-accent-foreground/60 hover:text-accent-foreground"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex animate-fade-in-up",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-soft",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground rounded-bl-md",
                  message.isCrisisDetected && "ring-2 ring-accent"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3 text-primary" />
                    <span>Serenity</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-[10px] opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Serenity is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind... 💚"
                className="min-h-[52px] max-h-[200px] resize-none pr-12 rounded-xl border-muted focus:border-primary/50"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-[52px] w-[52px] rounded-xl bg-primary hover:bg-primary/90 shadow-soft"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Serenity provides emotional support only, not medical advice. In crisis? Call <strong>988</strong> (US)
          </p>
        </div>
      </div>
    </div>
  );
}
