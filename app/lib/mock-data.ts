import type { Category, Discount, Product, Settings } from "./data";

// Disamakan dengan CMS_CATEGORY / OTHERS_CATEGORY di ./data.
// Pakai literal di sini agar tidak terjadi circular import nilai.
const CMS_CATEGORY = "cms";
const OTHERS_CATEGORY = "others";

// Data dummy untuk pratinjau tampilan selama API belum siap / dirombak.
// Dipakai sebagai fallback saja — implementasi API tetap dipakai bila tersedia.
function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/640/400`;
}

const rawMockProducts: Product[] = [
  {
    id: 101,
    name: "Solusite CMS",
    short: "CMS modern untuk website company profile.",
    description:
      "Sistem manajemen konten serbaguna untuk membangun website company profile. Kelola halaman, menu, banner, dan media tanpa perlu coding.",
    price: 1989000,
    label: "CMS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: CMS_CATEGORY,
    tags: ["Mudah dikelola", "Responsif", "SEO"],
    thumbnail: "",
    thumbnailUrl: img("solusite-cms"),
  },
  {
    id: 102,
    name: "Toko Online CMS",
    short: "Kelola katalog produk dan pesanan sendiri.",
    description:
      "CMS toko online lengkap dengan katalog produk, keranjang, dan manajemen pesanan. Cocok untuk UMKM yang ingin berjualan online.",
    price: 2500000,
    label: "CMS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: CMS_CATEGORY,
    tags: ["E-commerce", "Pembayaran", "Stok"],
    thumbnail: "",
    thumbnailUrl: img("toko-cms"),
  },
  {
    id: 103,
    name: "Blog & Berita CMS",
    short: "Publikasikan artikel dan berita dengan mudah.",
    description:
      "Platform CMS untuk media, blog, dan portal berita. Dukungan kategori, tag, penulis, dan penjadwalan artikel.",
    price: 1500000,
    label: "CMS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: CMS_CATEGORY,
    tags: ["Artikel", "Editor", "SEO"],
    thumbnail: "",
    thumbnailUrl: img("blog-cms"),
  },
  {
    id: 104,
    name: "Landing Page CMS",
    short: "Bangun halaman promosi tanpa ngoding.",
    description:
      "CMS khusus landing page dengan editor blok drag-and-drop. Ideal untuk kampanye produk dan pengumpulan leads.",
    price: 990000,
    label: "CMS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: CMS_CATEGORY,
    tags: ["Landing", "Leads", "Form"],
    thumbnail: "",
    thumbnailUrl: img("landing-cms"),
  },
  {
    id: 105,
    name: "Sekolah CMS",
    short: "Website profil sekolah yang mudah dikelola.",
    description:
      "CMS untuk sekolah: profil, pengumuman, galeri kegiatan, dan informasi PPDB. Admin sekolah bisa update sendiri.",
    price: 1750000,
    label: "CMS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: CMS_CATEGORY,
    tags: ["Pendidikan", "Pengumuman", "Galeri"],
    thumbnail: "",
    thumbnailUrl: img("sekolah-cms"),
  },
  {
    id: 106,
    name: "Portal Desa CMS",
    short: "Sistem informasi desa berbasis web.",
    description:
      "CMS portal desa untuk publikasi berita, layanan masyarakat, dan transparansi anggaran. Mudah dioperasikan perangkat desa.",
    price: 1650000,
    label: "CMS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: CMS_CATEGORY,
    tags: ["Pemerintahan", "Layanan", "Berita"],
    thumbnail: "",
    thumbnailUrl: img("desa-cms"),
  },
  {
    id: 201,
    name: "POS Kasir",
    short: "Aplikasi kasir untuk toko dan resto.",
    description:
      "Aplikasi Point of Sale untuk mencatat transaksi, mengelola stok, dan mencetak struk. Cocok untuk retail dan F&B.",
    price: 3500000,
    label: "POS",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: OTHERS_CATEGORY,
    tags: ["Kasir", "Stok", "Laporan"],
    thumbnail: "",
    thumbnailUrl: img("pos-kasir"),
  },
  {
    id: 202,
    name: "CRM Pelanggan",
    short: "Kelola relasi dan pipeline pelanggan.",
    description:
      "Customer Relationship Management untuk mencatat prospek, mengelola pipeline penjualan, dan menjaga hubungan pelanggan.",
    price: 4200000,
    label: "CRM",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: OTHERS_CATEGORY,
    tags: ["Sales", "Pipeline", "Kontak"],
    thumbnail: "",
    thumbnailUrl: img("crm"),
  },
  {
    id: 203,
    name: "Inventory Management",
    short: "Pantau stok gudang secara real-time.",
    description:
      "Sistem manajemen inventaris untuk memantau stok masuk-keluar, multi-gudang, dan peringatan stok menipis.",
    price: 3800000,
    label: "ERP",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: OTHERS_CATEGORY,
    tags: ["Gudang", "Stok", "Multi-lokasi"],
    thumbnail: "",
    thumbnailUrl: img("inventory"),
  },
  {
    id: 204,
    name: "Booking Online",
    short: "Sistem reservasi dan janji temu.",
    description:
      "Aplikasi booking untuk jasa, klinik, atau penyewaan. Dilengkapi kalender ketersediaan dan notifikasi otomatis.",
    price: 2900000,
    label: "App",
    status: "Tersedia",
    type: "app",
    availability: "ready",
    category: OTHERS_CATEGORY,
    tags: ["Reservasi", "Kalender", "Notifikasi"],
    thumbnail: "",
    thumbnailUrl: img("booking"),
  },
];

// Beri setiap produk dummy sebuah URL demo (live preview) untuk pratinjau tombol.
export const mockProducts: Product[] = rawMockProducts.map((product) => ({
  ...product,
  demoUrl: product.demoUrl ?? `https://demo.solusite.studio/${product.id}`,
}));

