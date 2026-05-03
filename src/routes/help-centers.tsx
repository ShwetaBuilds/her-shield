import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { ShieldCheck, Phone, Navigation, MapPin, Hospital, Shield, Pill, Sparkles } from "lucide-react";
import { useState } from "react";
import { LiveMap, SAFE_PLACES, type Place } from "@/components/hershield/LiveMap";

export const Route = createFileRoute("/help-centers")({
  head: () => ({
    meta: [
      { title: "Nearest Safe Place · Her_Shield" },
      { name: "description", content: "Find the nearest hospitals, police stations, medical stores, and safe public places around you." },
    ],
  }),
  component: HelpCenters,
});

const sections: { key: Place["category"]; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: "Hospital", label: "Hospitals", icon: Hospital, color: "from-rose-500 to-pink-600" },
  { key: "Police", label: "Police Stations", icon: Shield, color: "from-blue-500 to-indigo-600" },
  { key: "Medical Store", label: "Medical Stores", icon: Pill, color: "from-emerald-500 to-teal-500" },
  { key: "Safe Place", label: "Safe Public Places", icon: Sparkles, color: "from-purple-500 to-fuchsia-600" },
];

function HelpCenters() {
  const [selected, setSelected] = useState<string | null>(null);

  const openMaps = (p: Place) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const dLat = pos.coords.latitude + p.offsetLat / 111320;
      const dLng = pos.coords.longitude + p.offsetLng / (111320 * Math.cos((pos.coords.latitude * Math.PI) / 180));
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${dLat},${dLng}&travelmode=driving`, "_blank");
    });
  };

  return (
    <AppLayout>
      <PageHeader title="Nearest Safe Place" subtitle="Verified hospitals, police, medical stores & safe public spaces around you." icon={ShieldCheck} />

      <div className="mb-8">
        <LiveMap places={SAFE_PLACES} selectedId={selected} onSelect={(p) => setSelected(p.id)} />
      </div>

      <div className="space-y-8">
        {sections.map((s) => {
          const items = SAFE_PLACES.filter((p) => p.category === s.key);
          return (
            <div key={s.key}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-soft`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">{s.label}</h2>
                <span className="text-xs text-muted-foreground">{items.length} nearby</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className={`glass rounded-2xl p-5 transition-all cursor-pointer hover:-translate-y-0.5 ${selected === p.id ? "ring-2 ring-primary/50" : ""}`}
                    onClick={() => setSelected(p.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-bold truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {p.address}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${p.open ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}>
                        {p.open ? "OPEN" : "CLOSED"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <a href={`tel:${p.phone}`} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {p.phone}
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); openMaps(p); }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-primary text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" /> Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
