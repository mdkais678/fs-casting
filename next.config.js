const host = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vzndrndsfjcqcrkbcsvj.supabase.co").replace("https://", "");
module.exports = { images: { remotePatterns: [{ protocol: "https", hostname: host }] } };
