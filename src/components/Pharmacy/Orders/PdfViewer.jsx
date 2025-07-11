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
  const pdfUrl =
    "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

  const zoomPluginInstance = zoomPlugin();
  const { ZoomOut, ZoomIn, CurrentScale } = zoomPluginInstance;

  const fullScreenPluginInstance = fullScreenPlugin();
  const { EnterFullScreen } = fullScreenPluginInstance;

  const printPluginInstance = printPlugin();
  const { Print } = printPluginInstance;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "sample-local-pdf.pdf"; // You can customize the filename
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex-1 min-h-0">
      {/* PDF Viewer */}
      <div
        className="border border-gray-300 rounded-lg overflow-auto"
        style={{ minHeight: 0 }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl} // Use pdfUrl instead of hardcoded URL
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
          style={{
            padding: "8px",
            justifyContent: "center",
          }}
        >
          <LuDownload size={24} />
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
    </div>
  );
};

export default PdfViewer;
