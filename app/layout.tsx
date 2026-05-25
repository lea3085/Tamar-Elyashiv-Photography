import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תמר אלישיב | צלמת לייף סטייל',
  description: 'צילום ניובורן, חלאקה, משפחות ובת מצווה במודיעין עילית',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
