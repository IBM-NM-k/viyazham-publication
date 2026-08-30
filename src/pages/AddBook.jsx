import { useState, useEffect, useRef } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  BookOpen,
  FileText,
  Image,
  X,
  Keyboard,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  addBook,
  getUploadedBooks,
  saveUploadedBooks,
} from "../services/booksService";

// =====================================================
// FILE → DATA URL
// =====================================================

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read file"));
    };

    reader.readAsDataURL(file);
  });
}

// =====================================================
// TAMIL KEYBOARD
// =====================================================

const TAMIL_VOWELS = [
  "அ",
  "ஆ",
  "இ",
  "ஈ",
  "உ",
  "ஊ",
  "எ",
  "ஏ",
  "ஐ",
  "ஒ",
  "ஓ",
  "ஔ",
  "ஃ",
];

const TAMIL_CONSONANTS = [
  "க",
  "ங",
  "ச",
  "ஞ",
  "ட",
  "ண",
  "த",
  "ந",
  "ப",
  "ம",
  "ய",
  "ர",
  "ல",
  "வ",
  "ழ",
  "ள",
  "ற",
  "ன",
  "ஜ",
  "ஷ",
  "ஸ",
  "ஹ",
];

const TAMIL_VOWEL_SIGNS = [
  "ா",
  "ி",
  "ீ",
  "ு",
  "ூ",
  "ெ",
  "ே",
  "ை",
  "ொ",
  "ோ",
  "ௌ",
  "்",
];

// =====================================================
// KEYBOARD STYLES
// =====================================================

const keyboardKeyStyle = {
  minWidth: "38px",
  height: "38px",
  border: "1px solid #ddd",
  background: "#ffffff",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  color: "#222",
};

const keyboardControlStyle = {
  height: "38px",
  padding: "0 16px",
  border: "1px solid #ddd",
  background: "#ffffff",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
  color: "#555",
};

// =====================================================
// TAMIL KEYBOARD COMPONENT
// =====================================================

function TamilKeyboard({
  activeField,
  insertTamilChar,
  handleTamilBackspace,
}) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "16px",
        background: "#faf7f2",
        border: "1px solid #e5e1db",
        borderRadius: "14px",
        boxShadow:
          "0 8px 25px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#777",
          }}
        >
          Tamil keyboard — typing in{" "}
          <strong style={{ color: "#8b1e3f" }}>
            {activeField}
          </strong>
        </span>
      </div>

      {/* VOWELS */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "8px",
        }}
      >
        {TAMIL_VOWELS.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => insertTamilChar(char)}
            style={keyboardKeyStyle}
          >
            {char}
          </button>
        ))}
      </div>

      {/* CONSONANTS */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "8px",
        }}
      >
        {TAMIL_CONSONANTS.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => insertTamilChar(char)}
            style={keyboardKeyStyle}
          >
            {char}
          </button>
        ))}
      </div>

      {/* VOWEL SIGNS */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {TAMIL_VOWEL_SIGNS.map(
          (char, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                insertTamilChar(char)
              }
              style={{
                ...keyboardKeyStyle,
                background: "#f0ece3",
              }}
            >
              {char}
            </button>
          )
        )}
      </div>

      {/* CONTROLS */}

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={() =>
            insertTamilChar(" ")
          }
          style={{
            ...keyboardControlStyle,
            flex: 1,
          }}
        >
          Space
        </button>

        <button
          type="button"
          onClick={handleTamilBackspace}
          style={{
            ...keyboardControlStyle,
            color: "#c62828",
          }}
        >
          ⌫ Back
        </button>
      </div>
    </div>
  );
}

// =====================================================
// ADD BOOK
// =====================================================

