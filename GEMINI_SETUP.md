# Gemini Chat Integration Setup

This document explains how to set up the Gemini chat functionality in CementMind.

## Features Added

1. **Gemini Chat Button**: Added to the top navigation bar with a gradient blue-to-purple design
2. **Chat Interface**: Modal dialog with a modern chat UI
3. **API Integration**: Supports both API key and Vertex AI authentication methods

## Environment Variables Setup

Create a `.env.local` file in your project root with one of the following configurations:

### Option 1: Using Gemini API Key (Recommended for development)

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

To get a Gemini API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env.local` file

### Option 2: Using Google Cloud Vertex AI

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GCP_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=us-central1
```

For this option, you'll need:

1. A Google Cloud project with Vertex AI enabled
2. Service account credentials configured
3. The appropriate IAM permissions

## Usage

1. Click the "Ask Gemini" button in the top navigation bar
2. Type your question in the chat input
3. Press Enter or click the Send button
4. Gemini will respond with AI-generated answers

## Chat Features

- **Real-time messaging**: Send and receive messages instantly
- **Loading indicators**: Visual feedback while waiting for responses
- **Error handling**: Graceful error messages if API calls fail
- **Responsive design**: Works on desktop and mobile devices
- **Context awareness**: Gemini is configured to understand CementMind-specific queries

## Troubleshooting

### Common Issues

1. **"Missing configuration" error**: Make sure you've set up the environment variables correctly
2. **API key errors**: Verify your API key is valid and has the necessary permissions
3. **Network errors**: Check your internet connection and firewall settings
4. **Model not found errors**: The application now uses gemini-2.5-flash by default, which is the latest stable model. If you encounter model-related errors, ensure your API key has access to this model.

### Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to the application
3. Click the "Ask Gemini" button
4. Try asking: "What is CementMind?" or "How can I monitor cement quality?"

## Files Modified/Created

- `components/dashboard/gemini-chat.tsx` - New chat component
- `components/dashboard/top-nav.tsx` - Updated with Gemini button
- `app/api/gemini/route.ts` - Updated API route with dual authentication support
- `GEMINI_SETUP.md` - This documentation file
