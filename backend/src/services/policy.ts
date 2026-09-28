import { Category } from "./ai";

export type Decision = "Approved" | "Denied" | "Escalated";
export interface Check { rule: string; passed: boolean; note: string }
interface Input {
  amount: number;
  ageDays: number;
  finalSale: boolean;
  refunded: boolean;
  emailMatches: boolean;
  flagged: boolean;
  category: Category;
}

export const LIMITS = { windowDays: 30, changeOfMindDays: 14, reviewAbove: 500 };

// The only place a decision is made. Checks are logged in order for the audit trail.
export function evaluate(i: Input): { decision: Decision; checks: Check[] } {
  const checks: Check[] = [];
  const finish = (decision: Decision) => ({ decision, checks });
  const check = (rule: string, passed: boolean, note: string) => checks.push({ rule, passed, note });

  check("Identity", i.emailMatches, i.emailMatches ? "Email matches the order." : "Email does not match the order owner.");
  check("Message safety", !i.flagged, i.flagged ? "Message tried to steer the decision or looked suspicious." : "No manipulation detected.");
  if (!i.emailMatches || i.flagged) return finish("Escalated");

  check("Already refunded", !i.refunded, i.refunded ? "This order was already refunded." : "No earlier refund.");
  if (i.refunded) return finish("Denied");

  check("Final sale", !i.finalSale, i.finalSale ? "Final sale items are not refundable." : "Item is refundable.");
  if (i.finalSale) return finish("Denied");

  const inWindow = i.ageDays <= LIMITS.windowDays;
  check("Refund window", inWindow, `Order is ${i.ageDays} days old (limit ${LIMITS.windowDays}).`);
  if (!inWindow) return finish("Denied");

  const small = i.amount <= LIMITS.reviewAbove;
  check("Amount", small, small ? `$${i.amount} is under the review limit.` : `$${i.amount} needs human review (over $${LIMITS.reviewAbove}).`);
  if (!small) return finish("Escalated");

  if (i.category === "damaged" || i.category === "incorrect_item") {
    check("Reason", true, "Damaged or incorrect item qualifies.");
    return finish("Approved");
  }
  if (i.category === "changed_mind") {
    const ok = i.ageDays <= LIMITS.changeOfMindDays;
    check("Change of mind", ok, ok ? "Within the change-of-mind window." : `Change of mind is only accepted within ${LIMITS.changeOfMindDays} days.`);
    return finish(ok ? "Approved" : "Denied");
  }
  check("Reason", false, "Reason is unclear, a person should look.");
  return finish("Escalated");
}
