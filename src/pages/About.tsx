import { Heart, Shield, Brain, Sparkles, Users, Lock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Support',
    description: 'Our compassionate AI companion is trained to listen without judgment and offer gentle guidance when you need it most.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your conversations and diary entries are encrypted and private. We never sell your data or share it with third parties.',
  },
  {
    icon: Sparkles,
    title: 'Grounding Exercises',
    description: 'Access breathing techniques, 5-4-3-2-1 grounding, and journaling prompts to help you find calm in difficult moments.',
  },
  {
    icon: Lock,
    title: 'Protected Diary',
    description: 'Keep a personal diary with an extra layer of password protection for your most private thoughts.',
  },
];

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            About Serenity
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Mental Wellness
            <span className="text-gradient block">Companion</span>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Serenity was created with one mission: to provide a safe, accessible space 
            for everyone to express their feelings and find support during challenging moments.
          </p>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We believe everyone deserves access to mental health support. Serenity combines 
              the power of AI with evidence-based techniques to provide compassionate, 
              judgment-free support whenever you need it. Whether you're feeling anxious, 
              overwhelmed, or just need someone to listen, Serenity is here for you.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="bg-secondary/50 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Serenity is not a substitute for professional mental health care. 
              If you're experiencing a crisis, please reach out to a mental health professional 
              or call your local emergency services.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
