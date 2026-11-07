export const WA = "923133316526";
export const CATEGORIES = [
  { slug: "rings", name: "Rings" }, { slug: "earrings", name: "Earrings" },
  { slug: "bangles", name: "Bangles" }, { slug: "bracelets", name: "Bracelets" },
  { slug: "necklaces", name: "Necklaces" }, { slug: "pendants", name: "Pendants" },
  { slug: "gold-casting", name: "Gold Casting" }, { slug: "rp-3d-designs", name: "RP / 3D Designs" },
  { slug: "custom-designs", name: "Custom Jewellery Designs" },
];
export const catName = (s: string) => CATEGORIES.find((c) => c.slug === s)?.name ?? s;
export type Design = { id: string; code: string; name: string; category: string; description: string; images: string[]; featured: boolean; published: boolean; created_at: string };
export const waLink = (d?: { name: string; code: string }) => {
  const msg = d
    ? `Assalam-o-Alaikum! I am interested in your jewellery design. Design Name: ${d.name}. Design ID: ${d.code}. Please share more details.`
    : "Assalam-o-Alaikum! I would like to inquire about your jewellery designs.";
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
};
