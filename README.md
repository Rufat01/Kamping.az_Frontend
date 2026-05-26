# Kamping.az — Frontend

Next.js 14 + Tailwind CSS ilə hazırlanmış ana səhifə.

## Qurulum

```bash
npm install
npm run dev
```

Brauzer: `http://localhost:3000`

## Struktur

```
app/
  layout.jsx     → SEO metadata, fontlar (Fraunces + Plus Jakarta Sans)
  page.jsx        → Ana səhifə — bütün section-lar burada yığılır
  globals.css     → Tailwind + xüsusi animasiyalar

components/
  Navbar.jsx          → Şəffaf → scroll ilə dolu navbar, mobil menyu
  Hero.jsx            → Fullscreen hero, axtarış formu
  Marquee.jsx         → Hərəkətli stat sətri
  Categories.jsx      → 4 kateqoriya (çadır/glamping/bungalo/ev)
  FeaturedListings.jsx → 6 elan kartı (API-ya hazır)
  MapTeaser.jsx       → Xəritə bölməsi Mapbox üçün teaser
  HowItWorks.jsx      → 4 addım izahı
  Testimonials.jsx    → İstifadəçi rəyləri + statistika
  CTA.jsx             → Sahibkarlar üçün çağırış
  Footer.jsx          → Link sütunları, sosial şəbəkələr
```

## API inteqrasiyası

`FeaturedListings.jsx` içindəki `LISTINGS` massivini real API ilə əvəz et:

```js
// GET /api/v1/listings/?status=active&ordering=-rating
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/`);
const data = await res.json();
```

`MapTeaser.jsx` üçün:
```js
// GET /api/v1/listings/map/
```

## Environment

`.env.local` faylı yarat:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```
