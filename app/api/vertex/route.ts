import { NextRequest } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      model = "text-bison@002",
      parameters = {
        temperature: 0.2,
        maxOutputTokens: 1024,
        topP: 0.8,
        topK: 40,
      },
    } = body || {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
      });
    }

    // Get project and location from environment variables
    const project =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || "us-central1";

    if (!project) {
      return new Response(
        JSON.stringify({
          error:
            "Missing project configuration. Please set GOOGLE_CLOUD_PROJECT environment variable.",
        }),
        { status: 500 }
      );
    }

    // Initialize Vertex AI
    const vertexAI = new VertexAI({ project, location });

    // Get the text model
    const textModel = vertexAI.preview.getGenerativeModel({
      model,
      generationConfig: parameters,
    });

    // Generate text
    const result = await textModel.generateContent(prompt);

    return new Response(
      JSON.stringify({
        result: result.response,
        metadata: {
          timestamp: new Date().toISOString(),
          model,
          project,
          location,
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Vertex AI API error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Failed to process request with Vertex AI",
        timestamp: new Date().toISOString(),
      }),
      { status: 500 }
    );
  }
}
