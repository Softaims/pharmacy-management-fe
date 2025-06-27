import React, { useState } from "react";
import OrderSidebar from "./Orders/OrderSidebar.jsx";
import OrderDocumentViewer from "./Orders/OrderDocumentViewer.jsx";
import OrderDetailsSidebar from "./Orders/OrderDetailsSidebar.jsx";

// Dummy order data with updated statuses
const dummyOrders = [
  {
    id: 1,
    patientName: "Jean Pascal DURANT",
    status: "À valider",
    statusColor: "bg-yellow-100 text-yellow-800",
    inquiryDate: "28/11/2024 à 14:00",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Jean Pascal DURANT",
        birthDate: "01/01/1990",
        socialSecurityNumber: "1900010010001",
        phone: "0123456789",
        email: "jeanpascal.durant@gmail.com",
      },
    },
  },
  {
    id: 2,
    patientName: "Jean Pascal DURANT updated",
    status: "En préparation",
    statusColor: "bg-blue-100 text-blue-800",
    inquiryDate: "28/11/2024 à 14:00",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Jean Pascal DURANT",
        birthDate: "01/01/1990",
        socialSecurityNumber: "1900010010001",
        phone: "0123456789",
        email: "jeanpascal.durant@gmail.com",
      },
    },
  },
  {
    id: 3,
    patientName: "Jean Pascal DURANT",
    status: "Prêt à collecter",
    statusColor: "bg-green-100 text-green-800",
    inquiryDate: "28/11/2024 à 14:00",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Jean Pascal DURANT",
        birthDate: "01/01/1990",
        socialSecurityNumber: "1900010010001",
        phone: "0123456789",
        email: "jeanpascal.durant@gmail.com",
      },
    },
  },
  {
    id: 4,
    patientName: "Jean Pascal DURANT",
    status: "Finalisé",
    statusColor: "bg-gray-100 text-gray-800",
    inquiryDate: "28/11/2024 à 14:00",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Jean Pascal DURANT",
        birthDate: "01/01/1990",
        socialSecurityNumber: "1900010010001",
        phone: "0123456789",
        email: "jeanpascal.durant@gmail.com",
      },
    },
  },
  {
    id: 5,
    patientName: "Jean Pascal DURANT",
    status: "Finalisé",
    statusColor: "bg-gray-100 text-gray-800",
    inquiryDate: "28/11/2024 à 14:00",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Jean Pascal DURANT",
        birthDate: "01/01/1990",
        socialSecurityNumber: "1900010010001",
        phone: "0123456789",
        email: "jeanpascal.durant@gmail.com",
      },
    },
  },
];

const Orders = () => {
  const [activeOrderTab, setActiveOrderTab] = useState("all");
  const [activeDocumentTab, setActiveDocumentTab] = useState("prescription");
  const [activeDetailsTab, setActiveDetailsTab] = useState("details");
  const [orders, setOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusCircles = (status) => {
    const statusOrder = [
      "À valider",
      "En préparation",
      "Prêt à collecter",
      "Finalisé",
    ];
    const filledCount = statusOrder.indexOf(status) + 1;
    return Array(4)
      .fill()
      .map((_, index) => (index < filledCount ? "bg-black" : "bg-gray-300"));
  };

  const getFilteredOrders = () => {
    const tabFilteredOrders = (() => {
      switch (activeOrderTab) {
        case "preparation":
          return orders.filter(
            (order) =>
              order.status === "À valider" ||
              order.status === "En préparation" ||
              order.status === "Prêt à collecter"
          );
        case "past":
          return orders.filter((order) => order.status === "Finalisé");
        default:
          return orders;
      }
    })();

    if (!searchTerm) return tabFilteredOrders;

    return tabFilteredOrders.filter((order) =>
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleValidate = (socialSecurityNumber, insuredName) => {
    if (socialSecurityNumber && insuredName) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: "En préparation",
                statusColor: "bg-blue-100 text-blue-800",
              }
            : order
        )
      );
      setSelectedOrder((prev) =>
        prev.id === selectedOrder.id
          ? {
              ...prev,
              status: "En préparation",
              statusColor: "bg-blue-100 text-blue-800",
            }
          : prev
      );
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <OrderSidebar
        activeOrderTab={activeOrderTab}
        setActiveOrderTab={setActiveOrderTab}
        orders={orders}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        getStatusCircles={getStatusCircles}
        getFilteredOrders={getFilteredOrders}
      />
      {selectedOrder && (
        <div className="md:hidden w-full flex flex-col">
          <div className="flex border-b border-gray-200">
            {[
              { id: "documents", label: "Documents" },
              { id: "details", label: "Détails" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMobileTab(tab.id)}
                className={`flex-1 py-2 px-4 font-medium text-sm transition-colors ${
                  activeMobileTab === tab.id
                    ? "border-b-2 border-red-500 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-2 text-gray-500 hover:text-gray-700"
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
          {activeMobileTab === "documents" && (
            <OrderDocumentViewer
              selectedOrder={selectedOrder}
              activeDocumentTab={activeDocumentTab}
              setActiveDocumentTab={setActiveDocumentTab}
            />
          )}
          {activeMobileTab === "details" && (
            <OrderDetailsSidebar
              selectedOrder={selectedOrder}
              activeDetailsTab={activeDetailsTab}
              setActiveDetailsTab={setActiveDetailsTab}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleValidate={handleValidate}
            />
          )}
        </div>
      )}
      <div className="hidden md:flex flex-1">
        <OrderDocumentViewer
          selectedOrder={selectedOrder}
          activeDocumentTab={activeDocumentTab}
          setActiveDocumentTab={setActiveDocumentTab}
        />
        <OrderDetailsSidebar
          selectedOrder={selectedOrder}
          activeDetailsTab={activeDetailsTab}
          setActiveDetailsTab={setActiveDetailsTab}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleValidate={handleValidate}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Pour valider l'ordonnance, merci de :
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Date d'émission"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Durée de l'ordonnance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={() => handleValidate("2025-06-27", "30 jours")}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
