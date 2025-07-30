import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { printPlugin } from "@react-pdf-viewer/print";
import { LuDownload } from "react-icons/lu";
import { MdZoomOut, MdZoomIn } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { BiExpand } from "react-icons/bi";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";

const PdfViewer = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) setViewerKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const zoomPluginInstance = zoomPlugin();
  const { ZoomOut, ZoomIn } = zoomPluginInstance;

  const printPluginInstance = printPlugin();
  const { Print } = printPluginInstance;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = "sample-local-pdf.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex-1 min-h-0">
      <div
        className="border border-gray-300 rounded-lg bg-gray-50"
        style={{
          height: "calc(100vh - 120px)",
          position: "relative",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            key={viewerKey}
            fileUrl={file}
            plugins={[zoomPluginInstance, printPluginInstance]}
          />
        </Worker>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div
            className="bg-white p-4 shadow-lg w-full h-full"
            style={{ position: "relative" }}
          >
            <div style={{ height: "100%", width: "100%" }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={file}
                  plugins={[zoomPluginInstance, printPluginInstance]}
                />
              </Worker>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-700 text-white rounded-lg p-2 flex items-center justify-center gap-3 shadow-lg">
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
              <button
                onClick={toggleModal}
                className="p-2 rounded hover:bg-gray-600 transition-colors"
                title="Close"
              >
                <BiExpand size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* Remove Print button from main toolbar when modal is open */}
        {!isModalOpen && (
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
        )}

        <button
          onClick={handleDownload}
          className="p-2 rounded hover:bg-gray-600 transition-colors"
          title="Download"
        >
          <LuDownload size={20} />
        </button>

        <button
          onClick={toggleModal}
          className="p-2 rounded hover:bg-gray-600 transition-colors"
          title="Enlarge"
        >
          <BiExpand size={20} />
        </button>
      </div>

      <style jsx>{`
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

        .border.border-gray-300 {
          overflow: auto !important;
          scrollbar-width: auto !important;
        }

        .rpv-core__viewer {
          min-width: 100%;
          min-height: 100%;
        }
      `}</style>
    </div>
  );
};

export default PdfViewer;
