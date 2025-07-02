import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import dummyPerscription from "../../../assets/IMG_1613.jpg";

const OrderDocumentViewer = ({
  selectedOrder,
  activeDocumentTab,
  setActiveDocumentTab,
}) => {
  const [showToolbar, setShowToolbar] = useState(true);

  const documentTabs = [
    { id: "prescription", label: "Ordonnance" },
    { id: "mutualCard", label: "Carte vitale" },
    { id: "vitalCard", label: "Mutuelle" },
  ];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dummyPerscription;
    link.download = "ordonnance.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              body {
                margin: 0;
              }
              img {
                width: 100%;
                height: auto;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dummyPerscription}" alt="Document" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleClose = () => {
    setShowToolbar(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="">
        <nav className="flex space-x-8 px-6 pt-4">
          {documentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocumentTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeDocumentTab === tab.id
                  ? "border-[#069AA2] text-[#069AA2]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-hidden p-6 relative">
        {activeDocumentTab === "prescription" ? (
          <div className="h-full relative">
            <TransformWrapper
              initialScale={1}
              minScale={0.25}
              maxScale={5}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
              pan={{ disabled: false }}
              pinch={{ step: 5 }}
              doubleClick={{ disabled: false, step: 0.5 }}
            >
              {({ zoomIn, zoomOut, resetTransform, centerView, instance }) => (
                <>
                  {/* Fixed Toolbar */}
                  {showToolbar && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-4 z-50 shadow-lg">
                      <span className="text-white text-sm font-medium">
                        {Math.round(
                          (instance?.transformState?.scale || 1) * 100
                        )}
                        %
                      </span>

                      {/* Zoom In */}
                      <button
                        onClick={() => zoomIn(0.25)}
                        className="text-white hover:text-gray-300 transition-colors"
                        title="Zoom In"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </button>

                      {/* Zoom Out */}
                      <button
                        onClick={() => zoomOut(0.25)}
                        className="text-white hover:text-gray-300 transition-colors"
                        title="Zoom Out"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                          />
                        </svg>
                      </button>

                      {/* Reset/Fit to Screen */}
                      <button
                        onClick={() => resetTransform()}
                        className="text-white hover:text-gray-300 transition-colors"
                        title="Reset Zoom"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>

                      {/* Center View */}
                      <button
                        onClick={() => centerView()}
                        className="text-white hover:text-gray-300 transition-colors"
                        title="Center Image"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>

                      {/* Print */}
                      <button
                        onClick={handlePrint}
                        className="text-white hover:text-gray-300 transition-colors"
                        title="Print"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </button>

                      {/* Download */}
                      <button
                        onClick={handleDownload}
                        className="text-white hover:text-gray-300 transition-colors"
                        title="Download"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </button>

                      {/* Close */}
                      <button
                        onClick={handleClose}
                        className="text-white hover:text-red-400 transition-colors"
                        title="Hide Toolbar"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Show/Hide Toolbar Button */}
                  {!showToolbar && (
                    <button
                      onClick={() => setShowToolbar(true)}
                      className="fixed bottom-6 right-6 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
                      title="Show Toolbar"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  )}

                  <TransformComponent
                    wrapperClass="w-full h-full"
                    contentClass="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={dummyPerscription}
                      alt="Ordonnance"
                      className="max-w-full max-h-full object-contain"
                      style={{ userSelect: "none" }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">Document Image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDocumentViewer;
