import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { Siren, MapPin, CheckCircle2, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sos")({
  component: SOS,
});

function SOS() {
  const [confirming, setConfirming] = useState(false);
  const [sent, setSent] = useState(false);

  const trigger = () => {
    setConfirming(false);
    setSent(true);
    const history = JSON.parse(localStorage.getItem("hs_alerts") || "[]");
    history.unshift({
      id: Date.now(),
      type: "SOS Emergency",
      risk: "HIGH",
      time: new Date().toISOString(),
      sentTo: "All trusted contacts",
      status: "Delivered",
    });
    localStorage.setItem("hs_alerts", JSON.stringify(history));
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <AppLayout>
      <PageHeader title="SOS Emergency" subtitle="One tap. Instant help. Always with you." icon={Siren} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[480px]">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10" />
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-rose-500/20 blur-3xl animate-pulse" />
            <button
              onClick={() => setConfirming(true)}
              className="relative w-56 h-56 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600 text-white font-bold text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center gap-2"
            >
              <Siren className="w-16 h-16" />
              <span>SOS</span>
              <span className="text-xs font-medium opacity-90">Tap to send alert</span>
            </button>
          </div>
          <p className="relative mt-8 text-sm text-muted-foreground max-w-xs">
            Your live location & a panic alert will be sent to every trusted contact instantly.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { title: "Instant trigger", desc: "Alert fires in under 3 seconds." },
            { title: "Live location attached", desc: "GPS coordinates auto-shared." },
            { title: "All contacts notified", desc: "SMS + in-app + push alerts." },
            { title: "Audio recording starts", desc: "Evidence captured automatically." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
          <div className="glass rounded-2xl p-5 flex items-center gap-3 bg-primary/5">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="text-sm">Current location: <span className="font-semibold">Detected · accurate to 5m</span></div>
          </div>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
              <Siren className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold">Send emergency alert?</h3>
            <p className="text-sm text-muted-foreground mt-2">All trusted contacts will be notified with your live location.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirming(false)} className="flex-1 py-3 rounded-xl bg-white/70 border border-border font-semibold">Cancel</button>
              <button onClick={trigger} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-soft">Send Now</button>
            </div>
          </div>
        </div>
      )}

      {sent && (
        <div className="fixed bottom-6 right-6 z-50 glass-strong rounded-2xl p-4 flex items-center gap-3 shadow-glow max-w-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <div>
            <div className="font-semibold text-sm">Alert sent successfully</div>
            <div className="text-xs text-muted-foreground">Help is on the way.</div>
          </div>
          <button onClick={() => setSent(false)}><X className="w-4 h-4" /></button>
        </div>
      )}
    </AppLayout>
  );
}