function AddBook() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // EDIT MODE
  // =====================================================

  const editBook =
    location.state?.editBook || null;

  const isEditMode = Boolean(editBook);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] =
    useState("");

  // =====================================================
  // FILES
  // =====================================================

  const [cover, setCover] = useState(null);
  const [bookFile, setBookFile] =
    useState(null);

  // Existing files while editing
  const [existingBookFile, setExistingBookFile] =
    useState(null);

  // =====================================================
  // PREVIEW
  // =====================================================

  const [coverPreview, setCoverPreview] =
    useState("");

  // =====================================================
  // STATUS
  // =====================================================

  const [message, setMessage] =
    useState("");

  const [isPublishing, setIsPublishing] =
    useState(false);

  // =====================================================
  // MANAGE BOOKS
  // =====================================================

  const [books, setBooks] = useState([]);

  // =====================================================
  // TAMIL KEYBOARD
  // =====================================================

  const [showTamilKeyboard, setShowTamilKeyboard] =
    useState(false);

  const [activeField, setActiveField] =
    useState("title");

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const categoryRef = useRef(null);
  const descriptionRef = useRef(null);

  const fieldRefs = {
    title: titleRef,
    author: authorRef,
    category: categoryRef,
    description: descriptionRef,
  };

  const fieldSetters = {
    title: setTitle,
    author: setAuthor,
    category: setCategory,
    description: setDescription,
  };

  // =====================================================
  // LOAD BOOKS
  // =====================================================

  const loadBooks = () => {
    try {
      const storedBooks =
        getUploadedBooks();

      setBooks(
        Array.isArray(storedBooks)
          ? storedBooks
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load books:",
        error
      );

      setBooks([]);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // =====================================================
  // LOAD EDIT BOOK
  // =====================================================

  useEffect(() => {
    if (!editBook) {
      return;
    }

    setTitle(editBook.title || "");

    setAuthor(
      editBook.author?.name ||
        editBook.author ||
        ""
    );

    setCategory(
      editBook.category || ""
    );

    setLanguage(
      editBook.language || ""
    );

    setPages(
      editBook.pages ?? ""
    );

    setPrice(
      editBook.price ?? ""
    );

    setDescription(
      editBook.description || ""
    );

    setCover(null);

    setCoverPreview(
      editBook.coverImageUrl ||
        editBook.coverUrl ||
        ""
    );

    setBookFile(null);

    setExistingBookFile({
      fileUrl:
        editBook.fileUrl ||
        editBook.pdfUrl ||
        "",

      fileName:
        editBook.fileName ||
        "",

      fileType:
        editBook.fileType ||
        "",

      fileExtension:
        editBook.fileExtension ||
        "",
      
      fileSize:
        editBook.fileSize ||
        0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [editBook]);

  // =====================================================
  // INSERT TAMIL CHARACTER
  // =====================================================

  const insertTamilChar = (char) => {
    const ref =
      fieldRefs[activeField];

    const setValue =
      fieldSetters[activeField];

    const input = ref?.current;

    if (!input) {
      return;
    }

    const start =
      input.selectionStart ??
      input.value.length;

    const end =
      input.selectionEnd ??
      input.value.length;

    const current = input.value;

    const nextValue =
      current.slice(0, start) +
      char +
      current.slice(end);

    setValue(nextValue);

    requestAnimationFrame(() => {
      input.focus();

      const cursor =
        start + char.length;

      input.setSelectionRange(
        cursor,
        cursor
      );
    });
  };

  // =====================================================
  // TAMIL BACKSPACE
  // =====================================================

  const handleTamilBackspace = () => {
    const ref =
      fieldRefs[activeField];

    const setValue =
      fieldSetters[activeField];

    const input = ref?.current;

    if (!input) {
      return;
    }

    const start =
      input.selectionStart ??
      input.value.length;

    const end =
      input.selectionEnd ??
      input.value.length;

    const current = input.value;

    let nextValue;
    let cursor;

    if (start !== end) {
      nextValue =
        current.slice(0, start) +
        current.slice(end);

      cursor = start;
    } else if (start > 0) {
      nextValue =
        current.slice(0, start - 1) +
        current.slice(start);

      cursor = start - 1;
    } else {
      return;
    }

    setValue(nextValue);

    requestAnimationFrame(() => {
      input.focus();

      input.setSelectionRange(
        cursor,
        cursor
      );
    });
  };

  // =====================================================
  // TOGGLE TAMIL KEYBOARD
  // =====================================================

  const toggleTamilKeyboard = (field) => {
    setActiveField(field);

    if (
      showTamilKeyboard &&
      activeField === field
    ) {
      setShowTamilKeyboard(false);
    } else {
      setShowTamilKeyboard(true);
    }

    requestAnimationFrame(() => {
      fieldRefs[field]?.current?.focus();
    });
  };

  // =====================================================
  // CLEAN COVER PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (
        coverPreview &&
        coverPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          coverPreview
        );
      }
    };
  }, [coverPreview]);

  // =====================================================
  // COVER UPLOAD
  // =====================================================

  const handleCoverChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setMessage(
        "Please upload a JPG, PNG or WEBP cover image."
      );

      event.target.value = "";

      return;
    }

    if (
      coverPreview &&
      coverPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        coverPreview
      );
    }

    setCover(file);

    const preview =
      URL.createObjectURL(file);

    setCoverPreview(preview);

    setMessage("");
  };

  // =====================================================
  // REMOVE COVER
  // =====================================================

  const removeCover = () => {
    if (
      coverPreview &&
      coverPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        coverPreview
      );
    }

    setCover(null);
    setCoverPreview("");
    setMessage("");
  };

  // =====================================================
  // BOOK FILE UPLOAD / REPLACE
  // =====================================================

  const handleBookFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
    ];

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      setMessage(
        "Please upload a PDF, DOC or DOCX file."
      );

      event.target.value = "";

      return;
    }

    setBookFile(file);

    // New file replaces old file
    setExistingBookFile(null);

    setMessage("");

    event.target.value = "";
  };

  // =====================================================
  // REMOVE BOOK FILE
  // =====================================================

  const removeBookFile = () => {
    setBookFile(null);
    setExistingBookFile(null);
    setMessage("");
  };

  // =====================================================
  // PUBLISH / UPDATE BOOK
  // =====================================================

  const handlePublish = async () => {
    setMessage("");

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!title.trim()) {
      setMessage(
        "Please enter the book title."
      );
      return;
    }

    if (!author.trim()) {
      setMessage(
        "Please enter the author name."
      );
      return;
    }

    if (!category.trim()) {
      setMessage(
        "Please enter a category."
      );
      return;
    }

    if (!bookFile && !existingBookFile) {
      setMessage(
        "Please upload the book file."
      );
      return;
    }

    if (!coverPreview && !cover) {
      setMessage(
        "Please upload a book cover."
      );
      return;
    }

    try {
      setIsPublishing(true);

      // =================================================
      // BOOK FILE
      // =================================================

      let bookDataUrl =
        existingBookFile?.fileUrl ||
        "";

      let fileName =
        existingBookFile?.fileName ||
        "";

      let fileType =
        existingBookFile?.fileType ||
        "";

      let fileExtension =
        existingBookFile?.fileExtension ||
        "";

      let fileSize =
        existingBookFile?.fileSize ||
        0;

      if (bookFile) {
        bookDataUrl =
          await fileToDataURL(
            bookFile
          );

        fileName =
          bookFile.name;

        fileType =
          bookFile.type;

        fileExtension =
          bookFile.name
            .split(".")
            .pop()
            .toLowerCase();

        fileSize =
          bookFile.size;
      }

      // =================================================
      // COVER
      // =================================================

      let coverDataUrl =
        editBook?.coverImageUrl ||
        editBook?.coverUrl ||
        "";

      if (cover) {
        coverDataUrl =
          await fileToDataURL(
            cover
          );
      }

      // =================================================
      // ID
      // =================================================

      const bookId =
        editBook?.id ||
        `uploaded-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`;

      // =================================================
      // SLUG
      // =================================================

      const slug = title
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /(^-|-$)/g,
          ""
        );

      // =================================================
      // BOOK OBJECT
      // =================================================

      const updatedBook = {
        id: bookId,

        title: title.trim(),

        slug,

        author: {
          name: author.trim(),
        },

        category:
          category.trim(),

        language:
          language.trim(),

        pages: pages
          ? Number(pages)
          : null,

        price: price
          ? Number(price)
          : null,

        description:
          description.trim(),

        // COVER
        coverImageUrl:
          coverDataUrl,

        // BOOK FILE
        fileUrl:
          bookDataUrl,

        fileName,

        fileType,

        fileExtension,

        fileSize,

        // PDF
        pdfUrl:
          fileExtension === "pdf"
            ? bookDataUrl
            : editBook?.pdfUrl || "",

        status:
          editBook?.status ||
          "published",

        featured:
          editBook?.featured ||
          false,

        createdAt:
          editBook?.createdAt ||
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

      // =================================================
      // SAVE
      // =================================================

      if (isEditMode) {
        const allBooks =
          getUploadedBooks();

        const updatedBooks =
          allBooks.map((book) =>
            String(book.id) ===
            String(editBook.id)
              ? updatedBook
              : book
          );

        saveUploadedBooks(
          updatedBooks
        );

        setMessage(
          "Book updated successfully!"
        );
      } else {
        addBook(updatedBook);

        setMessage(
          "Book published successfully!"
        );
      }

      // =================================================
      // REFRESH MANAGE LIST
      // =================================================

      loadBooks();

      // =================================================
      // CLEAR EDIT STATE
      // =================================================

      if (isEditMode) {
        window.history.replaceState(
          {},
          document.title
        );
      }

      // =================================================
      // SCROLL TO MANAGE BOOKS
      // =================================================

      setTimeout(() => {
        const manageSection =
          document.getElementById(
            "manage-books"
          );

        if (manageSection) {
          manageSection.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 500);

    } catch (error) {
      console.error(
        "Book publishing error:",
        error
      );

      setMessage(
        "Unable to save the book. Your browser may not have enough storage for this file."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  // =====================================================
  // EDIT BOOK
  // =====================================================

  const handleEdit = (book) => {
    navigate(
      "/admin/books/add",
      {
        state: {
          editBook: book,
        },
      }
    );
  };

  // =====================================================
  // DELETE BOOK
  // =====================================================

  const handleDelete = (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this book?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const currentBooks =
        getUploadedBooks();

      const updatedBooks =
        currentBooks.filter(
          (book) =>
            String(book.id) !==
            String(id)
        );

      saveUploadedBooks(
        updatedBooks
      );

      setBooks(updatedBooks);

      setMessage(
        "Book deleted successfully."
      );
    } catch (error) {
      console.error(
        "Unable to delete book:",
        error
      );

      setMessage(
        "Unable to delete the book."
      );
    }
  };

  // =====================================================
  // VIEW BOOK
  // =====================================================

  const handleViewBook = (id) => {
    navigate(
      `/books/${id}`
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main
      style={{
        minHeight:
          "calc(100vh - 90px)",
        background: "#f7f3ed",
        padding:
          "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            BACK
        ================================================= */}

        <button
          onClick={() =>
            navigate("/admin")
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            background:
              "transparent",
            cursor: "pointer",
            marginBottom: "25px",
            color: "#555",
            fontSize: "15px",
          }}
        >
          <ArrowLeft size={18} />
          Back to Admin
        </button>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "40px",
            border:
              "1px solid #e5e1db",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >

          {/* HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing:
                    "2px",
                  color: "#9a8064",
                  marginBottom:
                    "8px",
                }}
              >
                VIYAZHAM PUBLICATION
              </div>

              <h1
                style={{
                  margin: 0,
                  color: "#171717",
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                  fontWeight: 500,
                  fontSize: "34px",
                }}
              >
                {isEditMode
                  ? "Edit Book"
                  : "Add New Book"}
              </h1>

              <p
                style={{
                  color: "#777",
                  lineHeight: "1.6",
                  marginBottom: 0,
                }}
              >
                {isEditMode
                  ? "Update the book information and files."
                  : "Upload your book to Viyazham Publication."}
              </p>
            </div>

            {isEditMode && (
              <div
                style={{
                  padding:
                    "8px 13px",
                  borderRadius:
                    "20px",
                  background:
                    "#f0ebe4",
                  color: "#6b563b",
                  fontSize:
                    "12px",
                  fontWeight:
                    "600",
                }}
              >
                EDITING BOOK
              </div>
            )}
          </div>

          {/* =================================================
              COVER
          ================================================= */}

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <label>
              <strong>
                Book Cover
              </strong>
            </label>

            <div
              style={{
                border:
                  "2px dashed #d8d0c5",
                borderRadius: "15px",
                padding: "25px",
                textAlign: "center",
                marginTop: "10px",
                background:
                  "#fdfbf8",
              }}
            >

              {coverPreview ? (
                <div>

                  <div
                    style={{
                      width: "150px",
                      aspectRatio:
                        "3 / 4",
                      margin:
                        "0 auto",
                      borderRadius:
                        "4px 10px 10px 4px",
                      overflow:
                        "hidden",
                      background:
                        "#171717",
                      border:
                        "1px solid #e5e1db",
                      boxShadow:
                        "0 8px 20px rgba(0,0,0,0.12)",
                    }}
                  >
                    <img
                      src={
                        coverPreview
                      }
                      alt="Book cover preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit:
                          "contain",
                        display:
                          "block",
                      }}
                    />
                  </div>

                  <br />

                  <label
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      background:
                        "#171717",
                      color:
                        "white",
                      padding:
                        "9px 15px",
                      borderRadius:
                        "9px",
                      cursor:
                        "pointer",
                      marginRight:
                        "10px",
                    }}
                  >
                    <Upload
                      size={15}
                    />

                    Replace Cover

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={
                        handleCoverChange
                      }
                      style={{
                        display:
                          "none",
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={
                      removeCover
                    }
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: "6px",
                      border:
                        "1px solid #ead1d1",
                      background:
                        "#fff7f7",
                      padding:
                        "8px 12px",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer",
                      color:
                        "#c62828",
                    }}
                  >
                    <X size={15} />
                    Remove Cover
                  </button>

                  {cover && (
                    <p
                      style={{
                        color:
                          "#777",
                        fontSize:
                          "13px",
                        marginTop:
                          "10px",
                      }}
                    >
                      {cover.name}
                    </p>
                  )}

                </div>
              ) : (
                <>
                  <Image
                    size={45}
                    color="#777"
                  />

                  <br />

                  <label
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      background:
                        "#171717",
                      color:
                        "white",
                      padding:
                        "11px 18px",
                      borderRadius:
                        "9px",
                      cursor:
                        "pointer",
                      marginTop:
                        "15px",
                    }}
                  >
                    <Upload
                      size={17}
                    />

                    Upload Cover

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={
                        handleCoverChange
                      }
                      style={{
                        display:
                          "none",
                      }}
                    />
                  </label>
                </>
              )}

            </div>
          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div
            style={{
              marginTop: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                marginBottom:
                  "8px",
              }}
            >
              <label>
                <strong>
                  Book Title
                </strong>
              </label>

              <button
                type="button"
                onClick={() =>
                  toggleTamilKeyboard(
                    "title"
                  )
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "6px",
                  border:
                    "1px solid #ddd",
                  background:
                    showTamilKeyboard &&
                    activeField ===
                      "title"
                      ? "#171717"
                      : "white",
                  color:
                    showTamilKeyboard &&
                    activeField ===
                      "title"
                      ? "white"
                      : "#555",
                  padding:
                    "6px 10px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                }}
              >
                <Keyboard
                  size={14}
                />
                தமிழ்
              </button>
            </div>

            <input
              ref={titleRef}
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              onFocus={() =>
                setActiveField(
                  "title"
                )
              }
              placeholder="Enter book title"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "14px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                outline: "none",
                fontSize: "15px",
              }}
            />

            {showTamilKeyboard &&
              activeField ===
                "title" && (
                <TamilKeyboard
                  activeField="Book Title"
                  insertTamilChar={
                    insertTamilChar
                  }
                  handleTamilBackspace={
                    handleTamilBackspace
                  }
                />
              )}
          </div>

          {/* =================================================
              AUTHOR
          ================================================= */}

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                marginBottom:
                  "8px",
              }}
            >
              <label>
                <strong>
                  Author
                </strong>
              </label>

              <button
                type="button"
                onClick={() =>
                  toggleTamilKeyboard(
                    "author"
                  )
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "6px",
                  border:
                    "1px solid #ddd",
                  background:
                    showTamilKeyboard &&
                    activeField ===
                      "author"
                      ? "#171717"
                      : "white",
                  color:
                    showTamilKeyboard &&
                    activeField ===
                      "author"
                      ? "white"
                      : "#555",
                  padding:
                    "6px 10px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                }}
              >
                <Keyboard
                  size={14}
                />
                தமிழ்
              </button>
            </div>

            <input
              ref={authorRef}
              value={author}
              onChange={(e) =>
                setAuthor(
                  e.target.value
                )
              }
              onFocus={() =>
                setActiveField(
                  "author"
                )
              }
              placeholder="Enter author name"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "14px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                outline: "none",
                fontSize: "15px",
              }}
            />

            {showTamilKeyboard &&
              activeField ===
                "author" && (
                <TamilKeyboard
                  activeField="Author"
                  insertTamilChar={
                    insertTamilChar
                  }
                  handleTamilBackspace={
                    handleTamilBackspace
                  }
                />
              )}
          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                marginBottom:
                  "8px",
              }}
            >
              <label>
                <strong>
                  Category
                </strong>
              </label>

              <button
                type="button"
                onClick={() =>
                  toggleTamilKeyboard(
                    "category"
                  )
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "6px",
                  border:
                    "1px solid #ddd",
                  background:
                    showTamilKeyboard &&
                    activeField ===
                      "category"
                      ? "#171717"
                      : "white",
                  color:
                    showTamilKeyboard &&
                    activeField ===
                      "category"
                      ? "white"
                      : "#555",
                  padding:
                    "6px 10px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                }}
              >
                <Keyboard
                  size={14}
                />
                தமிழ்
              </button>
            </div>

            <input
              ref={categoryRef}
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              onFocus={() =>
                setActiveField(
                  "category"
                )
              }
              placeholder="Novel, Poetry, Fiction..."
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "14px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                outline: "none",
                fontSize: "15px",
              }}
            />

            {showTamilKeyboard &&
              activeField ===
                "category" && (
                <TamilKeyboard
                  activeField="Category"
                  insertTamilChar={
                    insertTamilChar
                  }
                  handleTamilBackspace={
                    handleTamilBackspace
                  }
                />
              )}
          </div>

          {/* =================================================
              LANGUAGE + PAGES
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "20px",
              marginTop:
                "22px",
            }}
          >
            <div>
              <label>
                <strong>
                  Language
                </strong>
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding: "14px",
                  marginTop:
                    "8px",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "10px",
                  outline: "none",
                  fontSize: "15px",
                  background:
                    "white",
                }}
              >
                <option value="">
                  Select language
                </option>

                <option value="Tamil">
                  Tamil
                </option>

                <option value="English">
                  English
                </option>

                <option value="Hindi">
                  Hindi
                </option>

                <option value="Malayalam">
                  Malayalam
                </option>

                <option value="Telugu">
                  Telugu
                </option>

                <option value="Kannada">
                  Kannada
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label>
                <strong>
                  No. of Pages
                </strong>
              </label>

              <input
                type="number"
                min="1"
                value={pages}
                onChange={(e) =>
                  setPages(
                    e.target.value
                  )
                }
                placeholder="e.g. 240"
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding: "14px",
                  marginTop:
                    "8px",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "10px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>
          </div>

          {/* =================================================
              COST
          ================================================= */}

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <label>
              <strong>
                Cost
              </strong>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              placeholder="₹ 0.00"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "14px",
                marginTop:
                  "8px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                outline: "none",
                fontFamily:
                  "'Courier New', monospace",
                fontSize: "22px",
                fontWeight: "700",
                color: "#171717",
              }}
            />
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                marginBottom:
                  "8px",
              }}
            >
              <label>
                <strong>
                  Description
                </strong>
              </label>

              <button
                type="button"
                onClick={() =>
                  toggleTamilKeyboard(
                    "description"
                  )
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "6px",
                  border:
                    "1px solid #ddd",
                  background:
                    showTamilKeyboard &&
                    activeField ===
                      "description"
                      ? "#171717"
                      : "white",
                  color:
                    showTamilKeyboard &&
                    activeField ===
                      "description"
                      ? "white"
                      : "#555",
                  padding:
                    "6px 10px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontSize:
                    "12px",
                }}
              >
                <Keyboard
                  size={14}
                />
                தமிழ்
              </button>
            </div>

            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              onFocus={() =>
                setActiveField(
                  "description"
                )
              }
              rows={5}
              placeholder="Write about the book..."
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding: "14px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                resize:
                  "vertical",
                outline: "none",
                fontSize: "15px",
                fontFamily:
                  "inherit",
              }}
            />

            {showTamilKeyboard &&
              activeField ===
                "description" && (
                <TamilKeyboard
                  activeField="Description"
                  insertTamilChar={
                    insertTamilChar
                  }
                  handleTamilBackspace={
                    handleTamilBackspace
                  }
                />
              )}
          </div>

          {/* =================================================
              BOOK FILE
          ================================================= */}

          <div
            style={{
              marginTop: "28px",
            }}
          >
            <label>
              <strong>
                Book File
              </strong>
            </label>

            <div
              style={{
                border:
                  "2px dashed #d8d0c5",
                borderRadius:
                  "14px",
                padding: "22px",
                display: "flex",
                alignItems:
                  "center",
                gap: "15px",
                marginTop:
                  "10px",
                background:
                  "#fdfbf8",
              }}
            >
              <FileText
                size={38}
                color="#555"
                style={{
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {bookFile ? (
                  <>
                    <strong
                      style={{
                        display:
                          "block",
                        color:
                          "#222",
                        marginBottom:
                          "6px",
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {bookFile.name}
                    </strong>

                    <div
                      style={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        alignItems:
                          "center",
                        gap: "7px",
                        color:
                          "#888",
                        fontSize:
                          "13px",
                      }}
                    >
                      <span>
                        {bookFile.name
                          .split(".")
                          .pop()
                          .toUpperCase()}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {(
                          bookFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </span>
                    </div>
                  </>
                ) : existingBookFile ? (
                  <>
                    <strong
                      style={{
                        display:
                          "block",
                        color:
                          "#222",
                        marginBottom:
                          "6px",
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {existingBookFile.fileName ||
                        "Existing book file"}
                    </strong>

                    <div
                      style={{
                        color:
                          "#4a7c59",
                        fontSize:
                          "13px",
                        fontWeight:
                          "600",
                      }}
                    >
                      Existing file •
                      ready to update
                    </div>
                  </>
                ) : (
                  <>
                    <strong
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "5px",
                      }}
                    >
                      Choose your book
                      file
                    </strong>

                    <div
                      style={{
                        color:
                          "#777",
                        fontSize:
                          "13px",
                      }}
                    >
                      PDF, DOC or DOCX
                    </div>
                  </>
                )}
              </div>

              {/* FILE BUTTONS */}

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                  flexWrap:
                    "wrap",
                  justifyContent:
                    "flex-end",
                }}
              >
                {!bookFile &&
                  !existingBookFile && (
                    <label
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        gap: "7px",
                        background:
                          "#171717",
                        color:
                          "white",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "9px",
                        cursor:
                          "pointer",
                        fontSize:
                          "13px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      <Upload
                        size={15}
                      />
                      Upload File

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={
                          handleBookFileChange
                        }
                        style={{
                          display:
                            "none",
                        }}
                      />
                    </label>
                  )}

                {(bookFile ||
                  existingBookFile) && (
                  <label
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: "7px",
                      background:
                        "#171717",
                      color:
                        "white",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "9px",
                      cursor:
                        "pointer",
                      fontSize:
                        "13px",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    <Pencil
                      size={15}
                    />

                    Replace

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={
                        handleBookFileChange
                      }
                      style={{
                        display:
                          "none",
                      }}
                    />
                  </label>
                )}

                {(bookFile ||
                  existingBookFile) && (
                  <button
                    type="button"
                    onClick={
                      removeBookFile
                    }
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: "6px",
                      border:
                        "1px solid #ead1d1",
                      background:
                        "#fff7f7",
                      borderRadius:
                        "9px",
                      padding:
                        "10px 14px",
                      cursor:
                        "pointer",
                      color:
                        "#c62828",
                      fontSize:
                        "13px",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    <X
                      size={15}
                    />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div
              style={{
                marginTop: "20px",
                padding:
                  "14px 16px",
                borderRadius:
                  "10px",
                background:
                  message.includes(
                    "successfully"
                  )
                    ? "#eef8f0"
                    : "#f3eee7",
                color:
                  message.includes(
                    "successfully"
                  )
                    ? "#26733a"
                    : "#333",
                border:
                  message.includes(
                    "successfully"
                  )
                    ? "1px solid #cde6d2"
                    : "1px solid #e5ddd2",
                lineHeight:
                  "1.5",
              }}
            >
              {message}
            </div>
          )}

          {/* =================================================
              PUBLISH / UPDATE
          ================================================= */}

          <button
            onClick={
              handlePublish
            }
            disabled={
              isPublishing
            }
            style={{
              width: "100%",
              marginTop: "25px",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: "10px",
              border: "none",
              background:
                "#171717",
              color: "white",
              padding: "16px",
              borderRadius:
                "11px",
              fontSize: "16px",
              fontWeight:
                "600",
              cursor:
                isPublishing
                  ? "not-allowed"
                  : "pointer",
              opacity:
                isPublishing
                  ? 0.6
                  : 1,
            }}
          >
            {isEditMode ? (
              <RefreshCw
                size={20}
              />
            ) : (
              <BookOpen
                size={20}
              />
            )}

            {isPublishing
              ? "Saving..."
              : isEditMode
              ? "Update Book"
              : "Publish Book"}
          </button>
        </div>

        {/* =====================================================
            MANAGE UPLOADED BOOKS
        ===================================================== */}

        <section
          id="manage-books"
          style={{
            marginTop: "55px",
          }}
        >

          {/* SECTION HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-end",
              marginBottom:
                "22px",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing:
                    "2px",
                  color: "#9a8064",
                  marginBottom:
                    "7px",
                }}
              >
                ADMIN LIBRARY
              </div>

              <h2
                style={{
                  margin: 0,
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                  fontSize: "30px",
                  fontWeight: 500,
                  color:
                    "#171717",
                }}
              >
                Manage Uploaded Books
              </h2>

              <p
                style={{
                  color: "#777",
                  margin:
                    "7px 0 0",
                }}
              >
                Edit, view or delete
                books published from
                this admin panel.
              </p>
            </div>

            <div
              style={{
                background:
                  "#171717",
                color: "white",
                padding:
                  "10px 16px",
                borderRadius:
                  "30px",
                fontSize:
                  "13px",
                fontWeight:
                  "600",
                whiteSpace:
                  "nowrap",
              }}
            >
              {books.length}{" "}
              {books.length === 1
                ? "Book"
                : "Books"}
            </div>
          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {books.length === 0 ? (
            <div
              style={{
                background:
                  "white",
                border:
                  "1px solid #e5e1db",
                borderRadius:
                  "20px",
                padding:
                  "60px 30px",
                textAlign:
                  "center",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  margin:
                    "0 auto 18px",
                  borderRadius:
                    "50%",
                  background:
                    "#f0ebe4",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                <BookOpen
                  size={32}
                  color="#777"
                />
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  fontSize:
                    "20px",
                }}
              >
                No books uploaded yet
              </h3>

              <p
                style={{
                  color:
                    "#777",
                  margin: 0,
                }}
              >
                Publish your first
                book above and it
                will appear here.
              </p>
            </div>
          ) : (

            /* =================================================
               BOOK LIST
            ================================================= */

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "16px",
              }}
            >
              {books.map(
                (book) => {

                  const coverUrl =
                    book.coverImageUrl ||
                    book.coverUrl;

                  const authorName =
                    book.author?.name ||
                    book.author ||
                    "Unknown Author";

                  return (
                    <article
                      key={
                        book.id
                      }
                      style={{
                        background:
                          "white",
                        border:
                          "1px solid #e5e1db",
                        borderRadius:
                          "20px",
                        padding:
                          "18px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "20px",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.04)",
                        position:
                          "relative",
                      }}
                    >

                      {/* =================================================
                          COVER
                      ================================================= */}

                      {coverUrl ? (
                        <img
                          src={
                            coverUrl
                          }
                          alt={
                            book.title
                          }
                          style={{
                            width:
                              "105px",
                            height:
                              "140px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
                            flexShrink:
                              0,
                            background:
                              "#eee9e1",
                            boxShadow:
                              "0 7px 18px rgba(0,0,0,0.13)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width:
                              "105px",
                            height:
                              "140px",
                            borderRadius:
                              "8px",
                            background:
                              "#eee9e1",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            flexShrink:
                              0,
                          }}
                        >
                          <BookOpen
                            size={
                              38
                            }
                            color="#aaa"
                          />
                        </div>
                      )}

                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >

                        {/* CATEGORY */}

                        <span
                          style={{
                            display:
                              "inline-block",
                            background:
                              "#f0ebe4",
                            color:
                              "#6b563b",
                            padding:
                              "5px 10px",
                            borderRadius:
                              "20px",
                            fontSize:
                              "11px",
                            fontWeight:
                              "600",
                            marginBottom:
                              "9px",
                          }}
                        >
                          {book.category ||
                            "Uncategorized"}
                        </span>

                        {/* TITLE */}

                        <h3
                          style={{
                            margin:
                              "0 0 7px",
                            fontFamily:
                              'Georgia, "Times New Roman", serif',
                            fontSize:
                              "23px",
                            fontWeight:
                              "500",
                            color:
                              "#171717",
                          }}
                        >
                          {book.title}
                        </h3>

                        {/* AUTHOR */}

                        <p
                          style={{
                            margin:
                              "0 0 9px",
                            color:
                              "#555",
                            fontSize:
                              "14px",
                          }}
                        >
                          By{" "}
                          <strong>
                            {
                              authorName
                            }
                          </strong>
                        </p>

                        {/* META */}

                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap:
                              "8px",
                            marginBottom:
                              "9px",
                          }}
                        >
                          {book.language && (
                            <span
                              style={{
                                background:
                                  "#faf7f2",
                                border:
                                  "1px solid #e5e1db",
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "7px",
                                color:
                                  "#666",
                                fontSize:
                                  "12px",
                              }}
                            >
                              Language:{" "}
                              {
                                book.language
                              }
                            </span>
                          )}

                          {book.pages && (
                            <span
                              style={{
                                background:
                                  "#faf7f2",
                                border:
                                  "1px solid #e5e1db",
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "7px",
                                color:
                                  "#666",
                                fontSize:
                                  "12px",
                              }}
                            >
                              Pages:{" "}
                              {
                                book.pages
                              }
                            </span>
                          )}

                          {book.price !==
                            null &&
                            book.price !==
                              undefined && (
                              <span
                                style={{
                                  background:
                                    "#171717",
                                  color:
                                    "white",
                                  padding:
                                    "5px 10px",
                                  borderRadius:
                                    "7px",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "700",
                                }}
                              >
                                ₹{" "}
                                {Number(
                                  book.price
                                ).toFixed(
                                  2
                                )}
                              </span>
                            )}
                        </div>

                        {/* FILE */}

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "7px",
                            color:
                              "#888",
                            fontSize:
                              "12px",
                            minWidth:
                              0,
                          }}
                        >
                          <FileText
                            size={
                              14
                            }
                          />

                          <span
                            style={{
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
                          </span>
                        </div>

                        {/* STATUS */}

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "7px",
                            marginTop:
                              "10px",
                            color:
                              "#4a7c59",
                            fontSize:
                              "12px",
                            fontWeight:
                              "600",
                          }}
                        >
                          <span
                            style={{
                              width:
                                "7px",
                              height:
                                "7px",
                              borderRadius:
                                "50%",
                              background:
                                "#4a7c59",
                            }}
                          />

                          Published
                        </div>
                      </div>

                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <div
                        style={{
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          gap:
                            "8px",
                          flexShrink:
                            0,
                        }}
                      >

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              book
                            )
                          }
                          style={{
                            minWidth:
                              "105px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap:
                              "7px",
                            border:
                              "1px solid #d8c8ae",
                            background:
                              "#faf6ef",
                            padding:
                              "10px 13px",
                            borderRadius:
                              "9px",
                            cursor:
                              "pointer",
                            color:
                              "#6b563b",
                            fontWeight:
                              "600",
                          }}
                        >
                          <Pencil
                            size={
                              16
                            }
                          />
                          Edit
                        </button>

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewBook(
                              book.id
                            )
                          }
                          style={{
                            minWidth:
                              "105px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap:
                              "7px",
                            border:
                              "1px solid #ddd",
                            background:
                              "white",
                            padding:
                              "10px 13px",
                            borderRadius:
                              "9px",
                            cursor:
                              "pointer",
                            color:
                              "#333",
                            fontWeight:
                              "600",
                          }}
                        >
                          <Eye
                            size={
                              16
                            }
                          />
                          View
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              book.id
                            )
                          }
                          style={{
                            minWidth:
                              "105px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap:
                              "7px",
                            border:
                              "1px solid #ead1d1",
                            background:
                              "#fff7f7",
                            padding:
                              "10px 13px",
                            borderRadius:
                              "9px",
                            cursor:
                              "pointer",
                            color:
                              "#c62828",
                            fontWeight:
                              "600",
                          }}
                        >
                          <Trash2
                            size={
                              16
                            }
                          />
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
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
            marginTop:
              "35px",
            display: "flex",
            alignItems:
              "center",
            gap: "8px",
            border: "none",
            background:
              "transparent",
            cursor:
              "pointer",
            color:
              "#555",
          }}
        >
          <ArrowLeft
            size={17}
          />
          Back to Website
        </button>
      </div>
    </main>
  );
}

export default AddBook;