import type { PackId } from '../engine/types';
import { WorkflowPackSchema } from '../engine/types';
import { customerOperationsPack } from './customerOperations';
import { procurementPack } from './procurement';
import { recruitmentPack } from './recruitment';

export const workflowPacks = [procurementPack, recruitmentPack, customerOperationsPack] as const;
workflowPacks.forEach((pack) => WorkflowPackSchema.parse(pack));
export function getWorkflowPack(id: PackId) { return workflowPacks.find((pack) => pack.id === id) ?? procurementPack; }
