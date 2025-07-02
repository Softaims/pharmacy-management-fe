import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCircle,
  FaRegCircle,
} from "react-icons/fa";

const OrderDetailsSidebar = ({
  selectedOrder,
  activeDetailsTab,
  setActiveDetailsTab,
  setIsModalOpen,
  setIsPrepModalOpen,
  setIsWithdrawModalOpen,
}) => {
  console.log("🚀 ~ selectedOrder:", selectedOrder);

  const detailsTabs = [
    { id: "details", label: "Détails ordonnance" },
    { id: "history", label: "Historique" },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "À valider":
        return "bg-[#FEEEB8] text-black border-2 border-[#FAC710]";
      case "En préparation":
        return "bg-[#E7D5AA] text-black border-2 border-[#FAA010]";
      case "Prêt à collecter":
        return "bg-[#B8F0F2] text-black border-2 border-[#12CDD4]";
      case "Finalisé":
        return "bg-[#DEF1CB] text-black border-2 border-[#8FD14F]";
      default:
        return "bg-gray-200 text-black border-2 border-gray-400";
    }
  };

  const statusOrder = [
    "À valider",
    "En préparation",
    "Prêt à collecter",
    "Finalisé",
  ];
  const normalizedStatus =
    selectedOrder?.status === "PENDING" ? "À valider" : selectedOrder?.status;
  const filledCount = selectedOrder
    ? statusOrder.indexOf(normalizedStatus) + 1
    : 0;
  const statusIcons = Array(4)
    .fill()
    .map((_, index) =>
      index < filledCount ? (
        <FaCircle key={index} className="text-black w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <FaRegCircle
          key={index}
          className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5"
        />
      )
    );

  const isFamilyOrder = selectedOrder?.orderFor === "familymember";
  const person = isFamilyOrder
    ? selectedOrder?.familyMember
    : selectedOrder?.patient;

  return (
    <div className="bg-white flex flex-col overflow-y-auto h-full">
      <div className="border-b border-gray-200">
        <nav className="flex flex-row justify-between gap-2 px-4 pt-4 overflow-x-auto">
          {detailsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailsTab(tab.id)}
              className={`py-2 font-medium text-base sm:text-lg rounded-t-lg transition-colors relative ${
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

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {activeDetailsTab === "details" ? (
          <div>
            <div className="mb-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="mt-2">
                    <span className="text-gray-900 font-semibold text-base sm:text-lg">
                      {isFamilyOrder ? "Membre de la famille :" : "Patient :"}
                    </span>
                    <ul className="mt-2 space-y-2 text-sm sm:text-base text-gray-600 border-b-[1.5px] pb-4 border-gray-200">
                      <li className="text-[#069AA2] truncate text-sm">
                        {`${person?.firstName || "—"} ${
                          person?.lastName || ""
                        }`.trim()}
                      </li>
                      <li className="text-sm">
                        {person?.dateOfBirth
                          ? new Date(person.dateOfBirth).toLocaleDateString(
                              "fr-FR"
                            )
                          : "—"}
                      </li>

                      <li className="text-sm">{person?.phoneNumber || "—"}</li>
                      <li className="text-sm">{person?.email || "—"}</li>
                      <li className="text-sm">{person?.address || "—"}</li>
                      {isFamilyOrder && person?.relationship && (
                        <li className="italic text-gray-500 text-sm">
                          Lien : {person.relationship}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 border-b-[1.5px] pb-4 border-gray-200">
                    <div className="space-y-2 mt-2">
                      <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1 text-base">
                        <span className="font-bold text-black text-sm">
                          Livraison :
                        </span>
                        <span className="text-[#E9486C] font-normal text-sm">
                          {selectedOrder?.orderType === "delivery"
                            ? "Livraison à domicile"
                            : "Retrait en pharmacie"}
                        </span>
                      </div>
                      <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1 text-base">
                        <span className="font-bold text-black">Id ordo :</span>
                        <span className="text-black font-normal">
                          {selectedOrder?.id || "1234567890"}
                        </span>
                      </div>
                      <div className="flex flex-row flex-wrap text-sm items-baseline gap-x-2 gap-y-1 text-base">
                        <span className="font-bold text-black">
                          Numéro de commande :
                        </span>
                        <span className="text-black font-normal">
                          {selectedOrder?.orderNumber || "00000000"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between mb-4 gap-4 border-b-[1.5px] pb-4 border-gray-200">
                    <span className="text-sm font-bold text-gray-900">
                      Statut
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center justify-center w-32 py-1.5 rounded-md text-sm font-medium ${getStatusClass(
                          normalizedStatus
                        )}`}
                      >
                        {normalizedStatus || "—"}
                      </span>
                    </div>
                    <div className="flex gap-3">{statusIcons}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {normalizedStatus !== "Finalisé" && (
                <h3 className="text-base sm:text-md font-medium text-gray-900 mb-4">
                  Ordonnance à
                  {normalizedStatus === "En préparation"
                    ? " préparer"
                    : normalizedStatus === "Prêt à collecter"
                    ? " retirer"
                    : " valider"}
                </h3>
              )}

              {normalizedStatus === "À valider" && (
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    className="w-full sm:w-auto flex-1 bg-red-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-600 transition-colors"
                    onClick={() => console.log("Order refused")}
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-teal-700 transition-colors"
                  >
                    Valider
                  </button>
                </div>
              )}

              {normalizedStatus === "En préparation" && (
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    onClick={() => console.log("Order canceled directly")}
                    className="w-full sm:w-auto flex-1 bg-red-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-600 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setIsPrepModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-teal-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-teal-600 transition-colors"
                  >
                    Prête
                  </button>
                </div>
              )}

              {normalizedStatus === "Prêt à collecter" && (
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    onClick={() => console.log("Order canceled directly")}
                    className="w-full sm:w-auto flex-1 bg-red-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-600 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-teal-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-teal-600 transition-colors"
                  >
                    Retirer
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-base sm:text-lg">
            <p>
              Historique des commandes pour l'ordonnance{" "}
              {selectedOrder?.id || "—"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsSidebar;
