import React from "react";
import PdfViewer from "./PdfViewer"; // Adjust the import path as needed

const OrderDocumentViewer = ({
  selectedOrder,
  activeDocumentTab,
  setActiveDocumentTab,
}) => {
  // Document tab configuration for scalability
  const documentTabs = [
    { id: "prescription", label: "Ordonnance" },
    { id: "mutualCard", label: "Carte Vitale" },
    { id: "vitalCard", label: "Mutuelle" },
    { id: "ameCard", label: "AME" },
  ];

  // Get the URL for the active document tab or Social Security Number
  const getDocumentUrl = () => {
    const activeTab = documentTabs.find((tab) => tab.id === activeDocumentTab);
    if (!activeTab || !selectedOrder) return null;

    let url = null;
    const isSelf = selectedOrder.orderFor === "self";
    console.log("🚀 ~ getDocumentUrl ~ isSelf:", isSelf);

    const source = isSelf ? selectedOrder.patient : selectedOrder.familyMember;
    console.log("🚀 ~ getDocumentUrl ~ source:", source);

    switch (activeTab.id) {
      case "prescription":
        url = selectedOrder.prescriptionUrl;
        break;
      case "mutualCard":
        url = source?.healthCoverages?.carteVitale?.socialSecurityNumber;
        break;
      case "vitalCard":
        url = source?.healthCoverages?.privateCoverage?.mediaUrl;
        break;
      case "ameCard":
        url = source?.healthCoverages?.ameCoverage?.mediaUrl;
        break;
      default:
        break;
    }

    console.log("🚀 ~ getDocumentUrl ~ url:", url);
    return url ? url : null;
  };

  const documentUrl = getDocumentUrl();

  return (
    <div className="flex flex-col h-full">
      {/* Document Tabs */}
      <div className="px-2 pt-2">
        <nav className="flex space-x-0 bg-white rounded-lg overflow-hidden border border-gray-300">
          {documentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocumentTab(tab.id)}
              className={`py-2 px-6 text-gray-700 font-medium text-[12px] h-[52px] transition-colors flex-1 ${
                activeDocumentTab === tab.id
                  ? "bg-gray-200 text-gray-900 flex-grow"
                  : "bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto p-6">
        {activeDocumentTab === "mutualCard" ? (
          // Show Social Security Number for Carte Vitale tab
          documentUrl ? (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-gray-500">
                Social Security Number: {documentUrl}
              </p>
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-gray-500">
                No Social Security Number available
              </p>
            </div>
          )
        ) : documentUrl ? (
          // Show PDF for other tabs
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
