// This file simulates what will eventually come from a real database.
// Every book object follows the exact shape the future backend API will return,
// so when we swap this for real fetch() calls later, nothing else has to change.

export const books = [
  {
    id: "orrumai-001",
    slug: "orrumai",
    title: "ஒற்றுமை",
    author: {
      id: "author-001",
      name: "கவிவேந்தர் செந்தமிழ்ச் சித்தன்",
    },
    description:
      "A meaningful literary work presented by Viyazham Publication. Discover the ideas, stories and emotions within its pages.",
    category: "Short Stories",
    coverImageUrl: "/covers/orrumai.jpg",
    pdfUrl: "/pdfs/orrumai.pdf",
    status: "published",
    featured: true,
    allowDownload: false,
    publishedAt: "2026-01-15T00:00:00Z",
    pageCount: 128,
    language: "Tamil",
  },
  {
    id: "kavithai-thuli-002",
    slug: "kavithai-thuli",
    title: "கவிதைத் துளி",
    author: {
      id: "author-002",
      name: "மலர் அரசி",
    },
    description:
      "A collection of short verses exploring everyday life, nature, and quiet reflection.",
    category: "Poetry",
    coverImageUrl: "/covers/kavithai-thuli.jpg",
    pdfUrl: "/pdfs/kavithai-thuli.pdf",
    status: "published",
    featured: true,
    allowDownload: true,
    publishedAt: "2026-02-02T00:00:00Z",
    pageCount: 64,
    language: "Tamil",
  },
  {
    id: "nadanda-paathai-003",
    slug: "nadanda-paathai",
    title: "நடந்த பாதை",
    author: {
      id: "author-003",
      name: "செல்வன் இராஜா",
    },
    description:
      "A novel following one family across three generations, tracing the paths they walked and the choices that shaped them.",
    category: "Novel",
    coverImageUrl: "/covers/nadanda-paathai.jpg",
    pdfUrl: "/pdfs/nadanda-paathai.pdf",
    status: "published",
    featured: false,
    allowDownload: false,
    publishedAt: "2025-11-20T00:00:00Z",
    pageCount: 312,
    language: "Tamil",
  },
  {
    id: "sindhanai-thunthu-004",
    slug: "sindhanai-thunthu",
    title: "சிந்தனைத் துண்டு",
    author: {
      id: "author-002",
      name: "மலர் அரசி",
    },
    description:
      "A set of short essays on thought, memory, and the small moments that quietly shape a life.",
    category: "Essays",
    coverImageUrl: "/covers/sindhanai-thunthu.jpg",
    pdfUrl: "/pdfs/sindhanai-thunthu.pdf",
    status: "published",
    featured: false,
    allowDownload: true,
    publishedAt: "2026-03-10T00:00:00Z",
    pageCount: 96,
    language: "Tamil",
  },
  {
    id: "marainthavargal-005",
    slug: "marainthavargal",
    title: "மறைந்தவர்கள்",
    author: {
      id: "author-004",
      name: "விஜயா கண்ணன்",
    },
    description:
      "A short story collection about people who leave, the spaces they leave behind, and what remains.",
    category: "Short Stories",
    coverImageUrl: "/covers/marainthavargal.jpg",
    pdfUrl: "/pdfs/marainthavargal.pdf",
    status: "draft",
    featured: false,
    allowDownload: false,
    publishedAt: null,
    pageCount: 84,
    language: "Tamil",
  },
];

// A flat, de-duplicated list of categories, derived from the data itself
// rather than hardcoded — so a new category in a future book "just works"
// in the filter UI without a code change.
export function getAllCategories() {
  const unique = new Set(books.map((book) => book.category));
  return Array.from(unique);
}
