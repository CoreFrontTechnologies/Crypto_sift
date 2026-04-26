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
1. EXHAUSTIVE & VIVID: State EVERY detail found. Do not summarize if detail is available. Use easy-to-read English but explain things with high impact.
2. STRUCTURED SECTIONS: You must provide a list of sections for the report. Each section must have a status: SAFE (Green), NEUTRAL (Yellow), or DANGER (Red).
   Sections MUST include:
   - THE TEAM: Track record, doxxed status, qualifications.
   - INVESTORS: Big VCs vs. unknown players.
   - USECASE: Real-world application, technical architecture, and problem-solving level. 
   - UTILITY: Specific roles of the token (staking, governance, etc.), and value accrual mechanics.
   - ROADMAP: Audit of milestones. Are they being met? Is the team following their own schedule?
   - COMPETITORS: Comparison with rivals.
   - RISKS & SCAMS: Any predatory red flags.
3. EXECUTIVE DOSSIER: Perform a deep forensic audit on the leadership team. List ALL key team members (founders, lead devs, etc.) with their real names, past positions, and total years of experience. Include a "pastProjects" array detailing specific projects they worked on, the outcome (success/failure), and the logic. Include SOURCE links for each member (LinkedIn, Twitter, or Official Website).
4. VENTURE CAPITAL (VC) MAP: Identify all major institutional and angel investors. Classify them by Tier (Tier 1 like a16z, Paradigm, etc.) and list their notable past crypto investments. Include SOURCE links to proof of investment (VC portfolio, press release).
5. ROADMAP AUDIT: Check if the project has a roadmap. If yes, verify if they are following it (on track, delayed, or unknown). List at least 3 major milestones and their status. Provide SOURCE for the roadmap.
6. TVL & VESTING FORENSICS: Audit the "Total Value Locked" (if applicable/DeFi) and the "Vesting Schedules". Detail when tokens unlock, for whom, and the "inflationary pressure" over the next 12 months.
7. COMPETITOR ANALYSIS: Identify the top 3 rivals. For each, list their name, ticker, brief info, and our ADVANTAGE (why we are better) and MARKET SHARE.
8. USECASE & UTILITY AUDIT: Deep dive into the technical architecture and how the token actually functions. Does it have use beyond speculation? List ALL specific utilities.
9. TOKENOMICS DASHBOARD: Provide specific data points for Market Cap, FDV, Supplies, and a distribution breakdown.
   - BURNING MECHANISM: Detail if the project burns tokens (Manual/Auto), the frequency, and the impact.
10. SCORING SYSTEM: All scores MUST be integers (0-100).
   - COMMUNITY SCORE (previously Sentiment): Measures social hype, community "heat", and technical polarization vs fundamentals.
11. STRATEGY ADVICE: In the verdict explanation, you MUST state whether the user should HOLD for the long term or simply TRADE it for short-term gains, with detailed reasoning.
12. SOURCES: For EVERY section (Team, Investors, Usecase, Roadmap), you MUST provide a "sources" array with at least one verifiable URL.
13. BULLETS OVER PARAGRAPHS: Keep content scannable.
14. BRANDING: Refer to this as a "Crypto Exposer Forensic Report".

Your goal is to reveal the truth. If a project is a rug, say it. If it's the next big thing, explain why.

