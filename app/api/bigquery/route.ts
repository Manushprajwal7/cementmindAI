import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Return a graceful error response indicating BigQuery is not available
  return new Response(
    JSON.stringify({
      error:
        "BigQuery service is temporarily unavailable due to permission issues",
      code: "SERVICE_UNAVAILABLE",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 503,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// Keep the file as a valid module by exporting something
export async function GET() {
  return new Response(
    JSON.stringify({
      message: "BigQuery API endpoint",
      status: "disabled",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
