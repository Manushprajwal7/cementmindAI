"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Factory,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Truck,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Factory className="h-8 w-8" />,
      title: "Real-time Plant Monitoring",
      description:
        "Live telemetry data visualization with anomaly detection and alerts.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Quality Control",
      description:
        "Automated measurement validation and intelligent anomaly detection.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Smart Logistics",
      description:
        "Delivery tracking and route optimization for efficient transportation.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Custom reports and predictive maintenance insights.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI Assistant",
      description: "Gemini-powered NLP for industry queries and insights.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Scalable",
      description:
        "Built with Firebase Authentication and Google Cloud security.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    {
      icon: <Zap className="h-5 w-5" />,
      value: "99.9%",
      label: "Uptime",
      color: "blue",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      value: "+23%",
      label: "Efficiency",
      color: "green",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      value: "98.7%",
      label: "Accuracy",
      color: "purple",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      value: "-18%",
      label: "Costs",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-purple-950"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/20 backdrop-blur-xl bg-black/60">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <Factory className="h-8 w-8 text-blue-400 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-400/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              CementMind AI
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-200 hover:text-white transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all"></span>
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-4 py-20 md:py-2">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-blue-300">
                  AI-Powered Cement Production
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block mb-2 animate-slideInLeft text-white">
                  Revolutionizing
                </span>
                <span
                  className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent animate-slideInLeft"
                  style={{ animationDelay: "0.2s" }}
                >
                  JK Cement Production
                </span>
              </h1>

              <p
                className="text-xl text-gray-200 max-w-xl leading-relaxed animate-slideInLeft"
                style={{ animationDelay: "0.4s" }}
              >
                Intelligent cement plant monitoring, quality control, and
                logistics optimization powered by cutting-edge AI and Google
                Cloud technologies, specifically designed for JK Cement plants.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 animate-slideInLeft"
                style={{ animationDelay: "0.6s" }}
              >
                <Link
                  href="/signup"
                  className="px-10 py-5.5 text-sm font-large bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2 text-white"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div
                className="flex items-center gap-8 pt-4 animate-slideInLeft"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-black flex items-center justify-center text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    Implemented Specifically for JK Cement plants
                  </p>
                </div>
              </div>
            </div>

            {/* Animated Stats Cards */}
            <div className="relative">
              <div
                className="grid grid-cols-2 gap-6 animate-fadeIn"
                style={{ animationDelay: "0.4s" }}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:border-white/40 transition-all hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/30 to-transparent opacity-0 group-hover:opacity-20 transition-opacity`}
                    ></div>
                    <div className="relative">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br from-${stat.color}-500/30 to-${stat.color}-600/30 w-fit mb-4`}
                      >
                        {stat.icon}
                      </div>
                      <div className="text-4xl font-bold mb-2 text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white font-medium">
                        {stat.label}
                      </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                  </div>
                ))}
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-50 animate-float"></div>
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 py-20 md:py-32"
        >
          <div className="text-center space-y-4 mb-16 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm mb-4">
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200">
                Powerful Capabilities for JK Cement
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Optimize your JK Cement production process with our comprehensive
              suite of AI-powered tools
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 transition-all hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                ></div>
                <div className="relative">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 w-fit mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:gap-3 transition-all">
                    Learn more
                    <ChevronRight className="h-4 w-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div
                  className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity`}
                ></div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 py-12 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Factory className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                CementMind AI for JK Cement
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
            <p className="text-sm text-gray-300">
              © 2025 CementMind AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
