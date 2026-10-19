-- Jalankan di Supabase > SQL Editor
create table if not exists public.likes (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

alter table public.likes enable row level security;

-- Semua pengunjung boleh melihat jumlah dan menambah like
create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (true);

-- Aktifkan realtime untuk tabel likes (counter live)
alter publication supabase_realtime add table public.likes;
