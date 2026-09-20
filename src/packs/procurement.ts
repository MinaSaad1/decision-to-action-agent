import { stageIds, type WorkflowPack } from '../engine/types';

export const procurementPack: WorkflowPack = {
  id: 'procurement', label: 'Procurement', eyebrow: 'Featured walkthrough', featured: true,
  description: 'Compare supplier offers, expose trade-offs, and prepare an accountable award decision.',
  stages: stageIds,
  scenarios: [
    {
      id: 'supplier-award', label: 'Supplier award', kind: 'happy',
      summary: 'Choose the best-value supplier for 120 industrial pumps under an explicit weighted policy.',
      sourceRecords: [
        { id: 'pr-1042', type: 'request', title: 'Purchase request PR-1042', sender: 'Northstar Facilities', receivedAt: '2026-09-18 09:12 GST', fields: { Quantity: '120 pumps', 'Required by': '2026-11-15', Currency: 'USD', Compliance: 'ISO 9001 required', Warranty: 'Minimum 24 months' }, body: 'Synthetic demonstration record. Evaluate total landed value, compliance, delivery, warranty, and payment terms.' },
        { id: 'aster-q', type: 'quotation', title: 'Aster Supply quotation', sender: 'Aster Supply', receivedAt: '2026-09-18 10:05 GST', fields: { 'Unit price': '$1,180', Total: '$141,600', Lead: '42 days', Payment: '50% advance', Validity: '30 days', Compliance: 'ISO 9001 attached', Warranty: '24 months' }, body: 'Synthetic quotation. Freight included. Earliest delivery, high advance payment.' },
        { id: 'cedar-q', type: 'quotation', title: 'Cedar Industrial quotation', sender: 'Cedar Industrial', receivedAt: '2026-09-18 11:22 GST', fields: { 'Unit price': '$1,145', Total: '$137,400', Lead: '55 days', Payment: 'Net 30', Validity: '45 days', Compliance: 'ISO 9001 attached', Warranty: '36 months' }, body: 'Synthetic quotation. Freight included. Strongest warranty and payment terms.' },
        { id: 'meridian-q', type: 'quotation', title: 'Meridian Trade quotation', sender: 'Meridian Trade', receivedAt: '2026-09-18 12:04 GST', fields: { 'Unit price': '$1,110', Total: '$133,200', Lead: '70 days', Payment: '30% advance', Validity: '21 days', Compliance: 'ISO 9001 attached', Warranty: '18 months' }, body: 'Synthetic quotation. Lowest price, but delivery and warranty miss required thresholds.' },
        { id: 'proc-policy', type: 'policy', title: 'Supplier award policy', sender: 'Northstar Facilities', receivedAt: '2026-09-18 08:00 GST', fields: { Price: '40%', Delivery: '25%', Compliance: '15%', Warranty: '10%', Payment: '10%' }, body: 'Synthetic policy. Failed mandatory compliance or warranty excludes an offer. Highest weighted score among eligible offers is recommended.' },
      ],
      stageSummaries: { intake: 'Received one request, three quotations, and the award policy.', understand: 'Normalized price, delivery, warranty, payment, validity, and compliance.', evaluate: 'Excluded one non-compliant offer and scored two eligible offers.', explain: 'Prepared a recommendation with record-level evidence and policy checks.' },
      decision: {
        recommendation: 'Recommend Cedar Industrial for award.', confidence: 'high',
        rationale: ['Cedar meets every mandatory requirement.', 'Its total is $4,200 lower than Aster while offering a longer warranty and better payment terms.', 'Meridian is cheaper but fails the minimum warranty and required delivery date.'],
        evidence: [
          { sourceId: 'cedar-q', label: 'Cedar quotation', excerpt: '$137,400 total, 55-day lead, Net 30, 36-month warranty.' },
          { sourceId: 'pr-1042', label: 'Purchase request', excerpt: 'Delivery by 2026-11-15 and minimum 24-month warranty.' },
          { sourceId: 'proc-policy', label: 'Award policy', excerpt: 'Mandatory failures exclude an offer before weighted scoring.' },
        ],
        policyChecks: [
          { id: 'mandatory', label: 'Mandatory requirements', result: 'pass', detail: 'Cedar meets compliance, delivery, and warranty thresholds.' },
          { id: 'value', label: 'Weighted value', result: 'pass', detail: 'Cedar ranks first among eligible offers.' },
          { id: 'validity', label: 'Offer validity', result: 'pass', detail: 'Cedar remains valid for 45 days.' },
        ], missingInformation: [],
      },
      preparedAction: { title: 'Supplier award recommendation', destination: 'Procurement approval queue', body: 'Approve Cedar Industrial for PR-1042 at $137,400, subject to final contract review.' },
    },
    {
      id: 'missing-compliance', label: 'Missing compliance document', kind: 'exception',
      summary: 'A lower-priced offer arrives without the mandatory compliance certificate.',
      sourceRecords: [
        { id: 'pr-1088', type: 'request', title: 'Purchase request PR-1088', sender: 'Northstar Facilities', receivedAt: '2026-09-19 09:10 GST', fields: { Quantity: '80 control valves', Compliance: 'ISO 9001 certificate required', Warranty: '24 months' }, body: 'Synthetic demonstration record. Missing compliance documents require escalation.' },
        { id: 'aster-1088', type: 'quotation', title: 'Aster Supply quotation', sender: 'Aster Supply', receivedAt: '2026-09-19 10:20 GST', fields: { Total: '$84,000', Lead: '35 days', Compliance: 'Certificate missing', Warranty: '24 months' }, body: 'Synthetic quotation. Supplier states certification is available but did not attach it.' },
        { id: 'policy-1088', type: 'policy', title: 'Compliance gate', sender: 'Northstar Facilities', receivedAt: '2026-09-19 08:00 GST', fields: { Rule: 'Do not award without certificate' }, body: 'Synthetic policy. Request clarification and escalate if a mandatory certificate is absent.' },
      ],
      stageSummaries: { intake: 'Received the request, quotation, and compliance gate.', understand: 'Extracted commercial terms and detected a missing attachment.', evaluate: 'Stopped award scoring because a mandatory gate failed.', explain: 'Prepared a clarification request and escalation with cited evidence.' },
      decision: {
        recommendation: 'Do not award yet. Request the missing certificate and escalate for review.', confidence: 'high',
        rationale: ['The supplier did not provide the mandatory ISO 9001 certificate.', 'Policy blocks award until the document is verified.'],
        evidence: [{ sourceId: 'aster-1088', label: 'Aster quotation', excerpt: 'Compliance: Certificate missing.' }, { sourceId: 'policy-1088', label: 'Compliance gate', excerpt: 'Do not award without certificate.' }],
        policyChecks: [{ id: 'certificate', label: 'Compliance certificate', result: 'fail', detail: 'Required certificate is not attached.' }, { id: 'commercial', label: 'Commercial terms', result: 'warn', detail: 'Terms were extracted but cannot be scored before compliance clears.' }],
        missingInformation: ['Current ISO 9001 certificate from Aster Supply'],
      },
      preparedAction: { title: 'Compliance escalation', destination: 'Procurement manager', body: 'Hold PR-1088. Ask Aster Supply for its current ISO 9001 certificate before evaluation resumes.' },
    },
  ],
};
