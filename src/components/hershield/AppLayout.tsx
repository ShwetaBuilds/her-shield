import { Link, useNavigate } from "@tanstack/react-router";
import { Shield, LogOut, Home } from "lucide-react";
import { HomeButton } from "./HomeButton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("hs_auth");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-strong border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Her_Shield</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/home"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-foreground/80 hover:bg-white/70 transition-all"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-muted-foreground">
        © 2026 Her_Shield · Built with care for women's safety
      </footer>
    </div>
  );
}

export function PageHeader({
  title, subtitle, icon: Icon, showHome = true,
}: { title: string; subtitle?: string; icon?: React.ComponentType<{ className?: string }>; showHome?: boolean }) {
  return (
    <div className="mb-8">
      {showHome && (
        <div className="mb-4">
          <HomeButton />
        </div>
      )}
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
            <Icon className="w-7 h-7 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
