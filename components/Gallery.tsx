"use client";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { imgUrl } from "@/lib/supabase";
export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0); const [zoom, setZoom] = useState(false); const [pos, setPos] = useState("50% 50%");
  if (!images.length) return <div className="aspect-square rounded-2xl bg-beige" />;
  return (
    <div>
      <button onClick={() => setZoom(true)} className="relative block w-full aspect-square overflow-hidden rounded-2xl bg-beige cursor-zoom-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl(images[i])} alt={name} className="h-full w-full object-cover" />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2"><ZoomIn size={18} /></span>
      </button>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {images.map((p, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p} src={imgUrl(p)} alt="" onClick={() => setI(k)} className={`h-16 w-16 sm:h-20 sm:w-20 shrink-0 cursor-pointer rounded-xl object-cover border-2 ${k === i ? "border-gold" : "border-transparent"}`} />
        ))}
      </div>
      {zoom && (
        <div className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-2" onClick={() => setZoom(false)}>
          <button className="absolute right-4 top-4 p-3" aria-label="Close"><X /></button>
          <div className="h-full w-full overflow-hidden" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl(images[i])} alt={name} className="h-full w-full object-contain transition-transform duration-200 md:hover:scale-[2]" style={{ transformOrigin: pos }} />
          </div>
        </div>
      )}
    </div>
  );
}
