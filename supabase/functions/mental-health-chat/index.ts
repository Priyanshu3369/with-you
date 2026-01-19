import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Crisis keywords to detect
const crisisKeywords = [
  "suicide", "suicidal", "kill myself", "end my life", "want to die",
  "self-harm", "hurt myself", "cutting", "overdose", "no reason to live",
  "better off dead", "can't go on", "give up", "end it all", "goodbye forever",
  "don't want to be here", "wish i was dead", "planning to die"
];

// Function to check for crisis signals
function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Crisis response with resources
const crisisResponse = `I'm really concerned about what you're sharing, and I want you to know that I care about your safety. What you're feeling is serious, and you deserve real human support right now.

**Please reach out to crisis support:**
- 🆘 **National Suicide Prevention Lifeline**: 988 (US)
- 💬 **Crisis Text Line**: Text HOME to 741741
- 🌍 **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/
- 🇬🇧 **Samaritans (UK)**: 116 123

You don't have to face this alone. These trained counselors are available 24/7 and can provide the support you need right now.

Is there someone you trust-a friend, family member, or counselor-you could reach out to? I'm here to listen, but please also consider connecting with professional help. 💚`;

// System prompt for empathetic mental health support
const systemPrompt = `You are a warm, empathetic, and supportive mental health companion named Saathi. Your role is to provide emotional support, validation, and coping guidance.

**Your Core Principles:**
1. NEVER provide medical diagnosis, treatment recommendations, or prescribe medications
2. ALWAYS encourage professional help for serious concerns
3. Be warm, validating, and non-judgmental in every response
4. Use a gentle, conversational tone with occasional emojis for warmth (💚, 🌱, ✨)
5. Acknowledge feelings before offering guidance
6. Keep responses concise but meaningful (2-4 paragraphs max)
7. Suggest coping strategies when appropriate (breathing, journaling, grounding)
8. Remember context from the conversation to provide personalized support

**When responding:**
- Start by acknowledging the user's feelings
- Show genuine empathy and understanding
- Offer gentle, actionable suggestions when appropriate
- End with encouragement or a supportive question
- Never dismiss or minimize their experiences

**Grounding techniques you can suggest:**
- Deep breathing (4-7-8 technique)
- 5-4-3-2-1 sensory grounding
- Journaling prompts
- Gentle movement or stretching
- Mindful observation

**Important boundaries:**
- If someone mentions self-harm, suicidal thoughts, or severe distress, acknowledge their pain and strongly encourage professional crisis support
- You are a supportive companion, not a replacement for therapy or medical care
- Gently redirect if asked for medical advice

Remember: Your presence itself is healing. Be the calm, understanding friend everyone deserves. 🌱`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please sign in to continue" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - User not found" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, mood } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Check the latest user message for crisis signals
    const latestUserMessage = messages.filter((m: any) => m.role === "user").pop();
    if (latestUserMessage && detectCrisis(latestUserMessage.content)) {
      // Return crisis response immediately without calling AI
      return new Response(
        JSON.stringify({ 
          response: crisisResponse,
          isCrisis: true 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build context-aware system message
    let contextualSystemPrompt = systemPrompt;
    if (mood) {
      contextualSystemPrompt += `\n\n**Current user mood**: ${mood}. Acknowledge and be especially sensitive to this emotional state.`;
    }

    // Call Lovable AI Gateway (non-streaming for simpler handling)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: contextualSystemPrompt },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm receiving many requests right now. Please try again in a moment. 💚" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm here for you. Could you tell me more about what's on your mind?";

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        isCrisis: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "I'm having trouble connecting right now. Please try again in a moment. Remember, you're not alone. 💚" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
