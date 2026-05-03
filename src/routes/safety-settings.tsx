import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { ShieldAlert, Mic, Smartphone, Volume2, Power, Plus, X, CheckCircle2, Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  loadSilent, saveSilent, loadVoice, saveVoice, logAlert,
  type SilentTrigger,
} from "@/lib/safety";

export const Route = createFileRoute("/safety-settings")({
  head: () => ({
    meta: [
      { title: "Safety Settings · Her_Shield" },
      { name: "description", content: "Configure Silent SOS, Emergency Voice Command and trigger preferences." },
    ],
  }),
  component: SafetySettings,
});

function SafetySettings() {
  const [silent, setSilent] = useState(loadSilent());
  const [voice, setVoice] = useState(loadVoice());
  const [newKeyword, setNewKeyword] = useState("");
  const [micTesting, setMicTesting] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [shakeStatus, setShakeStatus] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => saveSilent(silent), [silent]);
  useEffect(() => saveVoice(voice), [voice]);

  // ---- Mic test ----
  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicTesting(true);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setMicLevel(Math.min(100, (avg / 128) * 100));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      // auto-stop after 6s
      setTimeout(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
        setMicTesting(false);
        setMicLevel(0);
      }, 6000);
    } catch {
      setMicTesting(false);
      alert("Microphone permission denied.");
    }
  };

  // ---- Shake test ----
  const testShake = () => {
    setShakeStatus("Listening for shake… move your device for 5 seconds");
    let count = 0;
    let last = { x: 0, y: 0, z: 0, t: 0 };
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const now = Date.now();
      if (now - last.t > 100) {
        const dx = (a.x || 0) - last.x;
        const dy = (a.y || 0) - last.y;
        const dz = (a.z || 0) - last.z;
        const speed = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (speed > 18 - silent.sensitivity) count++;
        last = { x: a.x || 0, y: a.y || 0, z: a.z || 0, t: now };
      }
    };
    window.addEventListener("devicemotion", handler);
    setTimeout(() => {
      window.removeEventListener("devicemotion", handler);
      setShakeStatus(count > 3 ? `✅ Shake detected ${count} times — trigger works!` : "No strong shake detected. Try increasing sensitivity.");
      setTimeout(() => setShakeStatus(null), 5000);
    }, 5000);
  };

  // ---- Simulate silent trigger ----
  const simulate = () => {
    logAlert({
      type: "Silent SOS Trigger",
      risk: "HIGH",
      sentTo: "All trusted contacts + Police",
      status: "Escalated",
    });
    alert("Silent SOS simulated! Check Alert History — emergency was triggered without opening the app.");
  };

  const addKeyword = () => {
    const k = newKeyword.trim().toLowerCase();
    if (!k || voice.keywords.includes(k)) return;
    setVoice({ ...voice, keywords: [...voice.keywords, k] });
    setNewKeyword("");
  };

  const removeKeyword = (k: string) => {
    setVoice({ ...voice, keywords: voice.keywords.filter((x) => x !== k) });
  };

  const triggerOptions: { id: SilentTrigger; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: "shake", label: "Phone Shake", icon: Smartphone, desc: "Shake the device firmly to trigger." },
    { id: "volume", label: "Volume Pattern", icon: Volume2, desc: "Press Volume Down 3 times quickly." },
    { id: "power", label: "Power Pattern", icon: Power, desc: "Press Power button 3 times rapidly." },
  ];

  return (
    <AppLayout>
      <PageHeader title="Safety Settings" subtitle="Configure hidden triggers, voice commands and emergency keywords." icon={ShieldAlert} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ============ Silent SOS ============ */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Hidden trigger</div>
              <h2 className="text-2xl font-bold mt-1">Silent SOS Trigger 🤫</h2>
              <p className="text-sm text-muted-foreground mt-1">Activate emergency without opening the app.</p>
            </div>
            <Toggle on={silent.enabled} onChange={(v) => setSilent({ ...silent, enabled: v })} />
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Trigger method</div>
            {triggerOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => setSilent({ ...silent, trigger: o.id })}
                disabled={!silent.enabled}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  silent.trigger === o.id
                    ? "bg-gradient-primary text-white border-transparent shadow-soft"
                    : "bg-white/70 border-border hover:bg-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${silent.trigger === o.id ? "bg-white/20" : "bg-gradient-primary"}`}>
                  <o.icon className={`w-5 h-5 ${silent.trigger === o.id ? "text-white" : "text-white"}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{o.label}</div>
                  <div className={`text-xs ${silent.trigger === o.id ? "text-white/80" : "text-muted-foreground"}`}>{o.desc}</div>
                </div>
                {silent.trigger === o.id && <CheckCircle2 className="w-5 h-5" />}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
              <span>Sensitivity</span>
              <span className="text-primary">{silent.sensitivity}/10</span>
            </div>
            <input
              type="range" min={1} max={10} value={silent.sensitivity}
              disabled={!silent.enabled}
              onChange={(e) => setSilent({ ...silent, sensitivity: Number(e.target.value) })}
              className="w-full mt-2 accent-pink-500 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Less sensitive</span><span>More sensitive</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={testShake}
              disabled={!silent.enabled || silent.trigger !== "shake"}
              className="py-3 rounded-xl bg-white/80 border border-border font-semibold text-sm disabled:opacity-50"
            >
              Test trigger
            </button>
            <button
              onClick={simulate}
              disabled={!silent.enabled}
              className="py-3 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-soft disabled:opacity-50"
            >
              Simulate Silent SOS
            </button>
          </div>
          {shakeStatus && (
            <div className="mt-3 text-xs p-3 rounded-xl bg-white/70 border border-border">{shakeStatus}</div>
          )}
        </div>

        {/* ============ Voice Command ============ */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Hands-free</div>
              <h2 className="text-2xl font-bold mt-1">Emergency Voice Command 🎤</h2>
              <p className="text-sm text-muted-foreground mt-1">Say a keyword to instantly trigger SOS.</p>
            </div>
            <Toggle on={voice.enabled} onChange={(v) => setVoice({ ...voice, enabled: v })} />
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Emergency keywords</div>
            <div className="flex flex-wrap gap-2">
              {voice.keywords.map((k) => (
                <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-primary text-white text-xs font-semibold shadow-soft">
                  "{k}"
                  <button onClick={() => removeKeyword(k)} disabled={!voice.enabled} className="hover:bg-white/20 rounded-full p-0.5 disabled:opacity-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                disabled={!voice.enabled}
                placeholder="Add custom keyword e.g. 'rescue me'"
                className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              />
              <button
                onClick={addKeyword}
                disabled={!voice.enabled}
                className="px-4 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-soft disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Test microphone</div>
            <button
              onClick={startMicTest}
              disabled={micTesting}
              className="w-full py-3 rounded-xl bg-white/80 border border-border font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Mic className="w-4 h-4" /> {micTesting ? "Listening… speak now" : "Start microphone test"}
            </button>
            {micTesting && (
              <div className="mt-3">
                <div className="h-3 rounded-full bg-white/60 overflow-hidden">
                  <div className="h-full bg-gradient-primary transition-all" style={{ width: `${micLevel}%` }} />
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" /> Mic level — {Math.round(micLevel)}%
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
            💡 When enabled, Her_Shield listens in the background. If a keyword is detected, SOS fires automatically — recording starts, location is shared, and trusted contacts are notified.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${on ? "bg-gradient-primary" : "bg-muted"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}