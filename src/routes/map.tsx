import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { MapPin, Navigation, Phone, Shield, Hospital, Pill, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

const places = [
  { icon: Shield, name: "Sector 5 Police Station", type: "Police", distance: "0.8 km", phone: "100", color: "bg-blue-500" },
  { icon: Hospital, name: "City Care Hospital", type: "Hospital", distance: "1.2 km", phone: "102", color: "bg-rose-500" },
  { icon: Pill, name: "Apollo Pharmacy", type: "Medical Store", distance: "0.4 km", phone: "+91 98765 43210", color: "bg-emerald-500" },
  { icon: ShieldCheck, name: "Women Safe Zone – Mall Plaza", type: "Safe Zone", distance: "0.6 km", phone: "1091", color: "bg-purple-500" },
  { icon: Hospital, name: "Lifeline Multispecialty", type: "Hospital", distance: "2.1 km", phone: "+91 99887 76655", color: "bg-rose-500" },
  { icon: Shield, name: "MG Road Police Outpost", type: "Police", distance: "1.5 km", phone: "100", color: "bg-blue-500" },
];

function MapPage() {
  return (
    <AppLayout>
      <PageHeader title="Live Location Map" subtitle="Find help around you in seconds." icon={MapPin} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map mock */}
        <div className="lg:col-span-2 glass-strong rounded-3xl overflow-hidden h-[500px] relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(236,72,153,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.15) 0%, transparent 40%), linear-gradient(135deg, #fce7f3, #f3e8ff, #fef3c7)",
            }}
          />
          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Pins */}
          {[
            { x: "30%", y: "40%", color: "bg-rose-500" },
            { x: "65%", y: "30%", color: "bg-blue-500" },
            { x: "55%", y: "65%", color: "bg-emerald-500" },
            { x: "25%", y: "70%", color: "bg-purple-500" },
          ].map((p, i) => (
            <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
              <div className={`w-8 h-8 rounded-full ${p.color} shadow-glow flex items-center justify-center -translate-x-1/2 -translate-y-1/2`}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}

          {/* You marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/30 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow border-4 border-white">
                <Navigation className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 glass-strong rounded-2xl p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Your location</div>
              <div className="font-semibold text-sm">123 Park Avenue, Sector 5 · Live</div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold">Share</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {places.map((p) => (
            <div key={p.name} className="glass rounded-2xl p-4 flex items-start gap-3 hover:bg-white/90 transition-all">
              <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center shrink-0`}>
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.type} · {p.distance}</div>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {p.phone}
                  </button>
                  <button className="text-xs px-2.5 py-1 rounded-lg bg-white/70 border border-border font-semibold">Navigate</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}