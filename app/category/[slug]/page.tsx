import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import { CATEGORIES, Design } from "@/lib/data";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: CATEGORIES.find((c) => c.slug === params.slug)?.name ?? "Category" };
}
export default async function Category({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const { data } = await supabase.from("designs").select("*").eq("published", true).eq("category", cat.slug).order("created_at", { ascending: false });
  const list = (data ?? []) as Design[];
  return (
    <>
      <Header />
      <main className="wrap py-12 sm:py-16 min-h-[60vh]">
        <h1 className="font-serif text-3xl sm:text-5xl text-center mb-10">{cat.name}</h1>
        {list.length ? <div className="grid-d">{list.map((d) => <Card key={d.id} d={d} />)}</div>
          : <p className="text-center card p-10 text-ink/60">No designs in this category yet.</p>}
      </main>
      <Footer />
    </>
  );
}
