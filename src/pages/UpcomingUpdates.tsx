import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Languages, Bot, MessageSquarePlus, Zap, Landmark, Sun, Moon, Image } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import GovlyxLogo from "../components/ui/GovlyxLogo";

export default function UpcomingUpdates() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const updates = [
    {
      icon: <Languages className="w-6 h-6 text-[#1D4ED8]" />,
      title: "Regional Language Support",
      description: "Support for Marathi, Hindi, Kannada, Tamil, and other regional languages using translation APIs so every Indian citizen can participate in their mother tongue.",
      status: "In Progress"
    },
    {
      icon: <Bot className="w-6 h-6 text-[#1D4ED8]" />,
      title: "Hyperlocal AI Assistant",
      description: "An AI agent that automatically translates civic complaints into formal drafts, categorizes issues, and matches them with corresponding government departments.",
      status: "Planning"
    },
    {
      icon: <MessageSquarePlus className="w-6 h-6 text-[#1D4ED8]" />,
      title: "Ephemeral Group Chats",
      description: "Real-time, self-cleaning chat rooms dedicated to active local updates (e.g., live traffic congestion, municipal repairs, water outages) with automatic message expiry.",
      status: "In Development"
    },
    {
      icon: <Image className="w-6 h-6 text-[#1D4ED8]" />,
      title: "Media Uploads in Community Chats",
      description: "Share images, videos, and documents directly within community chats to provide visual context and report issues with proof in real-time.",
      status: "In Progress"
    },
    {
      icon: <Landmark className="w-6 h-6 text-[#1D4ED8]" />,
      title: "Official PG-Portal Sync",
      description: "Direct API pipelines to standard grievance management systems (CPGRAMS) to route highly-voted citizen issues directly to designated state officers.",
      status: "Planning"
    },
    {
      icon: <Zap className="w-6 h-6 text-[#1D4ED8]" />,
      title: "Verified RWA Dashboards",
      description: "Custom admin dashboards for Resident Welfare Associations (RWAs) and ward committee members to address and resolve local queries directly.",
      status: "In Progress"
    }
  ];

  return (
    <div className="h-screen bg-base-100 text-slate-800 dark:text-slate-200 selection:bg-[#1D4ED8]/20 transition-colors duration-300 flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-slate-200/80 dark:border-slate-800/80 bg-base-100/90 backdrop-blur-md sticky top-0 z-50 h-[72px] shrink-0">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing Page
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-[#1D4ED8] dark:text-[#60A5FA] uppercase">ROADMAP</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer border-none"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-between">
        {/* Main Content */}
        <main className="max-w-[800px] w-full mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-[#1D4ED8]/10 dark:bg-[#60A5FA]/10 text-[#1D4ED8] dark:text-[#60A5FA] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Upcoming Updates & Features
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
              Discover the future iterations of Govlyx as we scale to connect every Indian citizen to their local community and government.
            </p>
          </div>

          {/* Timeline Updates */}
          <div className="space-y-6">
            {updates.map((item, index) => (
              <div 
                key={index}
                className="bg-white/80 dark:bg-[#121829]/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex gap-5 items-start animate-fade-in"
              >
                <div className="p-3 bg-[#1D4ED8]/10 dark:bg-[#60A5FA]/10 rounded-xl shrink-0">
                  {React.cloneElement(item.icon, { className: "w-6 h-6 text-[#1D4ED8] dark:text-[#60A5FA]" })}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">{item.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      item.status === "In Development" 
                        ? "bg-amber-500/10 text-amber-500" 
                        : item.status === "In Progress"
                        ? "bg-[#1D4ED8]/10 dark:bg-[#60A5FA]/15 text-[#1D4ED8] dark:text-[#60A5FA]"
                        : "bg-slate-500/10 text-slate-500"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-base-100 border-t border-slate-200 dark:border-slate-800/80 py-10 sm:py-12 px-4 sm:px-6 transition-colors duration-300">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <GovlyxLogo showText size={26} textClassName="text-lg font-extrabold" />
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <button onClick={() => navigate("/")} className="hover:text-red-600 dark:hover:text-red-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold">Home</button>
              <button onClick={() => navigate("/upcoming-updates")} className="hover:text-red-600 dark:hover:text-red-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-red-500 dark:text-red-400">Upcoming Updates</button>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
              © 2026 Govlyx · Hyperlocal Civic Infrastructure
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
