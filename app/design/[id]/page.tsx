import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { Design, catName, waLink } from "@/lib/data";
import { supabase, imgUrl } from "@/lib/supabase";
export const dynamic = "force-dynamic";
const get = async (id: string) => {
  const { data } = await supabase.from("designs").select("*").eq("id", id).eq("published", true).maybeSingle();
  return data as Design | null;
};
export async function generateMetadata({ params }: { params: { id: string } }) {
  const d = await get(params.id);
  return d ? { title: `${d.name} (${d.code})`, description: d.description.slice(0, 150), openGraph: { images: d.images[0] ? [imgUrl(d.images[0])] : [] } } : {};
}
export default async function DesignPage({ params }: { params: { id: string } }) {
  const d = await get(params.id);
  if (!d) notFound();
  return (
    <>
      <Header />
      <main className="wrap py-8 sm:py-14">
        <Link href={`/category/${d.category}`} className="text-sm text-gold">← {catName(d.category)}</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Gallery images={d.images} name={d.name} />
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">{catName(d.category)}</p>
            <h1 className="font-serif text-3xl sm:text-4xl mt-1">{d.name}</h1>
            <p className="mt-2 text-sm text-ink/60">Design ID: <b>{d.code}</b></p>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/80">{d.description}</p>
            <a href={waLink(d)} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-8 w-full sm:w-auto"><MessageCircle size={18} />WhatsApp Inquiry</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
