import { Server } from "socket.io"
import { createServer } from "http"
import express from "express"
import cors from "cors"

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// Mock data generators
const generateSensorReading = () => ({
  timestamp: new Date().toISOString(),
  kiln_temperature: 1450 + Math.random() * 100,
  system_pressure: 2.1 + Math.random() * 0.4,
  material_flow_rate: 85 + Math.random() * 30,
  oxygen_level: 3.2 + Math.random() * 1.8,
  energy_consumption: 145 + Math.random() * 25,
})

const generateAnalysisResult = () => ({
  timestamp: new Date().toISOString(),
  system_status: Math.random() > 0.8 ? "warning" : "normal",
  alerts:
    Math.random() > 0.7
      ? [
          {
            id: `alert_${Date.now()}`,
            severity: Math.random() > 0.5 ? "medium" : "high",
            type: "temperature_anomaly",
            message: "Kiln temperature deviation detected",
            confidence: 0.85 + Math.random() * 0.15,
          },
        ]
      : [],
  recommendations: {
    quality_control: {
      predicted_fineness: 3200 + Math.random() * 400,
      predicted_setting_time: 180 + Math.random() * 60,
      predicted_strength: 42.5 + Math.random() * 7.5,
      corrections: {
        process_adjustments: ["Reduce kiln speed by 2%"],
        material_adjustments: ["Increase limestone by 0.5%"],
        estimated_impact: { quality_improvement: 0.15, cost: 250 },
      },
    },
    logistics: {
      truck_scheduling: {
        predicted_demand: Array.from({ length: 48 }, () => Math.floor(Math.random() * 8) + 2),
        optimal_schedule: Object.fromEntries(
          Array.from({ length: 48 }, (_, i) => [i, Math.floor(Math.random() * 6) + 1]),
        ),
        total_trucks_needed: 24,
        peak_demand_hours: [8, 14, 20],
      },
    },
  },
  performance_metrics: {
    energy_efficiency: 0.82 + Math.random() * 0.15,
    material_flow_rate: 85 + Math.random() * 30,
    system_pressure: 2.1 + Math.random() * 0.4,
    kiln_temperature: 1450 + Math.random() * 100,
    quality_score: 0.85 + Math.random() * 0.12,
    anomaly_confidence: Math.random() * 0.3,
  },
})

// WebSocket event handlers
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  // Send initial data
  socket.emit("analysis.update", generateAnalysisResult())

  // Send periodic updates
  const analysisInterval = setInterval(() => {
    socket.emit("analysis.update", generateAnalysisResult())
  }, 2000)

  const alertInterval = setInterval(() => {
    if (Math.random() > 0.8) {
      socket.emit("alert.new", {
        id: `alert_${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: Math.random() > 0.6 ? "high" : "medium",
        type: "anomaly_detected",
        affected_sensors: ["kiln_temperature", "system_pressure"],
        confidence: 0.75 + Math.random() * 0.25,
        potential_causes: ["Equipment wear", "Material composition variance"],
        recommended_actions: ["Check sensor calibration", "Adjust material feed rate"],
      })
    }
  }, 5000)

  socket.on("disconnect", () => {
    clearInterval(analysisInterval)
    clearInterval(alertInterval)
    console.log("Client disconnected:", socket.id)
  })
})

// REST API endpoint
app.post("/api/v1/analyze", (req, res) => {
  const sensorReading = req.body
  console.log("Received sensor reading:", sensorReading)

  // Simulate processing delay
  setTimeout(() => {
    res.json({
      analysis: generateAnalysisResult(),
      status: "success",
    })
  }, 100)
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`)
})
