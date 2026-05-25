'use client';

import { useMemo, useState } from 'react';

type ElementItem = {
  id: string;
  key: string;
  type: 'text' | 'image' | 'icon';
  content: string | null;
  image_path: string | null;
  icon_name: string | null;
  style: {
    color?: string;
    fontFamily?: string;
    textAlign?: 'right' | 'center' | 'left';
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic';
  } | null;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [items, setItems] = useState<ElementItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const selected = useMemo(() => items.find((i) => i.id === selectedId), [items, selectedId]);

  async function loadItems() {
    const res = await fetch('/api/admin/elements', { headers: { 'x-admin-password': password } });
    if (!res.ok) return alert('סיסמת אדמין שגויה או שגיאה בשרת');
    const json = await res.json();
    setItems(json.items);
    setSelectedId(json.items?.[0]?.id ?? '');
    setAuth(true);
  }

  async function savePatch(patch: Record<string, unknown>) {
    if (!selected) return;
    const res = await fetch('/api/admin/elements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: selected.id, patch }),
    });
    if (!res.ok) return alert('שמירה נכשלה');
    const json = await res.json();
    setItems((prev) => prev.map((p) => (p.id === selected.id ? json.item : p)));
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: form,
    });
    if (!res.ok) return alert('העלאת תמונה נכשלה');
    const json = await res.json();
    await savePatch({ image_path: json.image_path });
  }

  if (!auth) {
    return (
      <main className="mx-auto max-w-md p-8" dir="rtl">
        <h1 className="mb-4 text-2xl">ניהול אתר</h1>
        <input className="w-full rounded border p-3" type="password" placeholder="סיסמת אדמין" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="mt-4 rounded bg-black px-4 py-2 text-white" onClick={loadItems}>כניסה</button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-[320px,1fr]" dir="rtl">
      <aside className="rounded-xl border p-4">
        <h2 className="mb-3 font-medium">אלמנטים</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full rounded border px-3 py-2 text-right ${selectedId === item.id ? 'bg-stone-100' : ''}`}>
              {item.key} · {item.type}
            </button>
          ))}
        </div>
      </aside>
      <section className="rounded-xl border p-6">
        {!selected ? <p>בחרי אלמנט לעריכה</p> : (
          <div className="space-y-4">
            <h2 className="text-xl">עריכת: {selected.key}</h2>
            {selected.type === 'text' && (
              <textarea
                className="min-h-40 w-full rounded border p-3"
                defaultValue={selected.content ?? ''}
                onBlur={(e) => savePatch({ content: e.target.value })}
              />
            )}
            {selected.type === 'icon' && (
              <input
                className="w-full rounded border p-3"
                defaultValue={selected.icon_name ?? ''}
                onBlur={(e) => savePatch({ icon_name: e.target.value })}
                placeholder="שם אייקון (lucide)"
              />
            )}
            {selected.type === 'image' && (
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            )}
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded border p-2" type="color" onChange={(e) => savePatch({ style: { ...(selected.style ?? {}), color: e.target.value } })} />
              <input className="rounded border p-2" placeholder="גופן" defaultValue={selected.style?.fontFamily ?? ''} onBlur={(e) => savePatch({ style: { ...(selected.style ?? {}), fontFamily: e.target.value } })} />
              <select className="rounded border p-2" defaultValue={selected.style?.textAlign ?? 'right'} onChange={(e) => savePatch({ style: { ...(selected.style ?? {}), textAlign: e.target.value } })}>
                <option value="right">ימין</option><option value="center">מרכז</option><option value="left">שמאל</option>
              </select>
              <select className="rounded border p-2" defaultValue={selected.style?.fontWeight ?? '400'} onChange={(e) => savePatch({ style: { ...(selected.style ?? {}), fontWeight: e.target.value } })}>
                <option value="300">דק</option><option value="400">רגיל</option><option value="500">בינוני</option><option value="700">מודגש</option>
              </select>
              <select className="rounded border p-2" defaultValue={selected.style?.fontStyle ?? 'normal'} onChange={(e) => savePatch({ style: { ...(selected.style ?? {}), fontStyle: e.target.value } })}>
                <option value="normal">רגיל</option><option value="italic">נטוי</option>
              </select>
              <button className="rounded border border-red-300 px-3 py-2 text-red-600" onClick={() => savePatch({ content: null, image_path: null, icon_name: null })}>הסר תוכן</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
