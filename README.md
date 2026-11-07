# F.S Casting – Jewellery Portfolio + Admin

## 1. Supabase (free)
1. Create an account at supabase.com → **New project**.
2. **SQL Editor** → paste all of `supabase/setup.sql` → Run. (Creates tables, security rules and the `designs` photo bucket.)
3. **Authentication → Users → Add user** → enter your email + password (tick "Auto confirm").
4. Back in SQL Editor run (use your email):
   `insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';`
   Only users in this table can add/edit/delete.
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key. Never use the service_role key.

## 2. Run locally
```
npm install
cp .env.example .env.local   # fill in the two Supabase values
npm run dev
```
Open http://localhost:3000 and http://localhost:3000/admin.

## 3. Deploy on Vercel
1. Upload this folder to a GitHub repository.
2. vercel.com → **Add New Project** → import the repo.
3. Add Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy. Designs uploaded at `/admin` appear on the live site immediately, with no redeploy.

## Notes
- All WhatsApp buttons use +923133316526 with a pre-filled design name and ID (`lib/data.ts`).
- Supabase Auth → URL Configuration: set Site URL to your Vercel domain.
