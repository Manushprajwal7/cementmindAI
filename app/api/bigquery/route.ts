import { NextRequest } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sql, params } = body || {};
    if (!sql) {
      return new Response(JSON.stringify({ error: "Missing sql" }), {
        status: 400,
      });
    }

    // Get project ID from environment variables
    const projectId =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;

    // Initialize BigQuery with credentials from environment variables
    let bqOptions: any = {
      projectId,
    };

    // Use service account credentials from environment variables
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (clientEmail && privateKey && projectId) {
      bqOptions.credentials = {
        client_email: clientEmail,
        private_key: privateKey,
      };
    }

    const bq = new BigQuery(bqOptions);
    const options: any = {
      query: sql,
      location: process.env.GOOGLE_CLOUD_REGION || "US",
    };
    if (params) options.params = params;

    // Track query execution time
    const startTime = Date.now();
    const [job] = await bq.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    const executionTime = Date.now() - startTime;

    // Return enhanced response with metadata
    return new Response(
      JSON.stringify({
        rows,
        metadata: {
          timestamp: new Date().toISOString(),
          rowCount: rows.length,
          executionTimeMs: executionTime,
          jobId: job.id,
          projectId,
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("BigQuery API error:", err);

    // Handle permission errors specifically
    if (err?.message?.includes("bigquery.jobs.create permission")) {
      return new Response(
        JSON.stringify({
          error:
            "BigQuery permission denied. Please check service account permissions.",
          code: "PERMISSION_DENIED",
          timestamp: new Date().toISOString(),
        }),
        { status: 403 }
      );
    }

    return new Response(
      JSON.stringify({
        error: err?.message || "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      { status: 500 }
    );
  }
}
