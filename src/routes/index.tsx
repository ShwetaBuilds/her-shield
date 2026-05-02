import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import heroImg from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login · Her_Shield" },
      { name: "description", content: "Sign in to Her_Shield – Women Safety Alert System." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (localStorage.getItem("hs_auth")) navigate({ to: "/home" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    localStorage.setItem("hs_auth", JSON.stringify({ email, name: email.split("@")[0] }));
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 gap-6 p-4 sm:p-8">
      {/* Illustration side */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden rounded-3xl bg-gradient-soft">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative z-10 text-center px-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold">Trusted by 50,000+ women</span>
          </div>
          <img src={heroImg} alt="Women safety" className="w-80 h-80 mx-auto object-contain drop-shadow-2xl" width={320} height={320} />
          <h2 className="text-3xl font-bold gradient-text mt-6">You are never alone.</h2>
          <p className="text-muted-foreground mt-3 max-w-sm mx-auto">
            Smart protection, instant alerts, and AI-powered voice risk detection — all in one place.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">Her_Shield</span>
          </div>

          <div className="glass-strong rounded-3xl p-8 sm:p-10">
            <h1 className="text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === "login" ? "Sign in to continue to Her_Shield" : "Join Her_Shield and stay protected"}
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground/70">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/70">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/70 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded accent-primary" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-primary font-semibold hover:underline">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-primary text-white font-semibold shadow-soft hover:shadow-glow transition-all">
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-white/0 text-muted-foreground">or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="py-2.5 rounded-xl bg-white/70 border border-border text-sm font-medium hover:bg-white">Google</button>
                <button type="button" className="py-2.5 rounded-xl bg-white/70 border border-border text-sm font-medium hover:bg-white">Apple</button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-2">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
                  {mode === "login" ? "Create one" : "Sign in"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
