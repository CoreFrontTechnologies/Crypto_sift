/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TokenInput {
  tokenName: string;
  ticker: string;
  marketCap: string;
  fdv: string;
  totalSupply: string;
  circulatingSupply: string;
  liquidityRatio: string;
  holders: string;
  watchlist: string;
  
  // Tokenomics
  publicPercentage: string;
  teamPercentage: string;
  investorsPercentage: string;
  advisorsPercentage: string;
  ecosystemPercentage: string;

  // Team
  teamSize: string;
  teamExperience: string;
  teamActivity: string;
  teamIdentity: string; // Known or Anonymous

  useCaseDescription: string;
  investorList: string;
  competitorList: string;
  roadmapInfo: string;
  sentimentSummary: string;
  githubActivity: string;
}

export interface AnalysisScores {
  tokenomics: number;
  team: number;
  useCase: number;
  investors: number;
  competition: number;
  roadmap: number;
  sentiment: number;
  development: number;
  total: number;
}

export interface AnalysisResult {
  tokenName: string;
  ticker: string;
  summary: string;
  scores: AnalysisScores;
  pros: string[];
  cons: string[];
  risks: string[];
  growthPotential: string;
  verdict: 'STRONG BUY' | 'BUY' | 'HOLD' | 'AVOID' | 'STRONG BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'RUG RISK';
  verdictExplanation: string;
  fullAnalysisText: string; // The raw markdown from the model
}
