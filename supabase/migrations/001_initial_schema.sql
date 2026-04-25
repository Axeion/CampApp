-- Config table: stores rsvp, pack_list, and menu as JSONB
create table if not exists public.config (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

-- Checklist table: shared real-time check state
create table if not exists public.checklist (
  item_key   text primary key,
  checked    boolean not null default false,
  checked_by text,
  updated_at timestamptz default now()
);

-- Row Level Security (permissive — tighten once auth is added)
alter table public.config    enable row level security;
alter table public.checklist enable row level security;

create policy "allow all on config"    on public.config    for all using (true) with check (true);
create policy "allow all on checklist" on public.checklist for all using (true) with check (true);

-- Enable real-time
alter publication supabase_realtime add table public.config;
alter publication supabase_realtime add table public.checklist;
