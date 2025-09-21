# CementMind AI - Cement Manufacturing Intelligence Platform

CementMind AI is a comprehensive industrial IoT platform designed specifically for cement manufacturing plants. It leverages Google's cutting-edge technologies including Gemini AI, Firebase, BigQuery, and Cloud Vision to provide real-time monitoring, predictive analytics, and intelligent insights for cement production processes.

## 🌟 Key Features

### 🏭 Real-time Plant Monitoring
- Live telemetry data from sensors across the production line
- Real-time alerts and notifications for critical events
- Interactive dashboards with KPI visualization
- Equipment health and performance tracking

### 🔍 Quality Control & Analysis
- Automated quality measurement tracking
- AI-powered anomaly detection
- Historical trend analysis
- Compliance with industry standards

### 🚚 Smart Logistics
- Delivery scheduling and tracking
- Fleet management
- Route optimization
- Driver performance analytics

### 📊 Advanced Analytics & Reporting
- Custom report generation
- Predictive maintenance insights
- Production efficiency analysis
- Energy consumption monitoring

### 🤖 AI-Powered Assistant
- Natural language processing with Gemini AI
- Context-aware responses for cement industry queries
- Real-time data analysis and insights
- Integration with plant operations

## 🛠️ Technology Stack

### Google Cloud Platform
- **Firebase**: Authentication, Firestore Database, Cloud Functions
- **BigQuery**: Data warehousing and analytics
- **Vertex AI**: Machine learning and AI model deployment
- **Cloud Vision**: Image analysis for quality inspection
- **Cloud Storage**: Secure file storage for documents and images

### Frontend
- **Next.js 14**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Recharts**: Data visualization library

### Backend
- **Node.js**: JavaScript runtime
- **Firebase Admin SDK**: Server-side Firebase operations
- **Express**: API route handling
- **Socket.IO**: Real-time bidirectional communication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Cloud account with billing enabled
- Firebase project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cementmind-ai.git
   cd cementmind-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   # Google Cloud
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   
   # Gemini AI
   GEMINI_API_KEY=your-gemini-api-key
   # OR for Vertex AI
   GCP_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_REGION=your-region
   ```

4. **Initialize Firebase**
   - Set up a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Run the initialization script:
     ```bash
     npx ts-node scripts/init-firebase.ts
     ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000` to see the application in action.

## 📚 Documentation

### Project Structure
```
cementmind-ai/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── alerts/             # Alerts management
│   ├── logistics/          # Logistics management
│   ├── quality/            # Quality control
│   └── ...
├── components/             # Reusable React components
├── lib/                    # Utility functions and configs
├── public/                 # Static files
└── scripts/                # Utility scripts
```

### API Endpoints

#### Authentication
- `POST /api/firebase/auth` - User authentication

#### Telemetry
- `GET /api/firebase/telemetry` - Get telemetry data
- `POST /api/firebase/telemetry` - Add telemetry data

#### Alerts
- `GET /api/firebase/alerts` - Get alerts
- `POST /api/firebase/alerts` - Create/update alerts

#### Quality
- `GET /api/firebase/quality` - Get quality measurements
- `POST /api/firebase/quality` - Add/update quality data

#### Logistics
- `GET /api/firebase/logistics` - Get logistics data
- `POST /api/firebase/logistics` - Update logistics

## 🤖 Gemini AI Integration

The application features a powerful AI assistant powered by Google's Gemini. To set it up:

1. Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. The AI assistant will be available via the chat interface

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for all new code
- Write meaningful commit messages
- Create pull requests for all changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Cloud Platform
- Firebase
- Next.js
- The open-source community

## 📧 Contact

For inquiries, please contact [your-email@example.com](mailto:your-email@example.com)
