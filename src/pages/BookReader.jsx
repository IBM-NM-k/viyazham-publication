import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
} from "lucide-react";

import {
  getBookById,
} from "../services/booksService";

import PDFViewer from "../components/PDFViewer";


function BookReader() {

  const { bookId } =
    useParams();

  const navigate =
    useNavigate();

  const [book, setBook] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD BOOK
  // =====================================================

  useEffect(() => {

    let active = true;

    getBookById(bookId)
      .then((result) => {

        if (active) {
          setBook(result);
          setLoading(false);
        }

      });

    return () => {
      active = false;
    };

  }, [bookId]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <main
        style={{
          minHeight:
            "calc(100vh - 90px)",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "#f7f3ed",
        }}
      >
        Opening book...
      </main>
    );

  }


  // =====================================================
  // BOOK NOT FOUND
  // =====================================================

  if (!book) {

    return (
      <main
        style={{
          minHeight:
            "calc(100vh - 90px)",

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "#f7f3ed",

          textAlign:
            "center",
        }}
      >

        <BookOpen
          size={55}
          color="#777"
        />

        <h2>
          Book not found
        </h2>

        <button
          onClick={() =>
            navigate("/books")
          }

          style={{
            border: "none",

            background:
              "#171717",

            color: "white",

            padding:
              "12px 20px",

            borderRadius:
              "9px",

            cursor:
              "pointer",
          }}
        >
          Back to Books
        </button>

      </main>
    );

  }


  // =====================================================
  // CHECK FILE TYPE
  // =====================================================

  const extension =
    book.fileExtension ||
    book.fileName
      ?.split(".")
      .pop()
      ?.toLowerCase();


  // =====================================================
  // PDF ONLY FOR READER
  // =====================================================

  const isPDF =
    extension === "pdf";


  return (
    <main
      style={{
        minHeight:
          "calc(100vh - 90px)",

        background:
          "#e9e3da",

        padding:
          "25px 20px 60px",
      }}
    >

      <div
        style={{
          maxWidth:
            "1000px",

          margin:
            "0 auto",
        }}
      >


        {/* =================================================
            TOP BAR
        ================================================= */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            background:
              "#faf7f2",

            borderRadius:
              "14px",

            padding:
              "15px 20px",

            marginBottom:
              "20px",

            border:
              "1px solid #ddd5ca",
          }}
        >

          <button
            onClick={() =>
              navigate(
                `/books/${book.id}`
              )
            }

            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "8px",

              border:
                "none",

              background:
                "transparent",

              cursor:
                "pointer",

              color:
                "#444",

              fontSize:
                "14px",
            }}
          >

            <ArrowLeft
              size={18}
            />

            Back

          </button>


          <div
            style={{
              textAlign:
                "center",

              flex: 1,

              padding:
                "0 15px",
            }}
          >

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "17px",

                color:
                  "#171717",

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              {book.title}
            </strong>


            <span
              style={{
                fontSize:
                  "12px",

                color:
                  "#777",
              }}
            >
              {book.author?.name}
            </span>

          </div>


          <BookOpen
            size={21}
            color="#555"
          />

        </div>



        {/* =================================================
            PDF READER
        ================================================= */}

        {isPDF ? (

          <PDFViewer
            file={book.fileUrl}
          />

        ) : (

          <div
            style={{
              background:
                "#faf7f2",

              borderRadius:
                "16px",

              padding:
                "60px 25px",

              textAlign:
                "center",

              border:
                "1px solid #ddd5ca",
            }}
          >

            <BookOpen
              size={55}
              color="#777"
            />

            <h2>
              This book is not a PDF
            </h2>

            <p
              style={{
                color:
                  "#777",

                maxWidth:
                  "500px",

                margin:
                  "0 auto",

                lineHeight:
                  "1.6",
              }}
            >
              Online reading is currently
              available for PDF books.
              Please upload the book as a
              PDF to enable the Viyazham
              reader.
            </p>


            <button
              onClick={() =>
                navigate(
                  `/books/${book.id}`
                )
              }

              style={{
                marginTop:
                  "20px",

                border:
                  "none",

                background:
                  "#171717",

                color:
                  "white",

                padding:
                  "12px 20px",

                borderRadius:
                  "9px",

                cursor:
                  "pointer",
              }}
            >
              Back to Book
            </button>

          </div>

        )}

      </div>

    </main>
  );
}

export default BookReader;