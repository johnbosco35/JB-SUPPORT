export type Decision = "Approved" | "Denied" | "Escalated";
export interface Check { rule: string; passed: boolean; note: string }
export interface Refund {
  _id: string; orderNumber: string; email: string; item: string; amount: number; message: string;
  category: string; summary: string; flagged: boolean; decision: Decision; checks: Check[];
  reply: string; aiUsed: boolean; createdAt: string;
}
