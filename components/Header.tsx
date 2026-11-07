"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
export function Logo() {
  return <Link href="/" className="font-serif text-xl sm:text-2xl tracking-wide">F.S <span className="text-gold">Casting</span></Link>;
}
export default function Header() {
  const [o, setO] = useState(false);
  const links = [["/#collection", "Collection"], ["/#categories", "Categories"], ["/#about", "About"], ["/#contact", "Contact"]];
  return (
    <header className="sticky top-0 z-40 border-b border-light/70 bg-pearl/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex gap-8 text-sm">{links.map(([h, l]) => <Link key={h} href={h} className="hover:text-gold transition">{l}</Link>)}</nav>
        <button className="md:hidden p-3 -mr-3" aria-label="Menu" onClick={() => setO(!o)}>{o ? <X /> : <Menu />}</button>
      </div>
      {o && <div className="md:hidden border-t border-light bg-pearl px-4 pb-4">
        {links.map(([h, l]) => <Link key={h} href={h} onClick={() => setO(false)} className="block py-3 border-b border-light/60">{l}</Link>)}
        <p className="pt-3 text-xs text-ink/60">Categories</p>
        {CATEGORIES.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setO(false)} className="block py-2 text-sm">{c.name}</Link>)}
      </div>}
    </header>
  );
}
