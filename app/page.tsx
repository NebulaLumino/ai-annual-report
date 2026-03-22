"use client";

import { useState } from "react";

export default function AnnualReportPage() {
  const [form, setForm] = useState({
    companyName: "", year: new Date().getFullYear().toString(), industry: "",
    keyMetrics: "", achievements: "", challenges: "", financials: "", mission: "", teamSize: "",
  });
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function generate() {
    if (!form.companyName.trim() || !form.year) return;
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.executiveSummary) setReport(data);
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!report) return;
    const text = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
            Corporate Communications
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">AI Annual Report Generator</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Generate a professional annual report — executive summary, year in review, CEO letter, and forward look.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name *</label>
              <input value={form.companyName} onChange={(e) => update("companyName", e.target.value)}
                placeholder="Acme Corp"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fiscal Year *</label>
              <input value={form.year} onChange={(e) => update("year", e.target.value)}
                placeholder="2024"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industry</label>
              <input value={form.industry} onChange={(e) => update("industry", e.target.value)}
                placeholder="SaaS / FinTech / E-commerce"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team Size</label>
              <input value={form.teamSize} onChange={(e) => update("teamSize", e.target.value)}
                placeholder="e.g. 25 employees"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Metrics</label>
              <input value={form.keyMetrics} onChange={(e) => update("keyMetrics", e.target.value)}
                placeholder="e.g. $2M ARR, 500 customers, 120% net retention, 40% MoM growth"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Achievements</label>
              <input value={form.achievements} onChange={(e) => update("achievements", e.target.value)}
                placeholder="e.g. Launched v2.0, expanded to EU, hit 500 customers"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Challenges</label>
              <input value={form.challenges} onChange={(e) => update("challenges", e.target.value)}
                placeholder="e.g. Raised pricing, supply chain issues, talent acquisition"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Financials</label>
              <input value={form.financials} onChange={(e) => update("financials", e.target.value)}
                placeholder="e.g. $3M ARR, $500K monthly burn, 18 months runway"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
          </div>

          <button onClick={generate} disabled={loading || !form.companyName.trim()}
            className="w-full mt-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold py-4 rounded-xl transition-all text-lg">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Generating Report...
              </span>
            ) : "Generate Annual Report"}
          </button>
        </div>

        {report && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Annual Report — {form.year}</h2>
              <button onClick={copyAll}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                {copied ? "✓ Copied" : "Copy JSON"}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Executive Summary</p>
              <p className="text-slate-700 leading-relaxed">{report.executiveSummary}</p>
            </div>

            <div className="bg-slate-900 rounded-2xl shadow p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Letter from the CEO</p>
              <p className="text-slate-200 leading-relaxed italic font-light">{report.letterFromCEO}</p>
            </div>

            {report.yearInReview?.sections && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Year in Review</h3>
                <div className="grid grid-cols-2 gap-4">
                  {report.yearInReview.sections.map((s: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{s.category}</p>
                      <p className="text-slate-700 text-sm leading-relaxed mb-3">{s.content}</p>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-slate-400 mb-0.5">Highlight</p>
                        <p className="text-slate-800 font-semibold text-sm">{s.highlight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.financialSnapshot && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Financial Snapshot</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { k: "Revenue", v: report.financialSnapshot.revenue },
                    { k: "Burn Rate", v: report.financialSnapshot.burnRate },
                    { k: "Funding", v: report.financialSnapshot.funding },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{item.k}</p>
                      <p className="text-slate-800 font-medium text-sm">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Looking Ahead</p>
              <p className="text-slate-700 leading-relaxed">{report.lookingAhead}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
