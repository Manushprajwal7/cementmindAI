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

    const projectId =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;
    const bq = new BigQuery({ projectId });
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
          projectId
        }
      }), 
      { status: 200 }
    );
  } catch (err: any) {
    console.error("BigQuery API error:", err);
    return new Response(
      JSON.stringify({ 
        error: err?.message || "Unknown error",
        timestamp: new Date().toISOString()
      }),
      { status: 500 }
    );
  }
}
