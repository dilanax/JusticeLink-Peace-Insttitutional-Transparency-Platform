import { useState, useEffect, useRef } from "react";
import { 
  Search, Bell, User, TrendingUp, CheckCircle, Clock, XCircle, 
  ThumbsUp, ThumbsDown, MessageCircle, Send, Newspaper, Globe, 
  Twitter, Link2, Settings, Star, Shield, Award, BarChart3,
  Users, Target, Eye, Sparkles, Zap, ChevronRight, Menu, X
} from "lucide-react";

/* ─────────────────────────────────────────
   PREMIUM DESIGN SYSTEM
───────────────────────────────────────── */
const theme = {
  // Vibrant Modern Colors
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  accent: {
    gold: "#F59E0B",
    rose: "#F43F5E",
    emerald: "#10B981",
    violet: "#8B5CF6",
    cyan: "#06B6D4",
  },
  dark: {
    1: "#0A0A0F",
    2: "#0F0F1A",
    3: "#15151F",
    4: "#1A1A25",
    5: "#20202D",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#94A3B8",
    tertiary: "#64748B",
    accent: "#F59E0B",
  }
};

/* ─────────────────────────────────────────
   ANIMATION KEYFRAMES
───────────────────────────────────────── */
const animations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes glow {
    0%, 100% { opacity: 0.5; filter: blur(20px); }
    50% { opacity: 0.8; filter: blur(25px); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulseRing {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-glow { animation: glow 3s ease-in-out infinite; }
  .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
  .animate-slideLeft { animation: slideInLeft 0.6s ease-out forwards; }
  .animate-slideRight { animation: slideInRight 0.6s ease-out forwards; }
  .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.3); }
  .glass-effect { background: rgba(15, 15, 26, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(99, 102, 241, 0.2); }
  .gradient-border { position: relative; background: linear-gradient(135deg, ${theme.primary[500]}, ${theme.accent.violet}); padding: 1px; border-radius: 16px; }
  .gradient-border > * { background: ${theme.dark[3]}; border-radius: 15px; }
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const politicians = [
  { name: "Ranil Wickremesinghe", role: "President · UNP", party: "UNP", image: "👨‍💼", score: 62, kept: 12, broken: 8, pending: 6, trend: "+5%" },
  { name: "Sajith Premadasa", role: "Opposition Leader · SJB", party: "SJB", image: "👨‍💼", score: 78, kept: 19, broken: 4, pending: 3, trend: "+12%" },
  { name: "Harini Amarasuriya", role: "Prime Minister · NPP", party: "NPP", image: "👩‍💼", score: 85, kept: 9, broken: 1, pending: 7, trend: "+18%" },
  { name: "Anura Kumara", role: "MP · NPP", party: "NPP", image: "👨‍💼", score: 89, kept: 14, broken: 2, pending: 4, trend: "+22%" },
];

const promises = [
  { id: 1, title: "Reduce electricity tariff by 25% in Western Province", status: "in-progress", politician: "Anura K.", district: "Colombo", confidence: 68, votes: 234, category: "Economy" },
  { id: 2, title: "Build 5,000 affordable housing units in Galle", status: "completed", politician: "M. Silva", district: "Galle", confidence: 94, votes: 1245, category: "Housing" },
  { id: 3, title: "Free university education expansion by 2025", status: "broken", politician: "R. Premadasa", district: "National", confidence: 12, votes: 789, category: "Education" },
  { id: 4, title: "New water supply project for rural areas", status: "completed", politician: "S. Wickrama", district: "Kandy", confidence: 89, votes: 567, category: "Infrastructure" },
  { id: 5, title: "Digital economy transformation initiative", status: "in-progress", politician: "H. Amarasuriya", district: "Colombo", confidence: 76, votes: 892, category: "Technology" },
];

const trendingPromises = [
  { title: "Fuel subsidy restoration", votes: 2341, change: "+47%", status: "hot" },
  { title: "Teachers salary increment", votes: 1876, change: "+32%", status: "trending" },
  { title: "Port City economic zone", votes: 1432, change: "+23%", status: "stable" },
];

const newsItems = [
  { title: "President announces new agricultural modernization fund", source: "Daily Mirror", time: "2h ago", verified: true, impact: "high" },
  { title: "Opposition releases alternative budget proposal", source: "NewsFirst", time: "5h ago", verified: true, impact: "medium" },
  { title: "Election Commission launches digital pledge tracker", source: "Ada Derana", time: "1d ago", verified: true, impact: "high" },
];

const communityPosts = [
  { id: 1, user: "Piumi Silva", avatar: "PS", time: "2h ago", content: "The new water project in Galle is complete! Attached photos from inauguration.", likes: 124, comments: 23, verified: true, type: "evidence" },
  { id: 2, user: "Kasun Perera", avatar: "KP", time: "5h ago", content: "Electricity tariff reduced in Colombo as promised. Here's my bill comparison.", likes: 89, comments: 12, verified: true, type: "evidence" },
  { id: 3, user: "Nimal Jay", avatar: "NJ", time: "1d ago", content: "Still waiting for rural road development. 2 years overdue.", likes: 267, comments: 45, verified: false, type: "report" },
];

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function PledgeTrack() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("promises");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      completed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Kept" },
      "in-progress": { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "In Progress" },
      broken: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Broken" },
    };
    return configs[status] || configs["in-progress"];
  };

  const filteredPromises = selectedFilter === "all" ? promises : promises.filter(p => p.status === selectedFilter);

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(circle at 0% 0%, ${theme.dark[1]}, ${theme.dark[2]})` }}>
      <style>{animations}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: "4s" }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "glass-effect shadow-2xl" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                <Shield className="w-8 h-8 text-white relative z-10" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Pledge<span className="text-amber-400">Track</span>
              </span>
              <span className="hidden md:inline-flex ml-3 px-2 py-1 text-xs font-bold bg-gradient-to-r from-indigo-500/20 to-amber-500/20 text-amber-400 rounded-full border border-indigo-500/30">
                🇱🇰 Sri Lanka
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Dashboard", "Politicians", "Promises", "Community", "News"].map(item => (
                <a key={item} href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium relative group">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-amber-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </button>
              <button className="hidden md:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/25">
                <User className="w-4 h-4" />
                Sign In
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-amber-500/10 rounded-full border border-indigo-500/30 mb-6 animate-slideLeft">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Live Election Tracker 2026</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slideLeft" style={{ animationDelay: "0.1s" }}>
                Track Political
                <span className="bg-gradient-to-r from-indigo-400 via-amber-400 to-rose-400 bg-clip-text text-transparent block">
                  Promises Like Never Before
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-lg animate-slideLeft" style={{ animationDelay: "0.2s" }}>
                Real-time pledge verification, citizen-powered evidence, and AI-driven news integration. 
                Holding Sri Lankan politicians accountable — one promise at a time.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8 animate-slideLeft" style={{ animationDelay: "0.3s" }}>
                <button className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2">
                  Explore Promises
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-full font-semibold transition-all duration-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Live Stats
                </button>
              </div>
              
              <div className="flex gap-8 animate-slideLeft" style={{ animationDelay: "0.4s" }}>
                <div><div className="text-2xl font-bold text-white">247+</div><div className="text-sm text-gray-400">Politicians</div></div>
                <div><div className="text-2xl font-bold text-white">1.2k</div><div className="text-sm text-gray-400">Promises</div></div>
                <div><div className="text-2xl font-bold text-amber-400">38%</div><div className="text-sm text-gray-400">Kept Rate</div></div>
              </div>
            </div>
            
            <div className="relative animate-slideRight" style={{ animationDelay: "0.2s" }}>
              <div className="gradient-border">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white">🔥 Trending Promises</h3>
                    <span className="text-xs text-indigo-400">Live Updates</span>
                  </div>
                  <div className="space-y-3">
                    {trendingPromises.map((promise, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">{promise.title}</span>
                          <span className="text-xs text-emerald-400">{promise.change}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">{promise.votes.toLocaleString()} votes</span>
                          {promise.status === "hot" && <span className="text-xs text-rose-400">🔥 Hot</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="relative bg-gradient-to-r from-indigo-500/5 via-transparent to-amber-500/5 border-y border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "52,000+", label: "Active Citizens", color: "text-indigo-400" },
              { icon: Target, value: "1,284", label: "Promises Tracked", color: "text-amber-400" },
              { icon: CheckCircle, value: "38%", label: "Keep Rate", color: "text-emerald-400" },
              { icon: Eye, value: "24/7", label: "Live Monitoring", color: "text-rose-400" },
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promise Tracker Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Live Promise Tracker</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Real-time Promise Monitoring</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Track every election promise with community verification and evidence</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {["all", "completed", "in-progress", "broken"].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {filter === "all" ? "All Promises" : filter === "completed" ? "✅ Kept" : filter === "in-progress" ? "⏳ In Progress" : "❌ Broken"}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredPromises.map((promise, i) => {
              const statusConfig = getStatusConfig(promise.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={promise.id} className="group bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 rounded-xl border border-white/10 hover:border-indigo-500/30 p-5 transition-all duration-300">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-gray-500">{promise.category}</span>
                        <span className="text-xs text-gray-500">📍 {promise.district}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">{promise.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>👤 {promise.politician}</span>
                        <span>👍 {promise.votes.toLocaleString()} community votes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Community Confidence</div>
                      <div className="text-2xl font-bold text-white">{promise.confidence}%</div>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${promise.confidence}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community & News Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-4">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Community Hub</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Citizen-Powered Accountability</h2>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {["promises", "community", "news"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {tab === "promises" ? "📋 Promises" : tab === "community" ? "💬 Community" : "📰 News"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "community" && (
            <div className="grid gap-4">
              {communityPosts.map(post => (
                <div key={post.id} className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all border border-white/10">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 flex items-center justify-center font-bold text-white">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-white">{post.user}</span>
                        <span className="text-xs text-gray-500">{post.time}</span>
                        {post.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Shield className="w-3 h-3" /> Verified Evidence
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition">
                          <ThumbsUp className="w-4 h-4" /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-400 transition">
                          <MessageCircle className="w-4 h-4" /> {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Share evidence or comment on a promise..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Send className="w-4 h-4" /> Post
                </button>
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-white">Latest Political News</h3>
                </div>
                <div className="space-y-4">
                  {newsItems.map((news, i) => (
                    <div key={i} className="border-b border-white/10 pb-3 last:border-0">
                      <p className="text-white font-medium mb-1">{news.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{news.source}</span>
                        <span>{news.time}</span>
                        {news.verified && <span className="text-emerald-400">✓ Verified</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500/10 to-amber-500/10 rounded-xl p-6 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Link News as Evidence</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">Connect news articles to promises and help verify political accountability</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Paste news article URL..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500" />
                  <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all">Verify</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "promises" && (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Kept Promises", value: "38%", change: "+12% this month", color: "text-emerald-400" },
                { title: "In Progress", value: "31%", change: "+8% this month", color: "text-amber-400" },
                { title: "Broken", value: "31%", change: "-5% this month", color: "text-rose-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-indigo-500/30 transition-all">
                  <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Politicians Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full mb-4">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Featured Leaders</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Most Followed Politicians</h2>
            <p className="text-gray-400">Track their promises, performance, and accountability scores</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {politicians.map((p, i) => (
              <div key={i} className="group bg-gradient-to-br from-white/5 to-transparent rounded-xl p-6 border border-white/10 hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl mb-3">{p.image}</div>
                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{p.role}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Accountability Score</span>
                  <span className="text-xl font-bold text-white">{p.score}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${p.score}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">✓ {p.kept} Kept</span>
                  <span className="text-amber-400">⏳ {p.pending} Pending</span>
                  <span className="text-rose-400">❌ {p.broken} Broken</span>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-xs text-emerald-400">{p.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-amber-600/20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
          <Star className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the Accountability Movement</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Over 52,000 Sri Lankans are already tracking promises and demanding transparency. 
            Be part of the change.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white rounded-full font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" /> Start Tracking Now
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">PledgeTrack</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs">Building a transparent Sri Lanka through citizen-powered accountability.</p>
            </div>
            <div className="flex flex-wrap gap-12">
              {[
                { title: "Platform", links: ["Politicians", "Promises", "Stats", "Reports"] },
                { title: "Community", links: ["Feedback", "Evidence Hub", "Discussion", "Alerts"] },
                { title: "Resources", links: ["API Docs", "News", "Research", "Contact"] },
              ].map(section => (
                <div key={section.title}>
                  <h4 className="font-semibold text-white mb-3">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map(link => (
                      <li key={link}><a href="#" className="text-sm text-gray-500 hover:text-indigo-400 transition">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>© 2026 PledgeTrack — Independent, non-partisan. All data community-verified.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}