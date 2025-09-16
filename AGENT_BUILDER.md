Agent Builder integration (Vertex AI)

Overview

- Create an agent in Vertex AI Agent Builder to answer operations questions, run tools, and fetch data.
- Use Webhooks/Tools to call your Next.js APIs: `/api/gemini`, `/api/vision`, `/api/bigquery`.

Steps

1. In Google Cloud Console, enable Vertex AI, Agent Builder, Vision API, BigQuery, and set up a service account with permissions.
2. Create an Agent in Agent Builder. Define intents such as "analyze image", "run sql", "ask gemini".
3. Add Tools (webhooks):
   - geminiTool -> POST to `https://YOUR_HOST/api/gemini` body: { prompt, system? }
   - visionTool -> POST to `https://YOUR_HOST/api/vision` body: { imageBase64, features? }
   - bigQueryTool -> POST to `https://YOUR_HOST/api/bigquery` body: { sql, params? }
4. Configure authentication: Use a service account and secure your endpoints (e.g., API key header or Google IAP if deployed on Cloud Run).
5. Test agent by prompting: "Summarize kiln performance. If needed, query BigQuery for last 24h KPIs."

Notes

- For Vision file inputs, pre-upload to GCS and send the base64 content or GCS URI.
- For BigQuery, restrict SQL via allowlist in the endpoint for safety.
