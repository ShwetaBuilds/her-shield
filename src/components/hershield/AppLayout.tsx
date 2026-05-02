import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield, Siren, MapPin, Hospital, Mic, PhoneCall, AudioLines,
  Users, History, Contact, User, LayoutDashboard, Menu, X, LogOut,
} from "lucide-react";

export const navItems = [
  { to: "/home", label: "Home", icon: Shield },
  { to: "/sos", label: "SOS", icon: Siren },
  { to: "/map", label: "Live Map", icon: MapPin },
  { to: "/help-centers", label: "Help Centers", icon: Hospital },
  { to: "/voice-ai", label: "Voice AI", icon: Mic },
  { to: "/fake-call", label: "Fake Call", icon: PhoneCall },
  { to: "/audio-capture", label: "Audio", icon: AudioLines },
  { to: "/trust-circle", label: "Trust Circle", icon: Users },
  { to: "/alert-history", label: "History", icon: History },
  { to: "/contacts", label: "Contacts", icon: Contact },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: LayoutDashboard },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("hs_auth");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Her_Shield</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-2 overflow-x-auto flex-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-gradient-primary text-white shadow-soft"
                      : "text-foreground/70 hover:bg-white/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden ml-auto p-2 rounded-xl bg-white/60"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/40 px-4 py-3 grid grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/70 text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium col-span-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-muted-foreground">
        © 2026 Her_Shield · Built with care for women's safety
      </footer>
    </div>
  );
}

export function PageHeader({
  title, subtitle, icon: Icon,
}: { title: string; subtitle?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="mb-8 flex items-start gap-4">
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
  );
}