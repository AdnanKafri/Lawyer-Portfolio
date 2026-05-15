insert into public.organizations (name, slug, business_type, default_locale, is_active)
values ('Al Manzour Legal', 'counsel-studio', 'lawyer', 'en', true)
on conflict (slug) do update
set
  name = excluded.name,
  business_type = excluded.business_type,
  default_locale = excluded.default_locale,
  is_active = excluded.is_active;

with active_org as (
  select id
  from public.organizations
  where slug = 'counsel-studio'
  limit 1
)
insert into public.pages (organization_id, page_key, locale, slug, is_active)
select id, 'home', locale_value, '', true
from active_org
cross join (values ('en'), ('ar')) as locales(locale_value)
on conflict (organization_id, page_key, locale) do nothing;

with active_org as (
  select id
  from public.organizations
  where slug = 'counsel-studio'
  limit 1
)
insert into public.hero_sections (
  organization_id,
  locale,
  eyebrow,
  title,
  description,
  primary_cta_label,
  primary_cta_href,
  secondary_cta_label,
  secondary_cta_href,
  trust_points
)
select
  id,
  locale_value,
  case when locale_value = 'ar' then 'خدمات قانونية احترافية' else 'Premium legal advisory' end,
  case when locale_value = 'ar'
    then 'محاماة حديثة تبني الثقة وتدير الحضور المهني باحتراف'
    else 'Modern legal representation built on trust, clarity, and professional authority'
  end,
  case when locale_value = 'ar'
    then 'محتوى افتتاحي جاهز للإدارة من لوحة التحكم بعد ربط النظام.'
    else 'Premium legal representation for commercial matters, contracts, and dispute strategy.'
  end,
  case when locale_value = 'ar' then 'احجز استشارة' else 'Book a consultation' end,
  '#contact',
  case when locale_value = 'ar' then 'استعرض الخدمات' else 'Explore services' end,
  '#services',
  case when locale_value = 'ar'
    then '["استجابة سريعة","ثقة ووضوح","دعم ثنائي اللغة"]'::jsonb
    else '["Fast response","Clarity and trust","Bilingual support"]'::jsonb
  end
from active_org
cross join (values ('en'), ('ar')) as locales(locale_value)
on conflict (organization_id, locale) do nothing;

with active_org as (
  select id
  from public.organizations
  where slug = 'counsel-studio'
  limit 1
)
insert into public.about_sections (
  organization_id,
  locale,
  eyebrow,
  title,
  summary,
  languages,
  is_active
)
select
  id,
  locale_value,
  case when locale_value = 'ar' then 'نبذة تعريفية' else 'About' end,
  case when locale_value = 'ar'
    then 'تعريف مهني واضح يبرز الخبرة والاعتمادات'
    else 'A clear professional introduction that highlights expertise and credentials'
  end,
  case when locale_value = 'ar'
    then 'هذا المحتوى التأسيسي يثبت البنية ويجهز القسم للإدارة الكاملة من لوحة التحكم.'
    else 'A refined professional introduction that highlights experience, credentials, and approach.'
  end,
  case when locale_value = 'ar' then array['العربية', 'الإنجليزية'] else array['Arabic', 'English'] end,
  true
from active_org
cross join (values ('en'), ('ar')) as locales(locale_value)
on conflict (organization_id, locale) do nothing;

with active_org as (
  select id
  from public.organizations
  where slug = 'counsel-studio'
  limit 1
)
insert into public.contact_info (
  organization_id,
  locale,
  eyebrow,
  title,
  description,
  phone,
  whatsapp,
  email,
  address,
  response_time_label
)
select
  id,
  locale_value,
  case when locale_value = 'ar' then 'تواصل' else 'Contact' end,
  case when locale_value = 'ar'
    then 'ابدأ استشارتك القانونية'
    else 'Start your legal consultation'
  end,
  case when locale_value = 'ar'
    then 'سيتم حفظ الطلبات وإدارتها من لوحة التحكم.'
    else 'New inquiries are reviewed promptly and routed securely for follow-up.'
  end,
  '+971 4 555 0188',
  '+971 50 555 0188',
  'office@almanzourlegal.com',
  case when locale_value = 'ar' then 'دبي، الإمارات العربية المتحدة' else 'Dubai, United Arab Emirates' end,
  case when locale_value = 'ar' then 'خلال 24 ساعة' else 'Within 24 hours' end
from active_org
cross join (values ('en'), ('ar')) as locales(locale_value)
on conflict (organization_id, locale) do nothing;
