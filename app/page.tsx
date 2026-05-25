import Image from 'next/image';
import { Camera, Heart, Sparkles, Users, Baby, Scissors, Star } from 'lucide-react';
import { PUBLIC_BUCKET, supabase } from '@/lib/supabase';

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
  primary_color: '#9a8a78',
  font_family: 'Heebo, Assistant, Rubik, sans-serif',
  text_align: 'right',
};

function getPublicImageUrl(path: string): string {
  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function getSettings(): Promise<SiteSettings> {
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
  const { data } = await supabase
    .from('photos')
    .select('id, title, alt_text, image_path')
    .not('image_path', 'is', null)
    .order('created_at', { ascending: false })
    .limit(12);

  return (data ?? []).filter((item) => item.image_path) as Photo[];
}

export default async function HomePage() {
  const [settings, photos] = await Promise.all([getSettings(), getPhotos()]);

  return (
    <main
      className="min-h-screen"
      style={{
        ['--theme-primary' as string]: settings.primary_color ?? defaultSettings.primary_color,
        ['--theme-font' as string]: settings.font_family ?? defaultSettings.font_family,
        ['--theme-text-align' as string]: settings.text_align ?? defaultSettings.text_align,
        textAlign: settings.text_align ?? 'right',
      }}
    >
      <section className="relative isolate h-[78vh] min-h-[560px] overflow-hidden">
        <Image
          src={getPublicImageUrl('hero.jpg')}
          alt="תמונת שער - תמר אלישיב"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-stone-950/70" />
        <div className="soft-reveal relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end p-8 text-stone-100 md:p-16">
          <p className="mb-3 text-sm tracking-[0.28em] text-stone-200/90">מודיעין עילית • לייף סטייל פרימיום</p>
          <h1 className="text-4xl font-light leading-tight md:text-6xl">תמר אלישיב · Tamar Elyashiv</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-200 md:text-xl">אומנות של רגש, סטייל ודיוק — ניובורן, חלאקה, משפחות ובת מצווה.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2 md:px-12">
        <div className="soft-reveal space-y-4">
          <h2 className="text-3xl font-light text-stone-900 md:text-4xl">הקסם שמאחורי העדשה</h2>
          <p className="leading-8 text-stone-700">תמר אלישיב ידועה כ־"מאסטרית לקומפוזיציה ולסטיילינג": כל פריים בנוי בקפידה, כל פרופ מוכנס בדיוק במקום, וכל פרט קטן הופך לחלק מסיפור גדול ומרגש.</p>
          <p className="leading-8 text-stone-700">"המגע הקסום" שלה ניכר במיוחד ברגעים מאתגרים — לוקיישן לא מושלם, ילד עייף או תנאי אור מורכבים הופכים ביד אומן לתמונה אלגנטית, יוקרתית ונצחית.</p>
          <p className="leading-8 text-stone-700">עם סבלנות אינסופית, מקצוענות נדירה וטעם מדויק, תמר יוצרת חוויה שקטה, מכילה ומוקפדת — ותוצר סופי בעל שפה עריכתית ייחודית המזוהה איתה.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[Sparkles, Camera, Heart, Star].map((Icon, index) => (
            <div key={index} className="group rounded-2xl border border-stone-200 bg-white/70 p-5 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
              <Icon className="mb-3 h-6 w-6 text-[var(--theme-primary)] transition group-hover:scale-110" />
              <p className="text-sm leading-7 text-stone-700">דיוק קומפוזיציה, עריכה חתימתית וליווי רגיש לכל משפחה.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        <h2 className="mb-8 text-3xl font-light">פורטפוליו</h2>
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <article key={photo.id} className="soft-reveal break-inside-avoid overflow-hidden rounded-2xl bg-stone-100">
              <Image
                src={getPublicImageUrl(photo.image_path)}
                alt={photo.alt_text ?? photo.title ?? 'צילום מאת תמר אלישיב'}
                width={800}
                height={1000}
                className="h-auto w-full object-cover transition duration-500 hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        <h2 className="mb-8 text-3xl font-light">תחומי צילום</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Baby, label: 'ניובורן' },
            { icon: Scissors, label: 'חלאקה' },
            { icon: Users, label: 'משפחות' },
            { icon: Sparkles, label: 'בת מצווה' },
          ].map((item) => (
            <div key={item.label} className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-[var(--theme-primary)] hover:shadow-md">
              <item.icon className="mb-4 h-6 w-6 text-[var(--theme-primary)] transition group-hover:rotate-6" />
              <p className="text-lg text-stone-800">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 text-center md:px-12">
        <h2 className="mb-6 text-3xl font-light">פילוסופיית הצילום</h2>
        <p className="mx-auto max-w-3xl leading-8 text-stone-700">"תמונה מעולה היא שילוב של רגש אמיתי ואסתטיקה מוקפדת." זו ההבטחה של תמר: שירות סבלני, מקצועי ומלא טעם — מהשיחה הראשונה ועד לתמונה האחרונה.</p>
      </section>

      <footer className="border-t border-stone-200 px-6 py-8 text-sm text-stone-600 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 md:flex-row">
          <p>© {new Date().getFullYear()} תמר אלישיב | מודיעין עילית</p>
          <p>לפרטים והזמנות: 050-0000000 · hello@tamarelyashiv.com</p>
        </div>
      </footer>
    </main>
  );
}
