import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { companyName, industry, year, metrics, achievements, financials, goals } = await req.json();
    if (!companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a professional annual report writer and corporate communications expert. Write compelling, professional annual report narratives that balance factual data with inspiring storytelling.`,
        },
        {
          role: "user",
          content: `Write a professional annual report narrative for ${companyName} (${industry || "General Business"}) for fiscal year ${year || new Date().getFullYear() - 1}.

**Key Metrics:**
${metrics || "Revenue growth, customer acquisition, team size, market expansion"}

**Major Achievements:**
${achievements || "Product launches, partnerships, awards, milestones"}

**Financial Summary:**
${financials || "Revenue, profit margins, funding rounds (or 'private — not disclosed')"}

**Strategic Goals:**
${goals || "Expansion plans, product roadmap, team growth"}

Generate a complete annual report narrative in markdown with ALL these sections:

---

# ${companyName} Annual Report — FY ${year || new Date().getFullYear() - 1}

## Letter from Leadership
[2-3 paragraphs: Year in review, key milestones, forward vision. Should feel personal and inspiring from the CEO/founder's voice]

## Executive Summary
[4-5 bullet points covering: company position, revenue/funding status, team growth, key product milestones, market highlights]

## Year in Review: Key Achievements
[6-8 specific achievements with dates/context. Format as a narrative timeline where possible]

## By the Numbers: Metrics that Mattered
[Present the metrics as a story — not just numbers but what they mean:
- Revenue / Growth: [X] → what it shows
- Customers: [X] → [Y] growth
- Team: [X] people
- Markets: [X] countries
- Products: [X] launched]

## Product Highlights
[2-4 key product/service achievements from the year]

## People & Culture
[Team growth, new hires in leadership, culture initiatives, DEI efforts]

## Financial Overview
${financials || "[Based on industry norms for a company at this stage]"}

## Looking Ahead: FY $((new Date().getFullYear())) Strategic Priorities
[3-5 forward-looking priorities with brief rationale]

## Closing Statement
[1 paragraph closing note from leadership — forward-looking and confident]

---

Use a professional but engaging tone. Write as a real narrative, not a template. Make it something a CEO would be proud to sign. Include realistic placeholder data styled professionally where specific numbers aren't provided.`,
        },
      ],
      max_tokens: 1800,
      temperature: 0.6,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}
