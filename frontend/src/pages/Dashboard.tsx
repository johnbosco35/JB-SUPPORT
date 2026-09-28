import { useEffect, useState } from "react";
import { fetchRefunds } from "../api";
import { Decision, Refund } from "../types";

const filters: ("All" | Decision)[] = ["All", "Approved", "Denied", "Escalated"];

export default function Dashboard() {
  const [rows, setRows] = useState<Refund[]>([]);
  const [filter, setFilter] = useState<"All" | Decision>("All");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => fetchRefunds().then(setRows).catch((e) => setError(e.message));
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  const count = (d: "All" | Decision) => (d === "All" ? rows.length : rows.filter((r) => r.decision === d).length);
  const shown = filter === "All" ? rows : rows.filter((r) => r.decision === filter);

  return (
    <div className="desk">
      <h1>Support desk</h1>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        {filters.map((f) => (
          <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>{f} <b>{count(f)}</b></button>
        ))}
      </div>
      {shown.length === 0 && <p className="empty">No requests here yet. Submit one from the customer page.</p>}
      <div className="rows">
        {shown.map((r) => (
          <div key={r._id} className={`row ${open === r._id ? "open" : ""}`}>
            <button className="summary" onClick={() => setOpen(open === r._id ? null : r._id)}>
              <span className={`dot ${r.decision.toLowerCase()}`} />
              <span className="what"><b>{r.item}</b><small>{r.orderNumber} · {r.email}</small></span>
              <span className="amt">${r.amount}</span>
              <span className={`tag ${r.decision.toLowerCase()}`}>{r.decision}</span>
              <time>{new Date(r.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</time>
            </button>
            {open === r._id && (
              <div className="audit">
                <p className="quote">“{r.message}”</p>
                <p><b>AI read:</b> {r.category.replace("_", " ")}. {r.summary} {r.aiUsed ? "" : "(keyword fallback, no model call)"}</p>
                {r.flagged && <p className="warn">Flagged as a possible attempt to steer the decision.</p>}
                <ul>{r.checks.map((c) => (<li key={c.rule} className={c.passed ? "pass" : "fail"}><b>{c.rule}</b> {c.note}</li>))}</ul>
                <p><b>Reply sent:</b> {r.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
