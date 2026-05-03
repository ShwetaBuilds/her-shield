import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/hershield/AppLayout";
import {
  Siren, MapPin, Mic, Users, ShieldCheck, AudioLines, PhoneCall, History,
  Contact, User, LayoutDashboard, Shield, ArrowRight, Sparkles,
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

const modules = [
  { to: "/sos", icon: Siren, title: "SOS Emergency", desc: "One-tap alert to all your trusted contacts.", color: "from-rose-500 to-pink-600" },
  { to: "/map", icon: MapPin, title: "Live Location Map", desc: "Real-time map with your location & directions.", color: "from-purple-500 to-fuchsia-500" },
  { to: "/help-centers", icon: ShieldCheck, title: "Nearest Safe Place", desc: "Hospitals, police, medical stores & safe zones.", color: "from-fuchsia-500 to-pink-500" },
  { to: "/voice-ai", icon: Mic, title: "Smart Emergency Detection", desc: "AI listens for panic, stress & emergency keywords.", color: "from-purple-500 to-indigo-500" },
  { to: "/fake-call", icon: PhoneCall, title: "Fake Call", desc: "Discreet escape from unsafe situations.", color: "from-amber-500 to-orange-500" },
  { to: "/audio-capture", icon: AudioLines, title: "Auto Audio Capture", desc: "Tamper-proof evidence during emergencies.", color: "from-rose-500 to-orange-400" },
  { to: "/trust-circle", icon: Users, title: "Trust Circle", desc: "Manage your priority emergency contacts.", color: "from-pink-500 to-purple-500" },
  { to: "/alert-history", icon: History, title: "Alert History", desc: "Every alert, perfectly logged & timestamped.", color: "from-purple-500 to-pink-500" },
  { to: "/contacts", icon: Contact, title: "Emergency Contacts", desc: "National helplines and quick dial numbers.", color: "from-blue-500 to-indigo-600" },
  { to: "/profile", icon: User, title: "Profile", desc: "Manage your account, safety & privacy.", color: "from-fuchsia-500 to-purple-500" },
  { to: "/admin", icon: LayoutDashboard, title: "Admin Access", desc: "SaaS-style monitoring & analytics dashboard.", color: "from-emerald-500 to-teal-500" },
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
              Smart protection, instant alerts, trusted emergency support, and AI-powered Smart Emergency Detection — designed for women, by people who care.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/sos" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold shadow-soft hover:shadow-glow transition-all">
                <Siren className="w-4 h-4" /> Emergency Help
              </Link>
              <Link to="/how-to-use" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass border-white/60 font-semibold hover:bg-white/90 transition-all">
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

      {/* Modules */}
      <section>
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">All Safety Modules</h2>
            <p className="text-muted-foreground text-sm mt-1">Tap any card to open its module.</p>
          </div>
          <Link to="/how-to-use" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            How to use <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group glass rounded-3xl p-6 hover:-translate-y-1 hover:shadow-glow transition-all duration-300 block"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-soft mb-4 group-hover:scale-110 transition-transform`}>
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-lg">{m.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>
            </Link>
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
