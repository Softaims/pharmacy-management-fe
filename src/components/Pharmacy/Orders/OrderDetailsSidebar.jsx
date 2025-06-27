import React from "react";

const OrderDetailsSidebar = ({
  selectedOrder,
  activeDetailsTab,
  setActiveDetailsTab,
  isModalOpen,
  setIsModalOpen,
  handleValidate,
}) => {
  const detailsTabs = [
    { id: "details", label: "Détails ordonnance" },
    { id: "history", label: "Historique" },
  ];

  return (
    <div className="w-150 bg-white flex flex-col">
      <div className="border-b border-gray-200">
        <nav className="flex px-4 pt-4">
          {detailsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailsTab(tab.id)}
              className={`py-2 px-4 font-medium text-sm rounded-t-lg transition-colors ${
                activeDetailsTab === tab.id
                  ? "bg-yellow-400 text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
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
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-900">
                  Statut:
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedOrder?.statusColor}`}
                >
                  {selectedOrder?.status}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Id reçu:
                </label>
                <p className="text-sm text-gray-900">{selectedOrder?.id}789</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Numéro de commande:
                </label>
                <p className="text-sm text-gray-900">{selectedOrder?.id}4567</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Patient:
                </label>
                <p className="text-sm text-gray-900">
                  {selectedOrder?.details.patientInfo.name}
                </p>
                <p className="text-xs text-gray-500">
                  Date de naissance:{" "}
                  {selectedOrder?.details.patientInfo.birthDate}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Numéro de sécurité social:
                </label>
                <p className="text-sm text-gray-900">
                  {selectedOrder?.details.patientInfo.socialSecurityNumber}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  📞 Téléphone:
                </label>
                <p className="text-sm text-gray-900">
                  {selectedOrder?.details.patientInfo.phone}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  ✉️ Email:
                </label>
                <p className="text-sm text-gray-900">
                  {selectedOrder?.details.patientInfo.email}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Ordonnance à valider
              </h3>
              <div className="flex space-x-3">
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center">
                <span className="bg-gray-200 text-gray-600 px-3 py-2 rounded-full text-sm">
                  ND
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Bouton à activer lorsque qu'il y a 2 premières ordonnances
              </p>
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
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Envoyer un message"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="p-2 text-gray-400 hover:text-gray-600">
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSidebar;
