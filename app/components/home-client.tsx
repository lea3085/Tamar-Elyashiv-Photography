'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Baby, Trees } from 'lucide-react';

type SiteSettings = {
  primary_color: string | null;
  font_family: string | null;
  text_align: 'right' | 'center' | 'left' | null;
};

type UiPhoto = {
  id: string;
  title: string | null;
  alt: string;
  url: string;
};

export default function HomeClient({ settings, photos }: { settings: SiteSettings; photos: UiPhoto[] }) {
  const [activeHero, setActiveHero] = useState(0);
  const heroPhotos = useMemo(() => (photos.length ? photos.slice(0, 4) : []), [photos]);
  const newbornPhotos = photos.slice(0, 6);
  const outdoorPhotos = photos.slice(6, 12).length ? photos.slice(6, 12) : photos.slice(0, 6);

  useEffect(() => {
    if (!heroPhotos.length) return;
    const onScroll = () => {
      const step = Math.min(heroPhotos.length - 1, Math.floor(window.scrollY / 320));
      setActiveHero(step);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroPhotos.length]);

  return (
    <main
      className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]"
      style={{
        ['--theme-primary' as string]: settings.primary_color ?? '#8c6a54',
        ['--theme-font' as string]: settings.font_family ?? 'Heebo, Assistant, Rubik, sans-serif',
        ['--theme-text-align' as string]: settings.text_align ?? 'right',
        ['--bg-main' as string]: '#f8f5f1',
        ['--text-main' as string]: '#392d24',
        textAlign: settings.text_align ?? 'right',
        fontFamily: settings.font_family ?? 'Heebo, Assistant, Rubik, sans-serif',
      }}
      dir="rtl"
    >
      <section className="relative isolate h-[82vh] min-h-[560px] overflow-hidden">
        {heroPhotos.map((photo, index) => (
          <Image key={photo.id} src={photo.url} alt={photo.alt} fill priority={index === 0} sizes="100vw" className={`object-cover transition-opacity duration-700 ${index === activeHero ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-[#221a15]/85" />
        <div className="soft-reveal relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-end px-6 pb-16 text-stone-100 md:px-12">
          <p className="mb-4 tracking-[0.25em] text-stone-200/90">גלריה קצת מעל מחירון, השארת פרטים בהמשך</p>
          <h1 className="text-5xl font-light md:text-7xl">תמר אלישיב</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-200 md:text-2xl">צילום מינימליסטי, אלגנטי ומדויק - ניו בורן וצילומי חוץ.</p>
          <a href="#gallery" className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-stone-50/10 px-5 py-3 text-sm backdrop-blur transition hover:bg-stone-50/25">מעבר ישיר לגלריה <ArrowDown className="h-4 w-4" /></a>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl font-light">גלריה</h2>
          <p className="text-sm text-stone-600">גלילה קלה מההירו ואת כבר כאן</p>
        </div>

        <div className="mb-12 rounded-3xl border border-[#d6c9be] bg-white/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 text-2xl"><Baby className="h-6 w-6 text-[var(--theme-primary)]" /> ניו בורן</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newbornPhotos.map((photo) => (
              <article key={`newborn-${photo.id}`} className="soft-reveal overflow-hidden rounded-2xl bg-[#efe7df]">
                <Image src={photo.url} alt={photo.alt} width={700} height={900} className="h-72 w-full object-cover transition duration-500 hover:scale-105" />
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#d6c9be] bg-white/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 text-2xl"><Trees className="h-6 w-6 text-[var(--theme-primary)]" /> חוץ</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outdoorPhotos.map((photo) => (
              <article key={`outdoor-${photo.id}`} className="soft-reveal overflow-hidden rounded-2xl bg-[#efe7df]">
                <Image src={photo.url} alt={photo.alt} width={700} height={900} className="h-72 w-full object-cover transition duration-500 hover:scale-105" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 md:px-12">
        <div className="rounded-3xl border border-[#d6c9be] bg-white p-8 text-center shadow-sm">
          <h2 className="text-4xl font-light">מחירון</h2>
          <p className="mt-5 text-lg leading-8 text-stone-700">חבילות צילום בהתאמה אישית, ניובורן וחוץ. המחירון המדויק נשלח לאחר שיחה קצרה להבנת הצורך.</p>
          <button className="mt-8 rounded-full bg-[var(--theme-primary)] px-8 py-3 text-white transition hover:brightness-95">עמוד חבילות</button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 md:px-12">
        <div className="rounded-3xl bg-[#f0dfd8] p-8 text-center">
          <h3 className="text-3xl font-light">השארת פרטים</h3>
          <p className="mt-4 text-stone-700">למייל: hello@tamarelyashiv.com · וואטסאפ: 050-0000000</p>
        </div>
      </section>
    </main>
  );
}
