import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const OrderDetailsSidebar = ({
  selectedOrder,
  activeDetailsTab,
  setActiveDetailsTab,
  setIsModalOpen,
}) => {
  console.log("🚀 ~ selectedOrder:,,,,,,,,,,,,,", selectedOrder);
  const detailsTabs = [
    { id: "details", label: "Détails ordonnance" },
    { id: "history", label: "Historique" },
  ];

  return (
    <div className="w-150 bg-white flex flex-col md:w-150 w-full">
      <div className="border-b border-gray-200">
        <nav className="flex gap-3 px-4 pt-4 relative">
          {detailsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailsTab(tab.id)}
              className={`py-2 px-4 font-medium text-sm rounded-t-lg transition-colors relative ${
                activeDetailsTab === tab.id
                  ? "text-[#069AA2] border-b-2 border-[#069AA2] bg-transparent"
                  : "text-gray-500 hover:text-gray-700 bg-transparent border-b-2 border-transparent"
              }`}
              style={{ background: "none" }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeDetailsTab === "details" ? (
          <div>
            <div className="mb-6">
              <div className="flex  tems-center justify-between mb-4 gap-2">
                <span className="text-sm font-medium text-gray-900">
                  Statut:
                </span>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedOrder?.statusColor}`}
                >
                  {selectedOrder?.status}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex  sm:flex-row sm:items-center text-xs text-gray-900 font-medium">
                    <span className="w-36 text-gray-500 font-medium">
                      Id ordo :
                    </span>
                    <span className="ml-2 text-black font-normal">
                      {selectedOrder?.id || "—"}
                    </span>
                  </div>
                  <div className="flex  sm:flex-row sm:items-center text-xs text-gray-900 font-medium">
                    <span className="w-36 text-gray-500 font-medium">
                      Numéro de commande :
                    </span>
                    <span className="ml-2 text-black font-normal">
                      {selectedOrder?.orderNumber || "00000000"}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-900 font-semibold text-sm">
                      Patient :
                    </span>
                    <ul className="ml-4 mt-1 space-y-1 text-xs text-gray-900 list-disc">
                      <li>
                        {selectedOrder?.details?.patientInfo?.name || "—"}
                      </li>
                      <li>
                        <span className="font-bold">Date de naissance</span> :{" "}
                        {selectedOrder?.details?.patientInfo?.birthDate || "—"}
                      </li>
                      <li>
                        <span className="font-bold">
                          Numéro de sécurité social
                        </span>{" "}
                        :{" "}
                        {selectedOrder?.details?.patientInfo
                          ?.socialSecurityNumber || "—"}
                      </li>
                      <li className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-500 text-xs" />
                        <span>
                          {selectedOrder?.details?.patientInfo?.address ||
                            "33 avenue victor hugo, 75006 Paris"}
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        <FaPhoneAlt className="text-gray-500 text-xs" />
                        <span>
                          {selectedOrder?.details?.patientInfo?.phone ||
                            "0600000000"}
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        <FaEnvelope className="text-gray-500 text-xs" />
                        <span>
                          {selectedOrder?.details?.patientInfo?.email ||
                            "jeanpascaldurant@gmail.com"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Ordonnance à valider
              </h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:space-x-3">
                <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  Refuser
                </button>
                {selectedOrder?.status === "À valider" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Valider
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>
              Historique des commandes pour l'ordonnance {selectedOrder?.id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsSidebar;
