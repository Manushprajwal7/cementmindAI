### Setup instructions for Firebase, Vertex AI (Gemini), Cloud Vision, BigQuery, and Agent Builder

#### 1) Prerequisites

- Node 18+ and npm
- Google Cloud project with billing enabled
- gcloud CLI installed and logged in

Run locally once:

```bash
gcloud auth application-default login
```

#### 2) Environment variables

Create a file `.env.local` in the project root with:

```bash
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Cloud (server)
# One of these must be set
GOOGLE_CLOUD_PROJECT=
GCP_PROJECT_ID=
GOOGLE_CLOUD_REGION=us-central1

# Optional: protect API routes with a shared key
INTERNAL_API_KEY=

# Optional: public base URL for Agent Builder webhook docs
PUBLIC_BASE_URL=http://localhost:3000
```

Firebase values come from your Firebase console (Project settings → General → Your apps). Use Realtime Database and set Database URL.

#### 3) Install dependencies

```bash
npm i
```

#### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`. The Telemetry Console will stream live data. If Firebase vars are set, data is written to `plants/plant-1/analysis` in Realtime Database; otherwise it falls back to local mock.

#### 5) Testing APIs

Gemini (Vertex AI):

```bash
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Summarize kiln performance"}'
```

Vision (OCR/labels):

```bash
curl -X POST http://localhost:3000/api/vision \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"<base64>","features":[{"type":"TEXT_DETECTION"}]}'
```

BigQuery:

```bash
curl -X POST http://localhost:3000/api/bigquery \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT 1 AS x"}'
```

If you set `INTERNAL_API_KEY`, include `-H "x-internal-key: <key>"` in requests and add a check in the API routes.

#### 6) Where things are wired

- Firebase init: `lib/firebase.ts`
- Realtime hook: `hooks/use-real-time-data.ts` (reads/writes `plants/{plantId}/analysis`)
- Live charts: `components/dashboard/metric-line-chart.tsx` (uses `_live` metric keys)
- Vertex AI API: `app/api/gemini/route.ts`
- Vision API: `app/api/vision/route.ts`
- BigQuery API: `app/api/bigquery/route.ts`
- Vertex AI Python sample: `api/vertex_gemini_sample.py`
- Agent Builder guide: `AGENT_BUILDER.md`

#### 7) Google Cloud configuration

Enable services:

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  bigquery.googleapis.com \
  vision.googleapis.com
```

Local dev uses Application Default Credentials from `gcloud auth application-default login`.

Service account roles for deployment (Cloud Run or Vercel + workload identity):

- Vertex AI User
- BigQuery Data Viewer and BigQuery Job User
- Cloud Vision API User

#### 8) Deploying (Cloud Run quickstart)

Build and deploy (example):

```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/cementmind
gcloud run deploy cementmind \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/cementmind \
  --region $GOOGLE_CLOUD_REGION \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT,GOOGLE_CLOUD_REGION=$GOOGLE_CLOUD_REGION
```

Add your Firebase NEXT*PUBLIC*\* envs to the service as well.

#### 9) Agent Builder

Follow `AGENT_BUILDER.md` to create an agent and add tools that call:

- `POST {PUBLIC_BASE_URL}/api/gemini`
- `POST {PUBLIC_BASE_URL}/api/vision`
- `POST {PUBLIC_BASE_URL}/api/bigquery`

Secure endpoints (API key header or IAP) before exposing publicly.
