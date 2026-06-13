-- ============================================================
-- Mật Mã 21 — Supabase Database Setup
-- Chạy từng phần trong Supabase SQL Editor
-- ============================================================

-- 1. Bảng user_profiles (auto-created khi user đăng ký)
create table if not exists public.user_profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  phone       text,
  email_consent boolean default false,
  source      text,
  created_at  timestamptz default now()
);

-- 2. Bảng course_enrollments
create table if not exists public.course_enrollments (
  id          bigserial primary key,
  user_id     uuid references auth.users on delete cascade,
  course_id   text not null,
  course_name text,
  status      text default 'active',
  enrolled_at timestamptz default now(),
  unique (user_id, course_id)
);

-- 3. Trigger: tự tạo user_profile khi user signUp thành công
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, name, phone, email_consent, source)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'email_consent')::boolean, false),
    new.raw_user_meta_data->>'source'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.course_enrollments enable row level security;

-- User có thể đọc/sửa profile của mình
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- User có thể đọc/thêm enrollment của mình
create policy "Users can view own enrollments"
  on public.course_enrollments for select
  using (auth.uid() = user_id);

create policy "Users can enroll"
  on public.course_enrollments for insert
  with check (auth.uid() = user_id);

-- 5. Cấp quyền cho service role đọc tất cả (admin API dùng service role key)
-- Không cần policy riêng vì service role key bypass RLS tự động.

-- ============================================================
-- Sau khi chạy xong SQL, thêm vào .env và Vercel Dashboard:
--
-- VITE_SUPABASE_URL=https://xxxx.supabase.co
-- VITE_SUPABASE_ANON_KEY=eyJhbGci...
-- SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   ← CHỈ Vercel, KHÔNG thêm VITE_ prefix
--
-- Và thêm redirect URL trong Supabase Dashboard:
-- Authentication → URL Configuration → Redirect URLs:
--   https://your-domain.com/portal.html
--   http://localhost:5173/portal.html
-- ============================================================
