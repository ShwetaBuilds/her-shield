import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { Mic, Square, AlertTriangle, Shield, Hospital, Flame, X, Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/voice-ai")({
  head: () => ({
    meta: [
      { title: "Smart Emergency Detection · Her_Shield" },
      { name: "description", content: "AI-powered Smart Emergency Detection — listens for panic, stress, and emergency keywords." },
    ],
  }),
  component: VoiceAI,
});

type Risk = "LOW" | "MEDIUM" | "HIGH";
type EmergencyType = "Police" | "Medical" | "Fire" | "General";

function VoiceAI() {
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ risk: Risk; type: EmergencyType; transcript: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  const start = () => {
    setRecording(true);
    setResult(null);
    setProgress(0);
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          stop();
          return 100;
        }
        return p + 2;
      });
    }, 80);
  };

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRecording(false);
    // Mock AI result
    const risks: Risk[] = ["LOW", "MEDIUM", "HIGH"];
    const types: EmergencyType[] = ["Police", "Medical", "Fire", "General"];
    const risk = risks[Math.floor(Math.random() * 3)];
    const type = types[Math.floor(Math.random() * 4)];
    setResult({
      risk,
      type,
      transcript: "Help me please... I think someone is following me, I'm scared.",
    });
    if (risk === "HIGH") setShowPopup(true);

    const history = JSON.parse(localStorage.getItem("hs_alerts") || "[]");
    history.unshift({
      id: Date.now(),
      type: `Smart Detection · ${type}`,
      risk,
      time: new Date().toISOString(),
      sentTo: risk === "HIGH" ? "All contacts + Police" : "Logged",
      status: risk === "HIGH" ? "Escalated" : "Analyzed",
    });
    localStorage.setItem("hs_alerts", JSON.stringify(history));
  };

  const riskColor: Record<Risk, string> = {
    LOW: "from-emerald-500 to-teal-500",
    MEDIUM: "from-amber-500 to-orange-500",
    HIGH: "from-rose-500 to-pink-600",
  };

  const typeIcon: Record<EmergencyType, React.ComponentType<{ className?: string }>> = {
    Police: Shield, Medical: Hospital, Fire: Flame, General: AlertTriangle,
  };

  return (
    <AppLayout>
      <PageHeader title="Smart Emergency Detection" subtitle="AI listens for panic, stress, and emergency keywords in real time." icon={Mic} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recorder */}
        <div className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <div className="relative">
            <div className={`absolute -inset-12 rounded-full bg-primary/20 blur-3xl ${recording ? "animate-pulse" : ""}`} />
            <button
              onClick={recording ? stop : start}
              className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${recording ? "from-rose-500 to-pink-600" : "from-purple-500 to-fuchsia-600"} text-white shadow-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2`}
            >
              {recording ? <Square className="w-14 h-14" /> : <Mic className="w-14 h-14" />}
              <span className="text-sm font-semibold">{recording ? "Stop" : "Start Recording"}</span>
            </button>
          </div>
          <p className="relative mt-8 text-sm text-muted-foreground max-w-xs">
            {recording ? "Listening… AI is analyzing your voice in real-time." : "Tap the mic and speak. AI will detect stress, panic & emergency type."}
          </p>

          {recording && (
            <div className="relative mt-6 w-full max-w-sm">
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-center gap-1 mt-4 h-12 items-end">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-1.5 bg-gradient-primary rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 50}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className={`rounded-3xl p-6 text-white shadow-soft bg-gradient-to-br ${riskColor[result.risk]}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold opacity-90 uppercase tracking-wider">Risk Level</div>
                  <Activity className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-4xl font-bold mt-2">{result.risk} RISK</div>
                <div className="text-sm opacity-90 mt-1">Confidence · 94%</div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground font-semibold">Emergency type detected</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    {(() => { const I = typeIcon[result.type]; return <I className="w-5 h-5 text-white" />; })()}
                  </div>
                  <div className="font-bold text-lg">{result.type} Emergency</div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground font-semibold">Transcript</div>
                <p className="mt-2 text-sm italic">"{result.transcript}"</p>
              </div>
            </>
          ) : (
            <div className="glass rounded-3xl p-8 text-center text-muted-foreground min-h-[300px] flex flex-col items-center justify-center">
              <Activity className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Results will appear here after analysis.</p>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center shadow-glow">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Emergency Detected</h3>
                <p className="text-xs text-muted-foreground">High-risk situation identified by AI</p>
              </div>
              <button onClick={() => setShowPopup(false)} className="ml-auto"><X className="w-5 h-5" /></button>
            </div>

            <div className="mt-6 space-y-2">
              {[
                "Notifying nearest police station",
                "Notifying nearest hospital",
                "Sharing live location",
                "Triggering SOS alert",
                "Saving voice recording",
              ].map((a) => (
                <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-white/70 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {a}
                </div>
              ))}
            </div>

            <button onClick={() => setShowPopup(false)} className="w-full mt-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-soft">
              I'm safe now
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}