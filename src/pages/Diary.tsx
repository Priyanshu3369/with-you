import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, Plus, Edit2, Trash2, Save, X, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DiaryEntry {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface DiarySettings {
  id: string;
  password_hash: string;
  is_locked: boolean;
}

// Simple hash function for client-side password comparison
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function Diary() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [diarySettings, setDiarySettings] = useState<DiarySettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Entry editing state
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Check auth and load settings
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadDiarySettings();
    }
  }, [user, authLoading, navigate]);

  const loadDiarySettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('diary_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDiarySettings(data);
        setHasPassword(true);
        setPasswordDialogOpen(true);
      } else {
        setHasPassword(false);
        setSetupDialogOpen(true);
      }
    } catch (error) {
      console.error('Error loading diary settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load diary entries',
        variant: 'destructive',
      });
    }
  };

  const handleSetupPassword = async () => {
    if (newPassword.length < 4) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 4 characters',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    try {
      const hashedPassword = await hashPassword(newPassword);
      
      const { error } = await supabase
        .from('diary_settings')
        .insert({
          user_id: user!.id,
          password_hash: hashedPassword,
          is_locked: false,
        });

      if (error) throw error;

      setHasPassword(true);
      setIsUnlocked(true);
      setSetupDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      loadEntries();
      
      toast({
        title: 'Diary created!',
        description: 'Your private diary is now ready to use',
      });
    } catch (error) {
      console.error('Error setting up diary:', error);
      toast({
        title: 'Error',
        description: 'Failed to create diary',
        variant: 'destructive',
      });
    }
  };

  const handleUnlock = async () => {
    if (!diarySettings) return;

    try {
      const hashedPassword = await hashPassword(password);
      
      if (hashedPassword === diarySettings.password_hash) {
        setIsUnlocked(true);
        setPasswordDialogOpen(false);
        setPassword('');
        loadEntries();
        
        toast({
          title: 'Diary unlocked',
          description: 'Welcome back to your diary',
        });
      } else {
        toast({
          title: 'Incorrect password',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error unlocking diary:', error);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setEntries([]);
    setPasswordDialogOpen(true);
  };

  const handleSaveEntry = async () => {
    if (!entryContent.trim()) {
      toast({
        title: 'Content required',
        description: 'Please write something in your diary entry',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('diary_entries')
          .update({
            title: entryTitle.trim() || null,
            content: entryContent.trim(),
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        
        toast({ title: 'Entry updated' });
      } else {
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            user_id: user!.id,
            title: entryTitle.trim() || null,
            content: entryContent.trim(),
          });

        if (error) throw error;
        
        toast({ title: 'Entry saved' });
      }

      setNewEntryOpen(false);
      setEditingEntry(null);
      setEntryTitle('');
      setEntryContent('');
      loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save entry',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!deleteEntryId) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', deleteEntryId);

      if (error) throw error;
      
      toast({ title: 'Entry deleted' });
      setDeleteEntryId(null);
      loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
    }
  };

  const openEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setEntryTitle(entry.title || '');
    setEntryContent(entry.content);
    setNewEntryOpen(true);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading your diary...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">My Diary</h1>
              </div>
              <p className="text-muted-foreground">
                {isUnlocked 
                  ? 'Your private space to write about your daily life'
                  : 'Enter your password to access your diary'}
              </p>
            </div>

            {isUnlocked && (
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setEditingEntry(null);
                    setEntryTitle('');
                    setEntryContent('');
                    setNewEntryOpen(true);
                  }}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </Button>
                <Button
                  onClick={handleLock}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Lock Diary
                </Button>
              </div>
            )}
          </div>

          {/* Entries List */}
          {isUnlocked && (
            <div className="space-y-4 animate-fade-in-up">
              {entries.length === 0 ? (
                <Card className="rounded-2xl shadow-soft">
                  <CardContent className="py-16 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No entries yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start writing about your day, thoughts, or feelings
                    </p>
                    <Button
                      onClick={() => {
                        setEditingEntry(null);
                        setEntryTitle('');
                        setEntryContent('');
                        setNewEntryOpen(true);
                      }}
                      className="rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Write Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                entries.map((entry) => (
                  <Card key={entry.id} className="rounded-2xl shadow-soft hover:shadow-card transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {entry.title || 'Untitled Entry'}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(entry.created_at), 'MMMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            onClick={() => openEditEntry(entry)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-destructive hover:text-destructive"
                            onClick={() => setDeleteEntryId(entry.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4">
                        {entry.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Password Entry Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Diary Locked
            </DialogTitle>
            <DialogDescription>
              Enter your diary password to access your private entries
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="diary-password">Password</Label>
              <Input
                id="diary-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your diary password"
                className="mt-1.5 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
            </div>
            <Button onClick={handleUnlock} className="w-full rounded-xl">
              <Unlock className="w-4 h-4 mr-2" />
              Unlock Diary
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Setup Password Dialog */}
      <Dialog open={setupDialogOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Create Your Diary
            </DialogTitle>
            <DialogDescription>
              Set up a password to protect your private diary entries
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a password (min 4 characters)"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="mt-1.5 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && handleSetupPassword()}
              />
            </div>
            <Button onClick={handleSetupPassword} className="w-full rounded-xl">
              <Lock className="w-4 h-4 mr-2" />
              Create Diary
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New/Edit Entry Dialog */}
      <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Entry' : 'New Diary Entry'}
            </DialogTitle>
            <DialogDescription>
              {format(new Date(), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="entry-title">Title (optional)</Label>
              <Input
                id="entry-title"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="mt-1.5 rounded-xl"
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="entry-content">What's on your mind?</Label>
              <Textarea
                id="entry-content"
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                placeholder="Write about your day, thoughts, feelings..."
                className="mt-1.5 rounded-xl min-h-[200px]"
                maxLength={10000}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setNewEntryOpen(false)}
                className="rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveEntry}
                disabled={saving}
                className="rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteEntryId} onOpenChange={() => setDeleteEntryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your diary entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntry}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
