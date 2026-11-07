"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle, Images, Tags, Star, Settings, LogOut, Menu, X, Trash2, Pencil, Upload, Search } from "lucide-react";
import { supabase, imgUrl } from "@/lib/supabase";
import { CATEGORIES, Design, catName, WA } from "@/lib/data";

type View = "dash" | "form" | "manage" | "cats" | "feat" | "settings";
const OK = ["image/jpeg", "image/png", "image/webp"];

export default function AdminApp() {
  const [state, setState] = useState<"loading" | "out" | "in">("loading");
  const [email, setEmail] = useState("");
  const [view, setView] = useState<View>("dash");
  const [drawer, setDrawer] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [editing, setEditing] = useState<Design | null>(null);
  const [del, setDel] = useState<Design | null>(null);
  const [filterCat, setFilterCat] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("designs").select("*").order("created_at", { ascending: false });
    setDesigns((data ?? []) as Design[]);
  }, []);
  const check = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const u = data.session?.user;
    if (!u) return setState("out");
    const { data: a } = await supabase.from("admins").select("user_id").eq("user_id", u.id).maybeSingle();
    if (!a) { await supabase.auth.signOut(); return setState("out"); }
    setEmail(u.email ?? ""); setState("in"); load();
  }, [load]);
  useEffect(() => { check(); }, [check]);

  if (state === "loading") return <div className="p-10 text-center">Loading…</div>;
  if (state === "out") return <Login onDone={check} />;

  const go = (v: View) => { setView(v); setDrawer(false); if (v !== "form") setEditing(null); };
  const nav: [View, string, React.ReactNode][] = [
    ["dash", "Dashboard", <LayoutDashboard key="a" size={18} />], ["form", "Add New Design", <PlusCircle key="b" size={18} />],
    ["manage", "Manage Designs", <Images key="c" size={18} />], ["cats", "Categories", <Tags key="d" size={18} />],
    ["feat", "Featured Designs", <Star key="e" size={18} />], ["settings", "Settings", <Settings key="f" size={18} />],
  ];
  const doDelete = async () => {
    if (!del) return;
    if (del.images.length) await supabase.storage.from("designs").remove(del.images);
    const { error } = await supabase.from("designs").delete().eq("id", del.id);
    if (error) alert(error.message);
    setDel(null); load();
  };
  const toggleFeat = async (d: Design) => { await supabase.from("designs").update({ featured: !d.featured }).eq("id", d.id); load(); };
  const edit = (d: Design) => { setEditing(d); setView("form"); };

  return (
    <div className="min-h-screen lg:flex bg-pearl">
      {drawer && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setDrawer(false)} />}
      <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-light p-4 flex flex-col transition-transform lg:static lg:translate-x-0 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-6"><span className="font-serif text-xl">F.S <span className="text-gold">Admin</span></span><button className="lg:hidden p-2" onClick={() => setDrawer(false)}><X /></button></div>
        <nav className="flex-1 space-y-1">
          {nav.map(([v, l, i]) => <button key={v} onClick={() => go(v)} className={`flex w-full items-center gap-3 rounded-xl px-3 min-h-[44px] text-left text-sm ${view === v ? "bg-beige text-ink font-medium" : "hover:bg-pearl"}`}>{i}{l}</button>)}
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); setState("out"); }} className="flex items-center gap-3 rounded-xl px-3 min-h-[44px] text-sm hover:bg-pearl"><LogOut size={18} />Logout</button>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-light bg-pearl/90 backdrop-blur px-4">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setDrawer(true)} aria-label="Menu"><Menu /></button>
          <Link href="/" target="_blank" className="text-sm text-gold ml-auto">View website ↗</Link>
        </div>
        <main className="p-4 sm:p-8 max-w-6xl">
          {view === "dash" && <Dash designs={designs} go={go} edit={edit} />}
          {view === "form" && <Form key={editing?.id ?? "new"} initial={editing} onDone={() => { load(); go("manage"); }} />}
          {view === "manage" && <List designs={designs} onEdit={edit} onDel={setDel} onFeat={toggleFeat} initCat={filterCat} />}
          {view === "feat" && <List designs={designs.filter((d) => d.featured)} onEdit={edit} onDel={setDel} onFeat={toggleFeat} initCat="" title="Featured Designs" />}
          {view === "cats" && (
            <div><h1 className="font-serif text-3xl mb-6">Categories</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => { setFilterCat(c.slug); go("manage"); }} className="card p-5 text-left hover:border-gold">
                  <p className="font-serif text-lg">{c.name}</p><p className="text-sm text-ink/60">{designs.filter((d) => d.category === c.slug).length} designs</p></button>))}</div></div>
          )}
          {view === "settings" && <Sett email={email} />}
        </main>
      </div>
      {del && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-6 max-w-sm w-full">
            <h3 className="font-serif text-xl">Delete this design?</h3>
            <p className="text-sm text-ink/70 mt-2">&ldquo;{del.name}&rdquo; ({del.code}) and its photos will be permanently removed.</p>
            <div className="mt-5 flex gap-3"><button className="btn btn-line flex-1" onClick={() => setDel(null)}>Cancel</button><button className="btn flex-1 bg-red-600 text-white" onClick={doDelete}>Delete</button></div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [e, setE] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
    if (error) setErr(error.message); else { await onDone(); setErr("This account is not an authorized administrator."); }
    setBusy(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige p-4">
      <form onSubmit={submit} className="card p-6 sm:p-8 w-full max-w-sm space-y-4">
        <h1 className="font-serif text-2xl text-center">F.S <span className="text-gold">Casting</span> Admin</h1>
        <input className="inp" type="email" placeholder="Email" value={e} onChange={(x) => setE(x.target.value)} required />
        <input className="inp" type="password" placeholder="Password" value={p} onChange={(x) => setP(x.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

function Dash({ designs, go, edit }: { designs: Design[]; go: (v: View) => void; edit: (d: Design) => void }) {
  const stats: [string, number][] = [["Total designs", designs.length], ["Total categories", CATEGORIES.length], ["Featured", designs.filter((d) => d.featured).length]];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><h1 className="font-serif text-3xl">Dashboard</h1><button className="btn btn-gold" onClick={() => go("form")}><PlusCircle size={18} />+ ADD NEW DESIGN</button></div>
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-4">{stats.map(([l, n]) => <div key={l} className="card p-5"><p className="text-3xl font-serif">{n}</p><p className="text-sm text-ink/60">{l}</p></div>)}</div>
      <h2 className="font-serif text-xl mt-8 mb-3">Recently uploaded</h2>
      {designs.length ? <div className="space-y-2">{designs.slice(0, 5).map((d) => (
        <button key={d.id} onClick={() => edit(d)} className="card w-full flex items-center gap-3 p-3 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {d.images[0] && <img src={imgUrl(d.images[0])} alt="" className="h-14 w-14 rounded-lg object-cover" />}
          <div className="min-w-0"><p className="truncate font-medium">{d.name}</p><p className="text-xs text-ink/60">{d.code} · {catName(d.category)}</p></div></button>))}</div>
        : <p className="card p-6 text-ink/60">No designs yet. Click “+ ADD NEW DESIGN” to upload your first one.</p>}
    </div>
  );
}

function List({ designs, onEdit, onDel, onFeat, initCat, title = "Manage Designs" }: { designs: Design[]; onEdit: (d: Design) => void; onDel: (d: Design) => void; onFeat: (d: Design) => void; initCat: string; title?: string }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState(initCat);
  const rows = designs.filter((d) => (!cat || d.category === cat) && (`${d.name} ${d.code}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <h1 className="font-serif text-3xl mb-4">{title}</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1"><Search size={16} className="absolute left-3 top-3.5 text-ink/40" /><input className="inp pl-9" placeholder="Search by name or ID" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="inp sm:w-56" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
      </div>
      {rows.length === 0 ? <p className="card p-8 text-center text-ink/60">No designs found.</p> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{rows.map((d) => (
          <div key={d.id} className="card p-3 flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {d.images[0] ? <img src={imgUrl(d.images[0])} alt="" className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl object-cover" /> : <div className="h-24 w-24 rounded-xl bg-beige" />}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{d.name}</p>
              <p className="text-xs text-ink/60">{d.code} · {catName(d.category)}</p>
              <p className="text-xs text-ink/50">{new Date(d.created_at).toLocaleDateString()}</p>
              <div className="mt-2 flex gap-2">
                <button className="btn btn-line !min-h-[40px] !px-3" onClick={() => onEdit(d)}><Pencil size={14} />Edit</button>
                <button className={`btn !min-h-[40px] !px-3 ${d.featured ? "btn-gold" : "btn-line"}`} onClick={() => onFeat(d)} aria-label="Toggle featured"><Star size={14} /></button>
                <button className="btn btn-line !min-h-[40px] !px-3 text-red-600" onClick={() => onDel(d)}><Trash2 size={14} />Delete</button>
              </div></div></div>))}</div>}
    </div>
  );
}

function Form({ initial, onDone }: { initial: Design | null; onDone: () => void }) {
  const [name, setName] = useState(initial?.name ?? ""); const [code, setCode] = useState(initial?.code ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0].slug); const [desc, setDesc] = useState(initial?.description ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [existing, setExisting] = useState<string[]>(initial?.images ?? []); const [removed, setRemoved] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]); const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(0); const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const pick = (list: FileList | null) => {
    if (!list) return; const good: File[] = []; const bad: string[] = [];
    Array.from(list).forEach((f) => (OK.includes(f.type) && f.size <= 10 * 1024 * 1024 ? good.push(f) : bad.push(f.name)));
    setFiles((p) => [...p, ...good]);
    setMsg(bad.length ? { ok: false, t: `Skipped (only JPG, PNG, WEBP under 10MB): ${bad.join(", ")}` } : null);
  };
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setMsg(null);
    if (existing.length + files.length === 0) return setMsg({ ok: false, t: "Please add at least one photograph." });
    setBusy(true); setProg(0);
    try {
      const folder = code.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const ext = files[i].type === "image/png" ? "png" : files[i].type === "image/webp" ? "webp" : "jpg";
        const path = `${folder}/${Date.now()}-${i}.${ext}`;
        const { error } = await supabase.storage.from("designs").upload(path, files[i], { contentType: files[i].type });
        if (error) throw error;
        uploaded.push(path); setProg(Math.round(((i + 1) / files.length) * 100));
      }
      const row = { name: name.trim(), code: code.trim(), category, description: desc.trim(), featured, images: [...existing, ...uploaded] };
      const { error } = initial ? await supabase.from("designs").update(row).eq("id", initial.id) : await supabase.from("designs").insert({ ...row, published: true });
      if (error) { if (uploaded.length) await supabase.storage.from("designs").remove(uploaded); throw error; }
      if (removed.length) await supabase.storage.from("designs").remove(removed);
      setMsg({ ok: true, t: "Design published successfully!" }); setTimeout(onDone, 900);
    } catch (e: any) {
      setMsg({ ok: false, t: e?.code === "23505" ? "That Design ID is already used. Please choose a unique one." : e?.message ?? "Upload failed. Please try again." });
    }
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="card p-4 sm:p-8 space-y-5 max-w-3xl">
      <h1 className="font-serif text-3xl">{initial ? "Edit Design" : "Add New Design"}</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">Design Name<input className="inp mt-1" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label className="block text-sm">Unique Design ID / Code<input className="inp mt-1" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="e.g. FS-R-001" /></label>
      </div>
      <label className="block text-sm">Category<select className="inp mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
      <label className="block text-sm">Description<textarea className="inp mt-1 min-h-[110px]" value={desc} onChange={(e) => setDesc(e.target.value)} required /></label>
      <div>
        <p className="text-sm mb-2">Photographs (JPG, PNG, WEBP)</p>
        <label className="btn btn-line cursor-pointer w-full sm:w-auto"><Upload size={16} />Choose File
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { pick(e.target.files); e.target.value = ""; }} /></label>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {existing.map((p) => <Thumb key={p} src={imgUrl(p)} onX={() => { setExisting(existing.filter((x) => x !== p)); setRemoved([...removed, p]); }} />)}
          {previews.map((s, i) => <Thumb key={s} src={s} onX={() => setFiles(files.filter((_, k) => k !== i))} />)}
        </div>
      </div>
      <label className="flex items-center gap-3 min-h-[44px] text-sm"><input type="checkbox" className="h-5 w-5 accent-[#D6BD88]" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />Featured design (shown on homepage)</label>
      {busy && <div className="h-2 rounded-full bg-beige overflow-hidden"><div className="h-full bg-gold transition-all" style={{ width: `${Math.max(prog, 8)}%` }} /></div>}
      {msg && <p className={`text-sm rounded-xl p-3 ${msg.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>{msg.t}</p>}
      <button className="btn btn-gold w-full sm:w-auto" disabled={busy}>{busy ? `Uploading… ${prog}%` : initial ? "Save Changes" : "Publish Design"}</button>
    </form>
  );
}
function Thumb({ src, onX }: { src: string; onX: () => void }) {
  return (
    <div className="relative aspect-square">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full rounded-xl object-cover" />
      <button type="button" onClick={onX} aria-label="Remove photo" className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-ink text-white"><X size={14} /></button>
    </div>
  );
}

function Sett({ email }: { email: string }) {
  const [pw, setPw] = useState(""); const [m, setM] = useState("");
  const save = async (e: React.FormEvent) => { e.preventDefault(); const { error } = await supabase.auth.updateUser({ password: pw }); setM(error ? error.message : "Password updated."); setPw(""); };
  return (
    <div className="max-w-md space-y-5"><h1 className="font-serif text-3xl">Settings</h1>
      <div className="card p-5 text-sm space-y-1"><p>Signed in as <b>{email}</b></p><p>WhatsApp number: <b>+{WA}</b></p></div>
      <form onSubmit={save} className="card p-5 space-y-3"><p className="font-medium">Change password</p>
        <input className="inp" type="password" minLength={8} placeholder="New password (8+ characters)" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {m && <p className="text-sm">{m}</p>}<button className="btn btn-gold">Update password</button></form>
    </div>
  );
}
