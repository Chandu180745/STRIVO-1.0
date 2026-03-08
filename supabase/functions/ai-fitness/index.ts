import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";

    if (type === "chatbot") {
      systemPrompt = `You are STRIVO AI, a comprehensive fitness and nutrition expert. You provide actionable advice about:
- Workout routines, exercise form, and training programs
- Nutrition, meal planning, and diet optimization
- Supplement recommendations with prices in ₹
- Weight loss, bulking, cutting, and body recomposition
- Recovery, injury prevention, and muscle imbalance detection
- Sleep optimization and stress management
- AI-powered workout suggestions based on user goals

Keep responses under 200 words. Be motivational and direct. Use bullet points for lists. Use ₹ for prices.
When asked about injury prevention, analyze training patterns and warn about overtraining.
When asked about meal plans, generate specific meals with macros.
When asked about workouts, suggest specific exercises with sets/reps.`;
    } else if (type === "recommendation") {
      systemPrompt = `You are a fitness product recommendation engine. Based on the user's goal and context, suggest 3-4 specific products from this catalog:

SUPPLEMENTS: Whey Isolate (₹2999), Casein Protein (₹3299), Plant Protein (₹2799), Mass Gainer (₹3999), Creatine (₹1499), BCAA (₹1799), Pre-Workout (₹1999), Omega-3 (₹899), Multivitamin (₹699), ZMA (₹1199)
EQUIPMENT: Dumbbells (₹4999), Resistance Bands (₹1299), Yoga Mat (₹999), Kettlebell (₹3499), Foam Roller (₹899), Bench (₹8999)
DIET: Oats (₹349), Chicken Meal Prep (₹599), Quinoa Bowl (₹499), Greek Yogurt (₹329), Green Smoothie (₹279), Energy Balls (₹399)

Return JSON format: {"recommendations": [{"name": "Product Name", "id": "product-id", "reason": "Why this product"}], "alsoBought": [{"name": "Product Name", "id": "product-id"}]}

Context: ${context || "general fitness"}`;
    } else if (type === "meal-generator") {
      systemPrompt = `You are STRIVO AI Meal Generator. Generate a complete daily meal plan.
Based on the user's calorie target and dietary preference, create 4 meals (breakfast, lunch, dinner, snack).
For each meal provide: name, calories, protein (g), carbs (g), fat (g), and a brief ingredient list.
Format as JSON: {"meals": [{"category": "breakfast", "name": "...", "calories": N, "protein": N, "carbs": N, "fat": N, "ingredients": "..."}]}
Be specific with portions. Use common foods. Match the calorie target closely.`;
    } else if (type === "injury-prevention") {
      systemPrompt = `You are STRIVO AI Injury Prevention Advisor. Analyze the user's training data and warn about:
- Overtraining risks (too much volume, insufficient rest)
- Muscle imbalances (e.g., too much push, not enough pull)
- Form issues based on exercise selection
- Recovery recommendations

Given the training context, provide:
1. Risk level (LOW/MEDIUM/HIGH)
2. Specific warnings
3. Actionable recommendations
Keep it concise and actionable. Format clearly with headers.`;
    } else if (type === "workout-demo") {
      systemPrompt = `You are a fitness exercise instruction expert. For the given exercise, provide a brief, vivid description of the movement in 2-3 sentences that could be used to generate an animated demonstration. Describe the starting position, the movement, and the ending position. Be specific about body positioning.`;
    } else if (type === "workout-plan") {
      systemPrompt = `You are STRIVO AI Workout Plan Generator. Create a personalized weekly workout plan.
Based on the user's goal, experience level, available equipment, and schedule, generate a 7-day plan.
Format as JSON: {"plan": [{"day": "Monday", "focus": "Chest & Triceps", "exercises": [{"name": "...", "sets": N, "reps": "...", "rest": "60s"}], "duration": "45 min"}]}
Include warm-up and cool-down notes. Be specific with exercises.`;
    } else if (type === "diet-plan") {
      systemPrompt = `You are STRIVO AI Diet Plan Generator. Create a comprehensive weekly diet plan.
Based on the user's goal, weight, activity level, and dietary preferences, generate a full 7-day eating plan.
Format as JSON: {"dietPlan": [{"day": "Monday", "totalCalories": N, "meals": [{"time": "8:00 AM", "name": "...", "calories": N, "protein": N, "carbs": N, "fat": N, "items": "..."}]}], "dailyTargets": {"calories": N, "protein": N, "carbs": N, "fat": N}}
Be practical with food choices.`;
    } else if (type === "body-transformation") {
      systemPrompt = `You are STRIVO AI Body Transformation Coach. Create a 12-week transformation roadmap.
Based on the user's current stats and goal, provide a phased plan with milestones.
Format as JSON: {"phases": [{"weeks": "1-4", "title": "...", "focus": "...", "training": "...", "nutrition": "...", "expectedProgress": "..."}], "milestones": [{"week": N, "goal": "..."}], "tips": ["..."]}
Be realistic and motivational.`;
    } else if (type === "macro-calculator") {
      systemPrompt = `You are STRIVO AI Macro Calculator. Calculate precise macronutrient targets.
Based on the user's weight, height, age, activity level, and goal, calculate:
Format as JSON: {"tdee": N, "target_calories": N, "macros": {"protein": {"grams": N, "percentage": N}, "carbs": {"grams": N, "percentage": N}, "fat": {"grams": N, "percentage": N}}, "mealDistribution": [{"meal": "Breakfast", "calories": N, "protein": N, "carbs": N, "fat": N}], "explanation": "..."}
Use Mifflin-St Jeor equation. Be precise.`;
    } else if (type === "voice-trainer") {
      systemPrompt = `You are STRIVO AI Voice Trainer. You provide motivational real-time coaching instructions.
Respond with short, punchy coaching cues as if you're a personal trainer standing next to the user.
Keep responses under 50 words. Be energetic, direct, and motivating. Use action words.
Example: "PUSH IT! Keep that core tight, drive through the heels! You've got 3 more reps, don't quit now!"`;
    } else if (type === "motivation") {
      systemPrompt = `You are STRIVO AI Emotional Support Coach. You provide motivational support for fitness journeys.
The user may be feeling unmotivated, tired, or discouraged. Your job is to:
- Acknowledge their feelings
- Provide perspective and encouragement
- Share relevant motivational insights
- Suggest small actionable steps
Keep it warm, genuine, and under 150 words. Don't be cheesy. Be real.`;
    } else if (type === "bulk-cut") {
      systemPrompt = `You are STRIVO AI Bulk/Cut Strategy Simulator. Analyze the user's current stats and goal to recommend whether to bulk or cut.
Format as JSON: {"recommendation": "BULK" or "CUT" or "RECOMP", "reasoning": "...", "duration": "X weeks", "calorieAdjustment": "+/-N calories", "expectedResults": {"weight": "+/-N kg", "bodyFat": "+/-N%", "muscle": "+/-N kg"}, "strategy": {"phase1": "...", "phase2": "..."}, "warnings": ["..."]}
Be data-driven and realistic.`;
    } else if (type === "calorie-prediction") {
      systemPrompt = `You are STRIVO AI Calorie Predictor. When a user describes a food item or meal, predict its nutritional content.
Format as JSON: {"food": "...", "serving": "...", "calories": N, "protein": N, "carbs": N, "fat": N, "fiber": N, "sugar": N, "verdict": "GOOD" or "OKAY" or "LIMIT", "explanation": "...", "healthierAlternative": "...", "impactOnGoal": "..."}
Be accurate with common foods. Consider typical serving sizes.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        stream: type === "chatbot",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "chatbot") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-fitness error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
