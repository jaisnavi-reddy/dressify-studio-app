import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Convert a data URL (data:image/png;base64,XXX) to {mimeType, data}
function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    return { mimeType: "image/png", data: dataUrl };
  }
  return { mimeType: match[1], data: match[2] };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sketchDataUrl, outfitType, gender, fabric, colors, patterns, selectedRegion } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    if (!sketchDataUrl) {
      throw new Error("No sketch provided");
    }

    const outfitLabel = outfitType || "outfit";
    const genderLabel = gender === "men" ? "men's" : "women's";
    const fabricLabel = fabric || "silk";

    const prompt = `You are given an image of a ${genderLabel} ${outfitLabel} garment.

YOUR TASK: Generate a photorealistic version of this EXACT SAME garment with the following modifications applied:

COLORS (MUST APPLY EXACTLY):
${colors || "Keep original colors"}

PATTERNS:
${patterns && patterns !== "none" ? patterns : "No pattern changes — keep fabric plain or as shown"}

FOCUSED REGION: ${selectedRegion || "entire garment"}
— Pay special attention to accurately rendering the ${selectedRegion || "entire"} region with the specified color.

CRITICAL RULES:
1. The generated garment MUST have the EXACT SAME shape, silhouette, and design as the input image.
2. DO NOT change the garment type — if it's a saree, generate a saree. If it's a shirt, generate a shirt.
3. Apply the specified colors PRECISELY to each region (body, sleeve, border).
4. Use realistic ${fabricLabel} fabric texture with natural folds, shadows, and draping.
5. Display on a clean white/light neutral background, flat-lay or mannequin style.
6. Make it look like a professional fashion catalog photograph.
7. The output should look like the SAME garment just with the new colors/patterns applied.`;

    const { mimeType, data: imageData } = parseDataUrl(sketchDataUrl);

    // Call Google Gemini directly using user's API key
    const model = "gemini-2.5-flash-image";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: imageData } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit hit on Google Gemini. Wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Gemini API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];

    let generatedImage = "";
    let textResponse = "";
    for (const part of parts) {
      if (part.inline_data?.data) {
        const mt = part.inline_data.mime_type || "image/png";
        generatedImage = `data:${mt};base64,${part.inline_data.data}`;
      } else if (part.inlineData?.data) {
        const mt = part.inlineData.mimeType || "image/png";
        generatedImage = `data:${mt};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!generatedImage) {
      console.error("No image in Gemini response:", JSON.stringify(data).slice(0, 500));
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
