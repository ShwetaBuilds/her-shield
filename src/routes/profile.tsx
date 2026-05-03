import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { User, Bell, Shield, Users, LogOut, ChevronRight, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hs_auth");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem("hs_auth");
    navigate({ to: "/" });
  };

  const sections: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; to?: string }[] = [
    { icon: ShieldAlert, title: "Safety Settings", desc: "Silent SOS, voice command & emergency keywords.", to: "/safety-settings" },
    { icon: Bell, title: "Emergency Settings", desc: "Configure SOS triggers, auto-recording, and alert sounds." },
    { icon: Users, title: "Trusted Contacts", desc: "Manage your trust circle — currently 4 contacts.", to: "/trust-circle" },
    { icon: Shield, title: "Security & Privacy", desc: "2FA, data sharing, location precision settings." },
  ];

  return (
    <AppLayout>
      <PageHeader title="Profile" subtitle="Manage your account, safety, and privacy." icon={User} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-strong rounded-3xl p-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="mt-4 font-bold text-lg capitalize">{user?.name || "User"}</div>
          <div className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/60">
              <div className="text-xl font-bold gradient-text">12</div>
              <div className="text-[10px] text-muted-foreground font-semibold">ALERTS</div>
            </div>
            <div className="p-3 rounded-xl bg-white/60">
              <div className="text-xl font-bold gradient-text">4</div>
              <div className="text-[10px] text-muted-foreground font-semibold">CONTACTS</div>
            </div>
            <div className="p-3 rounded-xl bg-white/60">
              <div className="text-xl font-bold gradient-text">98%</div>
              <div className="text-[10px] text-muted-foreground font-semibold">SAFETY</div>
            </div>
          </div>

          <button onClick={logout} className="w-full mt-6 py-3 rounded-xl bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {sections.map((s) => {
            const inner = (
              <>
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </>
            );
            return s.to ? (
              <Link key={s.title} to={s.to} className="w-full glass rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all text-left">
                {inner}
              </Link>
            ) : (
              <button key={s.title} className="w-full glass rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all text-left">
                {inner}
              </button>
            );
          })}

          <div className="glass rounded-2xl p-5">
            <div className="font-bold mb-3">User Details</div>
            {[
              { k: "Full Name", v: user?.name || "—" },
              { k: "Email", v: user?.email || "—" },
              { k: "Phone", v: "+91 98765 43210" },
              { k: "Blood Group", v: "O+" },
              { k: "Emergency Note", v: "Allergic to penicillin" },
            ].map((d) => (
              <div key={d.k} className="flex justify-between py-2.5 border-b border-border/50 last:border-0 text-sm">
                <span className="text-muted-foreground">{d.k}</span>
                <span className="font-semibold capitalize">{d.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}