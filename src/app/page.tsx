"use client";
import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{trimmed.replace("# ","")}</h1>;
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-slate-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (trimmed.startsWith("| ")) return <div key={i} className="text-slate-300 text-sm font-mono my-1">{trimmed}</div>;
    if (trimmed.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-blue-400 pl-4 italic text-slate-400 text-sm my-3">{trimmed.replace("> ","")}</blockquote>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear() - 1));
  const [metrics, setMetrics] = useState("");
  const [achievements, setAchievements] = useState("");
  const [financials, setFinancials] = useState("");
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!companyName.trim()) { setError("Company name is required."); return; }
    setLoading(true); setError(""); setResult(""); setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, industry, year, metrics, achievements, financials, goals }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result); setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Annual Report Generator</h1>
            <p className="text-xs text-slate-400">Corporate narratives · Executive summaries · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Tell Your Company's Year in Review 📊</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate a professional annual report narrative with executive summary, achievements, and forward vision.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company Name *</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Acme Technologies"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. SaaS, Fintech"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">📅 Fiscal Year</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder={String(new Date().getFullYear() - 1)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-32" />
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">📈 Key Metrics</label>
            <textarea value={metrics} onChange={(e) => setMetrics(e.target.value)} rows={2}
              placeholder="e.g. Revenue grew 40% YoY, 500 customers, expanded to 3 new markets, team of 50..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">🏆 Major Achievements</label>
            <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={2}
              placeholder="e.g. Launched v2.0, Series A funding, won Best Workplace award..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Financial Summary</label>
              <input value={financials} onChange={(e) => setFinancials(e.target.value)} placeholder="e.g. $2M ARR, 60% gross margin"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Strategic Goals</label>
              <input value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g. Expand to Europe, launch mobile app"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Writing annual report...</> : <><span>📊</span> Generate Annual Report</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-blue-500/10 border-b border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <p className="text-blue-300 font-bold text-sm">Annual Report: {companyName} FY {year}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(result)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10 transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderMarkdown(result)}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">AI Annual Report Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
