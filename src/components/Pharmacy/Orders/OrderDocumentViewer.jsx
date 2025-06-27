import React from "react";

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

  return (
    <div className="md:w-3/5 bg-white border-r border-gray-200 flex flex-col">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 pt-4">
          {documentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocumentTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeDocumentTab === tab.id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
          <div className="p-4 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {
                  documentTabs.find((tab) => tab.id === activeDocumentTab)
                    ?.label
                }
              </h3>
              <p className="text-sm text-gray-500">
                Date de rédaction: {selectedOrder?.inquiryDate}
              </p>
            </div>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Document Image</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Déclarer l'ordonnance finie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDocumentViewer;
