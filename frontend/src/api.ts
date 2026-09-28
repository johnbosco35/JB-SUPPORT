import { Refund } from "./types";

export async function submitRefund(body: { email: string; orderNumber: string; message: string }): Promise<Refund> {
  const res = await fetch("/api/refunds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function fetchRefunds(): Promise<Refund[]> {
  const res = await fetch("/api/refunds");
  if (!res.ok) throw new Error("Could not load requests");
  return res.json();
}
