import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import { CATEGORIES, Design, waLink } from "@/lib/data";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { data } = await supabase.from("designs").select("*").eq("published", true).order("created_at", { ascending: false }).limit(60);
  const all = (data ?? []) as Design[];
  const featured = all.filter((d) => d.featured).slice(0, 8);
  const shown = featured.length ? featured : all.slice(0, 8);
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-beige to-pearl">
          <div className="wrap py-16 sm:py-24 lg:py-32 text-center max-w-3xl">
            <p className="text-xs sm:text-sm uppercase tracking-[.35em] text-gold mb-4">Karachi · Since design, cast in gold</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-tight">Jewellery designed with <em className="text-gold">timeless</em> elegance</h1>
            <p className="mt-6 text-ink/70 text-base sm:text-lg">Jewellery design, gold casting and RP / 3D design crafted for brides, families and jewellers.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="#collection" className="btn btn-gold">Explore Collection</Link>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-line">WhatsApp Inquiry</a>
            </div>
          </div>
        </section>
        <section id="collection" className="wrap py-14 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-2">Featured Designs</h2>
          <p className="text-center text-ink/70 mb-10">A selection from our latest collection.</p>
          {shown.length ? <div className="grid-d">{shown.map((d) => <Card key={d.id} d={d} />)}</div>
            : <p className="text-center text-ink/60 card p-10">New designs are coming soon.</p>}
        </section>
        <section id="categories" className="bg-beige py-14 sm:py-20">
          <div className="wrap">
            <h2 className="font-serif text-3xl sm:text-4xl text-center mb-10">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {CATEGORIES.map((c) => <Link key={c.slug} href={`/category/${c.slug}`} className="card p-5 sm:p-8 text-center font-serif text-lg sm:text-xl hover:border-gold hover:-translate-y-1 transition duration-300">{c.name}</Link>)}
            </div>
          </div>
        </section>
        <section id="about" className="wrap py-14 sm:py-20 text-center max-w-3xl">
          <h2 className="font-serif text-3xl sm:text-4xl mb-4">About F.S Casting</h2>
          <p className="text-ink/75 leading-relaxed">F.S Casting is a Karachi-based studio for jewellery design, gold casting and RP / 3D design. From a first sketch to a finished cast piece, we bring precision and craftsmanship to every order, including fully custom designs.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
