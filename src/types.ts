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
  technologyUsecase: number; 
  investors: number;
  competitors: number;
  utility: number;
  tvl: number;
  community: number;
  total: number;
}

export interface AnalysisSection {
  title: string;
  status: 'SAFE' | 'NEUTRAL' | 'DANGER';
  content: string;
}

export interface TokenomicsItem {
  label: string;
  value: number;
}

export interface TokenomicsData {
  mcap: string;
  fdv: string;
  circulatingSupply: string;
  totalSupply: string;
  distribution: TokenomicsItem[];
  burningMechanism: {
    type: 'manual' | 'automatic' | 'none';
    description: string;
    percentageBurned?: string;
  };
}

export interface PastProject {
  projectName: string;
  role: string;
  outcome: 'success' | 'failure' | 'neutral';
  outcomeReason: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  pastWork: string[];
  pastProjects: PastProject[];
  yearsExperience: number;
  socials: { platform: string; url: string }[];
  trustScore: number;
  sources: Source[];
}

export interface Investor {
  name: string;
  tier: 'tier-1' | 'tier-2' | 'tier-3' | 'angel';
  description: string;
  pastInvestments: string[];
  socials: { platform: string; url: string }[];
  sources: Source[];
}

export interface VestingSchedule {
  stakeholder: string;
  percentage: number;
  cliffMonths: number;
  vestingMonths: number;
  unlockFrequency: string;
}

export interface TVLData {
  currentValue: string; // e.g., "$1.2B"
  trend: 'up' | 'down' | 'stable';
  vestingSchedules: VestingSchedule[];
  unlockWarning: string; // Brief forensic warning about upcoming unlocks
}

export interface Competitor {
  name: string;
  ticker: string;
  briefInfo: string;
  advantage: string; // Why our project is better
  marketShare: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface RoadmapItem {
  milestone: string;
  status: 'completed' | 'ongoing' | 'missed' | 'future';
  date?: string;
}

export interface RoadmapInfo {
  hasRoadmap: boolean;
  followingProgress: 'on track' | 'delayed' | 'no roadmap' | 'exceeding';
  details: string;
  milestones: RoadmapItem[];
  sources: Source[];
}

export interface UsecaseInfo {
  description: string;
  realWorldProblem: string;
  githubActivity: string;
  innovationLevel: string;
  technicalMoat: string;
  sources: Source[];
}

export interface UtilityInfo {
  governance: boolean;
  staking: boolean;
  burnMechanics: boolean;
  specificUtilities: string[];
  ecosystemRole: string;
  valueAccrual: string;
  sources: Source[];
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
  verdict: 'STRONGLY BUY' | 'BUY' | 'HOLD' | 'AVOID' | 'SELL' | 'STRONGLY SELL' | 'STRONGLY AVOID';
  verdictExplanation: string;
  fullAnalysisText: string; 
  sections: AnalysisSection[];
  tokenomicsData: TokenomicsData;
  team: TeamMember[];
  investors: Investor[];
  tvlData: TVLData;
  competitors: Competitor[];
  usecaseInfo: UsecaseInfo;
  utilityInfo: UtilityInfo;
  roadmapInfo: RoadmapInfo;
  logoUrl?: string;
}
