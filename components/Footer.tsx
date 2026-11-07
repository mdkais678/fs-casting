import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/data";
export default function Footer() {
  return (
    <footer id="contact" className="bg-beige border-t border-light">
      <div className="wrap py-12 text-center">
        <h2 className="font-serif text-3xl mb-2">Let&apos;s create your jewellery</h2>
        <p className="text-ink/70 mb-6">Message us on WhatsApp with a design ID or your own idea.</p>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><MessageCircle size={18} />WhatsApp +92 313 3316526</a>
        <p className="mt-10 text-xs text-ink/60">© {new Date().getFullYear()} F.S Casting · Karachi, Pakistan</p>
      </div>
    </footer>
  );
}
