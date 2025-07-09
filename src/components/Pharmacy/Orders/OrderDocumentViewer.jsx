import React, { useState } from "react";
import PdfViewer from "./PdfViewer"; // Adjust the import path as needed

const OrderDocumentViewer = ({
  selectedOrder,
  activeDocumentTab,
  setActiveDocumentTab,
}) => {
  const documentTabs = [
    { id: "prescription", label: "Ordonnance" },
    { id: "mutualCard", label: "Carte vitale" },
    { id: "vitalCard", label: "Mutuelle" },
  ];

  // Function to get document URL, with a fallback to static URL
  const getDocumentUrl = (tabId) => {
    if (!selectedOrder)
      return "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
    switch (tabId) {
      case "prescription":
        return "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
      case "mutualCard":
        return (
          selectedOrder.mutualCardUrl ||
          "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
        );
      case "vitalCard":
        return (
          selectedOrder.vitalCardUrl ||
          "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
        );
      default:
        return "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
    }
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
        <PdfViewer fileUrl={getDocumentUrl(activeDocumentTab)} />
      </div>
    </div>
  );
};

export default OrderDocumentViewer;
