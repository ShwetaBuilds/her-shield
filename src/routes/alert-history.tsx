import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { History, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/alert-history")({
  component: AlertHistory,
});

type Alert = { id: number; type: string; risk: string; time: string; sentTo: string; status: string };

const seed: Alert[] = [
  { id: 1, type: "SOS Emergency", risk: "HIGH", time: "2026-04-29T21:42:00", sentTo: "All trusted contacts", status: "Delivered" },
  { id: 2, type: "Voice AI · Police", risk: "MEDIUM", time: "2026-04-21T18:10:00", sentTo: "Logged", status: "Analyzed" },
  { id: 3, type: "Voice AI · Medical", risk: "HIGH", time: "2026-04-12T23:15:00", sentTo: "All contacts + Hospital", status: "Escalated" },
  { id: 4, type: "Fake Call", risk: "LOW", time: "2026-04-08T14:30:00", sentTo: "Self", status: "Triggered" },
];

const riskBadge = { HIGH: "bg-rose-500", MEDIUM: "bg-amber-500", LOW: "bg-emerald-500" } as const;

function AlertHistory() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hs_alerts") || "[]") as Alert[];
    setAlerts([...saved, ...seed]);
  }, []);

  const stats = [
    { label: "Total Alerts", value: alerts.length, color: "from-purple-500 to-fuchsia-500" },
    { label: "High Risk", value: alerts.filter((a) => a.risk === "HIGH").length, color: "from-rose-500 to-pink-500" },
    { label: "Resolved", value: alerts.filter((a) => a.status === "Delivered" || a.status === "Escalated").length, color: "from-emerald-500 to-teal-500" },
    { label: "This Month", value: alerts.length, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <AppLayout>
      <PageHeader title="Alert History" subtitle="Every alert, perfectly logged." icon={History} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className={`text-3xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
          <div className="col-span-3">Type</div>
          <div className="col-span-2">Risk</div>
          <div className="col-span-3">Time</div>
          <div className="col-span-3">Sent To</div>
          <div className="col-span-1">Status</div>
        </div>
        {alerts.map((a) => (
          <div key={a.id} className="grid sm:grid-cols-12 gap-3 px-6 py-4 border-b border-border/50 hover:bg-white/40 transition-all items-center text-sm">
            <div className="col-span-3 font-semibold">{a.type}</div>
            <div className="col-span-2"><span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${riskBadge[a.risk as keyof typeof riskBadge] ?? "bg-slate-500"}`}>{a.risk}</span></div>
            <div className="col-span-3 text-muted-foreground">{new Date(a.time).toLocaleString()}</div>
            <div className="col-span-3 text-muted-foreground">{a.sentTo}</div>
            <div className="col-span-1 flex items-center gap-1 text-emerald-600 font-semibold text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> {a.status}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}