"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Waves,
  Fish,
  Thermometer,
  Droplets,
  Activity,
  Zap,
  Shield,
  Database,
  Eye,
  Server,
  Cpu,
  Wifi,
  TrendingUp,
  BarChart3,
  Globe,
  Lock,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { login, type LoginActionState } from "../actions";

/* ------------------------------------------------------------------ */
/*  Hydration-safe particle layer (client-only)                        */
/* ------------------------------------------------------------------ */
function FloatingDataStreams() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const particles = Array.from({ length: 25 }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${1 + Math.random() * 2}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: parseFloat(p.duration),
            delay: parseFloat(p.delay),
          }}
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400/60 blur-sm"></div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Static data helpers                                               */
/* ------------------------------------------------------------------ */
const liveData = [
  {
    label: "Water Temp",
    value: "24.5°C",
    status: "optimal",
    change: "+0.2°C",
    icon: Thermometer,
  },
  {
    label: "pH Level",
    value: "7.2",
    status: "good",
    change: "-0.1",
    icon: Droplets,
  },
  {
    label: "O2 Levels",
    value: "8.4 mg/L",
    status: "excellent",
    change: "+0.3",
    icon: Activity,
  },
  {
    label: "Fish Count",
    value: "2,847",
    status: "stable",
    change: "+12",
    icon: Fish,
  },
  {
    label: "Sensors",
    value: "128/128",
    status: "active",
    change: "100%",
    icon: Wifi,
  },
  {
    label: "Data Rate",
    value: "2.4 GB/h",
    status: "high",
    change: "+5%",
    icon: TrendingUp,
  },
];

const systemStatus = [
  { name: "Primary Servers", status: "online", uptime: "99.9%", icon: Server },
  { name: "IoT Network", status: "active", uptime: "99.8%", icon: Wifi },
  { name: "AI Processing", status: "running", uptime: "99.7%", icon: Cpu },
  { name: "Data Pipeline", status: "flowing", uptime: "99.9%", icon: Database },
];

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    optimal: "text-green-400",
    excellent: "text-green-400",
    good: "text-cyan-400",
    stable: "text-blue-400",
    active: "text-purple-400",
    high: "text-orange-400",
    online: "text-green-400",
    running: "text-blue-400",
    flowing: "text-cyan-400",
  };
  return map[status] || "text-gray-400";
};

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */
export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );

  /* side effects ---------------------------------------------------- */
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timeInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (state.status === "failed") toast.error("Invalid credentials!");
    else if (state.status === "invalid_data")
      toast.error("Failed validating your submission!");
    else if (state.status === "success") {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleSubmit = (fd: FormData) => {
    setEmail(fd.get("email") as string);
    formAction(fd);
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900">
      {/* Background layers */}
      <div className="absolute inset-0 opacity-20">
        <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
        />
      </div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(6,182,212,0.4),_transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.4),_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_40%,_rgba(16,185,129,0.3),_transparent_50%)]" />
      </div>

      {/* Mouse follower glow */}
      <div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl pointer-events-none"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />

      {/* Floating particles (client-only) */}
      <FloatingDataStreams />

      {/* Main layout */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side – Dashboard */}
          <div className="space-y-10 text-white">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                      <Waves className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur opacity-75 animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      AquaLab IoT
                    </h1>
                    <p className="text-cyan-200 text-sm">
                      Advanced Marine Intelligence Platform
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {mounted && time ? time.toLocaleTimeString() : "00:00:00"}
                  </div>
                  <div className="text-sm text-cyan-200">
                    {mounted && time ? time.toLocaleDateString() : "01/01/1970"}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-5xl font-bold leading-tight">
                  Laboratory <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Command Center
                  </span>
                </h2>
                <p className="text-xl text-slate-300 max-w-lg">
                  Access real-time aquaculture data, AI-powered insights, and
                  comprehensive system monitoring from your secure dashboard.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                {["overview", "systems", "analytics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                        : "bg-white/10 text-slate-300 hover:bg-white/15"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Live Environmental Data
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {liveData.map((item) => (
                        <div
                          key={item.label}
                          className="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <item.icon className="w-5 h-5 text-cyan-400" />
                            <span
                              className={`text-xs font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.change}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-400">
                              {item.label}
                            </p>
                            <p className="text-lg font-bold text-white">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "systems" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      System Health Monitor
                    </h3>
                    <div className="space-y-3">
                      {systemStatus.map((system) => (
                        <div
                          key={system.name}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <system.icon className="w-5 h-5 text-cyan-400" />
                            <div>
                              <p className="font-medium text-white">
                                {system.name}
                              </p>
                              <p
                                className={`text-xs ${getStatusColor(
                                  system.status
                                )}`}
                              >
                                {system.status.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-white">
                              {system.uptime}
                            </p>
                            <p className="text-xs text-slate-400">Uptime</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      AI Analytics Dashboard
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                            <span className="text-white font-medium">
                              Growth Prediction
                            </span>
                          </div>
                          <span className="text-green-400 text-sm">+12.5%</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full w-4/5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            <span className="text-white font-medium">
                              Feed Efficiency
                            </span>
                          </div>
                          <span className="text-blue-400 text-sm">94.2%</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full w-11/12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl p-4 border border-green-500/30 mb-16">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="font-semibold text-white">All Systems Operational</p>
                  <p className="text-sm text-green-200">
                    Laboratory running at peak performance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side – Login */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mb-4 relative">
                  <Shield className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 blur opacity-75 animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Secure Laboratory Access
                </h3>
                <p className="text-slate-300 text-lg">
                  Welcome back to the future of aquaculture
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-slate-400">256-bit SSL</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-slate-400">Biometric Ready</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-slate-400">Global Access</p>
                </div>
              </div>

              <AuthForm action={handleSubmit} defaultEmail={email}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <SubmitButton isSuccessful={isSuccessful}>
                    <span className="relative z-10 flex items-center justify-center space-x-3 text-lg font-semibold">
                      <span>Initialize Laboratory Session</span>
                      <Activity className="w-6 h-6" />
                    </span>
                  </SubmitButton>
                </div>
              </AuthForm>

              <div className="text-center space-y-6 mt-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="text-slate-400 text-sm">or</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <p className="text-slate-400">
                  {"Need laboratory credentials? "}
                  <Link
                    href="/register"
                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
                  >
                    Request Access Authorization
                  </Link>
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Lab Systems: Online</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Security: Maximum</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Uptime: 99.9%</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span>Data: Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8 text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Primary Lab: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>IoT Network: Stable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Data Stream: Live</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>AI Engine: Processing</span>
              </div>
            </div>
            <div className="text-slate-500 font-medium">
              Bluesand AI Command Center © 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}