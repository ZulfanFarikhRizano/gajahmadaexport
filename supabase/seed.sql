-- Run after schema.sql. Safe to re-run (upserts).
--
-- Image fields below use a plain gray placeholder data URI instead of a
-- local file path like "/images/chair-01.jpg" — that file was never
-- guaranteed to exist in public/images and rendered as a broken image.
-- Replace these with real photos via the admin dashboard (uploads go to
-- Supabase Storage automatically) after your first login.

insert into site_content (id, site_name, logo_url, hero_headline, hero_subheadline, whatsapp_number, about_text, contact_address)
values (
  1,
  'Gajah Mada Export',
  'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''200'' height=''200''%3E%3Crect width=''200'' height=''200'' fill=''%23A85C3F''/%3E%3Ctext x=''50%25'' y=''50%25'' font-family=''serif'' font-size=''28'' fill=''%23FAF6EE'' text-anchor=''middle'' dominant-baseline=''middle''%3EGM%3C/text%3E%3C/svg%3E',
  'Gajah Mada Export',
  'Handwoven rattan, made to travel the world',
  '6285714365948',
  'Gajah Mada Export adalah produsen dan eksportir furnitur rotan asal Cirebon, Indonesia. Setiap produk ditenun oleh pengrajin lokal dengan motif turun-temurun.',
  'Cirebon, Jawa Barat, Indonesia'
)
on conflict (id) do update set
  site_name = excluded.site_name,
  hero_headline = excluded.hero_headline,
  hero_subheadline = excluded.hero_subheadline,
  whatsapp_number = excluded.whatsapp_number,
  about_text = excluded.about_text,
  contact_address = excluded.contact_address;
  -- logo_url intentionally NOT overwritten on conflict, so re-running this
  -- seed never clobbers a real logo you've already uploaded via /admin.

insert into products (id, name, category, description, price, images)
values
  ('chr-001', 'Rattan Armchair Classic', 'chair-bench', 'Kursi rotan anyam tangan dengan bantal duduk empuk, cocok untuk ruang tamu atau teras.', 'Hubungi kami', '{}'),
  ('hng-001', 'Rattan Hanging Swing Chair', 'hanging-chair', 'Kursi gantung rotan bulat dengan konstruksi kokoh, dilengkapi dudukan bantal.', 'Hubungi kami', '{}')
on conflict (id) do nothing;
