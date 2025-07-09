import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaArrowAltCircleUp,
} from "react-icons/fa";

// Use CDN for the worker script
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ fileUrl }) => {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(600); // Default page width
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Calculate page width based on container and zoom
  const calculatePageWidth = (containerWidth, zoom, isFullscreenMode) => {
    if (isFullscreenMode) {
      // In fullscreen, allow wider pages and proper zoom scaling
      return Math.min(800 * zoom, 1200 * zoom);
    } else {
      // In normal mode, respect the original layout
      return Math.min(600 * zoom, containerWidth * 0.9); // Leave some margin
    }
  };

  useEffect(() => {
    const updatePageWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newPageWidth = calculatePageWidth(
          containerWidth,
          zoomLevel,
          isFullScreen
        );
        setPageWidth(newPageWidth);
      }
    };

    window.addEventListener("resize", updatePageWidth);
    updatePageWidth();

    return () => {
      window.removeEventListener("resize", updatePageWidth);
    };
  }, [zoomLevel, isFullScreen]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);

      if (!isCurrentlyFullScreen) {
        // When exiting fullscreen, reset to default width and layout
        setZoomLevel(1); // Reset zoom to 100%
        if (containerRef.current) {
          containerRef.current.style.padding = "20px 0"; // Reset padding after exiting fullscreen
          const containerWidth = containerRef.current.offsetWidth;
          setPageWidth(Math.min(600, containerWidth)); // Reset to default page width
        }
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
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5)); // Limit zoom to 150%
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Zoom out but not below 0.5x
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
        overflow: "auto", // Enable scrolling in full-screen mode
        maxWidth: "100%",
        backgroundColor: isFullScreen ? "#f8f9fa" : "transparent",
        padding: isFullScreen ? "0" : "20px 0", // Reset padding after exiting fullscreen
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
          error="Failed to load PDF file."
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              minWidth: `${pageWidth}px`, // Ensure minimum width for scrolling
            }}
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <Page
                key={page}
                width={pageWidth}
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #e1e5e9",
                }}
              />
            ))}
          </div>
        </Document>
      </div>

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
        {isFullScreen && (
          <>
            <button
              onClick={handleZoomOut}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Zoom In"
            >
              <FaSearchPlus size={20} />
            </button>
          </>
        )}
        <button
          onClick={toggleFullScreen}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          <FaExpand size={20} />
        </button>
        <span style={{ color: "white", fontSize: "14px" }}>
          Page 1 of {numPages} | Zoom: {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      {/* Exit full-screen button at the top, only visible in full-screen mode */}
      {isFullScreen && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1100,
          }}
        >
          <button
            onClick={() => document.exitFullscreen()}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Exit Full Screen"
          >
            <FaArrowAltCircleUp size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
