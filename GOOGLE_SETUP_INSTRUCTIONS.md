# Google Cloud Services Setup Instructions

This document provides detailed instructions for setting up Google Cloud Vision, BigQuery, and Vertex AI for the CementMind application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Billing enabled on your GCP account
3. A GCP project created

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google Cloud Project Settings
GOOGLE_CLOUD_PROJECT=your-project-id
GCP_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=us-central1

# Optional: For direct API key access to Gemini
GEMINI_API_KEY=your-gemini-api-key
```

## Authentication Setup

### Option 1: Local Development (Recommended)

1. Install Google Cloud CLI: [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

2. Login to your Google account:
   ```bash
   gcloud auth login
   ```

3. Set your project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

4. Create application default credentials:
   ```bash
   gcloud auth application-default login
   ```

### Option 2: Service Account (For production)

1. Create a service account in the Google Cloud Console:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name your service account (e.g., "cementmind-app")
   - Grant necessary roles (see below)
   - Click "Create"

2. Create and download a JSON key:
   - Select your service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Click "Create"

3. Store the JSON key securely and set the environment variable:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json
   ```

## Required IAM Roles

For each service, assign these roles to your service account:

- **Cloud Vision API**:
  - `roles/aiplatform.user`
  - `roles/serviceusage.serviceUsageConsumer`

- **BigQuery**:
  - `roles/bigquery.dataViewer`
  - `roles/bigquery.jobUser`
  - `roles/bigquery.user`

- **Vertex AI**:
  - `roles/aiplatform.user`
  - `roles/serviceusage.serviceUsageConsumer`

## Service-Specific Setup

### 1. Cloud Vision API

1. **Enable the API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

2. **Usage in CementMind**:
   - The application uses Vision API for image analysis in the Quality section
   - Supported features include text detection, label detection, and face detection
   - API endpoint: `/api/vision`

### 2. BigQuery

1. **Enable the API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Library"
   - Search for "BigQuery API"
   - Click "Enable"

2. **Create a Dataset** (optional):
   - Go to BigQuery in the Cloud Console
   - Click "Create Dataset"
   - Enter a dataset ID (e.g., "cementmind_data")
   - Choose a data location
   - Click "Create"

3. **Sample Table Creation** (optional):
   ```sql
   CREATE TABLE `your-project.cementmind_data.quality_metrics` (
     timestamp TIMESTAMP,
     plant_id STRING,
     batch_id STRING,
     temperature FLOAT64,
     pressure FLOAT64,
     humidity FLOAT64,
     quality_score FLOAT64
   );
   ```

4. **Usage in CementMind**:
   - The application uses BigQuery for data analytics in the Reports section
   - API endpoint: `/api/bigquery`
   - Example query: `SELECT * FROM \`your-project.cementmind_data.quality_metrics\` LIMIT 100`

### 3. Vertex AI

1. **Enable the API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Library"
   - Search for "Vertex AI API"
   - Click "Enable"

2. **Usage in CementMind**:
   - The application uses Vertex AI for advanced ML capabilities
   - API endpoint: `/api/vertex`
   - Default model: `text-bison@002`

### 4. Gemini API (Optional)

1. **Get API Key** (for development):
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file as `GEMINI_API_KEY`

2. **Usage in CementMind**:
   - The application uses Gemini for the chat functionality
   - API endpoint: `/api/gemini`
   - Default model: `gemini-1.5-flash-002`

## Testing Your Setup

1. **Vision API Test**:
   - Upload an image in the Quality section's Image Analysis component
   - Click "Analyze Image"
   - Verify that text and labels are detected

2. **BigQuery Test**:
   - Go to the Reports section's BigQuery Analytics component
   - Enter a simple query: `SELECT 1 as test`
   - Click "Run Query"
   - Verify that results are displayed

3. **Vertex AI Test**:
   - The Vertex AI integration is used internally by other components
   - Successful operation of the Gemini chat indicates proper setup

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify that you've set up authentication correctly
   - Check that your service account has the necessary permissions
   - Ensure the `GOOGLE_APPLICATION_CREDENTIALS` path is correct

2. **API Not Enabled**:
   - Ensure you've enabled all required APIs in your Google Cloud project
   - Some APIs may take a few minutes to fully activate

3. **Billing Issues**:
   - Confirm that billing is enabled for your project
   - Some APIs require a valid billing account even for free tier usage

4. **CORS Issues**:
   - If testing locally, ensure your API calls are properly configured
   - The Next.js API routes should handle CORS automatically

### Getting Help

If you encounter issues:

1. Check the Google Cloud documentation for the specific service
2. Review the error messages in the browser console or server logs
3. Verify that your environment variables are correctly set
4. Ensure your service account has the necessary permissions

## Additional Resources

- [Cloud Vision API Documentation](https://cloud.google.com/vision/docs)
- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)