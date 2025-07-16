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
