/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Lead Institutional Analyst specialized in Crypto VC and On-chain Forensics.
Your objective is to produce a tiered, vivid, and surgically detailed institutional-grade audit report for a project (name or CA).

REPORT STRUCTURE & REQUIREMENTS:

1. EXECUTIVE THESIS (Vivid): A 2-3 sentence punchy summary of the project's viability.
2. CORE PILLARS (Detailed):
   - **Leadership & Team Forensic**: Deep dive into the founders. Look for past successful exits, failures, scandals, or technical contributions. Explain WHY they are qualified or WHY they are a risk.
   - **Tokenomics Hygiene**: Go beyond percentages. Analyze circulating-to-FDV ratio, vesting cliffs (impending dumps), and buy/sell tax structures.
   - **Technical Moat & Utility**: Does this project solve a real problem or is it a "solution looking for a problem"? Explain the technical value prop vividy.
   - **Market Context & Moat**: Compare with the top 3 competitors. Explain why this project might win or lose.
   - **Backer Integrity**: Tier-1 VC (e.g., Paradigm, a16z) vs. Tier-3/Retail focused backers.
   - **Community & Social Sentiment**: Detect organic growth vs. bot-driven hype. 

Brutally honest tone. Use Markdown headers and clear sections in 'fullAnalysisText'.
Make it clear that this is a "Sayyed-Sift Forensic Audit". 
Always provide a definitive action in the 'verdict' field (BUY, HOLD, AVOID, etc.) and justify it precisely in 'verdictExplanation'.
`;

export async function analyzeProjectAutomated(query: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Conduct an exhaustive institutional audit on: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
      toolConfig: { includeServerSideToolInvocations: true },
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["tokenName", "ticker", "summary", "scores", "pros", "cons", "risks", "growthPotential", "verdict", "verdictExplanation", "fullAnalysisText"],
        properties: {
          tokenName: { type: Type.STRING },
          ticker: { type: Type.STRING },
          summary: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            required: ["tokenomics", "team", "useCase", "investors", "competition", "roadmap", "sentiment", "development", "total"],
            properties: {
              tokenomics: { type: Type.NUMBER },
              team: { type: Type.NUMBER },
              useCase: { type: Type.NUMBER },
              investors: { type: Type.NUMBER },
              competition: { type: Type.NUMBER },
              roadmap: { type: Type.NUMBER },
              sentiment: { type: Type.NUMBER },
              development: { type: Type.NUMBER },
              total: { type: Type.NUMBER },
            }
          },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          growthPotential: { type: Type.STRING },
          verdict: { type: Type.STRING, enum: ["STRONG BUY", "BUY", "HOLD", "AVOID", "STRONG BULLISH", "BULLISH", "NEUTRAL", "BEARISH", "RUG RISK"] },
          verdictExplanation: { type: Type.STRING },
          fullAnalysisText: { type: Type.STRING, description: "Extended markdown summary of the whole analysis" },
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini AI. The research yielded no definitive data.");
  }

  return JSON.parse(response.text) as AnalysisResult;
}
