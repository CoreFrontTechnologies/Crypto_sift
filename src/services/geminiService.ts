/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("MISSING API KEY: Please ensure GEMINI_API_KEY is available in the environment.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are the lead forensic analyst for "Crypto Exposer". Your mission is to provide deep, vivid, yet simplified audits of cryptocurrency projects.

OPERATIONAL PRINCIPLES:
1. TOTAL EXPOSURE: You must be extremely thorough. Mention EVERY SINGLE team member discovered, EVERY investor, and EVERY roadmap detail. Do not summarize; do not truncate. Detail is intelligence.
2. UNABRIDGED RESEARCH: Provide the full technical and financial depth. No "summaries" or "briefs". We need the heavy data.
3. STRUCTURED SECTIONS: provide a list of sections for the report. Each section must have a status: SAFE (Green), NEUTRAL (Yellow), or DANGER (Red).
4. ABSOLUTE TEAM DOSSIER: Audit the entire leadership and development team. List EVERY founder, developer, advisor, and key contributor discovered. We need 100% coverage of the roster. Include real names, past roles, total years of experience, and source links. Include "pastProjects" with outcomes (success/failure) and logic.
5. VENTURE CAPITAL (VC) MAP: Identify all institutional and angel investors. Classify by Tier (Tier 1 like a16z, Paradigm, etc.) and list past investments. Include SOURCE links to proof.
6. ROADMAP AUDIT: Audit ALL milestones. Do not skip any. Provide SOURCE.
7. TVL & VESTING: Audit "Total Value Locked" and "Vesting Schedules". Detail tokens unlocks and "inflationary pressure" over 12 months.
8. COMPETITOR ANALYSIS: Compare with top 3 rivals. List name, ticker, info, ADVANTAGE, and MARKET SHARE.
9. STRATEGY ADVICE: State explicitly whether to HOLD for the long term or TRADE it for short-term gains, with detailed reasoning.
10. LOGO EXTRACTION: Provide HTTPS URL to the official logo. If unknown, use a placeholder or common CDN.
11. VERDICT CATEGORIES: Choose ONLY from: STRONGLY BUY, BUY, HOLD, AVOID, SELL, STRONGLY SELL, STRONGLY AVOID.
12. SCORING PRECISION: Each individual score must be out of 100. The "total" score must be a weighted average of all other scores.

CRITICAL DIRECTIVE: The user demands "FULL INFORMATION". Do not provide high-level overviews. Provide the equivalent of a 30-page institutional research paper in your data fields. Exhaustively list all identified people and entities. PROHIBITED: Do not say "and others" or provide only a "representative" sample of the team. You must list every single individual found.
`;

export async function analyzeProjectAutomated(query: string, attempts = 3): Promise<AnalysisResult> {
  const ai = getAiClient();
  
  for (let i = 0; i < attempts; i++) {
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
            required: ["tokenName", "ticker", "summary", "scores", "pros", "cons", "risks", "growthPotential", "verdict", "verdictExplanation", "fullAnalysisText", "sections", "tokenomicsData", "team", "investors", "tvlData", "competitors", "usecaseInfo", "utilityInfo", "roadmapInfo", "logoUrl"],
            properties: {
              tokenName: { type: Type.STRING },
              ticker: { type: Type.STRING },
              logoUrl: { type: Type.STRING, description: "HTTPS URL to the token logo image" },
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
          }
        },
      });

      if (!response.text) {
        throw new Error("No response from Gemini AI. The research yielded no definitive data.");
      }

      return JSON.parse(response.text) as AnalysisResult;
    } catch (error: any) {
      console.error(`Forensic Engine Attempt ${i + 1} Failed:`, error);
      
      const errorMsg = error?.message?.toLowerCase() || '';
      const isRateLimited = errorMsg.includes('429') || errorMsg.includes('resource_exhausted') || errorMsg.includes('throttled');
      const isTransient = errorMsg.includes('xhr error') || 
                        errorMsg.includes('rpc failed') ||
                        errorMsg.includes('network error') || 
                        errorMsg.includes('deadline exceeded') ||
                        errorMsg.includes('500') ||
                        errorMsg.includes('unknown') ||
                        isRateLimited;

      if (isTransient && i < attempts - 1) {
        // Significantly longer backoff if we are rate limited
        const baseDelay = isRateLimited ? 5000 : 500;
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retrying in ${Math.round(delay)}ms due to ${isRateLimited ? 'rate limit' : 'transient error'}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Handle Quota/Rate Limit Errors (429) - if we still fail after retries
      if (isRateLimited) {
        throw new Error('API QUOTA REACHED: Your Gemini API key is heavily throttled. Please wait at least 30-60 seconds before trying again.');
      }
      
      throw new Error('INTERNAL ENGINE FAILURE: ' + (error?.message || 'The AI engine encountered an unexpected error.'));
    }
  }
  throw new Error("Failed after multiple attempts.");
}
