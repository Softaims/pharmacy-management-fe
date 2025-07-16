import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import {
  fullScreenPlugin,
  FullScreenIcon,
} from "@react-pdf-viewer/full-screen";
import { printPlugin } from "@react-pdf-viewer/print";
import { LuDownload } from "react-icons/lu";
import { MdZoomOut, MdZoomIn } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";

const PdfViewer = ({ file }) => {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomOut, ZoomIn, CurrentScale } = zoomPluginInstance;

  const fullScreenPluginInstance = fullScreenPlugin();
  const { EnterFullScreen } = fullScreenPluginInstance;

  const printPluginInstance = printPlugin();
  const { Print } = printPluginInstance;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "sample-local-pdf.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex-1 min-h-0">
      {/* PDF Viewer Container with fixed height and visible scrollbars */}
      <div
        className="border border-gray-300 rounded-lg bg-gray-50"
        style={{
          height: "calc(100vh - 120px)", // Fixed height
          // overflow: "auto", // Enable scrollbars
          // overflow: "hidden",
          position: "relative",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={file}
            plugins={[
              zoomPluginInstance,
              fullScreenPluginInstance,
              printPluginInstance,
            ]}
          />
        </Worker>
      </div>

      {/* Fixed Toolbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-700 text-white rounded-lg p-2 flex items-center justify-center gap-3 shadow-lg">
        <ZoomOut>
          {(props) => (
            <button
              onClick={props.onClick}
              className="p-2 rounded hover:bg-gray-600 transition-colors"
              title="Zoom Out"
            >
              <MdZoomOut size={20} />
            </button>
          )}
        </ZoomOut>

        <ZoomIn>
          {(props) => (
            <button
              onClick={props.onClick}
              className="p-2 rounded hover:bg-gray-600 transition-colors"
              title="Zoom In"
            >
              <MdZoomIn size={20} />
            </button>
          )}
        </ZoomIn>

        <Print>
          {(props) => (
            <button
              onClick={props.onClick}
              className="p-2 rounded hover:bg-gray-600 transition-colors"
              title="Print"
            >
              <IoIosPrint size={20} />
            </button>
          )}
        </Print>

        <button
          onClick={handleDownload}
          className="p-2 rounded hover:bg-gray-600 transition-colors"
          title="Download"
        >
          <LuDownload size={20} />
        </button>

        <EnterFullScreen>
          {(props) => (
            <button
              onClick={props.onClick}
              className="p-2 rounded hover:bg-gray-600 transition-colors"
              title="Full Screen"
            >
              <FullScreenIcon />
            </button>
          )}
        </EnterFullScreen>
      </div>

      {/* Custom CSS for better scrollbar visibility */}
      <style jsx>{`
        /* Make scrollbars always visible and better styled */
        .border.border-gray-300 {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 #f3f4f6;
        }

        .border.border-gray-300::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .border.border-gray-300::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 6px;
        }

        .border.border-gray-300::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 6px;
          border: 2px solid #f3f4f6;
        }

        .border.border-gray-300::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }

        .border.border-gray-300::-webkit-scrollbar-corner {
          background: #f3f4f6;
        }

        /* Ensure scrollbars are always visible */
        .border.border-gray-300 {
          overflow: auto !important;
          scrollbar-width: auto !important;
        }

        /* Make sure the PDF viewer content can scroll properly */
        .rpv-core__viewer {
          min-width: 100%;
          min-height: 100%;
        }
      `}</style>
    </div>
  );
};

export default PdfViewer;
