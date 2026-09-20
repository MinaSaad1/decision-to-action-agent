import type { AgentRunResult } from './deterministicDriver';
import type { PreparedAction, ReviewDecision, Scenario, StageId } from './types';
export interface AuditEvent { id:string; at:string; label:string; detail:string }
export interface RunState { scenario:Scenario|null; status:'idle'|'running'|'review'|'complete'|'error'; activeStage:StageId|null; completedStages:StageId[]; result:AgentRunResult|null; review:ReviewDecision|null; action:PreparedAction|null; audit:AuditEvent[]; error:string|null }
export const initialRunState:RunState={scenario:null,status:'idle',activeStage:null,completedStages:[],result:null,review:null,action:null,audit:[],error:null};
export type RunEvent=
|{type:'START_RUN';scenario:Scenario}|{type:'STAGE_COMPLETED';stage:Exclude<StageId,'human-gate'|'act-and-log'>}|{type:'RUN_READY_FOR_REVIEW';result:AgentRunResult}|{type:'REVIEW_SUBMITTED';decision:ReviewDecision}|{type:'RESET'}|{type:'RUN_FAILED';message:string};
const audit=(label:string,detail:string):AuditEvent=>({id:`${Date.now()}-${Math.random()}`,at:new Date().toISOString(),label,detail});
export function runReducer(state:RunState,event:RunEvent):RunState{
 if(event.type==='RESET') return initialRunState;
 if(event.type==='START_RUN') return {...initialRunState,scenario:event.scenario,status:'running',activeStage:'intake',audit:[audit('Run started',event.scenario.label)]};
 if(event.type==='RUN_FAILED') return {...state,status:'error',error:event.message,activeStage:null,audit:[...state.audit,audit('Run failed',event.message)]};
 if(event.type==='STAGE_COMPLETED'){
  const order=['intake','understand','evaluate','explain'] as const; const expected=order[state.completedStages.length];
  if(state.status!=='running'||event.stage!==expected) return {...state,error:`Unexpected stage: ${event.stage}`};
  const next=order[state.completedStages.length+1]??'human-gate';
  return {...state,completedStages:[...state.completedStages,event.stage],activeStage:next,audit:[...state.audit,audit(`${event.stage} complete`,state.scenario?.stageSummaries[event.stage]??'')]};
 }
 if(event.type==='RUN_READY_FOR_REVIEW') return {...state,status:'review',activeStage:'human-gate',result:event.result,audit:[...state.audit,audit('Ready for human review',event.result.decision.recommendation)]};
 if(event.type==='REVIEW_SUBMITTED'){
  if(state.status!=='review'||!state.scenario) return {...state,error:'Review is not available yet.'};
  const status=event.decision==='approved'?'approved':event.decision;
  return {...state,status:'complete',activeStage:'act-and-log',review:event.decision,action:{...state.scenario.preparedAction,status},completedStages:[...state.completedStages,'human-gate','act-and-log'],audit:[...state.audit,audit(`Human review: ${event.decision}`,state.scenario.preparedAction.title),audit('Action prepared','No external system was changed.')]};
 }
 return state;
}
