import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  LogOut,
  Trash2,
  Eye,
  Pencil,
} from "lucide-react";

const STORAGE_KEY = "viyazham_uploaded_books";

function Admin() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  // =====================================================
  // LOAD UPLOADED BOOKS
  // =====================================================

  const loadBooks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsedBooks = JSON.parse(stored);

        if (Array.isArray(parsedBooks)) {
          setBooks(parsedBooks);
        } else {
          setBooks([]);
        }
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Unable to load uploaded books:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // =====================================================
  // DELETE BOOK
  // =====================================================

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedBooks = books.filter(
        (book) => String(book.id) !== String(id)
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedBooks)
      );

      setBooks(updatedBooks);

      alert("Book deleted successfully.");
    } catch (error) {
      console.error("Unable to delete book:", error);

      alert("Unable to delete the book.");
    }
  };

  // =====================================================
  // EDIT BOOK
  // =====================================================

  const handleEdit = (book) => {
    /*
      We send the selected book to AddBook through
      React Router state.

      Your AddBook.jsx can then read this book and
      automatically fill the form.
    */

    navigate("/admin/books/add", {
      state: {
        editBook: book,
      },
    });
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    navigate("/admin-login");
  };

  // =====================================================
  // VIEW BOOK
  // =====================================================

  const handleViewBook = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 90px)",
        background: "#f7f3ed",
        padding: "50px 25px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                letterSpacing: "2px",
                color: "#777",
                marginBottom: "8px",
              }}
            >
              VIYAZHAM PUBLICATION
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                color: "#171717",
              }}
            >
              Admin Dashboard
            </h1>

            <p
              style={{
                color: "#777",
                marginTop: "8px",
              }}
            >
              Manage your published books.
            </p>
          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #ddd",
              background: "white",
              padding: "11px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {/* =================================================
            ACTION CARDS
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
            marginBottom: "45px",
          }}
        >

          {/* ADD BOOK CARD */}

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid #e5e1db",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "15px",
                background: "#171717",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Plus size={27} />
            </div>

            <h2
              style={{
                margin: "0 0 8px",
              }}
            >
              Add New Book
            </h2>

            <p
              style={{
                color: "#777",
                lineHeight: "1.6",
              }}
            >
              Upload a new book with its cover,
              details and PDF, DOC or DOCX file.
            </p>

            <button
              onClick={() =>
                navigate("/admin/books/add")
              }
              style={{
                width: "100%",
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "none",
                background: "#171717",
                color: "white",
                padding: "14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <Plus size={18} />
              Upload Book
            </button>
          </div>

          {/* VIEW BOOKS CARD */}

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid #e5e1db",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "15px",
                background: "#f0ebe4",
                color: "#171717",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <BookOpen size={27} />
            </div>

            <h2
              style={{
                margin: "0 0 8px",
              }}
            >
              Published Books
            </h2>

            <p
              style={{
                color: "#777",
                lineHeight: "1.6",
              }}
            >
              You currently have{" "}
              <strong>{books.length}</strong>{" "}
              uploaded book
              {books.length !== 1 ? "s" : ""}.
            </p>

            <button
              onClick={() =>
                navigate("/books")
              }
              style={{
                width: "100%",
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "1px solid #171717",
                background: "white",
                color: "#171717",
                padding: "14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <Eye size={18} />
              View Books
            </button>
          </div>
        </div>

        {/* =================================================
            MANAGE BOOKS
        ================================================= */}

        <section>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "25px",
                }}
              >
                Manage Books
              </h2>

              <p
                style={{
                  color: "#777",
                  marginTop: "5px",
                }}
              >
                Books uploaded through the admin panel.
              </p>
            </div>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {books.length === 0 ? (

            <div
              style={{
                background: "white",
                border: "1px solid #e5e1db",
                borderRadius: "18px",
                padding: "50px",
                textAlign: "center",
              }}
            >
              <BookOpen
                size={45}
                color="#aaa"
              />

              <h3>
                No uploaded books yet
              </h3>

              <p
                style={{
                  color: "#777",
                }}
              >
                Upload your first book to see
                it here.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/books/add")
                }
                style={{
                  marginTop: "10px",
                  border: "none",
                  background: "#171717",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "9px",
                  cursor: "pointer",
                }}
              >
                Upload First Book
              </button>
            </div>

          ) : (

            /* =================================================
               BOOK LIST
            ================================================= */

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >

              {books.map((book) => (

                <div
                  key={book.id}
                  style={{
                    background: "white",
                    borderRadius: "18px",
                    border:
                      "1px solid #e5e1db",
                    padding: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.03)",
                  }}
                >

                  {/* =========================================
                      DELETE BUTTON
                  ========================================= */}

                  <button
                    onClick={() =>
                      handleDelete(book.id)
                    }
                    title="Delete this book"
                    aria-label={`Delete ${book.title}`}
                    style={{
                      width: "48px",
                      height: "48px",
                      minWidth: "48px",
                      border:
                        "1px solid #e5b8b8",
                      background: "#fff5f5",
                      color: "#c62828",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={21} />
                  </button>

                  {/* =========================================
                      BOOK COVER

                      IMPORTANT:
                      AddBook.jsx uses coverImageUrl.
                      We also keep coverUrl as fallback.
                  ========================================= */}

                  {book.coverImageUrl || book.coverUrl ? (

                    <img
                      src={
                        book.coverImageUrl ||
                        book.coverUrl
                      }
                      alt={book.title}
                      style={{
                        width: "110px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        flexShrink: 0,
                        background: "#eee9e1",
                        boxShadow:
                          "0 5px 15px rgba(0,0,0,0.12)",
                      }}
                    />

                  ) : (

                    <div
                      style={{
                        width: "110px",
                        height: "150px",
                        borderRadius: "10px",
                        background: "#eee9e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <BookOpen
                        size={40}
                        color="#aaa"
                      />
                    </div>

                  )}

                  {/* =========================================
                      BOOK DETAILS
                  ========================================= */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >

                    {/* CATEGORY */}

                    <div
                      style={{
                        display: "inline-block",
                        background: "#f0ebe4",
                        color: "#555",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {book.category ||
                        "Uncategorized"}
                    </div>

                    {/* TITLE */}

                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "21px",
                        color: "#171717",
                      }}
                    >
                      {book.title}
                    </h3>

                    {/* AUTHOR */}

                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#555",
                      }}
                    >
                      By{" "}
                      {book.author?.name ||
                        book.author ||
                        "Unknown Author"}
                    </p>

                    {/* LANGUAGE + PAGES */}

                    {(book.language ||
                      book.pages) && (
                      <p
                        style={{
                          margin: "0 0 8px",
                          color: "#777",
                          fontSize: "13px",
                        }}
                      >
                        {book.language &&
                          `Language: ${book.language}`}

                        {book.language &&
                          book.pages &&
                          "  •  "}

                        {book.pages &&
                          `Pages: ${book.pages}`}
                      </p>
                    )}

                    {/* PRICE */}

                    {book.price !== null &&
                      book.price !== undefined && (
                        <p
                          style={{
                            margin: "0 0 8px",
                            color: "#171717",
                            fontWeight: "700",
                          }}
                        >
                          ₹ {Number(book.price).toFixed(2)}
                        </p>
                      )}

                    {/* FILE */}

                    <p
                      style={{
                        margin: 0,
                        color: "#888",
                        fontSize: "13px",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {book.fileName ||
                        "Book file uploaded"}
                    </p>

                    {/* STATUS */}

                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#4a7c59",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#4a7c59",
                        }}
                      />

                      Published
                    </div>

                  </div>

                  {/* =========================================
                      ACTION BUTTONS
                  ========================================= */}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      flexShrink: 0,
                    }}
                  >

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        handleEdit(book)
                      }
                      title="Edit this book"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        border:
                          "1px solid #d8c8ae",
                        background: "#faf6ef",
                        padding:
                          "10px 14px",
                        borderRadius: "9px",
                        cursor: "pointer",
                        color: "#6b563b",
                        fontWeight: "600",
                      }}
                    >
                      <Pencil size={17} />
                      Edit
                    </button>

                    {/* VIEW */}

                    <button
                      onClick={() =>
                        handleViewBook(
                          book.id
                        )
                      }
                      title="View this book"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        border:
                          "1px solid #ddd",
                        background: "white",
                        padding:
                          "10px 14px",
                        borderRadius: "9px",
                        cursor: "pointer",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      <Eye size={17} />
                      View
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* =================================================
            BACK TO WEBSITE
        ================================================= */}

        <button
          onClick={() =>
            navigate("/")
          }
          style={{
            marginTop: "35px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#555",
          }}
        >
          <ArrowLeft size={17} />
          Back to Website
        </button>

      </div>
    </main>
  );
}

export default Admin;