-- ==============================================================
-- SKEMA DATABASE SUPABASE: PORTAL SURAT IZIN PASANGAN (KIP-RI)
-- ==============================================================
-- Jalankan query ini di SQL Editor di dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql

create table if not exists permits (
  id text primary key,
  letter_number text not null,
  applicant_name text not null,
  approver_name text not null,
  category text not null,
  category_name text,
  title text not null,
  letter_content text,
  activity_description text,
  location text not null,
  event_date text not null,
  start_time text not null,
  end_time text not null,
  companions text,
  promises jsonb default '[]'::jsonb,
  custom_promise text,
  applicant_signature text,
  applicant_signed_at text,
  status text not null default 'pending',
  approver_notes text,
  demands jsonb default '[]'::jsonb,
  approver_signature text,
  decided_at text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan Row Level Security (RLS)
alter table permits enable row level security;

-- Buat policy publik (bisa baca, buat, dan update surat dengan ID yang valid)
create policy "Allow all operations for public permit access"
on permits for all
using (true)
with check (true);

-- Indeks pencarian
create index if not exists idx_permits_created_at on permits (created_at desc);
create index if not exists idx_permits_status on permits (status);
