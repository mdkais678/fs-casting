import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Design, catName, waLink } from "@/lib/data";
import { imgUrl } from "@/lib/supabase";
export default function Card({ d }: { d: Design }) {
  return (
    <article className="card overflow-hidden group flex flex-col">
      <Link href={`/design/${d.id}`} className="relative block aspect-square bg-beige overflow-hidden">
        {d.images[0] && <Image src={imgUrl(d.images[0])} alt={d.name} fill sizes="(max-width:480px) 100vw,(max-width:1024px) 50vw,25vw" className="object-cover transition duration-500 group-hover:scale-105" />}
      </Link>
      <div className="p-4 flex flex-1 flex-col gap-1">
        <p className="text-xs uppercase tracking-widest text-gold">{catName(d.category)}</p>
        <h3 className="font-serif text-lg">{d.name}</h3>
        <p className="text-xs text-ink/60">ID: {d.code}</p>
        <p className="text-sm text-ink/80 line-clamp-2 mb-3">{d.description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          <Link href={`/design/${d.id}`} className="btn btn-line flex-1">View Details</Link>
          <a href={waLink(d)} target="_blank" rel="noopener noreferrer" className="btn btn-gold flex-1"><MessageCircle size={16} />WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
