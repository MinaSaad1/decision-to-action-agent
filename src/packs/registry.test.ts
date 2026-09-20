import { describe, expect, it } from 'vitest';
import { WorkflowPackSchema } from '../engine/types';
import { procurementPack } from './procurement';
import { workflowPacks } from './registry';

describe('workflow pack registry', () => {
  it('registers three valid packs in buyer order', () => {
    expect(workflowPacks.map((pack) => pack.id)).toEqual(['procurement', 'recruitment', 'customer-operations']);
    expect(workflowPacks.every((pack) => pack.stages.length === 6)).toBe(true);
    expect(() => workflowPacks.forEach((pack) => WorkflowPackSchema.parse(pack))).not.toThrow();
  });
  it('features procurement with an exception path', () => {
    expect(procurementPack.featured).toBe(true);
    expect(procurementPack.scenarios.some((scenario) => scenario.kind === 'exception')).toBe(true);
  });
});
