import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { companyName, year, industry, keyMetrics, achievements, challenges, financials, mission, teamSize } = await req.json();

    if (!companyName || !year) {
      return NextResponse.json({ error: "Company name and year are required" }, { status: 400 });
    }

    const prompt = `You are an expert corporate communications writer. Generate a professional annual report for ${companyName} for the fiscal year ${year}.

Company: ${companyName}
Year: ${year}
Industry: ${industry || "Technology / General"}
Key Metrics: ${keyMetrics || "Revenue, users, growth rate, team size"}
Achievements: ${achievements || "Major milestones reached"}
Challenges: ${challenges || "Headwinds or obstacles faced"}
Financials: ${financials || "Revenue, funding, burn rate"}
Mission: ${mission || "Company mission statement"}
Team Size: ${teamSize || "Current headcount"}

Generate a complete annual report in this JSON format (no markdown):
{
  "executiveSummary": "200-250 word executive summary covering the year holistically — growth, impact, and momentum",
  "letterFromCEO": "Personal 180-200 word letter from the CEO/ Founder voice. Warm, honest, forward-looking. Use first person.",
  "yearInReview": {
    "title": "Year in Review",
    "sections": [
      {
        "category": "Growth & Metrics",
        "content": "3-4 sentences about growth metrics and what they mean",
        "highlight": "One key stat to feature"
      },
      {
        "category": "Product & Innovation",
        "content": "3-4 sentences about product progress",
        "highlight": "One key product milestone"
      },
      {
        "category": "Team & Culture",
        "content": "3-4 sentences about team growth and culture",
        "highlight": "One team highlight"
      },
      {
        "category": "Challenges & Learnings",
        "content": "3-4 sentences acknowledging challenges honestly and what was learned",
        "highlight": "One key lesson"
      }
    ]
  },
  "lookingAhead": "150-180 word forward-looking statement covering next year priorities, vision, and goals",
  "financialSnapshot": {
    "revenue": "Revenue statement",
    "burnRate": "Burn rate / runway",
    "funding": "Funding status"
  }
}`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
