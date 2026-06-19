import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Star, CheckCircle, AlertCircle, RefreshCw, Cpu, Send, Bug, Rocket, Palette, MessageSquare } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import GovlyxLogo from "../components/ui/GovlyxLogo";
import axiosInstance from "../api/axiosConfig";
import { showToast } from "../utils/toast";

type FeedbackCategory = "BUG" | "FEATURE_REQUEST" | "UI_UX" | "GENERAL";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Form States
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>("GENERAL");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "offline">("idle");
  const [apiError, setApiError] = useState<string>("");

  // Metadata (auto-generated fields)
  const appVersion = "1.0.0";
  const deviceInfo = navigator.userAgent;

  const handleSubmit = async (e: React.FormEvent, simulate = false) => {
    e.preventDefault();
    if (rating === 0) {
      showToast.error("Please select a rating before submitting!");
      return;
    }

    setSubmitting(true);
    setApiError("");

    const payload = {
      rating,
      category,
      message,
      appVersion,
      deviceInfo
    };

    if (simulate) {
      setTimeout(() => {
        setSubmitting(false);
        setSubmitStatus("success");
        showToast.success("Simulated successful feedback submission!");
      }, 1000);
      return;
    }

    try {
      await axiosInstance.post("/api/v1/feedback", payload);
      setSubmitting(false);
      setSubmitStatus("success");
      showToast.success("Feedback submitted successfully!");
    } catch (err: any) {
      setSubmitting(false);
      console.error("Feedback API error:", err);
      // Check if server is offline / unreachable
      if (!err.response) {
        setSubmitStatus("offline");
      } else {
        const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to submit feedback.";
        setApiError(errMsg);
        showToast.error(errMsg);
      }
    }
  };

  const handleResetForm = () => {
    setRating(0);
    setHoverRating(0);
    setCategory("GENERAL");
    setMessage("");
    setSubmitStatus("idle");
    setApiError("");
  };

  return (
    <div className="h-screen bg-base-100 text-slate-800 dark:text-slate-200 selection:bg-blue-500/20 transition-colors duration-300 flex flex-col relative overflow-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-20 left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 right-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="border-b border-slate-200/80 dark:border-slate-800/80 bg-base-100/90 backdrop-blur-md sticky top-0 z-50 h-[72px] shrink-0">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase">SUBMIT FEEDBACK</span>
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
        <main className="flex-1 w-full mx-auto max-w-[850px] px-4 py-10 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-600/15">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Share Your Feedback
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              We value your experience. Let us know how we can make Govlyx better.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-[#121829]/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-sm space-y-8">
            
            {submitStatus === "success" ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Submission Successful!</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Thank you for reviewing the user feedback submission form. The API payload has been packaged and processed.
                  </p>
                </div>
                <button
                  onClick={handleResetForm}
                  className="btn btn-outline border-slate-200 dark:border-slate-800 text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Submit Another Feedback
                </button>
              </div>
            ) : submitStatus === "offline" ? (
              <div className="space-y-6">
                <div className="p-5 bg-amber-500/10 border-l-4 border-amber-600 rounded-r-2xl space-y-2 text-amber-800 dark:text-amber-300">
                  <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                    <AlertCircle className="w-5 h-5" /> Spring Boot Server Offline
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    The local Spring Boot backend service at <code className="font-mono text-xs bg-amber-500/5 px-1 py-0.5 rounded">POST /api/v1/feedback</code> is unreachable or offline. 
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={handleResetForm}
                    className="btn btn-outline border-slate-200 dark:border-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Go Back & Retry
                  </button>
                  <button
                    onClick={(e) => handleSubmit(e, true)}
                    className="btn bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg border-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Cpu className="w-4 h-4" /> Simulate Successful Submission
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                    Select Feedback Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(["BUG", "FEATURE_REQUEST", "UI_UX", "GENERAL"] as FeedbackCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-3 px-4 rounded-xl text-xs font-black tracking-wider transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                          category === cat
                            ? "bg-blue-600/10 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                            : "bg-slate-50 dark:bg-[#1a2234]/40 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        {cat === "BUG" && (
                          <>
                            <Bug className="w-4 h-4 shrink-0 text-emerald-500" />
                            <span>BUG</span>
                          </>
                        )}
                        {cat === "FEATURE_REQUEST" && (
                          <>
                            <Rocket className="w-4 h-4 shrink-0 text-pink-500" />
                            <span>FEATURE</span>
                          </>
                        )}
                        {cat === "UI_UX" && (
                          <>
                            <Palette className="w-4 h-4 shrink-0 text-purple-500" />
                            <span>UI / UX</span>
                          </>
                        )}
                        {cat === "GENERAL" && (
                          <>
                            <MessageSquare className="w-4 h-4 shrink-0 text-blue-500" />
                            <span>GENERAL</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Selector */}
                <div className="space-y-2 text-center py-4 bg-slate-50/50 dark:bg-[#1b2234]/20 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                    Overall Rating
                  </label>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform bg-transparent border-none"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-widest animate-pulse">
                      {rating === 1 && "Terrible 😡"}
                      {rating === 2 && "Poor 😞"}
                      {rating === 3 && "Average 😐"}
                      {rating === 4 && "Good 😊"}
                      {rating === 5 && "Excellent! 😍"}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                    Explain Your Experience (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share details about what you liked, or bugs that you encountered..."
                    className="w-full bg-slate-50 dark:bg-[#1b2234]/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    maxLength={1000}
                  />
                  <div className="text-right text-[10px] text-slate-400 font-bold">
                    {message.length} / 1000 characters
                  </div>
                </div>

                {/* API Payload Preview */}
                <div className="bg-slate-900/5 dark:bg-[#0d1117] border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" /> Auto-Generated DTO Fields
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-[#161b22] rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">App Version</span>
                      <code className="text-slate-800 dark:text-slate-200 font-mono font-bold mt-0.5 block">{appVersion}</code>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#161b22] rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">User Agent (deviceInfo)</span>
                      <code className="text-slate-800 dark:text-slate-200 font-mono mt-0.5 block break-all whitespace-pre-wrap" title={deviceInfo}>
                        {deviceInfo}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Submit buttons */}
                {apiError && (
                  <div className="p-3.5 bg-red-500/10 border-l-4 border-red-600 rounded text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {apiError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-sm sm:text-base tracking-wide hover:bg-blue-700 transition-colors shadow-lg border-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" /> Packaging & Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="bg-base-100 border-t border-slate-200 dark:border-slate-800/80 py-10 sm:py-12 px-4 sm:px-6 transition-colors duration-300 z-10 shrink-0">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <GovlyxLogo showText size={26} textClassName="text-lg font-extrabold" />
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <button onClick={() => navigate("/")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold">Home</button>
              <button onClick={() => navigate("/upcoming-updates")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold">Upcoming Updates</button>
              <button onClick={() => navigate("/privacy-policy")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold">Privacy Policy</button>
              <button onClick={() => navigate("/review")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-blue-600 dark:text-blue-400">Review</button>
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
