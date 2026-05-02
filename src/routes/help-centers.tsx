import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { Hospital, Phone, Navigation, Shield, Pill, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/help-centers")({
  component: HelpCenters,
});

const centers = [
  { icon: Shield, name: "Sector 5 Police Station", category: "Police", distance: "0.8 km", phone: "100", color: "from-blue-500 to-indigo-600" },
  { icon: Hospital, name: "City Care Hospital", category: "Hospital", distance: "1.2 km", phone: "102", color: "from-rose-500 to-pink-600" },
  { icon: Pill, name: "Apollo Pharmacy", category: "Medical Store", distance: "0.4 km", phone: "+91 98765 43210", color: "from-emerald-500 to-teal-500" },
  { icon: ShieldCheck, name: "Mall Plaza Safe Zone", category: "Safe Zone", distance: "0.6 km", phone: "1091", color: "from-purple-500 to-fuchsia-600" },
  { icon: Hospital, name: "Lifeline Multispecialty", category: "Hospital", distance: "2.1 km", phone: "+91 99887 76655", color: "from-rose-500 to-pink-600" },
  { icon: Shield, name: "MG Road Police Outpost", category: "Police", distance: "1.5 km", phone: "100", color: "from-blue-500 to-indigo-600" },
  { icon: Pill, name: "MedPlus 24/7", category: "Medical Store", distance: "1.0 km", phone: "+91 91234 56789", color: "from-emerald-500 to-teal-500" },
  { icon: ShieldCheck, name: "University Safe Zone", category: "Safe Zone", distance: "1.8 km", phone: "1091", color: "from-purple-500 to-fuchsia-600" },
];

function HelpCenters() {
  return (
    <AppLayout>
      <PageHeader title="Nearby Help Centers" subtitle="Verified safe places, sorted by distance." icon={Hospital} />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Police", "Hospital", "Medical Store", "Safe Zone"].map((c, i) => (
          <button key={c} className={`px-4 py-2 rounded-full text-sm font-semibold ${i === 0 ? "bg-gradient-primary text-white shadow-soft" : "glass"}`}>{c}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {centers.map((c) => (
          <div key={c.name} className="glass rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-all">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-soft shrink-0`}>
              <c.icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.category}</div>
                </div>
                <span className="text-xs font-semibold text-primary whitespace-nowrap">{c.distance}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <a href={`tel:${c.phone}`} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {c.phone}
                </a>
                <button className="px-3 py-1.5 rounded-xl bg-white/70 border border-border text-xs font-semibold flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> Directions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}