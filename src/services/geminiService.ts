/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("MISSING API KEY: Please set VITE_GEMINI_API_KEY in your Netlify environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are the lead forensic analyst for "Crypto Exposer". Your mission is to provide deep, vivid, yet simplified audits of cryptocurrency projects.

OPERATIONAL PRINCIPLES:
1. SIMPLE BUT VIVID: Use easy-to-read English but explain things with high impact.
2. STRUCTURED SECTIONS: You must provide a list of sections for the report. Each section must have a status: SAFE (Green), NEUTRAL (Yellow), or DANGER (Red).
   Sections MUST include:
   - THE TEAM: Track record, doxxed status, qualifications.
   - INVESTORS: Big VCs vs. unknown players.
   - TECHNICAL ALPHA: What makes it unique?
   - MARKET MOAT: Comparison with rivals.
   - RISKS & SCAMS: Any predatory red flags.
3. TOKENOMICS DASHBOARD: Provide specific data points for Market Cap, FDV, Supplies, and a distribution breakdown (Team, Public, Investors, etc.).
4. SCORING SYSTEM: All scores (individual and total) MUST be integers between 0 and 100. Be precise.
5. BULLETS OVER PARAGRAPHS: Keep content scannable.
6. BRANDING: Refer to this as a "Crypto Exposer Forensic Report".

Your goal is to reveal the truth. If a project is a rug, say it. If it's the next big thing, explain why.
`;

export async function analyzeProjectAutomated(query: string): Promise<AnalysisResult> {
  const ai = getAiClient();
  try {
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
          required: ["tokenName", "ticker", "summary", "scores", "pros", "cons", "risks", "growthPotential", "verdict", "verdictExplanation", "fullAnalysisText", "sections", "tokenomicsData"],
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
            fullAnalysisText: { type: Type.STRING, description: "Extended markdown summary" },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "status", "content"],
                properties: {
                  title: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["SAFE", "NEUTRAL", "DANGER"] },
                  content: { type: Type.STRING, description: "Markdown content for this section" }
                }
              }
            },
            tokenomicsData: {
              type: Type.OBJECT,
              required: ["mcap", "fdv", "circulatingSupply", "totalSupply", "distribution"],
              properties: {
                mcap: { type: Type.STRING },
                fdv: { type: Type.STRING },
                circulatingSupply: { type: Type.STRING },
                totalSupply: { type: Type.STRING },
                distribution: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["label", "value"],
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini AI. The research yielded no definitive data.");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error: any) {
    console.error('Forensic Engine Error:', error);
    
    // Handle Quota/Rate Limit Errors (429)
    if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API QUOTA REACHED: Your current Gemini API key has run out of tokens. If you are on the free plan, wait 60 seconds and try again. On Netlify, ensure you added your billing info or check your API usage at aistudio.google.com.');
    }
    
    throw new Error('INTERNAL ENGINE FAILURE: ' + (error?.message || 'The AI engine encountered an unexpected error. Please check your Netlify logs and environment variables.'));
  }
}
