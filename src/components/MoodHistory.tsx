import { useEffect, useState } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { TrendingUp, Calendar, Smile } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MoodType, MOOD_OPTIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MoodEntry {
  id: string;
  mood: MoodType;
  created_at: string;
  intensity: number;
}

export function MoodHistory() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchMoodHistory = async () => {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30);
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setMoodEntries(data || []);
      } catch (error) {
        console.error('Error fetching mood history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [user]);

  const getMoodEmoji = (mood: MoodType) => {
    return MOOD_OPTIONS.find((m) => m.type === mood)?.emoji || '😐';
  };

  const getMoodLabel = (mood: MoodType) => {
    return MOOD_OPTIONS.find((m) => m.type === mood)?.label || mood;
  };

  // Calculate mood distribution
  const moodDistribution = moodEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = moodEntries.length;
  const mostCommonMood = Object.entries(moodDistribution).sort((a, b) => b[1] - a[1])[0];

  // Get last 7 days for mini chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayEntries = moodEntries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startOfDay(date) && entryDate <= endOfDay(date);
    });
    return {
      date,
      entries: dayEntries,
    };
  });

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  if (moodEntries.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
        <Smile className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold mb-1">No mood history yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a chat to track your mood over time
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Mood Insights
        </h3>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-primary">{totalEntries}</p>
          <p className="text-xs text-muted-foreground">Total check-ins</p>
        </div>
        {mostCommonMood && (
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <p className="text-3xl">{getMoodEmoji(mostCommonMood[0] as MoodType)}</p>
            <p className="text-xs text-muted-foreground">Most common</p>
          </div>
        )}
      </div>

      {/* 7-Day Mini Chart */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Last 7 Days
        </h4>
        <div className="flex gap-2">
          {last7Days.map(({ date, entries }) => (
            <div key={date.toISOString()} className="flex-1 text-center">
              <div className="text-xs text-muted-foreground mb-2">
                {format(date, 'EEE')}
              </div>
              <div
                className={cn(
                  "h-12 rounded-lg flex items-center justify-center text-lg transition-all",
                  entries.length > 0
                    ? "bg-primary/10"
                    : "bg-muted/50"
                )}
              >
                {entries.length > 0 ? (
                  getMoodEmoji(entries[0].mood as MoodType)
                ) : (
                  <span className="text-muted-foreground text-xs">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <h4 className="text-sm font-medium mb-3">Recent Check-ins</h4>
        <div className="space-y-2">
          {moodEntries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-2xl">{getMoodEmoji(entry.mood as MoodType)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {getMoodLabel(entry.mood as MoodType)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
