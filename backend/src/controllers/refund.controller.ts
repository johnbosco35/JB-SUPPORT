import { Request, Response } from "express";
import Order from "../models/Order";
import RefundRequest from "../models/RefundRequest";
import { analyse, looksLikeInjection, writeReply } from "../services/ai";
import { evaluate } from "../services/policy";

export async function createRefund(req: Request, res: Response) {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const orderNumber = String(req.body.orderNumber ?? "").trim().toUpperCase();
  const message = String(req.body.message ?? "").trim().slice(0, 1000);
  if (!email || !orderNumber || !message) return res.status(400).json({ error: "Email, order number and message are required." });

  const order = await Order.findOne({ orderNumber }).populate<{ customer: { email: string } }>("customer");
  if (!order) return res.status(404).json({ error: `We couldn't find order ${orderNumber}.` });

  const analysis = await analyse(message);
  const flagged = looksLikeInjection(message) || analysis.suspicious;
  const ageDays = Math.floor((Date.now() - order.purchasedAt.getTime()) / 86_400_000);

  const { decision, checks } = evaluate({
    amount: order.amount,
    ageDays,
    finalSale: order.finalSale,
    refunded: order.refunded,
    emailMatches: order.customer.email === email,
    flagged,
    category: analysis.category,
  });

  const reply = await writeReply(decision, order.item, checks.filter((c) => !c.passed).map((c) => c.note));
  const saved = await RefundRequest.create({
    orderNumber, email, item: order.item, amount: order.amount, message,
    category: analysis.category, summary: analysis.summary, flagged, decision, checks, reply, aiUsed: analysis.aiUsed,
  });
  res.status(201).json(saved);
}

export async function listRefunds(_req: Request, res: Response) {
  res.json(await RefundRequest.find().sort({ createdAt: -1 }).limit(100));
}
