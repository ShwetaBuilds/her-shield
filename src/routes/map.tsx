import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { MapPin, Share2 } from "lucide-react";
import { useState } from "react";
import { LiveMap, SAFE_PLACES, type Place } from "@/components/hershield/LiveMap";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Live Location Map · Her_Shield" }] }),
  component: MapPage,
});

const filters: ("All" | Place["category"])[] = ["All", "Hospital", "Police", "Medical Store", "Safe Place"];

function MapPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [shared, setShared] = useState(false);

  const share = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const url = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      try {
        if (navigator.share) {
          await navigator.share({ title: "My live location", text: "I'm sharing my location for safety.", url });
        } else {
          await navigator.clipboard.writeText(url);
        }
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch {/* ignored */}
    });
  };

  return (
    <AppLayout>
      <PageHeader title="Live Location Map" subtitle="Real-time map · find help & navigate in seconds." icon={MapPin} />

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {filters.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === c ? "bg-gradient-primary text-white shadow-soft" : "glass hover:bg-white/90"
            }`}
          >
            {c}
          </button>
        ))}
        <button
          onClick={share}
          className="ml-auto px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-semibold flex items-center gap-2 shadow-soft"
        >
          <Share2 className="w-4 h-4" /> {shared ? "Location shared!" : "Share live location"}
        </button>
      </div>

      <LiveMap places={SAFE_PLACES} filter={filter} />
    </AppLayout>
  );
}
