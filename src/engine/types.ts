import { z } from 'zod';

export const stageIds = ['intake', 'understand', 'evaluate', 'explain', 'human-gate', 'act-and-log'] as const;
export type StageId = (typeof stageIds)[number];
export type AutomatedStageId = Exclude<StageId, 'human-gate' | 'act-and-log'>;
export type PackId = 'procurement' | 'recruitment' | 'customer-operations';
export type ScenarioKind = 'happy' | 'exception';
export type ReviewDecision = 'approved' | 'returned' | 'escalated';

export interface EvidenceRef { sourceId: string; label: string; excerpt: string }
export interface PolicyCheck { id: string; label: string; result: 'pass' | 'warn' | 'fail'; detail: string }
export interface DecisionPacket {
  recommendation: string;
  confidence: 'high' | 'medium' | 'low';
  rationale: string[];
  evidence: EvidenceRef[];
  policyChecks: PolicyCheck[];
  missingInformation: string[];
}
export interface SourceRecord {
  id: string;
  type: 'request' | 'quotation' | 'cv' | 'customer-message' | 'policy';
  title: string;
  sender: string;
  receivedAt: string;
  fields: Record<string, string>;
  body: string;
}
export interface PreparedAction {
  title: string;
  destination: string;
  body: string;
  status: 'prepared' | 'approved' | 'returned' | 'escalated';
}
export interface Scenario {
  id: string;
  label: string;
  kind: ScenarioKind;
  summary: string;
  sourceRecords: SourceRecord[];
  stageSummaries: Record<AutomatedStageId, string>;
  decision: DecisionPacket;
  preparedAction: Omit<PreparedAction, 'status'>;
}
export interface WorkflowPack {
  id: PackId;
  label: string;
  eyebrow: string;
  description: string;
  featured: boolean;
  stages: readonly StageId[];
  scenarios: Scenario[];
}

export const EvidenceRefSchema = z.object({ sourceId: z.string().min(1), label: z.string().min(1), excerpt: z.string().min(1) });
export const PolicyCheckSchema = z.object({ id: z.string().min(1), label: z.string().min(1), result: z.enum(['pass', 'warn', 'fail']), detail: z.string().min(1) });
export const DecisionPacketSchema = z.object({
  recommendation: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low']),
  rationale: z.array(z.string().min(1)).min(1),
  evidence: z.array(EvidenceRefSchema).min(1),
  policyChecks: z.array(PolicyCheckSchema).min(1),
  missingInformation: z.array(z.string()),
});
export const SourceRecordSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['request', 'quotation', 'cv', 'customer-message', 'policy']),
  title: z.string().min(1),
  sender: z.string().min(1),
  receivedAt: z.string().min(1),
  fields: z.record(z.string(), z.string()),
  body: z.string().min(1),
});
export const ScenarioSchema = z.object({
  id: z.string().min(1), label: z.string().min(1), kind: z.enum(['happy', 'exception']), summary: z.string().min(1),
  sourceRecords: z.array(SourceRecordSchema).min(2),
  stageSummaries: z.object({ intake: z.string(), understand: z.string(), evaluate: z.string(), explain: z.string() }),
  decision: DecisionPacketSchema,
  preparedAction: z.object({ title: z.string(), destination: z.string(), body: z.string() }),
});
export const WorkflowPackSchema = z.object({
  id: z.enum(['procurement', 'recruitment', 'customer-operations']),
  label: z.string().min(1), eyebrow: z.string().min(1), description: z.string().min(1), featured: z.boolean(),
  stages: z.tuple([z.literal('intake'), z.literal('understand'), z.literal('evaluate'), z.literal('explain'), z.literal('human-gate'), z.literal('act-and-log')]),
  scenarios: z.array(ScenarioSchema).min(2),
});
