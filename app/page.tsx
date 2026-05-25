export const dynamic = 'force-dynamic';

import { getSupabasePublic, PUBLIC_BUCKET } from '@/lib/supabase';
import HomeClient from '@/app/components/home-client';

type SiteSettings = {
  primary_color: string | null;
  font_family: string | null;
  text_align: 'right' | 'center' | 'left' | null;
};

type Photo = {
  id: string;
  title: string | null;
  alt_text: string | null;
  image_path: string;
};

const defaultSettings: SiteSettings = {
  primary_color: '#8c6a54',
  font_family: 'Heebo, Assistant, Rubik, sans-serif',
  text_align: 'right',
};

function getPublicImageUrl(path: string): string {
  const supabase = getSupabasePublic();
  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function getSettings(): Promise<SiteSettings> {
  const supabase = getSupabasePublic();
  const { data } = await supabase
    .from('settings')
    .select('primary_color, font_family, text_align')
    .limit(1)
    .maybeSingle();

  return {
    primary_color: data?.primary_color ?? defaultSettings.primary_color,
    font_family: data?.font_family ?? defaultSettings.font_family,
    text_align: data?.text_align ?? defaultSettings.text_align,
  };
}

async function getPhotos(): Promise<Photo[]> {
  const supabase = getSupabasePublic();
  const { data } = await supabase
    .from('photos')
    .select('id, title, alt_text, image_path')
    .not('image_path', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20);

  return (data ?? []).filter((item) => item.image_path) as Photo[];
}

export default async function HomePage() {
  const [settings, photos] = await Promise.all([getSettings(), getPhotos()]);
  const photoUrls = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    alt: photo.alt_text ?? photo.title ?? 'צילום מאת תמר אלישיב',
    url: getPublicImageUrl(photo.image_path),
  }));

  return <HomeClient settings={settings} photos={photoUrls} />;
}
