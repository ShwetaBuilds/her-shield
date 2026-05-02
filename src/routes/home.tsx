import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/hershield/AppLayout";
import {
  Siren, MapPin, Mic, Users, Hospital, AudioLines, Shield, ArrowRight, Sparkles,
} from "lucide-react";
import heroImg from "@/assets/hero.png";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home · Her_Shield" },
      { name: "description", content: "Her_Shield dashboard — your safety command center." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Siren, title: "One-Tap SOS Alert", desc: "Trigger instant emergency alerts to all your trusted contacts.", color: "from-pink-500 to-rose-500" },
  { icon: MapPin, title: "Live Location Tracking", desc: "Real-time location shared with your circle when it matters most.", color: "from-purple-500 to-fuchsia-500" },
  { icon: Mic, title: "AI Voice Detection", desc: "Detects panic, stress, and emergency keywords automatically.", color: "from-rose-500 to-orange-400" },
  { icon: Users, title: "Trusted Circle", desc: "Add up to 10+ contacts with priority-based emergency routing.", color: "from-fuchsia-500 to-pink-500" },
  { icon: Hospital, title: "Nearby Hospitals & Police", desc: "Find the closest verified safe places in seconds.", color: "from-purple-500 to-indigo-500" },
  { icon: AudioLines, title: "Emergency Audio Recording", desc: "Auto-captures audio evidence during alerts for safety.", color: "from-pink-500 to-purple-500" },
];

function Home() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 lg:p-16 mb-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/60 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI-Powered Safety · v2.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Safety is <br />
              <span className="gradient-text">Our Priority</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
              Smart protection, instant alerts, trusted emergency support, and AI-powered voice risk detection — designed for women, by people who care.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/sos" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold shadow-soft hover:shadow-glow transition-all">
                <Siren className="w-4 h-4" /> Emergency Help
              </Link>
              <Link to="/voice-ai" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass border-white/60 font-semibold hover:bg-white/90 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { num: "50K+", label: "Protected" },
                { num: "<3s", label: "Alert Speed" },
                { num: "24/7", label: "AI Monitor" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold gradient-text">{s.num}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-30" />
              <img src={heroImg} alt="Her_Shield safety illustration" className="relative w-[420px] h-[420px] object-contain drop-shadow-2xl" width={420} height={420} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Everything you need, in one place</h2>
            <p className="text-muted-foreground text-sm mt-1">Premium safety tools, designed to act when seconds matter.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group glass rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-soft mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 glass-strong rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative">
          <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-2xl sm:text-3xl font-bold">Stay one tap away from safety</h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Set up your trusted circle now and let Her_Shield watch over you, 24/7.</p>
          <Link to="/trust-circle" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-gradient-primary text-white font-semibold shadow-soft">
            Build Your Circle <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}