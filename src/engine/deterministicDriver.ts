import type { AutomatedStageId, DecisionPacket, Scenario } from './types';
export interface AgentRunResult { mode:'demonstration'|'live'; stageResults:Array<{stageId:AutomatedStageId;summary:string;completedAt:string}>; decision:DecisionPacket }
export interface AgentDriver { run(scenario:Scenario):Promise<AgentRunResult> }
export const deterministicDriver:AgentDriver={ async run(scenario){ return {mode:'demonstration',stageResults:(['intake','understand','evaluate','explain'] as AutomatedStageId[]).map(stageId=>({stageId,summary:scenario.stageSummaries[stageId],completedAt:new Date().toISOString()})),decision:structuredClone(scenario.decision)}; }};
