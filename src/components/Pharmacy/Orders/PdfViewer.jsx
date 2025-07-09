import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaSearchPlus, FaSearchMinus, FaExpand } from "react-icons/fa";

// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const PdfViewer = ({ fileUrl }) => {
  console.log("🚀 ~ PdfViewer ~ fileUrl,,,,,,,,,,,,,,,,,,:", fileUrl);
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const updatePageWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Limit the maximum width to container's width
        setPageWidth(Math.min(containerWidth * zoomLevel, containerWidth));
      }
    };

    window.addEventListener("resize", updatePageWidth);
    updatePageWidth();

    return () => {
      window.removeEventListener("resize", updatePageWidth);
    };
  }, [zoomLevel]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);
      if (!isCurrentlyFullScreen) {
        setZoomLevel(1);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: isFullScreen ? "100vh" : "100%",
        position: "relative",
        overflow: "auto", // Enable scrolling for zoomed content
        maxWidth: "100%", // Ensure it doesn't exceed parent width
      }}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
        error="Failed to load PDF file."
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <Page
            key={page}
            width={pageWidth}
            pageNumber={page}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "8px",
          padding: "10px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleZoomOut}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
          }}
          title="Zoom Out"
        >
          <FaSearchMinus size={20} />
        </button>
        <button
          onClick={handleZoomIn}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
          }}
          title="Zoom In"
        >
          <FaSearchPlus size={20} />
        </button>
        <button
          onClick={toggleFullScreen}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
          }}
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          <FaExpand size={20} />
        </button>
        <span style={{ color: "white" }}>
          Page 1 of {numPages} | Zoom: {Math.round(zoomLevel * 100)}%
        </span>
      </div>
    </div>
  );
};

export default PdfViewer;
