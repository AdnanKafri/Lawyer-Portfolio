create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  business_type text not null default 'lawyer',
  default_locale text not null default 'en' check (default_locale in ('en', 'ar')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'editor' check (role in ('super_admin', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text check (locale in ('en', 'ar')),
  bucket text not null default 'media',
  path text not null,
  file_name text not null,
  mime_type text not null,
  alt_text text,
  size_bytes integer not null default 0,
  width integer,
  height integer,
  is_active boolean not null default true,
  created_by uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  page_key text not null,
  locale text not null check (locale in ('en', 'ar')),
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, page_key, locale),
  unique (organization_id, locale, slug)
);

create table if not exists public.hero_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  eyebrow text not null,
  title text not null,
  description text not null,
  primary_cta_label text not null,
  primary_cta_href text not null default '#contact',
  secondary_cta_label text not null,
  secondary_cta_href text not null default '#services',
  trust_points jsonb not null default '[]'::jsonb,
  hero_asset_id uuid references public.media_assets(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, locale)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  slug text not null,
  title text not null,
  description text not null,
  icon_key text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, locale, slug)
);

create table if not exists public.about_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  eyebrow text not null,
  title text not null,
  summary text not null,
  years_experience smallint,
  languages text[] not null default '{}',
  certifications_summary text,
  profile_asset_id uuid references public.media_assets(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, locale)
);

create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  label text not null,
  value text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  author_name text not null,
  author_role text,
  quote text not null,
  rating smallint check (rating between 1 and 5),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_info (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  eyebrow text,
  title text,
  description text,
  phone text,
  whatsapp text,
  email text,
  address text,
  map_embed_url text,
  response_time_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, locale)
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  platform text not null,
  label text,
  url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  page_key text not null,
  meta_title text not null,
  meta_description text not null,
  og_title text,
  og_description text,
  og_image_asset_id uuid references public.media_assets(id) on delete set null,
  canonical_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, locale, page_key)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  site_name text not null,
  tagline text,
  primary_phone text,
  primary_email text,
  office_address text,
  logo_asset_id uuid references public.media_assets(id) on delete set null,
  favicon_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.legal_pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  page_type text not null check (page_type in ('privacy', 'terms')),
  title text not null,
  body text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, locale, page_type)
);

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'website_contact_form',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_admin_users_auth_user_id on public.admin_users(auth_user_id);
create index if not exists idx_admin_users_org on public.admin_users(organization_id);
create index if not exists idx_pages_org_locale on public.pages(organization_id, locale);
create index if not exists idx_services_org_locale_sort on public.services(organization_id, locale, sort_order);
create index if not exists idx_credentials_org_locale_sort on public.credentials(organization_id, locale, sort_order);
create index if not exists idx_statistics_org_locale_sort on public.statistics(organization_id, locale, sort_order);
create index if not exists idx_testimonials_org_locale_sort on public.testimonials(organization_id, locale, sort_order);
create index if not exists idx_faqs_org_locale_sort on public.faqs(organization_id, locale, sort_order);
create index if not exists idx_leads_org_status_created on public.lead_submissions(organization_id, status, created_at desc);
create index if not exists idx_media_assets_org_created on public.media_assets(organization_id, created_at desc);
create index if not exists idx_social_links_org_sort on public.social_links(organization_id, sort_order);
create index if not exists idx_seo_org_locale_page on public.seo_settings(organization_id, locale, page_key);

create or replace function public.is_any_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and is_active = true
  );
$$;

create or replace function public.current_user_has_org_role(target_organization uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and organization_id = target_organization
      and is_active = true
      and role = any(allowed_roles)
  );
$$;

create or replace function public.current_user_same_org(target_organization uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and organization_id = target_organization
      and is_active = true
  );
$$;

alter table public.organizations enable row level security;
alter table public.admin_users enable row level security;
alter table public.media_assets enable row level security;
alter table public.pages enable row level security;
alter table public.hero_sections enable row level security;
alter table public.services enable row level security;
alter table public.about_sections enable row level security;
alter table public.credentials enable row level security;
alter table public.statistics enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_info enable row level security;
alter table public.social_links enable row level security;
alter table public.seo_settings enable row level security;
alter table public.site_settings enable row level security;
alter table public.legal_pages enable row level security;
alter table public.lead_submissions enable row level security;

create policy "public read organizations"
on public.organizations for select
using (is_active = true);

create policy "admins manage organizations"
on public.organizations for all
using (public.current_user_has_org_role(id, array['super_admin']))
with check (public.current_user_has_org_role(id, array['super_admin']));

create policy "admins read own admin user row"
on public.admin_users for select
using (
  auth.uid() = auth_user_id
  or public.current_user_has_org_role(organization_id, array['super_admin'])
);

