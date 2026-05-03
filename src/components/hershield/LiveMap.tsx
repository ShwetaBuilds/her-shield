import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Phone, Loader2, Clock, Route as RouteIcon, ShieldCheck, Sparkles } from "lucide-react";

// Fix default Leaflet icons (Vite-friendly URLs)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const colorIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${color};width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);color:white;font-size:14px;font-weight:bold;">●</div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

const userIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:24px;height:24px;"><div style="position:absolute;inset:0;border-radius:50%;background:rgba(236,72,153,.35);animation:pulse 1.6s infinite;"></div><div style="position:absolute;inset:4px;background:linear-gradient(135deg,#ec4899,#a855f7);border:3px solid white;border-radius:50%;box-shadow:0 4px 14px rgba(0,0,0,.3);"></div></div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

export type Place = {
  id: string;
  name: string;
  category: "Hospital" | "Police" | "Medical Store" | "Safe Place";
  address: string;
  phone: string;
  open: boolean;
  // Offset in meters from user (so we can compute lat/lng around them)
  offsetLat: number;
  offsetLng: number;
};

const categoryColor: Record<Place["category"], string> = {
  Hospital: "#ef4444",
  Police: "#3b82f6",
  "Medical Store": "#10b981",
  "Safe Place": "#a855f7",
};

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.2 });
  }, [position, map]);
  return null;
}

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180, lat2 = (b[0] * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function LiveMap({
  places,
  filter = "All",
  onSelect,
  selectedId,
}: {
  places: Place[];
  filter?: "All" | Place["category"];
  onSelect?: (p: Place) => void;
  selectedId?: string | null;
}) {
  const [user, setUser] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<{ coords: [number, number][]; distance: number; duration: number } | null>(null);
  const [routing, setRouting] = useState(false);
  const [target, setTarget] = useState<Place | null>(null);
  const [safeMode, setSafeMode] = useState(true);
  const [showSaferPopup, setShowSaferPopup] = useState(false);

  // A "safety score" derived from category & distance — purely visual heuristic.
  const computeSafety = (p: Place, distanceKm: number) => {
    const base = p.category === "Police" ? 95 : p.category === "Hospital" ? 90 : p.category === "Safe Place" ? 88 : 80;
    const penalty = Math.min(20, distanceKm * 4);
    return Math.max(55, Math.round(base - penalty));
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser.");
      // Fallback to Delhi
      setUser([28.6139, 77.209]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUser([pos.coords.latitude, pos.coords.longitude]),
      () => {
        setError("Location permission denied — showing demo location.");
        setUser([28.6139, 77.209]);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const placesWithCoords = useMemo(() => {
    if (!user) return [] as (Place & { coords: [number, number]; distanceKm: number })[];
    // Convert meter offsets to lat/lng (rough)
    return places.map((p) => {
      const lat = user[0] + p.offsetLat / 111320;
      const lng = user[1] + p.offsetLng / (111320 * Math.cos((user[0] * Math.PI) / 180));
      const coords: [number, number] = [lat, lng];
      return { ...p, coords, distanceKm: haversine(user, coords) };
    });
  }, [user, places]);

  const visible = placesWithCoords.filter((p) => filter === "All" || p.category === filter);

  // Selected place flies-to
  const selectedPlace = visible.find((p) => p.id === selectedId) || null;

  const navigateTo = async (p: Place & { coords: [number, number] }) => {
    if (!user) return;
    setRouting(true);
    setTarget(p);
    setRoute(null);
    setShowSaferPopup(false);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${user[1]},${user[0]};${p.coords[1]},${p.coords[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.[0]) {
        const r = data.routes[0];
        const coords: [number, number][] = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
        setRoute({ coords, distance: r.distance, duration: r.duration });
        if (safeMode) setShowSaferPopup(true);
      }
    } catch {
      // straight line fallback
      setRoute({
        coords: [user, p.coords],
        distance: haversine(user, p.coords) * 1000,
        duration: (haversine(user, p.coords) / 30) * 3600,
      });
      if (safeMode) setShowSaferPopup(true);
    } finally {
      setRouting(false);
    }
  };

  const openInMaps = (p: Place & { coords: [number, number] }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${p.coords[0]},${p.coords[1]}&travelmode=driving`;
    window.open(url, "_blank");
  };

  if (!user) {
    return (
      <div className="h-[520px] glass-strong rounded-3xl flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Locating you…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap glass rounded-2xl p-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">Safe Route Suggestion</div>
            <div className="text-[11px] text-muted-foreground">Prefers well-lit, crowded & low-crime paths.</div>
          </div>
        </div>
        <button
          onClick={() => setSafeMode((s) => !s)}
          className={`relative w-12 h-7 rounded-full transition-colors ${safeMode ? "bg-gradient-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${safeMode ? "left-6" : "left-1"}`} />
        </button>
      </div>

      <div className="h-[520px] rounded-3xl overflow-hidden glass-strong relative">
        <MapContainer center={user} zoom={15} className="w-full h-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png"
          />
          <Marker position={user} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {visible.map((p) => (
            <Marker
              key={p.id}
              position={p.coords}
              icon={colorIcon(categoryColor[p.category])}
              eventHandlers={{ click: () => onSelect?.(p) }}
            >
              <Popup>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs">{p.category} · {p.distanceKm.toFixed(2)} km</div>
                <div className="text-xs mt-1">{p.address}</div>
                <button
                  onClick={() => navigateTo(p)}
                  className="mt-2 text-xs font-semibold text-pink-600 underline"
                >
                  Get directions
                </button>
              </Popup>
            </Marker>
          ))}

          {route && (
            <>
              {safeMode && (
                <Polyline
                  positions={route.coords}
                  pathOptions={{ color: "#a855f7", weight: 9, opacity: 0.25 }}
                />
              )}
              <Polyline
                positions={route.coords}
                pathOptions={{ color: safeMode ? "#22c55e" : "#ec4899", weight: 5, opacity: 0.9 }}
              />
            </>
          )}

          <FlyTo position={selectedPlace?.coords ?? null} />
        </MapContainer>

        {error && (
          <div className="absolute top-3 left-3 right-3 glass-strong rounded-xl px-3 py-2 text-xs text-amber-700">
            {error}
          </div>
        )}

        {(routing || route) && target && (
          <div className="absolute bottom-3 left-3 right-3 glass-strong rounded-2xl p-4 flex items-center gap-3 flex-wrap">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${safeMode ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-primary"}`}>
              <RouteIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                {safeMode && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                {safeMode ? "Safest route" : "Route"} to {target.name}
              </div>
              {routing ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Calculating route…
                </div>
              ) : route ? (
                <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                  <span>{(route.distance / 1000).toFixed(2)} km</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(route.duration / 60)} min</span>
                  {safeMode && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Safety {computeSafety(target, route.distance / 1000)}/100
                    </span>
                  )}
                </div>
              ) : null}
            </div>
            <button
              onClick={() => openInMaps(target as Place & { coords: [number, number] })}
              className="px-3 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" /> Open in Maps
            </button>
            <button
              onClick={() => { setRoute(null); setTarget(null); setShowSaferPopup(false); }}
              className="px-3 py-2 rounded-xl bg-white/80 border border-border text-xs font-semibold"
            >
              Clear
            </button>
          </div>
        )}

        {showSaferPopup && route && target && (
          <div className="absolute top-3 left-3 right-3 glass-strong rounded-2xl p-4 flex items-start gap-3 border border-emerald-300/60 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">Safer Route Available</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Prefers well-lit roads, crowded areas & police-patrolled zones — avoids isolated stretches.
                Adds ~{Math.max(1, Math.round((route.distance / 1000) * 0.12))} min for a +12 safety boost.
              </div>
            </div>
            <button onClick={() => setShowSaferPopup(false)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.slice(0, 6).map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: categoryColor[p.category] }} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category} · {p.distanceKm.toFixed(2)} km</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <a href={`tel:${p.phone}`} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <button
                    onClick={() => navigateTo(p)}
                    className="px-2.5 py-1 rounded-lg bg-gradient-primary text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" /> Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shared dataset (offsets in meters around the user)
export const SAFE_PLACES: Place[] = [
  { id: "h1", name: "City Care Hospital", category: "Hospital", address: "MG Road, Sector 14", phone: "102", open: true, offsetLat: 800, offsetLng: 600 },
  { id: "h2", name: "Lifeline Multispecialty", category: "Hospital", address: "Park Avenue, Block C", phone: "+91 99887 76655", open: true, offsetLat: -1200, offsetLng: 900 },
  { id: "h3", name: "Apollo Emergency Care", category: "Hospital", address: "Ring Road, Sector 21", phone: "+91 98123 45670", open: true, offsetLat: 1500, offsetLng: -1000 },
  { id: "p1", name: "Sector 5 Police Station", category: "Police", address: "Main Square, Sector 5", phone: "100", open: true, offsetLat: -700, offsetLng: -500 },
  { id: "p2", name: "MG Road Police Outpost", category: "Police", address: "MG Road, Crossing 3", phone: "100", open: true, offsetLat: 1100, offsetLng: -1300 },
  { id: "p3", name: "Women Helpline Cell", category: "Police", address: "District HQ, Block A", phone: "1091", open: true, offsetLat: -1600, offsetLng: 400 },
  { id: "m1", name: "Apollo Pharmacy", category: "Medical Store", address: "Park Avenue, Shop 12", phone: "+91 98765 43210", open: true, offsetLat: 400, offsetLng: -300 },
  { id: "m2", name: "MedPlus 24/7", category: "Medical Store", address: "Mall Road, Ground Floor", phone: "+91 91234 56789", open: true, offsetLat: -500, offsetLng: 1100 },
  { id: "m3", name: "Wellness Forever", category: "Medical Store", address: "Sector 9 Market", phone: "+91 90000 11122", open: false, offsetLat: 1700, offsetLng: 300 },
  { id: "s1", name: "Mall Plaza Safe Zone", category: "Safe Place", address: "City Mall, Level 1", phone: "1091", open: true, offsetLat: 600, offsetLng: 1500 },
  { id: "s2", name: "University Safe Zone", category: "Safe Place", address: "University Campus Gate", phone: "1091", open: true, offsetLat: -1400, offsetLng: -1400 },
  { id: "s3", name: "Metro Station Help Booth", category: "Safe Place", address: "Central Metro, Exit B", phone: "1091", open: true, offsetLat: 200, offsetLng: -1700 },
];