VERDICT CATEGORIES:
You must choose ONLY from: STRONGLY BUY, BUY, HOLD, AVOID, SELL, STRONGLY SELL, STRONGLY AVOID.
`;

export async function analyzeProjectAutomated(query: string): Promise<AnalysisResult> {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Conduct an exhaustive institutional audit on: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true },
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2,
        responseSchema: {
          type: Type.OBJECT,
          required: ["tokenName", "ticker", "summary", "scores", "pros", "cons", "risks", "growthPotential", "verdict", "verdictExplanation", "fullAnalysisText", "sections", "tokenomicsData", "team", "investors", "tvlData", "competitors", "usecaseInfo", "utilityInfo", "roadmapInfo"],
          properties: {
            tokenName: { type: Type.STRING },
            ticker: { type: Type.STRING },
            summary: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              required: ["tokenomics", "team", "technologyUsecase", "investors", "competitors", "utility", "tvl", "community", "total"],
              properties: {
                tokenomics: { type: Type.NUMBER },
                team: { type: Type.NUMBER },
                technologyUsecase: { type: Type.NUMBER },
                investors: { type: Type.NUMBER },
                competitors: { type: Type.NUMBER },
                utility: { type: Type.NUMBER },
                tvl: { type: Type.NUMBER },
                community: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
              }
            },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthPotential: { type: Type.STRING },
            verdict: { type: Type.STRING, enum: ["STRONGLY BUY", "BUY", "HOLD", "AVOID", "SELL", "STRONGLY SELL", "STRONGLY AVOID"] },
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
              required: ["mcap", "fdv", "circulatingSupply", "totalSupply", "distribution", "burningMechanism"],
              properties: {
                mcap: { type: Type.STRING },
                fdv: { type: Type.STRING },
                circulatingSupply: { type: Type.STRING },
                totalSupply: { type: Type.STRING },
                burningMechanism: {
                  type: Type.OBJECT,
                  required: ["type", "description"],
                  properties: {
                    type: { type: Type.STRING, enum: ["manual", "automatic", "none"] },
                    description: { type: Type.STRING },
                    percentageBurned: { type: Type.STRING }
                  }
                },
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
            },
            team: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "role", "bio", "pastWork", "pastProjects", "yearsExperience", "socials", "trustScore", "sources"],
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  pastWork: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pastProjects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["projectName", "role", "outcome", "outcomeReason"],
                      properties: {
                        projectName: { type: Type.STRING },
                        role: { type: Type.STRING },
                        outcome: { type: Type.STRING, enum: ["success", "failure", "neutral"] },
                        outcomeReason: { type: Type.STRING }
                      }
                    }
                  },
                  yearsExperience: { type: Type.NUMBER },
                  trustScore: { type: Type.NUMBER },
                  socials: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["platform", "url"],
                      properties: {
                        platform: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  },
                  sources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["label", "url"],
                      properties: {
                        label: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            investors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "tier", "description", "pastInvestments", "socials", "sources"],
                properties: {
                  name: { type: Type.STRING },
                  tier: { type: Type.STRING, enum: ["tier-1", "tier-2", "tier-3", "angel"] },
                  description: { type: Type.STRING },
                  pastInvestments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  socials: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["platform", "url"],
                      properties: {
                        platform: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  },
                  sources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["label", "url"],
                      properties: {
                        label: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            tvlData: {
              type: Type.OBJECT,
              required: ["currentValue", "trend", "vestingSchedules", "unlockWarning"],
              properties: {
                currentValue: { type: Type.STRING },
                trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
                unlockWarning: { type: Type.STRING },
                vestingSchedules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["stakeholder", "percentage", "cliffMonths", "vestingMonths", "unlockFrequency"],
                    properties: {
                      stakeholder: { type: Type.STRING },
                      percentage: { type: Type.NUMBER },
                      cliffMonths: { type: Type.NUMBER },
                      vestingMonths: { type: Type.NUMBER },
                      unlockFrequency: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "ticker", "briefInfo", "advantage", "marketShare"],
                properties: {
                  name: { type: Type.STRING },
                  ticker: { type: Type.STRING },
                  briefInfo: { type: Type.STRING },
                  advantage: { type: Type.STRING },
                  marketShare: { type: Type.STRING }
                }
              }
            },
            usecaseInfo: {
              type: Type.OBJECT,
              required: ["description", "realWorldProblem", "githubActivity", "innovationLevel", "technicalMoat", "sources"],
              properties: {
                description: { type: Type.STRING },
                realWorldProblem: { type: Type.STRING },
                githubActivity: { type: Type.STRING },
                innovationLevel: { type: Type.STRING },
                technicalMoat: { type: Type.STRING },
                sources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["label", "url"],
                    properties: {
                      label: { type: Type.STRING },
                      url: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            utilityInfo: {
              type: Type.OBJECT,
              required: ["governance", "staking", "burnMechanics", "specificUtilities", "ecosystemRole", "valueAccrual", "sources"],
              properties: {
                governance: { type: Type.BOOLEAN },
                staking: { type: Type.BOOLEAN },
                burnMechanics: { type: Type.BOOLEAN },
                specificUtilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                ecosystemRole: { type: Type.STRING },
                valueAccrual: { type: Type.STRING },
                sources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["label", "url"],
                    properties: {
                      label: { type: Type.STRING },
                      url: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            roadmapInfo: {
              type: Type.OBJECT,
              required: ["hasRoadmap", "followingProgress", "details", "milestones", "sources"],
              properties: {
                hasRoadmap: { type: Type.BOOLEAN },
                followingProgress: { type: Type.STRING, enum: ["on track", "delayed", "no roadmap", "exceeding"] },
                details: { type: Type.STRING },
                milestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["milestone", "status"],
                    properties: {
                      milestone: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["completed", "ongoing", "missed", "future"] },
                      date: { type: Type.STRING }
                    }
                  }
                },
                sources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["label", "url"],
                    properties: {
                      label: { type: Type.STRING },
                      url: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        },

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
