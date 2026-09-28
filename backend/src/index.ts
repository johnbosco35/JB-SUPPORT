import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import refundRoutes from "./routes/refund.routes";
import { seed } from "./seed";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use("/api/refunds", refundRoutes);
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side." });
});
// "mongodb://127.0.0.1/refunds"
async function start() {
  await mongoose.connect("mongodb+srv://okonkwovincent63:Johnbosco9@cluster0.bxymejq.mongodb.net/refundAiDB?appName=Cluster0");
  await seed();
  app.listen(5000, () => console.log("API on :5000"));
}
start();
