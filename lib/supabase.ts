import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vzndrndsfjcqcrkbcsvj.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_yUu5458-YYWJlh7zvoHxCg_GEjHb3A0"
);
export const imgUrl = (p: string) =>
  p.startsWith("http") ? p : supabase.storage.from("designs").getPublicUrl(p).data.publicUrl;
