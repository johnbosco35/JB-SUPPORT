import { useState } from "react";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [tab, setTab] = useState<"customer" | "support">("customer");
  return (
    <>
      <header className="top">
        <div className="brand"><span className="tape" />JB Support</div>
        <nav>
          <button className={tab === "customer" ? "on" : ""} onClick={() => setTab("customer")}>Request a refund</button>
          <button className={tab === "support" ? "on" : ""} onClick={() => setTab("support")}>Support desk</button>
        </nav>
      </header>
      <main>{tab === "customer" ? <Chat /> : <Dashboard />}</main>
    </>
  );
}
