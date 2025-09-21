import { NextRequest } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

// Function to handle API key-based requests
async function handleApiKeyRequest(
  prompt: string,
  system: string | undefined,
  model: string,
  apiKey: string
) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            ...(system
              ? [{ role: "user", parts: [{ text: `${system}\n\n${prompt}` }] }]
              : []),
            ...(system ? [] : [{ role: "user", parts: [{ text: prompt }] }]),
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return new Response(
      JSON.stringify({ error: `API Key request failed: ${error.message}` }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, system, model = "gemini-1.5-flash-002" } = body || {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
      });
    }

    // Check if using API key approach
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      return await handleApiKeyRequest(prompt, system, model, apiKey);
    }

    // Fallback to Vertex AI approach
    const project =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || "us-central1";

    if (!project) {
      return new Response(
        JSON.stringify({
          error:
            "Missing configuration. Please set either GEMINI_API_KEY or GOOGLE_CLOUD_PROJECT environment variables.",
        }),
        { status: 500 }
      );
    }

    const vertex = new VertexAI({ project, location });
    const generativeModel = vertex.getGenerativeModel({ model });

    const request = {
      contents: [
        ...(system ? [{ role: "system", parts: [{ text: system }] }] : []),
        { role: "user", parts: [{ text: prompt }] },
      ],
    };

    const result = await generativeModel.generateContent(request as any);
    const text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500 }
    );
  }
}

