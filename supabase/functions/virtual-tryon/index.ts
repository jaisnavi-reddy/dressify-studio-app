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
    const { personImageUrl, outfitImageUrl, outfitType, gender } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!personImageUrl) throw new Error("No person photo provided");
    if (!outfitImageUrl) throw new Error("No outfit image provided");

    const genderLabel = gender === "men" ? "male" : "female";
    const outfitLabel = outfitType || "outfit";

    const prompt = `You are given two images. The first image is a photo of a ${genderLabel} person. The second image is a ${outfitLabel} garment.

Your task: Create a photorealistic image of the person wearing this exact outfit. 
- Preserve the person's face, body shape, skin tone, and pose exactly.
- Fit the outfit naturally on their body with proper proportions.
- Add realistic fabric draping, shadows, and lighting that match the person's environment.
- The result should look like a real photograph, not a collage or overlay.
- Keep the background from the person's original photo.`;

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
                { type: "image_url", image_url: { url: personImageUrl } },
                { type: "image_url", image_url: { url: outfitImageUrl } },
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
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      throw new Error("No try-on image was generated. Please try again.");
    }

    return new Response(
      JSON.stringify({ imageUrl: generatedImage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("virtual-tryon error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed to generate try-on" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
