import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GROUNDING_EXERCISES, JOURNALING_PROMPTS, GroundingExercise } from '@/lib/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface GroundingExercisesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function GroundingExercises({ open, onOpenChange }: GroundingExercisesProps) {
  const [selectedExercise, setSelectedExercise] = useState<GroundingExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  
  // Breathing exercise state
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [breathingCycles, setBreathingCycles] = useState(0);
  
  const { user } = useAuth();

  const resetExercise = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setBreathingPhase('inhale');
    setBreathingTimer(4);
    setBreathingCycles(0);
  }, []);

  // Breathing exercise timer
  useEffect(() => {
    if (!isPlaying || selectedExercise?.type !== 'breathing') return;

    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setBreathingPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale':
                return 'hold';
              case 'hold':
                return 'exhale';
              case 'exhale':
                setBreathingCycles((c) => c + 1);
                return 'inhale';
              default:
                return 'inhale';
            }
          });
          // Reset timer for next phase
          switch (breathingPhase) {
            case 'inhale': return 7; // hold duration
            case 'hold': return 8; // exhale duration
            case 'exhale': return 4; // inhale duration
            default: return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedExercise, breathingPhase]);

  const logExercise = async (exerciseType: string) => {
    if (!user) return;
    try {
      await supabase.from('grounding_exercises').insert({
        user_id: user.id,
        exercise_type: exerciseType,
      });
    } catch (error) {
      console.error('Error logging exercise:', error);
    }
  };

  const handleStartExercise = (exercise: GroundingExercise) => {
    setSelectedExercise(exercise);
    resetExercise();
    logExercise(exercise.type);
  };

  const handleBack = () => {
    setSelectedExercise(null);
    resetExercise();
  };

  const fiveSteps = [
    { count: 5, sense: 'SEE', prompt: 'Look around and name 5 things you can see', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { count: 4, sense: 'HEAR', prompt: 'Listen carefully and identify 4 sounds', color: 'bg-green-100 dark:bg-green-900/30' },
    { count: 3, sense: 'FEEL', prompt: 'Notice 3 things you can physically feel', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { count: 2, sense: 'SMELL', prompt: 'Identify 2 things you can smell', color: 'bg-purple-100 dark:bg-purple-900/30' },
    { count: 1, sense: 'TASTE', prompt: 'Notice 1 thing you can taste', color: 'bg-pink-100 dark:bg-pink-900/30' },
  ];

  const renderExerciseContent = () => {
    if (!selectedExercise) return null;

    switch (selectedExercise.type) {
      case 'breathing':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-8">
            {/* Breathing circle */}
            <div className="relative">
              <div
                className={cn(
                  "w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000",
                  "bg-gradient-to-br from-primary/20 to-secondary/30",
                  isPlaying && breathingPhase === 'inhale' && "scale-125",
                  isPlaying && breathingPhase === 'hold' && "scale-125",
                  isPlaying && breathingPhase === 'exhale' && "scale-100"
                )}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{breathingTimer}</p>
                  <p className="text-lg font-medium text-foreground capitalize mt-1">
                    {breathingPhase}
                  </p>
                </div>
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-full animate-breathe-slow bg-primary/10" />
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {breathingPhase === 'inhale' && 'Breathe in slowly through your nose...'}
                {breathingPhase === 'hold' && 'Hold your breath gently...'}
                {breathingPhase === 'exhale' && 'Exhale slowly through your mouth...'}
              </p>
              <p className="text-xs text-muted-foreground">
                Cycles completed: {breathingCycles}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-xl"
              >
                {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isPlaying ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={resetExercise}
                className="rounded-xl"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        );

      case '5-4-3-2-1':
        return (
          <div className="py-6 space-y-6">
            <div className="flex gap-2 justify-center">
              {fiveSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            <div className={cn(
              "rounded-2xl p-8 text-center transition-all",
              fiveSteps[currentStep].color
            )}>
              <p className="text-6xl font-bold text-primary mb-4">
                {fiveSteps[currentStep].count}
              </p>
              <p className="text-xl font-semibold mb-2">
                {fiveSteps[currentStep].sense}
              </p>
              <p className="text-muted-foreground">
                {fiveSteps[currentStep].prompt}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={currentStep === 4}
                className="rounded-xl"
              >
                {currentStep === 4 ? 'Complete!' : 'Next'}
                {currentStep < 4 && <ChevronRight className="w-5 h-5 ml-1" />}
              </Button>
            </div>
          </div>
        );

      case 'journaling':
        return (
          <div className="py-6 space-y-6">
            <div className="bg-secondary/50 rounded-2xl p-8 text-center">
              <p className="text-lg font-medium text-foreground leading-relaxed">
                "{JOURNALING_PROMPTS[promptIndex]}"
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPromptIndex(Math.max(0, promptIndex - 1))}
                disabled={promptIndex === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setPromptIndex((promptIndex + 1) % JOURNALING_PROMPTS.length)}
                className="rounded-xl"
              >
                New Prompt
              </Button>
              <Button
                variant="outline"
                onClick={() => setPromptIndex(Math.min(JOURNALING_PROMPTS.length - 1, promptIndex + 1))}
                disabled={promptIndex === JOURNALING_PROMPTS.length - 1}
                className="rounded-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Take your time to reflect. There's no right or wrong answer. 💚
            </p>
          </div>
        );

      case 'body-scan':
        const bodyParts = [
          { name: 'Feet & Toes', instruction: 'Notice any sensations in your feet. Wiggle your toes gently.' },
          { name: 'Legs', instruction: 'Feel the weight of your legs. Release any tension.' },
          { name: 'Hips & Lower Back', instruction: 'Breathe into your lower back. Let it soften.' },
          { name: 'Stomach & Chest', instruction: 'Notice your breathing. Feel your chest rise and fall.' },
          { name: 'Shoulders & Arms', instruction: 'Drop your shoulders. Let your arms feel heavy.' },
          { name: 'Neck & Head', instruction: 'Relax your jaw. Soften your face.' },
        ];

        return (
          <div className="py-6 space-y-6">
            <div className="flex gap-1 justify-center">
              {bodyParts.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-8 rounded-full transition-all",
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl p-8 text-center">
              <p className="text-2xl font-semibold mb-3">
                {bodyParts[currentStep].name}
              </p>
              <p className="text-muted-foreground">
                {bodyParts[currentStep].instruction}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(bodyParts.length - 1, currentStep + 1))}
                disabled={currentStep === bodyParts.length - 1}
                className="rounded-xl"
              >
                {currentStep === bodyParts.length - 1 ? 'Complete!' : 'Next'}
                {currentStep < bodyParts.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedExercise ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xl">{selectedExercise.icon}</span>
                {selectedExercise.title}
              </>
            ) : (
              <>
                <span className="text-xl">🌿</span>
                Grounding Exercises
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {selectedExercise ? (
          renderExerciseContent()
        ) : (
          <div className="grid gap-3 py-4">
            {GROUNDING_EXERCISES.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleStartExercise(exercise)}
                className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-all text-left group shadow-soft hover:shadow-card"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {exercise.icon}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold">{exercise.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exercise.description}
                  </p>
                  {exercise.duration && (
                    <span className="text-xs text-primary mt-1 block">
                      {exercise.duration}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
