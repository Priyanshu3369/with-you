import { MOOD_OPTIONS, MoodType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
  compact?: boolean;
}

export function MoodSelector({ selectedMood, onSelectMood, compact = false }: MoodSelectorProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.type}
            onClick={() => onSelectMood(mood.type)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              "hover:scale-105 active:scale-95",
              selectedMood === mood.type
                ? `${mood.gradient} shadow-soft ring-2 ring-primary/20`
                : "bg-muted hover:bg-muted/80"
            )}
          >
            <span className="text-lg">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
      {MOOD_OPTIONS.map((mood) => (
        <button
          key={mood.type}
          onClick={() => onSelectMood(mood.type)}
          className={cn(
            "group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300",
            "hover:scale-105 hover:shadow-elevated active:scale-100",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
            selectedMood === mood.type
              ? `${mood.gradient} shadow-card ring-2 ring-primary/30 animate-gentle-pulse`
              : `bg-card shadow-soft hover:shadow-card`
          )}
        >
          <span className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">
            {mood.emoji}
          </span>
          <span className="font-semibold text-foreground mb-1">{mood.label}</span>
          <span className="text-xs text-muted-foreground text-center leading-tight">
            {mood.description}
          </span>
        </button>
      ))}
    </div>
  );
}
