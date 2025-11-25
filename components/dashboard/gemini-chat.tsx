"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function GeminiChat({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Gemini, your AI assistant for CementMind. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Store the input for the API call
    const currentInput = input.trim();

    try {
      // Add typing indicator
      const typingIndicatorId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: typingIndicatorId,
          role: "assistant",
          content: "...",
          timestamp: new Date(),
        },
      ]);

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentInput,
          system: `You are Gemini, an AI assistant specialized for CementMind AI - an AI Operating Workbench For Raw Material and Logistics Automation with Autonomous Real-Time Cement Quality Detection and Correction.

Your role is to help engineers and operators working with cement manufacturing plants to debug issues, optimize operations, and use the AI workbench efficiently.

About CementMind AI:
It's a comprehensive industrial IoT platform designed specifically for cement manufacturing plants
Leverages Google's cutting-edge technologies including Gemini AI, Firebase, BigQuery, and Cloud Vision
Provides real-time monitoring, predictive analytics, and intelligent insights for cement production processes

Key Features You Should Know About:

1. Real-time Plant Monitoring:
Live telemetry data from sensors across the production line
Real-time alerts and notifications for critical events
Interactive dashboards with KPI visualization
Equipment health and performance tracking

2. Quality Control & Analysis:
Automated quality measurement tracking
AI-powered anomaly detection
Historical trend analysis
Compliance with industry standards

3. Smart Logistics (Raw Material Handling Logistics Optimization):
Delivery scheduling and tracking
Fleet management with real-time GPS tracking
Route optimization using predictive algorithms
Driver performance analytics
Truck scheduling optimization based on demand forecasting
Supply chain efficiency monitoring

4. Advanced Analytics & Reporting:
Custom report generation using BigQuery
Predictive maintenance insights
Production efficiency analysis
Energy consumption monitoring

5. AI-Powered Assistant (That's You):
Natural language processing with Gemini AI
Context-aware responses for cement industry queries
Real-time data analysis and insights
Integration with plant operations

Technology Stack:
Google Cloud Platform (Firebase, BigQuery, Vertex AI, Cloud Vision, Cloud Storage)
Frontend: Next.js 14, TypeScript, Tailwind CSS, Radix UI, Recharts
Backend: Node.js, Firebase Admin SDK, Express

When helping users:
Be specific about cement manufacturing processes
Reference the actual features and tools available in CementMind
Provide actionable advice for debugging and optimization
Explain how to use the AI workbench effectively
When discussing logistics, mention truck scheduling, route optimization, and supply chain efficiency
For quality issues, discuss anomaly detection and autonomous corrections
For analytics, reference BigQuery reporting capabilities

Example user queries you might receive:
How do I check the current kiln temperature?
Why am I not seeing alerts for pressure anomalies?
How can I optimize truck scheduling for tomorrow?
What does the quality score metric represent?
How do I generate a report on energy consumption?

Always be helpful, accurate, and concise. If you don't know something, suggest checking the documentation or contacting support. Avoid using asterisks, hyphens, and other markdown formatting in your responses. Provide clear, plain text responses that are easy to read and understand.`,
          model: "gemini-2.5-flash",
        }),
      });

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== typingIndicatorId));

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(
          `Failed to get response from Gemini: ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again. If this persists, check your API configuration.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              Ask Gemini
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 pt-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CementMind..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
