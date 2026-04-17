import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return { mimeType: "image/png", data: dataUrl };
  return { mimeType: match[1], data: match[2] };
}

async function urlToInlineData(input: string): Promise<{ mimeType: string; data: string }> {
  if (input.startsWith("data:")) return parseDataUrl(input);
  const res = await fetch(input);
  if (!res.ok) throw new Error(`Failed to fetch image: ${input}`);
  const mimeType = res.headers.get("content-type") || "image/png";
  const buf = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  const data = btoa(binary);
  return { mimeType, data };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { personImageUrl, outfitImageUrl, outfitType, gender } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
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

    const [person, outfit] = await Promise.all([
      urlToInlineData(personImageUrl),
      urlToInlineData(outfitImageUrl),
    ]);

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
              { inline_data: { mime_type: person.mimeType, data: person.data } },
              { inline_data: { mime_type: outfit.mimeType, data: outfit.data } },
            ],
          },
        ],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
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
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];

    let generatedImage = "";
    for (const part of parts) {
      if (part.inline_data?.data) {
        const mt = part.inline_data.mime_type || "image/png";
        generatedImage = `data:${mt};base64,${part.inline_data.data}`;
      } else if (part.inlineData?.data) {
        const mt = part.inlineData.mimeType || "image/png";
        generatedImage = `data:${mt};base64,${part.inlineData.data}`;
      }
    }

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
