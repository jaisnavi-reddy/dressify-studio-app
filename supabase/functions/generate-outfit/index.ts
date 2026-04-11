import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sketchDataUrl, outfitType, gender, fabric } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!sketchDataUrl) {
      throw new Error("No sketch provided");
    }

    const outfitLabel = outfitType || "outfit";
    const genderLabel = gender === "men" ? "men's" : "women's";
    const fabricLabel = fabric || "silk";

    const prompt = `Convert this exact fashion sketch into a photorealistic ${genderLabel} ${outfitLabel} made of ${fabricLabel} fabric.

CRITICAL RULES:
- Reproduce the EXACT same silhouette, shape, and design from the sketch. Do NOT add any extra design elements, patterns, or embellishments that are not in the sketch.
- If the sketch shows a plain garment, keep it plain. Only add details that are clearly drawn in the sketch.
- Apply realistic ${fabricLabel} fabric texture with natural folds, shadows, and lighting.
- Display the garment on a clean white/neutral background, flat-lay or mannequin style.
- Make it look like a professional fashion catalog photograph.
- Match the exact proportions and outline of the sketched garment.
- Do NOT add embroidery, borders, or decorations unless they are explicitly drawn in the sketch.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: { url: sketchDataUrl },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const generatedImage =
      data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content || "";

    if (!generatedImage) {
      throw new Error("No image was generated. Please try again.");
    }

    return new Response(
      JSON.stringify({ imageUrl: generatedImage, description: textResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-outfit error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Failed to generate outfit",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
