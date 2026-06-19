
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Languages, Bot, MessageSquarePlus, Zap, Landmark, Sun, Moon, Image } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import GovlyxLogo from "../components/ui/GovlyxLogo";

export default function UpcomingUpdates() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const updates = [
    {
      icon: <Languages className="w-6 h-6" />,
      title: "Regional Language Support",
      description: "Support for Marathi, Hindi, Kannada, Tamil, and other regional languages using translation APIs so every Indian citizen can participate in their mother tongue.",
      status: "Done"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Hyperlocal AI Assistant",
      description: "An AI agent that automatically translates civic complaints into formal drafts, categorizes issues, and matches them with corresponding government departments.",
      status: "Planning"
    },
    {
      icon: <MessageSquarePlus className="w-6 h-6" />,
      title: "Ephemeral Group Chats",
      description: "Real-time, self-cleaning chat rooms dedicated to active local updates (e.g., live traffic congestion, municipal repairs, water outages) with automatic message expiry.",
      status: "In Development"
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Media Uploads in Community Chats",
      description: "Share images, videos, and documents directly within community chats to provide visual context and report issues with proof in real-time.",
      status: "In Progress"
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Official PG-Portal Sync",
      description: "Direct API pipelines to standard grievance management systems (CPGRAMS) to route highly-voted citizen issues directly to designated state officers.",
      status: "Planning"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Verified RWA Dashboards",
      description: "Custom admin dashboards for Resident Welfare Associations (RWAs) and ward committee members to address and resolve local queries directly.",
      status: "In Progress"
    }
  ];

  return (
    <div className="h-screen bg-base-100 text-slate-800 dark:text-slate-200 selection:bg-blue-500/20 transition-colors duration-300 flex flex-col relative overflow-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-20 left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 left-[20%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="border-b border-slate-200/80 dark:border-slate-800/80 bg-base-100/90 backdrop-blur-md sticky top-0 z-50 h-[72px] shrink-0">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing Page
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase">ROADMAP</span>
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

      {/* Scrollable Container Wrapper */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-between z-10">
        {/* Main Content */}
        <main className="w-full mx-auto max-w-[1000px] px-4 py-16 relative">
          <div className="text-center mb-20">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-600/15">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Upcoming Updates & Features
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
              Discover the future iterations of Govlyx as we scale to connect every Indian citizen to their local community and government.
            </p>
          </div>

          {/* Snake-like Road Map Timeline */}
          <div className="relative w-full py-8">
            {/* Centered vertical dotted line for md+, left-aligned for mobile */}
            <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-0.5 border-l-4 border-dashed border-blue-500/30 dark:border-blue-400/25 -translate-x-1/2 z-0" />

            <div className="space-y-16 md:space-y-24 relative z-10">
              {updates.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row items-center w-full gap-8 relative ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Card Container (index 0 even = left side default row) */}
                    <div className="w-full md:w-[45%] pl-16 md:pl-0">
                      <div className="w-full bg-white/80 dark:bg-[#121829]/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-400/30 hover:scale-[1.02] transition-all duration-300 relative group">
                        {/* Background hover light glow gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                        <div className="flex gap-4.5 items-start relative z-10">
                          {/* Icon Block */}
                          <div className="p-3 bg-blue-600/10 dark:bg-blue-400/10 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300 text-blue-600 dark:text-blue-400">
                            {item.icon}
                          </div>

                          {/* Text Block */}
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-3 flex-wrap">
                              <h3 className="font-extrabold text-slate-950 dark:text-white text-base sm:text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                              </h3>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                item.status === "In Development"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : item.status === "In Progress"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-slate-500/10 text-slate-500 dark:text-slate-400"
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Snake-like Central Connecting Node */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center top-6 md:top-auto z-20">
                      <div className="w-10 h-10 rounded-full bg-base-100 border-4 border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center font-black text-xs text-blue-600 dark:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400 transition-colors duration-300">
                        {index + 1}
                      </div>
                    </div>

                    {/* Spacer for md+ screen layout symmetry */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-base-100 border-t border-slate-200 dark:border-slate-800/80 py-10 sm:py-12 px-4 sm:px-6 transition-colors duration-300 z-10 shrink-0">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <GovlyxLogo showText size={26} textClassName="text-lg font-extrabold" />
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <button onClick={() => navigate("/")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold">Home</button>
              <button onClick={() => navigate("/upcoming-updates")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-blue-600 dark:text-blue-400">Upcoming Updates</button>
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
