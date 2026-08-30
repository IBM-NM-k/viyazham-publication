const STORAGE_KEY = "viyazham_uploaded_books";

const FAKE_DELAY_MS = 200;


// =====================================================
// DELAY
// =====================================================

function delay(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}


// =====================================================
// GET UPLOADED BOOKS
// =====================================================

export function getUploadedBooks() {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const books = JSON.parse(stored);

    return Array.isArray(books)
      ? books
      : [];

  } catch (error) {

    console.error(
      "Unable to read uploaded books:",
      error
    );

    return [];
  }
}


// =====================================================
// SAVE BOOKS
// =====================================================

export function saveUploadedBooks(books) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(books)
  );
}


// =====================================================
// GET ALL BOOKS
// ONLY ADMIN UPLOADED BOOKS
// =====================================================

export function getAllBooks() {
  return getUploadedBooks();
}


// =====================================================
// ADD BOOK
// =====================================================

export function addBook(book) {

  const uploadedBooks =
    getUploadedBooks();

  uploadedBooks.push(book);

  saveUploadedBooks(uploadedBooks);

  return book;
}


// =====================================================
// UPDATE BOOK
// THIS IS IMPORTANT FOR EDIT
// =====================================================

export function updateBook(updatedBook) {

  const uploadedBooks =
    getUploadedBooks();

  const updatedBooks =
    uploadedBooks.map((book) =>
      String(book.id) ===
      String(updatedBook.id)
        ? updatedBook
        : book
    );

  saveUploadedBooks(updatedBooks);

  return updatedBook;
}


// =====================================================
// DELETE BOOK
// =====================================================

export function deleteBook(id) {

  const uploadedBooks =
    getUploadedBooks();

  const updatedBooks =
    uploadedBooks.filter(
      (book) =>
        String(book.id) !== String(id)
    );

  saveUploadedBooks(updatedBooks);

  return updatedBooks;
}


// =====================================================
// PUBLISHED BOOKS
// =====================================================

export async function getPublishedBooks() {

  await delay(FAKE_DELAY_MS);

  return getAllBooks().filter(
    (book) =>
      book.status === "published"
  );
}


// =====================================================
// FEATURED BOOKS
// =====================================================

export async function getFeaturedBooks() {

  await delay(FAKE_DELAY_MS);

  return getAllBooks().filter(
    (book) =>
      book.status === "published" &&
      book.featured === true
  );
}


// =====================================================
// SINGLE BOOK
// =====================================================

export async function getBookById(id) {

  await delay(FAKE_DELAY_MS);

  return getAllBooks().find(
    (book) =>
      String(book.id) === String(id) &&
      book.status === "published"
  );
}


// =====================================================
// CATEGORIES
// =====================================================

export async function getCategories() {

  await delay(FAKE_DELAY_MS);

  const published =
    getAllBooks().filter(
      (book) =>
        book.status === "published"
    );

  const uniqueCategories =
    new Set(
      published
        .map((book) => book.category)
        .filter(Boolean)
    );

  return Array.from(
    uniqueCategories
  );
}


// =====================================================
// SEARCH BOOKS
// =====================================================

export async function searchBooks({
  query = "",
  category = "all",
} = {}) {

  await delay(FAKE_DELAY_MS);

  const normalizedQuery =
    query.trim().toLowerCase();

  return getAllBooks().filter(
    (book) => {

      // Only published books

      if (
        book.status !== "published"
      ) {
        return false;
      }


      // Category

      const matchesCategory =
        category === "all" ||
        book.category === category;


      // Search

      const title =
        book.title
          ?.toLowerCase() || "";

      const author =
        book.author?.name
          ?.toLowerCase() || "";

      const matchesQuery =
        normalizedQuery === "" ||
        title.includes(
          normalizedQuery
        ) ||
        author.includes(
          normalizedQuery
        );


      return (
        matchesCategory &&
        matchesQuery
      );
    }
  );
}


// =====================================================
// CLEAR ALL UPLOADED BOOKS
// =====================================================

export function clearUploadedBooks() {

  localStorage.removeItem(
    STORAGE_KEY
  );
}


// =====================================================
// STORAGE KEY
// =====================================================

export { STORAGE_KEY };