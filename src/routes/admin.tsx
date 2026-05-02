import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { LayoutDashboard, Users, Siren, Activity, Hospital, Shield, AlertOctagon, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const stats = [
    { label: "Active Users", value: "12,486", change: "+8.2%", icon: Users, color: "from-purple-500 to-fuchsia-500" },
    { label: "SOS Today", value: "247", change: "+12%", icon: Siren, color: "from-rose-500 to-pink-500" },
    { label: "Risk Logs", value: "1,892", change: "+3.4%", icon: Activity, color: "from-amber-500 to-orange-500" },
    { label: "Response Rate", value: "98.7%", change: "+0.4%", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ];

  const sections = [
    { icon: Users, title: "Manage Users", count: "12,486 users" },
    { icon: Siren, title: "Emergency Alert Monitoring", count: "247 active" },
    { icon: Activity, title: "Risk Logs", count: "1,892 entries" },
    { icon: Hospital, title: "Manage Hospitals", count: "382 verified" },
    { icon: Shield, title: "Manage Police Stations", count: "127 connected" },
    { icon: AlertOctagon, title: "Danger Zone Management", count: "23 zones flagged" },
  ];

  const recentAlerts = [
    { user: "Priya S.", type: "SOS Emergency", location: "Sector 5", time: "2 min ago", risk: "HIGH" },
    { user: "Anita R.", type: "Voice AI · Police", location: "MG Road", time: "8 min ago", risk: "MEDIUM" },
    { user: "Sneha K.", type: "Voice AI · Medical", location: "Park Avenue", time: "15 min ago", risk: "HIGH" },
    { user: "Riya M.", type: "Fake Call", location: "Mall Plaza", time: "22 min ago", risk: "LOW" },
    { user: "Kavya P.", type: "SOS Emergency", location: "Bus Stand", time: "31 min ago", risk: "HIGH" },
  ];

  const riskBadge = { HIGH: "bg-rose-500", MEDIUM: "bg-amber-500", LOW: "bg-emerald-500" } as const;

  return (
    <AppLayout>
      <PageHeader title="Admin Dashboard" subtitle="Real-time monitoring · Her_Shield Operations" icon={LayoutDashboard} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="glass-strong rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-emerald-600 font-semibold">{s.change}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-3">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Live Alert Feed</h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 hover:bg-white/90 transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {a.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{a.user} · <span className="text-muted-foreground font-normal">{a.type}</span></div>
                  <div className="text-xs text-muted-foreground">{a.location} · {a.time}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${riskBadge[a.risk as keyof typeof riskBadge]}`}>{a.risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-4">Analytics</h3>
          <div className="space-y-4">
            {[
              { label: "SOS Triggers", value: 75, color: "bg-rose-500" },
              { label: "Voice AI Detections", value: 60, color: "bg-purple-500" },
              { label: "Fake Calls", value: 35, color: "bg-amber-500" },
              { label: "Resolved Cases", value: 90, color: "bg-emerald-500" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>{m.label}</span><span>{m.value}%</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {sections.map((s) => (
          <button key={s.title} className="glass rounded-2xl p-5 text-left hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-3">
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold">{s.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.count}</div>
          </button>
        ))}
      </div>
    </AppLayout>
  );
}