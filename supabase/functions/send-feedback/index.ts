import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rating, feedback } = await req.json();

    // Use Supabase's built-in SMTP or a simple fetch to a mail API
    // For now, store feedback in a log and send via Resend if available
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Strivo Feedback <onboarding@resend.dev>",
          to: ["chandufuturestarc123@gmail.com"],
          subject: `Strivo Feedback - ${rating}/5 Stars`,
          html: `<h2>New Feedback Received</h2><p><strong>Rating:</strong> ${rating}/5 ⭐</p><p><strong>Feedback:</strong></p><p>${feedback || "No additional comments"}</p><p><em>Sent from Strivo App</em></p>`,
        }),
      });
    }

    // Always log feedback
    console.log(`FEEDBACK RECEIVED: Rating=${rating}/5, Message="${feedback}"`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
