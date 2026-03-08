import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image, type } = await req.json();
    // type: "food" for food image recognition, "barcode" for barcode data
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "barcode") {
      systemPrompt = "You are a food nutrition expert. The user will provide a barcode number. Return a JSON object with the food's nutritional info. Always respond with ONLY valid JSON, no markdown.";
      userPrompt = `Look up barcode: ${image}. Return JSON: {"name": "Food Name", "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "serving": "serving size"}. If unknown, estimate based on similar products.`;
    } else {
      systemPrompt = "You are an AI food recognition expert. Analyze food descriptions or images and estimate nutritional content. Always respond with ONLY valid JSON, no markdown.";
      userPrompt = `Analyze this food: ${image}. Return JSON: {"name": "Food Name", "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "serving": "serving size", "confidence": number}. Confidence is 0-100.`;
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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Strip markdown code blocks if present
      const clean = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = { name: "Unknown Food", calories: 200, protein: 10, carbs: 25, fat: 8, fiber: 2, serving: "1 serving", confidence: 50 };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("food-recognition error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