export const mockDiscounts: Discount[] = [
  {
    id: 1,
    productId: 101,
    name: "Promo Peluncuran",
    code: "LAUNCH20",
    type: "percentage",
    value: 20,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
    currentlyActive: true,
  },
  {
    id: 2,
    productId: 104,
    name: "Diskon Landing",
    code: "HEMAT200",
    type: "fixed",
    value: 200000,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
    currentlyActive: true,
  },
  {
    id: 3,
    productId: 102,
    name: "Promo Toko Online",
    code: "TOKO15",
    type: "percentage",
    value: 15,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
    currentlyActive: true,
  },
  {
    id: 4,
    productId: 105,
    name: "Promo Sekolah",
    code: "SEKOLAH25",
    type: "percentage",
    value: 25,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
    currentlyActive: true,
  },
  {
    id: 5,
    productId: 201,
    name: "Promo Kasir",
    code: "KASIR15",
    type: "percentage",
    value: 15,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
    currentlyActive: true,
  },
  {
    id: 6,
    productId: 202,
    name: "Promo CRM",
    code: "CRM20",
    type: "percentage",
    value: 20,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
    currentlyActive: true,
  },
];

export const mockCategories: Category[] = [
  {
    id: 1,
    slug: CMS_CATEGORY,
    name: "CMS",
    description: "Kelola isi website sendiri tanpa coding.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    slug: OTHERS_CATEGORY,
    name: "Lainnya",
    description: "Solusi bisnis lain seperti CRM, POS.",
    sortOrder: 2,
    isActive: true,
  },
];

export const mockSettings: Settings = {
  siteName: "Solusite Studio",
  tagline: "Website & aplikasi siap pakai untuk bisnis Anda.",
  logoUrl: null,
  whatsappNumber: "6281234567890",
  whatsappMessage: "Halo Solusite, saya tertarik dengan produk Anda.",
  email: "hello@solusite.studio",
  phone: "+62 812-3456-7890",
  address: "Jakarta, Indonesia",
  instagramUrl: "https://instagram.com/solusite.studio",
  facebookUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
};

export function findMockProduct(id: number) {
  return mockProducts.find((product) => product.id === id) ?? null;
}
