import { useState } from 'react';
import { Mail, MessageSquare, Send, Phone, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().trim().min(1, 'Message is required').max(2000, 'Message is too long'),
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = contactSchema.parse(formData);
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Message sent!',
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Have questions, feedback, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-soft">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="mt-1.5 rounded-xl"
                  maxLength={100}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="mt-1.5 rounded-xl"
                  maxLength={255}
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="mt-1.5 rounded-xl"
                  maxLength={200}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more..."
                  className="mt-1.5 rounded-xl min-h-[120px]"
                  maxLength={2000}
                />
              </div>
              
              <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                {loading ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground text-sm">support@Saathi.app</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground text-sm">San Francisco, CA</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Crisis Support</h3>
              <p className="text-muted-foreground text-sm mb-3">
                If you're in crisis, please reach out to professional help:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• National Suicide Prevention Lifeline: 988</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
