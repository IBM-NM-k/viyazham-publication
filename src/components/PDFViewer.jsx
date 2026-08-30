import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(false);

  if (!file) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        PDF file not found.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {error ? (
        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          <h2>Unable to open this book</h2>

          <p style={{ color: "#777" }}>
            The uploaded PDF could not be read.
          </p>
        </div>
      ) : (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
          }}
          onLoadError={(error) => {
            console.error(
              "PDF loading error:",
              error
            );

            setError(true);
          }}
          loading={
            <div style={{ padding: "40px" }}>
              Opening book...
            </div>
          }
        >
          {Array.from(
            { length: numPages || 0 },
            (_, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  marginBottom: "20px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.12)",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={800}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </div>
            )
          )}
        </Document>
      )}
    </div>
  );
}

export default PDFViewer;