import { supabase } from "./supabaseClient";

const TABLE = "books";
const BUCKET = "vizhayam-publication";


// =====================================================
// ROW <-> BOOK OBJECT MAPPING
// (Supabase columns are snake_case, the app uses camelCase)
// =====================================================

function toRow(book) {
  return {
    id: book.id,
    title: book.title,
    slug: book.slug,
    author_name:
      book.author?.name || book.author || "",
    category: book.category,
    language: book.language,
    pages: book.pages,
    price: book.price,
    description: book.description,
    cover_image_url: book.coverImageUrl,
    file_url: book.fileUrl,
    file_name: book.fileName,
    file_type: book.fileType,
    file_extension: book.fileExtension,
    file_size: book.fileSize,
    pdf_url: book.pdfUrl,
    status: book.status,
    featured: book.featured,
    created_at: book.createdAt,
    updated_at: book.updatedAt,
  };
}

function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    author: { name: row.author_name },
    category: row.category,
    language: row.language,
    pages: row.pages,
    price: row.price,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    coverUrl: row.cover_image_url,
    fileUrl: row.file_url,
    fileName: row.file_name,
    fileType: row.file_type,
    fileExtension: row.file_extension,
    fileSize: row.file_size,
    pdfUrl: row.pdf_url,
    status: row.status,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


// =====================================================
// UPLOAD A FRESH FILE TO STORAGE
// (skips re-uploading if it's already a hosted URL)
// =====================================================

async function uploadIfDataUrl(dataUrl, folder) {
  if (!dataUrl || !dataUrl.startsWith("data:")) {
    return dataUrl || "";
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const extension =
    blob.type.split("/")[1]?.split("+")[0] || "bin";

  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}


// =====================================================
// GET UPLOADED BOOKS (admin list, all statuses)
// =====================================================

export async function getUploadedBooks() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to read uploaded books:", error);
    return [];
  }

  return (data || []).map(fromRow);
}


// =====================================================
// SAVE BOOKS
// Kept for compatibility with any other pages calling it.
// Prefer addBook / updateBook / deleteBook for new code.
// =====================================================

export async function saveUploadedBooks(books) {
  const rows = books.map(toRow);

  const { error } = await supabase
    .from(TABLE)
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Unable to save books:", error);
    throw error;
  }
}


// =====================================================
// GET ALL BOOKS
// =====================================================

export async function getAllBooks() {
  return getUploadedBooks();
}


// =====================================================
// ADD BOOK
// =====================================================

export async function addBook(book) {
  const coverImageUrl = await uploadIfDataUrl(
    book.coverImageUrl,
    "covers"
  );

  const fileUrl = await uploadIfDataUrl(
    book.fileUrl,
    "files"
  );

  const finalBook = {
    ...book,
    coverImageUrl,
    fileUrl,
    pdfUrl:
      book.fileExtension === "pdf"
        ? fileUrl
        : book.pdfUrl || "",
  };

  const { error } = await supabase
    .from(TABLE)
    .insert(toRow(finalBook));

  if (error) {
    throw error;
  }

  return finalBook;
}


// =====================================================
// UPDATE BOOK
// =====================================================

export async function updateBook(updatedBook) {
  const coverImageUrl = await uploadIfDataUrl(
    updatedBook.coverImageUrl,
    "covers"
  );

  const fileUrl = await uploadIfDataUrl(
    updatedBook.fileUrl,
    "files"
  );

  const finalBook = {
    ...updatedBook,
    coverImageUrl,
    fileUrl,
    pdfUrl:
      updatedBook.fileExtension === "pdf"
        ? fileUrl
        : updatedBook.pdfUrl || "",
  };

  const { error } = await supabase
    .from(TABLE)
    .update(toRow(finalBook))
    .eq("id", updatedBook.id);

  if (error) {
    throw error;
  }

  return finalBook;
}


// =====================================================
// DELETE BOOK
// =====================================================

export async function deleteBook(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return getUploadedBooks();
}


// =====================================================
// PUBLISHED BOOKS
// =====================================================

export async function getPublishedBooks() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(fromRow);
}


// =====================================================
// FEATURED BOOKS
// =====================================================

export async function getFeaturedBooks() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(fromRow);
}


// =====================================================
// SINGLE BOOK
// =====================================================

export async function getBookById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data ? fromRow(data) : null;
}


// =====================================================
// CATEGORIES
// =====================================================

export async function getCategories() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("category")
    .eq("status", "published");

  if (error) {
    console.error(error);
    return [];
  }

  const uniqueCategories = new Set(
    (data || [])
      .map((row) => row.category)
      .filter(Boolean)
  );

  return Array.from(uniqueCategories);
}


// =====================================================
// SEARCH BOOKS
// =====================================================

export async function searchBooks({
  query = "",
  category = "all",
} = {}) {
  let request = supabase
    .from(TABLE)
    .select("*")
    .eq("status", "published");

  if (category !== "all") {
    request = request.eq("category", category);
  }

  const { data, error } = await request;

  if (error) {
    console.error(error);
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  return (data || [])
    .map(fromRow)
    .filter((book) => {
      if (normalizedQuery === "") {
        return true;
      }

      const title = book.title?.toLowerCase() || "";
      const author =
        book.author?.name?.toLowerCase() || "";

      return (
        title.includes(normalizedQuery) ||
        author.includes(normalizedQuery)
      );
    });
}


// =====================================================
// CLEAR ALL UPLOADED BOOKS
// =====================================================

export async function clearUploadedBooks() {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .neq("id", "");

  if (error) {
    throw error;
  }
}