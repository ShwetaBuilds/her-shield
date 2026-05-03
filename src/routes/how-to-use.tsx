import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { BookOpen, Siren, MapPin, Mic, PhoneCall, AudioLines, Users, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/how-to-use")({
  head: () => ({
    meta: [
      { title: "How to Use · Her_Shield" },
      { name: "description", content: "Step-by-step guide to using Her_Shield's safety modules — SOS, Smart Emergency Detection, Live Map, Trust Circle, and more." },
    ],
  }),
  component: HowToUse,
});

const guides = [
  {
    icon: Siren, color: "from-rose-500 to-pink-600", to: "/sos",
    title: "SOS Emergency",
    steps: [
      "Open the SOS module from the homepage.",
      "Tap the large red SOS button and confirm.",
      "Her_Shield instantly notifies every Trust Circle contact with your live GPS location.",
      "Audio capture begins automatically as evidence.",
    ],
  },
  {
    icon: Mic, color: "from-purple-500 to-fuchsia-600", to: "/voice-ai",
    title: "Smart Emergency Detection",
    steps: [
      "Open Smart Emergency Detection.",
      "Tap the mic — the AI listens for stress, panic & emergency keywords.",
      "Risk level (Low/Medium/High) and emergency type are detected automatically.",
      "On High risk, alerts and live location are escalated to police/medical services.",
    ],
  },
  {
    icon: MapPin, color: "from-pink-500 to-purple-500", to: "/map",
    title: "Live Location Map",
    steps: [
      "Allow location access when prompted.",
      "Your live position appears on a real interactive map.",
      "Filter Hospitals / Police / Medical Stores / Safe Places.",
      "Tap any pin and choose Directions for an optimised route.",
    ],
  },
  {
    icon: ShieldCheck, color: "from-fuchsia-500 to-pink-500", to: "/help-centers",
    title: "Nearest Safe Place",
    steps: [
      "View categorised lists: Hospitals, Police, Medical Stores, Safe Public Places.",
      "Each card shows name, address, contact, distance and open/closed status.",
      "Tap Directions to navigate, or Call to reach them instantly.",
    ],
  },
  {
    icon: Users, color: "from-purple-500 to-indigo-500", to: "/trust-circle",
    title: "Trust Circle",
    steps: [
      "Add up to 10+ trusted contacts with priority levels.",
      "High-priority contacts are notified first during an emergency.",
      "Edit or remove contacts anytime — changes save instantly.",
    ],
  },
  {
    icon: PhoneCall, color: "from-amber-500 to-orange-500", to: "/fake-call",
    title: "Fake Call",
    steps: [
      "Pick a caller name and a delay.",
      "Schedule the call discreetly to escape unsafe situations.",
      "A realistic full-screen incoming call appears on time.",
    ],
  },
  {
    icon: AudioLines, color: "from-rose-500 to-orange-400", to: "/audio-capture",
    title: "Auto Audio Capture",
    steps: [
      "Audio recording begins automatically during any SOS or High-risk detection.",
      "Recordings are timestamped and tagged by event type.",
      "Play or download them as tamper-proof evidence.",
    ],
  },
];

const workflow = [
  "User opens Her_Shield and is signed in to their safety dashboard.",
  "The app continuously monitors via Smart Emergency Detection (when enabled).",
  "On panic — voice signal, manual SOS, or fake-call escape — alerts are dispatched.",
  "Live location is shared with the Trust Circle and nearest safe places are surfaced.",
  "Audio capture creates an evidence log; Alert History keeps a permanent record.",
];

function HowToUse() {
  return (
    <AppLayout>
      <PageHeader title="How to Use Her_Shield" subtitle="A complete user guide to every safety module." icon={BookOpen} />

      <section className="glass-strong rounded-3xl p-8 mb-10">
        <h2 className="text-2xl font-bold">What is Her_Shield?</h2>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Her_Shield is a women-safety platform that combines instant SOS, real-time
          location sharing, AI-powered Smart Emergency Detection, and a trusted contacts
          network — designed to act in seconds when it matters most.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-5">Module-by-module guide</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {guides.map((g) => (
            <div key={g.title} className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center shadow-soft`}>
                  <g.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">{g.title}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {g.steps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
              <Link to={g.to} className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:gap-2 transition-all">
                Open module <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-strong rounded-3xl p-8">
        <h2 className="text-2xl font-bold">Full Emergency Workflow</h2>
        <ol className="mt-4 space-y-3">
          {workflow.map((w, i) => (
            <li key={w} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <p className="text-sm pt-1">{w}</p>
            </li>
          ))}
        </ol>
      </section>
    </AppLayout>
  );
}
