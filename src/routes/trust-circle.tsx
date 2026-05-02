import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/hershield/AppLayout";
import { Users, Plus, Trash2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/trust-circle")({
  component: TrustCircle,
});

type Contact = { id: number; name: string; phone: string; relation: string; priority: "High" | "Medium" | "Low" };

const seed: Contact[] = [
  { id: 1, name: "Mom", phone: "+91 98765 11111", relation: "Mother", priority: "High" },
  { id: 2, name: "Dad", phone: "+91 98765 22222", relation: "Father", priority: "High" },
  { id: 3, name: "Sister Riya", phone: "+91 98765 33333", relation: "Sister", priority: "High" },
  { id: 4, name: "Best Friend Ananya", phone: "+91 98765 44444", relation: "Friend", priority: "Medium" },
];

function TrustCircle() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Omit<Contact, "id">>({ name: "", phone: "", relation: "", priority: "High" });

  useEffect(() => {
    const saved = localStorage.getItem("hs_contacts");
    setContacts(saved ? JSON.parse(saved) : seed);
  }, []);

  const persist = (list: Contact[]) => {
    setContacts(list);
    localStorage.setItem("hs_contacts", JSON.stringify(list));
  };

  const openAdd = () => { setEditing(null); setForm({ name: "", phone: "", relation: "", priority: "High" }); setOpen(true); };
  const openEdit = (c: Contact) => { setEditing(c); setForm(c); setOpen(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      persist(contacts.map((c) => (c.id === editing.id ? { ...editing, ...form } : c)));
    } else {
      persist([...contacts, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  const remove = (id: number) => persist(contacts.filter((c) => c.id !== id));

  const priorityColor = { High: "bg-rose-500", Medium: "bg-amber-500", Low: "bg-emerald-500" };

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <PageHeader title="Trust Circle" subtitle={`${contacts.length} trusted contacts · Aim for 10+`} icon={Users} />
        <button onClick={openAdd} className="px-5 py-3 rounded-2xl bg-gradient-primary text-white font-semibold shadow-soft flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.relation}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${priorityColor[c.priority]}`}>{c.priority}</span>
            </div>
            <div className="text-sm font-medium mt-3 text-foreground/80">{c.phone}</div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openEdit(c)} className="flex-1 py-2 rounded-xl bg-white/70 border border-border text-xs font-semibold flex items-center justify-center gap-1">
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => remove(c.id)} className="flex-1 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-center justify-center gap-1">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}

        <button onClick={openAdd} className="rounded-2xl border-2 border-dashed border-primary/30 p-5 text-primary font-semibold hover:bg-white/40 transition-all min-h-[180px] flex flex-col items-center justify-center gap-2">
          <Plus className="w-8 h-8" /> Add another contact
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={save} className="glass-strong rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editing ? "Edit Contact" : "Add Trusted Contact"}</h3>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name" as const, type: "text", placeholder: "Jane Doe" },
                { label: "Phone Number", key: "phone" as const, type: "tel", placeholder: "+91 98765 43210" },
                { label: "Relationship", key: "relation" as const, type: "text", placeholder: "Sister, Friend, etc." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-foreground/70">{f.label}</label>
                  <input
                    required type={f.type} placeholder={f.placeholder}
                    value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white/70 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-foreground/70">Priority Level</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(["High", "Medium", "Low"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${form.priority === p ? "bg-gradient-primary text-white shadow-soft" : "bg-white/70 border border-border"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="w-full mt-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-soft">
              {editing ? "Save Changes" : "Add Contact"}
            </button>
          </form>
        </div>
      )}
    </AppLayout>
  );
}