create policy "super admins manage admin users"
on public.admin_users for all
using (public.current_user_has_org_role(organization_id, array['super_admin']))
with check (public.current_user_has_org_role(organization_id, array['super_admin']));

create policy "public read pages"
on public.pages for select
using (is_active = true);

create policy "admins manage pages"
on public.pages for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read hero sections"
on public.hero_sections for select
using (is_active = true);

create policy "admins manage hero sections"
on public.hero_sections for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read services"
on public.services for select
using (is_active = true);

create policy "admins manage services"
on public.services for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read about sections"
on public.about_sections for select
using (is_active = true);

create policy "admins manage about sections"
on public.about_sections for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read credentials"
on public.credentials for select
using (is_active = true);

create policy "admins manage credentials"
on public.credentials for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read statistics"
on public.statistics for select
using (is_active = true);

create policy "admins manage statistics"
on public.statistics for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read testimonials"
on public.testimonials for select
using (is_active = true);

create policy "admins manage testimonials"
on public.testimonials for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read faqs"
on public.faqs for select
using (is_active = true);

create policy "admins manage faqs"
on public.faqs for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read contact info"
on public.contact_info for select
using (is_active = true);

create policy "admins manage contact info"
on public.contact_info for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read social links"
on public.social_links for select
using (is_active = true);

create policy "admins manage social links"
on public.social_links for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read legal pages"
on public.legal_pages for select
using (is_active = true);

create policy "admins manage legal pages"
on public.legal_pages for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read site settings"
on public.site_settings for select
using (true);

create policy "admins manage site settings"
on public.site_settings for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read seo settings"
on public.seo_settings for select
using (is_active = true);

create policy "admins manage seo settings"
on public.seo_settings for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public insert leads"
on public.lead_submissions for insert
with check (exists (
  select 1
  from public.organizations
  where id = organization_id
    and is_active = true
));

create policy "admins read leads"
on public.lead_submissions for select
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "admins update leads"
on public.lead_submissions for update
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

create policy "public read media assets"
on public.media_assets for select
using (is_active = true);

create policy "admins manage media assets"
on public.media_assets for all
using (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']))
with check (public.current_user_has_org_role(organization_id, array['super_admin', 'editor']));

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at before update on public.admin_users
for each row execute procedure public.set_updated_at();

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at before update on public.media_assets
for each row execute procedure public.set_updated_at();

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at before update on public.pages
for each row execute procedure public.set_updated_at();

drop trigger if exists hero_sections_set_updated_at on public.hero_sections;
create trigger hero_sections_set_updated_at before update on public.hero_sections
for each row execute procedure public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at before update on public.services
for each row execute procedure public.set_updated_at();

drop trigger if exists about_sections_set_updated_at on public.about_sections;
create trigger about_sections_set_updated_at before update on public.about_sections
for each row execute procedure public.set_updated_at();

drop trigger if exists credentials_set_updated_at on public.credentials;
create trigger credentials_set_updated_at before update on public.credentials
for each row execute procedure public.set_updated_at();

drop trigger if exists statistics_set_updated_at on public.statistics;
create trigger statistics_set_updated_at before update on public.statistics
for each row execute procedure public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials
for each row execute procedure public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at before update on public.faqs
for each row execute procedure public.set_updated_at();

drop trigger if exists contact_info_set_updated_at on public.contact_info;
create trigger contact_info_set_updated_at before update on public.contact_info
for each row execute procedure public.set_updated_at();

drop trigger if exists social_links_set_updated_at on public.social_links;
create trigger social_links_set_updated_at before update on public.social_links
for each row execute procedure public.set_updated_at();

drop trigger if exists seo_settings_set_updated_at on public.seo_settings;
create trigger seo_settings_set_updated_at before update on public.seo_settings
for each row execute procedure public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute procedure public.set_updated_at();

drop trigger if exists legal_pages_set_updated_at on public.legal_pages;
create trigger legal_pages_set_updated_at before update on public.legal_pages
for each row execute procedure public.set_updated_at();

drop trigger if exists lead_submissions_set_updated_at on public.lead_submissions;
create trigger lead_submissions_set_updated_at before update on public.lead_submissions
for each row execute procedure public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket objects"
on storage.objects for select
using (bucket_id = 'media');

create policy "admins upload media bucket objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'media'
  and public.is_any_admin()
);

create policy "admins update media bucket objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'media'
  and public.is_any_admin()
)
with check (
  bucket_id = 'media'
  and public.is_any_admin()
);

create policy "admins delete media bucket objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'media'
  and public.is_any_admin()
);
