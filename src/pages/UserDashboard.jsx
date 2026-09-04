import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  LogOut,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  X,
  Eye,
} from "lucide-react";

// Books service
import { getAllBooks } from "../services/booksService";

// Supabase
import { supabase } from "../services/supabaseClient";

const BOOKS_KEY = "viyazham_uploaded_books";

const CATEGORY_COLORS = [
  { bg: "#7B1E3C", text: "#ffffff" },
  { bg: "#C9932F", text: "#171717" },
  { bg: "#3F6142", text: "#ffffff" },
  { bg: "#2B4C7E", text: "#ffffff" },
  { bg: "#B5651D", text: "#ffffff" },
];

function getCategoryColor(category) {
  const str = category || "Uncategorized";

  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return CATEGORY_COLORS[
    Math.abs(hash) % CATEGORY_COLORS.length
  ];
}

function UserDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // =====================================================
  // WHATSAPP NUMBERS
  // =====================================================

  const whatsappNumbers = [
    {
      name: "Viyazham Publication",
      number: "919962241090",
      display: "+91 99622 41090",
    },
    {
      name: "Viyazham Publication",
      number: "919514364459",
      display: "+91 95143 64459",
    },
  ];

  // =====================================================
  // SUPABASE LOGIN CHECK
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);

          if (mounted) {
            setCurrentUser(null);
            navigate("/login", { replace: true });
          }

          return;
        }

        if (!mounted) return;

        // No Supabase session
        if (!session?.user) {
          console.log("No Supabase session. Redirecting to login.");

          setCurrentUser(null);
          navigate("/login", { replace: true });
          return;
        }

        // Supabase user
        const user = session.user;

        console.log("Dashboard Supabase user:", user);

        setCurrentUser({
          id: user.id,
          email: user.email || "",
          name:
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
        });
      } catch (error) {
        console.error("Dashboard authentication error:", error);

        if (mounted) {
          setCurrentUser(null);
          navigate("/login", { replace: true });
        }
      }
    };

    checkUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        console.log(
          "Dashboard auth event:",
          _event,
          session
        );

        if (!session?.user) {
          setCurrentUser(null);
          navigate("/login", { replace: true });
          return;
        }

        const user = session.user;

        setCurrentUser({
          id: user.id,
          email: user.email || "",
          name:
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
        });
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // =====================================================
  // LOAD BOOKS FROM SUPABASE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadBooks = async () => {
      try {
        const data = await getAllBooks();

        if (!mounted) return;

        // Only show published books
        const publishedBooks = Array.isArray(data)
          ? data.filter(
              (book) =>
                book.status === "published" ||
                !book.status
            )
          : [];

        // Show latest 8 books
        setBooks(
          publishedBooks
            .slice(-8)
            .reverse()
        );
      } catch (error) {
        console.error(
          "Failed to load books from Supabase:",
          error
        );

        if (mounted) {
          setBooks([]);
        }
      }
    };

    loadBooks();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // COVER IMAGE
  // IMPORTANT:
  // AddBook.jsx saves the cover as coverImageUrl
  // Older books may use coverUrl
  // =====================================================

  const getCoverUrl = (book) => {
    return (
      book?.coverImageUrl ||
      book?.coverUrl ||
      ""
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
      }

      // Remove old localStorage values too
      // in case they still exist from the old login system.
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("currentUser");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      navigate("/", { replace: true });
    }
  };

  // =====================================================
  // PRICE
  // =====================================================

  const getPrice = (book) => {
    if (
      book?.price === undefined ||
      book?.price === null ||
      book?.price === ""
    ) {
      return "Price unavailable";
    }

    const numericPrice = Number(book.price);

    if (Number.isNaN(numericPrice)) {
      return "Price unavailable";
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  // =====================================================
  // AUTHOR
  // =====================================================

  const getAuthorName = (book) => {
    if (typeof book?.author === "string") {
      return book.author;
    }

    if (book?.author?.name) {
      return book.author.name;
    }

    return "Unknown Author";
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = (book) => {
    setSelectedBook(book);
  };

  // =====================================================
  // OPEN WHATSAPP
  // =====================================================

  const openWhatsApp = (number) => {
    if (!selectedBook) return;

    const title = selectedBook.title || "Book";
    const author = getAuthorName(selectedBook);
    const price = getPrice(selectedBook);

    const message = `Hello Viyazham Publication,

I would like to purchase this book.

📚 Book: ${title}
✍️ Author: ${author}
💰 Price: ${price}

Please provide me with the purchase details.

Thank you.`;

    const whatsappURL =
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

    setSelectedBook(null);
  };

  // =====================================================
  // FEATURED BOOK
  // =====================================================

  const featuredBook = books[0];

  // =====================================================
  // WAIT FOR LOGIN
  // =====================================================

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f3ed",
          color: "#7B1E3C",
          fontFamily:
            'Georgia, "Times New Roman", serif',
          fontSize: "18px",
        }}
      >
        Checking your login...
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 90px)",
        background: "#f7f3ed",
        padding: "45px 25px 80px",
        color: "#171717",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            WELCOME HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "20px",
            marginBottom: "35px",
            flexWrap: "wrap",
          }}
        >
          <div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "13px",
                letterSpacing: "2px",
                color: "#7B1E3C",
                marginBottom: "9px",
                fontWeight: "700",
              }}
            >
              <Sparkles size={15} />
              VIYAZHAM PUBLICATION
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily:
                  'Georgia, "Times New Roman", serif',
                fontSize: "38px",
                lineHeight: "1.15",
                color: "#171717",
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "#7B1E3C" }}>
                {currentUser.name}
              </span>
            </h1>

            <p
              style={{
                color: "#777",
                margin: "10px 0 0",
                fontSize: "16px",
              }}
            >
              Discover books that inspire, inform and entertain.
            </p>

          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              color: "#171717",
              padding: "11px 17px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

        {/* =================================================
            FEATURED BOOK
        ================================================= */}

        {featuredBook && (

          <section
            style={{
              background:
                "linear-gradient(135deg, #7B1E3C 0%, #9C2855 55%, #C9932F 100%)",
              borderRadius: "22px",
              padding: "30px",
              marginBottom: "55px",
              display: "grid",
              gridTemplateColumns: "210px 1fr",
              gap: "35px",
              alignItems: "center",
              boxShadow:
                "0 18px 45px rgba(123,30,60,0.22)",
            }}
          >

            {/* =================================================
                BOOK COVER
            ================================================= */}

            <div
              style={{
                width: "210px",
                height: "285px",
                borderRadius: "13px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.14)",
                boxShadow:
                  "0 15px 30px rgba(0,0,0,0.30)",
              }}
            >

              {getCoverUrl(featuredBook) ? (

                <img
                  src={getCoverUrl(featuredBook)}
                  alt={featuredBook.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

              ) : (

                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <BookOpen size={55} />

                  <span
                    style={{
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                  >
                    Cover unavailable
                  </span>
                </div>

              )}

            </div>

            {/* =================================================
                FEATURED DETAILS
            ================================================= */}

            <div
              style={{
                color: "#fff",
                minWidth: 0,
              }}
            >

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background:
                    "rgba(255,255,255,0.18)",
                  padding: "7px 13px",
                  borderRadius: "30px",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  marginBottom: "17px",
                }}
              >
                <Sparkles size={13} />
                NEWLY PUBLISHED
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                  fontSize: "34px",
                  lineHeight: "1.2",
                }}
              >
                {featuredBook.title}
              </h2>

              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: "16px",
                  color:
                    "rgba(255,255,255,0.88)",
                  fontWeight: "600",
                }}
              >
                By {getAuthorName(featuredBook)}
              </p>

              {featuredBook.category && (

                <div
                  style={{
                    display: "inline-block",
                    background:
                      "rgba(255,255,255,0.15)",
                    border:
                      "1px solid rgba(255,255,255,0.25)",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    marginBottom: "14px",
                  }}
                >
                  {featuredBook.category}
                </div>

              )}

              {featuredBook.description && (

                <p
                  style={{
                    margin: "0 0 20px",
                    maxWidth: "650px",
                    color:
                      "rgba(255,255,255,0.82)",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {featuredBook.description}
                </p>

              )}

              {/* PRICE */}

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  marginBottom: "20px",
                }}
              >
                {getPrice(featuredBook)}
              </div>

              {/* ACTIONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  onClick={() =>
                    handleBuyNow(featuredBook)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "none",
                    background: "#171717",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  <ShoppingBag size={17} />
                  Buy Now
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/books/${featuredBook.id}`
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    border:
                      "1px solid rgba(255,255,255,0.45)",
                    background:
                      "rgba(255,255,255,0.12)",
                    color: "#fff",
                    padding: "12px 19px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  <Eye size={17} />
                  View Details
                </button>

              </div>

            </div>

          </section>

        )}

        {/* =================================================
            RECENTLY ADDED BOOKS
        ================================================= */}

        <section>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "20px",
              marginBottom: "25px",
              flexWrap: "wrap",
            }}
          >

            <div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginBottom: "7px",
                }}
              >

                <Sparkles
                  size={21}
                  color="#7B1E3C"
                />

                <h2
                  style={{
                    margin: 0,
                    fontFamily:
                      'Georgia, "Times New Roman", serif',
                    fontSize: "28px",
                  }}
                >
                  Recently Added Books
                </h2>

              </div>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Explore our latest publications.
              </p>

            </div>

            <button
              onClick={() => navigate("/books")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                border: "none",
                background: "transparent",
                color: "#7B1E3C",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              View All Books
              <ArrowRight size={17} />
            </button>

          </div>

          {/* =================================================
              NO BOOKS
          ================================================= */}

          {books.length === 0 ? (

            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e1db",
                borderRadius: "18px",
                padding: "60px 30px",
                textAlign: "center",
              }}
            >

              <BookOpen
                size={48}
                color="#aaa"
              />

              <h3
                style={{
                  margin: "14px 0 5px",
                }}
              >
                No books yet
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                }}
              >
                New publications will appear here.
              </p>

            </div>

          ) : (

            /* =================================================
               BOOK GRID
            ================================================= */

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(210px, 1fr))",
                gap: "24px",
              }}
            >

              {books.map((book) => {

                const categoryColor =
                  getCategoryColor(book.category);

                return (

                  <article
                    key={book.id}
                    style={{
                      background: "#fff",
                      border:
                        "1px solid #e5e1db",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition:
                        "transform .25s ease, box-shadow .25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-6px)";

                      e.currentTarget.style.boxShadow =
                        "0 15px 35px rgba(0,0,0,0.11)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";

                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                  >

                    {/* =================================================
                        COVER
                    ================================================= */}

                    <div
                      onClick={() =>
                        navigate(
                          `/books/${book.id}`
                        )
                      }
                      style={{
                        height: "275px",
                        background: "#eee9e1",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    >

                      {getCoverUrl(book) ? (

                        <img
                          src={getCoverUrl(book)}
                          alt={book.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "center",
                            color: "#aaa",
                            flexDirection:
                              "column",
                            gap: "8px",
                          }}
                        >

                          <BookOpen size={45} />

                          <span
                            style={{
                              fontSize: "11px",
                            }}
                          >
                            Cover unavailable
                          </span>

                        </div>

                      )}

                    </div>

                    {/* =================================================
                        BOOK DETAILS
                    ================================================= */}

                    <div
                      style={{
                        padding: "17px",
                      }}
                    >

                      {/* CATEGORY */}

                      <div
                        style={{
                          display: "inline-block",
                          fontSize: "10px",
                          fontWeight: "700",
                          letterSpacing: ".5px",
                          color:
                            categoryColor.text,
                          background:
                            categoryColor.bg,
                          padding: "5px 9px",
                          borderRadius: "20px",
                          marginBottom: "11px",
                        }}
                      >
                        {book.category ||
                          "Uncategorized"}
                      </div>

                      {/* TITLE */}

                      <h3
                        style={{
                          margin: "0 0 5px",
                          fontFamily:
                            'Georgia, "Times New Roman", serif',
                          fontSize: "19px",
                          lineHeight: "1.3",
                          color: "#171717",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {book.title}
                      </h3>

                      {/* AUTHOR */}

                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "13px",
                          color: "#7B1E3C",
                          fontWeight: "600",
                        }}
                      >
                        By {getAuthorName(book)}
                      </p>

                      {/* DESCRIPTION */}

                      {book.description && (

                        <p
                          style={{
                            margin: "0 0 15px",
                            fontSize: "12px",
                            color: "#777",
                            lineHeight: "1.6",
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow: "hidden",
                            minHeight: "38px",
                          }}
                        >
                          {book.description}
                        </p>

                      )}

                      {/* PRICE + BUY */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "10px",
                          marginTop: "12px",
                          paddingTop: "13px",
                          borderTop:
                            "1px solid #eee",
                        }}
                      >

                        <strong
                          style={{
                            fontSize: "20px",
                            color: "#171717",
                          }}
                        >
                          {getPrice(book)}
                        </strong>

                        <button
                          onClick={() =>
                            handleBuyNow(book)
                          }
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "6px",
                            border: "none",
                            background:
                              "#7B1E3C",
                            color: "#fff",
                            padding:
                              "9px 13px",
                            borderRadius:
                              "8px",
                            cursor:
                              "pointer",
                            fontSize:
                              "12px",
                            fontWeight:
                              "700",
                          }}
                        >
                          <ShoppingBag
                            size={15}
                          />
                          Buy Now
                        </button>

                      </div>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

        {/* =================================================
            BROWSE ALL BOOKS
        ================================================= */}

        {books.length > 0 && (

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "45px",
            }}
          >

            <button
              onClick={() =>
                navigate("/books")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                border: "none",
                background: "#171717",
                color: "#fff",
                padding: "13px 23px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Browse All Books
              <ArrowRight size={17} />
            </button>

          </div>

        )}

      </div>

      {/* =================================================
          WHATSAPP SELECTION MODAL
      ================================================= */}

      {selectedBook && (

        <div
          onClick={() =>
            setSelectedBook(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "rgba(0,0,0,0.58)",
            backdropFilter:
              "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            padding: "20px",
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "450px",
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              position: "relative",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.3)",
            }}
          >

            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setSelectedBook(null)
              }
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "34px",
                height: "34px",
                border: "none",
                borderRadius: "50%",
                background: "#f3f1ed",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
              }}
            >
              <X size={18} />
            </button>

            {/* WHATSAPP ICON */}

            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "#e7f7ed",
                color: "#168c45",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <MessageCircle
                size={30}
              />
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily:
                  'Georgia, "Times New Roman", serif',
                fontSize: "27px",
              }}
            >
              Choose WhatsApp
            </h2>

            <p
              style={{
                margin:
                  "8px 0 4px",
                color: "#777",
                fontSize: "14px",
              }}
            >
              Contact us to purchase:
            </p>

            {/* SELECTED BOOK */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                background: "#f8f5f0",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "20px",
              }}
            >

              {/* SMALL COVER */}

              <div
                style={{
                  width: "48px",
                  height: "62px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#e5dfd7",
                }}
              >

                {getCoverUrl(selectedBook) ? (

                  <img
                    src={getCoverUrl(
                      selectedBook
                    )}
                    alt={
                      selectedBook.title
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                ) : (

                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <BookOpen
                      size={20}
                      color="#999"
                    />
                  </div>

                )}

              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >

                <div
                  style={{
                    color: "#7B1E3C",
                    fontWeight: "700",
                    fontSize: "15px",
                    marginBottom: "3px",
                  }}
                >
                  {selectedBook.title}
                </div>

                <div
                  style={{
                    color: "#777",
                    fontSize: "12px",
                  }}
                >
                  By{" "}
                  {getAuthorName(
                    selectedBook
                  )}
                </div>

                <div
                  style={{
                    color: "#171717",
                    fontWeight: "700",
                    fontSize: "13px",
                    marginTop: "3px",
                  }}
                >
                  {getPrice(
                    selectedBook
                  )}
                </div>

              </div>

            </div>

            {/* WHATSAPP NUMBERS */}

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "10px",
              }}
            >

              {whatsappNumbers.map(
                (item) => (

                  <button
                    key={item.number}
                    onClick={() =>
                      openWhatsApp(
                        item.number
                      )
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                      padding: "13px",
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "11px",
                      background:
                        "#fff",
                      cursor:
                        "pointer",
                      textAlign:
                        "left",
                    }}
                    onMouseEnter={(
                      e
                    ) => {
                      e.currentTarget.style.borderColor =
                        "#168c45";

                      e.currentTarget.style.background =
                        "#f5fff8";
                    }}
                    onMouseLeave={(
                      e
                    ) => {
                      e.currentTarget.style.borderColor =
                        "#ddd";

                      e.currentTarget.style.background =
                        "#fff";
                    }}
                  >

                    <div
                      style={{
                        width: "43px",
                        height: "43px",
                        borderRadius:
                          "50%",
                        background:
                          "#e7f7ed",
                        color:
                          "#168c45",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        flexShrink: 0,
                      }}
                    >
                      <MessageCircle
                        size={21}
                      />
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: "3px",
                      }}
                    >

                      <strong
                        style={{
                          color:
                            "#222",
                          fontSize:
                            "14px",
                        }}
                      >
                        {item.name}
                      </strong>

                      <span
                        style={{
                          color:
                            "#777",
                          fontSize:
                            "13px",
                        }}
                      >
                        {item.display}
                      </span>

                    </div>

                    <ArrowRight
                      size={18}
                      color="#777"
                    />

                  </button>

                )
              )}

            </div>

            {/* CANCEL */}

            <button
              onClick={() =>
                setSelectedBook(null)
              }
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                border:
                  "1px solid #ddd",
                borderRadius: "9px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: "600",
                color: "#555",
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

export default UserDashboard;