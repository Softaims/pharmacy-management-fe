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

  // Map tab IDs to their respective PDF URLs from selectedOrder
  const getDocumentUrl = (tabId) => {
    switch (tabId) {
      case "prescription":
        return selectedOrder?.prescriptionUrl || null;
      case "mutualCard":
        return selectedOrder?.mutualCardUrl || null;
      case "vitalCard":
        return selectedOrder?.vitalCardUrl || null;
      default:
        return null;
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
        {getDocumentUrl(activeDocumentTab) ? (
          <PdfViewer />
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
