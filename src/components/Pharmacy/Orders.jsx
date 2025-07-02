import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderSidebar from "./Orders/OrderSidebar.jsx";
import OrderDocumentViewer from "./Orders/OrderDocumentViewer.jsx";
import OrderDetailsSidebar from "./Orders/OrderDetailsSidebar.jsx";

// Dummy order data
const dummyOrders = [
  {
    id: 1,
    patientName: "Marie Dubois",
    status: "À valider",
    statusColor: "bg-[#FEEEB8] text-[#8C8469]",
    inquiryDate: "15/06/2025 à 09:30",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Marie Dubois",
        birthDate: "12/03/1985",
        socialSecurityNumber: "1850312010002",
        phone: "0678901234",
        email: "marie.dubois@email.com",
      },
    },
  },
  {
    id: 2,
    patientName: "Pierre Lefèvre",
    status: "En préparation",
    statusColor: "bg-blue-100 text-blue-800",
    inquiryDate: "20/06/2025 à 11:15",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Pierre Lefèvre",
        birthDate: "25/07/1978",
        socialSecurityNumber: "1780725010003",
        phone: "0612345678",
        email: "pierre.lefevre@email.com",
      },
    },
  },
  {
    id: 3,
    patientName: "Sophie Martin",
    status: "Prêt à collecter",
    statusColor: "bg-green-100 text-green-800",
    inquiryDate: "25/06/2025 à 14:45",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Sophie Martin",
        birthDate: "03/09/1992",
        socialSecurityNumber: "1920903010004",
        phone: "0698765432",
        email: "sophie.martin@email.com",
      },
    },
  },
  {
    id: 4,
    patientName: "Luc Renault",
    status: "Finalisé",
    statusColor: "bg-gray-100 text-gray-800",
    inquiryDate: "26/06/2025 à 16:20",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Luc Renault",
        birthDate: "14/11/1965",
        socialSecurityNumber: "1651114010005",
        phone: "0643217890",
        email: "luc.renault@email.com",
      },
    },
  },
  {
    id: 5,
    patientName: "Claire Dupont",
    status: "Finalisé",
    statusColor: "bg-gray-100 text-gray-800",
    inquiryDate: "27/06/2025 à 10:05",
    documents: {
      prescription: "/api/placeholder/400/500",
      mutualCard: "/api/placeholder/400/500",
      vitalCard: "/api/placeholder/400/500",
    },
    details: {
      patientInfo: {
        name: "Claire Dupont",
        birthDate: "30/04/1980",
        socialSecurityNumber: "1800430010006",
        phone: "0623456789",
        email: "claire.dupont@email.com",
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
  // const [selectedOrder, setSelectedOrder] = useState(
  //   isLargeScreen ? dummyOrders[0] : null
  // );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    type: "complete",
    note: "",
  });
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (isLargeScreen && !selectedOrder) {
      setSelectedOrder(dummyOrders[0]); // Set the first order if on large screen and no order is selected
    } else if (!isLargeScreen) {
      setSelectedOrder(null); // Deselect order if on small or medium screen
    }
  }, [isLargeScreen]);

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

    return searchTerm
      ? tabFilteredOrders.filter((order) =>
          order.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : tabFilteredOrders;
  };

  const handleValidate = (issueDate, duration) => {
    if (issueDate && duration) {
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
      toast.success(
        "Ordonnance validée avec succès et passée en En préparation"
      );
    }
  };

  const handlePrepare = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: "Prêt à collecter",
              statusColor: "bg-green-100 text-green-800",
            }
          : order
      )
    );
    setSelectedOrder((prev) =>
      prev.id === selectedOrder.id
        ? {
            ...prev,
            status: "Prêt à collecter",
            statusColor: "bg-green-100 text-green-800",
          }
        : prev
    );
    setIsPrepModalOpen(false);
    setIsDeliveryModalOpen(true);
    // toast.success("Ordonnance marquée comme Prêt à collecter avec succès");
  };

  const handleDelivery = () => {
    console.log("Delivery details saved:", deliveryDetails);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              delivery: {
                type: deliveryDetails.type,
                note: deliveryDetails.note,
                date: new Date().toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
              },
            }
          : order
      )
    );
    setSelectedOrder((prev) => ({
      ...prev,
      delivery: {
        type: deliveryDetails.type,
        note: deliveryDetails.note,
        date: new Date().toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
    }));
    setIsDeliveryModalOpen(false);
    toast.success("Détails de livraison ajoutés avec succès");
  };

  const handleCancel = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: "À valider",
              statusColor: "bg-[#FEEEB8] text-[#8C8469]",
            }
          : order
      )
    );
    setSelectedOrder((prev) =>
      prev.id === selectedOrder.id
        ? {
            ...prev,
            status: "À valider",
            statusColor: "bg-[#FEEEB8] text-[#8C8469]",
          }
        : prev
    );
    toast.success("Ordonnance annulée avec succès et revenue à À valider");
  };

  const handleWithdraw = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: "Finalisé",
              statusColor: "bg-gray-100 text-gray-800",
              withdrawalCode: Math.floor(10000 + Math.random() * 90000),
              withdrawalDate: new Date().toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            }
          : order
      )
    );
    setSelectedOrder((prev) =>
      prev.id === selectedOrder.id
        ? {
            ...prev,
            status: "Finalisé",
            statusColor: "bg-gray-100 text-gray-800",
            withdrawalCode: Math.floor(10000 + Math.random() * 90000),
            withdrawalDate: new Date().toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          }
        : prev
    );
    setIsWithdrawModalOpen(false);
    toast.success("Ordonnance retirée avec succès et marquée comme Finalisé");
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-y-hidden">
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
        <div className="lg:hidden w-full flex flex-col">
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
                    ? "border-b-2 border-[#069AA2] text-[#069AA2]"
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
              isPrepModalOpen={isPrepModalOpen}
              setIsPrepModalOpen={setIsPrepModalOpen}
              handlePrepare={handlePrepare}
              isDeliveryModalOpen={isDeliveryModalOpen}
              setIsDeliveryModalOpen={setIsDeliveryModalOpen}
              handleDelivery={handleDelivery}
              deliveryDetails={deliveryDetails}
              setDeliveryDetails={setDeliveryDetails}
              isWithdrawModalOpen={isWithdrawModalOpen}
              setIsWithdrawModalOpen={setIsWithdrawModalOpen}
              handleWithdraw={handleWithdraw}
            />
          )}
        </div>
      )}
      <div className="hidden lg:flex flex-1">
        <div className=" w-[60%]">
          <OrderDocumentViewer
            selectedOrder={selectedOrder}
            activeDocumentTab={activeDocumentTab}
            setActiveDocumentTab={setActiveDocumentTab}
          />
        </div>

        <div className="w-[40%]">
          <OrderDetailsSidebar
            selectedOrder={selectedOrder}
            activeDetailsTab={activeDetailsTab}
            setActiveDetailsTab={setActiveDetailsTab}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleValidate={handleValidate}
            isPrepModalOpen={isPrepModalOpen}
            setIsPrepModalOpen={setIsPrepModalOpen}
            handlePrepare={handlePrepare}
            isDeliveryModalOpen={isDeliveryModalOpen}
            setIsDeliveryModalOpen={setIsDeliveryModalOpen}
            handleDelivery={handleDelivery}
            deliveryDetails={deliveryDetails}
            setDeliveryDetails={setDeliveryDetails}
            isWithdrawModalOpen={isWithdrawModalOpen}
            setIsWithdrawModalOpen={setIsWithdrawModalOpen}
            handleWithdraw={handleWithdraw}
          />
        </div>
      </div>

      {/* Modal for "À valider" to "En préparation" */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
          >
            <div className="pb-4 mb-4">
              <p className="flex items-center justify-center text-gray-900">
                Souhaitez-vous accepter l'ordonnance ?
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <button
                onClick={() => handleValidate("2025-06-27", "30 jours")}
                className="px-4 py-2 w-[14rem] bg-[#069AA2] hover:bg-[#05828A] text-white rounded-lg transition text-sm"
              >
                Oui
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 w-[14rem] text-gray-700 border bg-[#E9486C] border-gray-300 hover:bg-[#D1365A] rounded-lg transition text-sm"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for "En préparation" to "Prêt à collecter" */}
      {isPrepModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsPrepModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
          >
            <div className="pb-4 mb-4">
              <p className="flex items-center justify-center text-gray-900">
                Confirmez-vous que l'ordonnance est prête ?
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <button
                onClick={handlePrepare}
                className="px-4 py-2 w-[14rem] bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition text-sm"
              >
                Prête
              </button>
              <button
                onClick={() => setIsPrepModalOpen(false)}
                className="px-4 py-2 w-[14rem] text-gray-700 border bg-red-500 border-gray-300 hover:bg-red-600 rounded-lg transition text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delivery Details */}
      {isDeliveryModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsDeliveryModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
          >
            <div className="pb-4 mb-4">
              <h3 className="text-center text-gray-900 font-medium">
                Entrez les détails de la délivrance
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="complete"
                  name="deliveryType"
                  checked={deliveryDetails.type === "complete"}
                  onChange={() =>
                    setDeliveryDetails({ ...deliveryDetails, type: "complete" })
                  }
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="complete" className="text-sm text-gray-700">
                  Délivrance complète
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="partial"
                  name="deliveryType"
                  checked={deliveryDetails.type === "partial"}
                  onChange={() =>
                    setDeliveryDetails({ ...deliveryDetails, type: "partial" })
                  }
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="partial" className="text-sm text-gray-700">
                  Délivrance partielle
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Note :
                </label>
                <textarea
                  value={deliveryDetails.note}
                  onChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      note: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  rows="3"
                  placeholder="Entrez une note..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDelivery}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for "Retirer" Confirmation */}
      {isWithdrawModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsWithdrawModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
          >
            <div className="pb-4 mb-4 text-center">
              <p className="text-gray-900 font-medium">
                Voulez-vous vraiment retirer cette ordonnance ?
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <button
                onClick={handleWithdraw}
                className="px-4 py-2 w-[14rem] bg-[#069AA2] hover:bg-[#05828A] text-white rounded-lg transition text-sm"
              >
                Oui
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-4 py-2 w-[14rem] text-gray-700 border bg-[#E9486C] border-gray-300 hover:bg-[#D1365A] rounded-lg transition text-sm"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
