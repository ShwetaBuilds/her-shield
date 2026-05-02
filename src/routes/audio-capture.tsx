import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { AudioLines, Play, Download, Circle } from "lucide-react";

export const Route = createFileRoute("/audio-capture")({
  component: AudioCapture,
});

const recordings = [
  { date: "2026-04-29", time: "21:42", duration: "01:24", type: "SOS Trigger", risk: "HIGH" },
  { date: "2026-04-21", time: "18:10", duration: "00:48", type: "Voice AI · Police", risk: "MEDIUM" },
  { date: "2026-04-12", time: "23:15", duration: "02:11", type: "SOS Trigger", risk: "HIGH" },
  { date: "2026-04-03", time: "07:55", duration: "00:32", type: "Voice AI · General", risk: "LOW" },
  { date: "2026-03-28", time: "20:01", duration: "01:55", type: "Voice AI · Medical", risk: "MEDIUM" },
];

const riskBadge = {
  HIGH: "bg-rose-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-emerald-500",
} as const;

function AudioCapture() {
  return (
    <AppLayout>
      <PageHeader title="Auto Audio Capture" subtitle="Tamper-proof evidence storage from emergencies." icon={AudioLines} />

      <div className="glass-strong rounded-3xl p-6 mb-6 flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-pulse" />
          <div className="relative w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
            <Circle className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold">Auto-recording: <span className="text-emerald-600">ENABLED</span></div>
          <div className="text-sm text-muted-foreground">Audio capture starts automatically during any emergency event.</div>
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-2 overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-1">Duration</div>
          <div className="col-span-3">Type</div>
          <div className="col-span-2">Risk</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        <div className="space-y-2">
          {recordings.map((r, i) => (
            <div key={i} className="grid sm:grid-cols-12 gap-3 px-4 py-4 rounded-2xl bg-white/60 hover:bg-white/90 transition-all items-center">
              <div className="col-span-2 font-semibold text-sm">{r.date}</div>
              <div className="col-span-1 text-sm">{r.time}</div>
              <div className="col-span-1 text-sm font-mono">{r.duration}</div>
              <div className="col-span-3 text-sm">{r.type}</div>
              <div className="col-span-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${riskBadge[r.risk as keyof typeof riskBadge]}`}>{r.risk}</span>
              </div>
              <div className="col-span-3 flex gap-2 sm:justify-end">
                <button className="px-3 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold flex items-center gap-1">
                  <Play className="w-3 h-3" /> Play
                </button>
                <button className="px-3 py-2 rounded-xl bg-white/70 border border-border text-xs font-semibold flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}