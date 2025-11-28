// Test BigQuery connection
const { BigQuery } = require("@google-cloud/bigquery");
require("dotenv").config();

// BigQuery configuration
const projectId =
  process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;

// Initialize BigQuery with credentials from environment variables
let bqOptions = {
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
  console.log("Using service account credentials");
} else {
  console.log(
    "Using default credentials (gcloud auth application-default login)"
  );
}

console.log("Testing BigQuery connection...");
console.log("Project ID:", projectId);
console.log("Environment variables status:");
console.log(
  "  GOOGLE_CLOUD_PROJECT:",
  process.env.GOOGLE_CLOUD_PROJECT ? "✓ Set" : "✗ Not set"
);
console.log(
  "  GCP_PROJECT_ID:",
  process.env.GCP_PROJECT_ID ? "✓ Set" : "✗ Not set"
);
console.log("  FIREBASE_CLIENT_EMAIL:", clientEmail ? "✓ Set" : "✗ Not set");
console.log("  FIREBASE_PRIVATE_KEY:", privateKey ? "✓ Set" : "✗ Not set");

async function testBigQuery() {
  try {
    const bq = new BigQuery(bqOptions);

    // Test with a simple query
    const query = "SELECT 1 as test";
    const options = {
      query: query,
      location: process.env.GOOGLE_CLOUD_REGION || "US",
    };

    console.log("Running test query...");
    const [job] = await bq.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    console.log("BigQuery connection successful!");
    console.log("Test query result:", rows);
    console.log("Job ID:", job.id);

    process.exit(0);
  } catch (error) {
    console.error("BigQuery connection failed:", error.message);

    if (error.message.includes("bigquery.jobs.create permission")) {
      console.error(
        "\nPermission error detected. Please ensure your service account has the following roles:"
      );
      console.error("  - roles/bigquery.dataViewer");
      console.error("  - roles/bigquery.jobUser");
      console.error("  - roles/bigquery.user");
    }

    process.exit(1);
  }
}

testBigQuery();
