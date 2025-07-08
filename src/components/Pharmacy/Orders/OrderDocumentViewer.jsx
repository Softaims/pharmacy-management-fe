import React from "react";
import PdfViewer from "./PdfViewer"; // Adjust the import path as needed

const OrderDocumentViewer = ({
  selectedOrder,
  activeDocumentTab,
  setActiveDocumentTab,
}) => {
  // Document tab configuration for scalability
  const documentTabs = [
    { id: "prescription", label: "Ordonnance", urlKey: "prescriptionUrl" },
    { id: "mutualCard", label: "Carte Vitale", urlKey: "mutualCardUrl" },
    { id: "vitalCard", label: "Mutuelle", urlKey: "vitalCardUrl" },
  ];

  // Get the URL for the active document tab
  const getDocumentUrl = () => {
    const activeTab = documentTabs.find((tab) => tab.id === activeDocumentTab);
    return activeTab && selectedOrder?.[activeTab.urlKey]
      ? selectedOrder[activeTab.urlKey]
      : null;
  };

  const documentUrl = getDocumentUrl();

  return (
    <div className="flex flex-col h-full">
      {/* Document Tabs */}
      <div className="border-b border-gray-200">
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

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto p-6">
        {documentUrl ? (
          <PdfViewer file={documentUrl} />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">No document available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDocumentViewer;
