# Frontend Solusite Studio

Frontend Next.js untuk halaman awal portofolio produk digital. Data halaman diambil langsung dari API REST publik Laravel tanpa autentikasi.

## Persiapan

```bash
cp .env.example .env.local
npm install
npm run dev
```

Isi `.env.local`:

```bash
NEXT_PUBLIC_LARAVEL_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Integrasi API

Frontend mengambil data langsung dari endpoint publik Laravel:

```text
GET {NEXT_PUBLIC_LARAVEL_API_BASE_URL}/products
GET {NEXT_PUBLIC_LARAVEL_API_BASE_URL}/services
GET {NEXT_PUBLIC_LARAVEL_API_BASE_URL}/portfolio
GET {NEXT_PUBLIC_LARAVEL_API_BASE_URL}/plans
GET {NEXT_PUBLIC_LARAVEL_API_BASE_URL}/discounts
GET {NEXT_PUBLIC_LARAVEL_API_BASE_URL}/products/{id}
```

Header yang dipakai:

```http
Accept: application/json
Content-Type: application/json
```

Response index dapat memakai paginated resource Laravel:

```json
{
  "data": []
}
```

Jika backend belum aktif, frontend menampilkan pesan error API, bukan data statis.

## Skrip

```bash
npm run dev
npm run lint
npx tsc --noEmit
npx next build --webpack
```
