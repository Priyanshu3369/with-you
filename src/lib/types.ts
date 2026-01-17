export type MoodType = 'happy' | 'sad' | 'anxious' | 'angry' | 'lonely' | 'overwhelmed' | 'neutral' | 'custom';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  description: string;
  gradient: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { 
    type: 'happy', 
    label: 'Happy', 
    emoji: '😊', 
    description: 'Feeling joyful and content',
    gradient: 'bg-mood-happy'
  },
  { 
    type: 'sad', 
    label: 'Sad', 
    emoji: '😢', 
    description: 'Feeling down or blue',
    gradient: 'bg-mood-sad'
  },
  { 
    type: 'anxious', 
    label: 'Anxious', 
    emoji: '😰', 
    description: 'Feeling worried or on edge',
    gradient: 'bg-mood-anxious'
  },
  { 
    type: 'angry', 
    label: 'Angry', 
    emoji: '😤', 
    description: 'Feeling frustrated or upset',
    gradient: 'bg-mood-angry'
  },
  { 
    type: 'lonely', 
    label: 'Lonely', 
    emoji: '🥺', 
    description: 'Feeling isolated or alone',
    gradient: 'bg-mood-lonely'
  },
  { 
    type: 'overwhelmed', 
    label: 'Overwhelmed', 
    emoji: '😵', 
    description: 'Feeling too much at once',
    gradient: 'bg-mood-overwhelmed'
  },
  { 
    type: 'neutral', 
    label: 'Neutral', 
    emoji: '😐', 
    description: 'Feeling okay, just checking in',
    gradient: 'bg-mood-neutral'
  },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCrisisDetected?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  mood?: MoodType;
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  customMood?: string;
  intensity: number;
  notes?: string;
  createdAt: Date;
}

export interface GroundingExercise {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | '5-4-3-2-1' | 'journaling' | 'body-scan';
  duration?: string;
  icon: string;
}

export const GROUNDING_EXERCISES: GroundingExercise[] = [
  {
    id: 'breathing-478',
    title: '4-7-8 Breathing',
    description: 'Breathe in for 4 seconds, hold for 7, exhale for 8. This activates your parasympathetic nervous system.',
    type: 'breathing',
    duration: '2-3 minutes',
    icon: '🌬️',
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding',
    description: 'Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste. Anchors you to the present.',
    type: '5-4-3-2-1',
    duration: '3-5 minutes',
    icon: '🌿',
  },
  {
    id: 'journaling-prompt',
    title: 'Journaling Prompts',
    description: 'Guided prompts to explore and process your feelings through writing.',
    type: 'journaling',
    duration: '5-10 minutes',
    icon: '📝',
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    description: 'Slowly focus attention on each part of your body, releasing tension as you go.',
    type: 'body-scan',
    duration: '5-10 minutes',
    icon: '🧘',
  },
];

export const JOURNALING_PROMPTS = [
  "What am I feeling right now, and where do I feel it in my body?",
  "What would I tell a friend who was feeling this way?",
  "What's one small thing I can do to take care of myself today?",
  "What am I grateful for in this moment?",
  "What do I need to let go of today?",
  "What made me smile recently, even just a little?",
  "If my emotions could speak, what would they say?",
  "What boundaries do I need to set for my wellbeing?",
];

export const CRISIS_RESOURCES = {
  title: "You're Not Alone",
  description: "If you're in crisis, please reach out to professional support:",
  resources: [
    { name: "National Suicide Prevention Lifeline", contact: "988", country: "US" },
    { name: "Crisis Text Line", contact: "Text HOME to 741741", country: "US" },
    { name: "Samaritans", contact: "116 123", country: "UK" },
    { name: "Lifeline", contact: "13 11 14", country: "Australia" },
    { name: "International Association for Suicide Prevention", contact: "https://www.iasp.info/resources/Crisis_Centres/", country: "International" },
  ],
};
