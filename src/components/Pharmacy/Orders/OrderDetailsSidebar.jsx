import React, { useState, useEffect } from "react";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import apiService from "../../../api/apiService";

const OrderDetailsSidebar = ({
  selectedOrder,
  activeDetailsTab,
  setActiveDetailsTab,
  setIsModalOpen,
  setIsPrepModalOpen,
  setIsWithdrawModalOpen,
  setIsRefuseModalOpen,
  handleRefuse,
  handleCancel,
}) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditHistoryModalOpen, setIsEditHistoryModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);
  const [editHistoryDetails, setEditHistoryDetails] = useState({
    completionStatus: "FULLY_COMPLETED",
    pharmacyNote: "",
  });

  const detailsTabs = [
    { id: "details", label: "Détails ordonnance" },
    { id: "history", label: "Historique" },
  ];

  useEffect(() => {
    if (activeDetailsTab === "history" && selectedOrder?.id) {
      setIsLoading(true);
      apiService
        .getOrderHistory(selectedOrder.id)
        .then((response) => {
          setOrderHistory(response.data || []);
        })
        .catch((error) => {
          console.error("Error fetching order history:", error);
          setOrderHistory([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeDetailsTab, selectedOrder?.id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "À valider":
        return "bg-[#FEEEB8] text-black border-2 border-[#FAC710]";
      case "En préparation":
        return "bg-[#FEE3B8] text-black border-2 border-[#FAA010]";
      case "Prêt à collecter":
        return "bg-[#B8F0F2] text-black border-2 border-[#12CDD4]";
      case "Prêt à livrer":
        return "bg-[#DEDAFF] text-black border-2 border-[#6631D7]";
      case "Finalisé":
        return "bg-[#DEF1CB] text-black border-2 border-[#8FD14F]";
      case "Annulée":
        return "bg-[#EBB6B6] text-black border-2 border-[#BD0A0A]";
      default:
        return "bg-gray-200 text-black border-2 border-gray-400";
    }
  };

  const statusOrder = [
    "À valider",
    "Refusé",
    "En préparation",
    "Prêt à collecter",
    "Prêt àLivrer",
    "Finalisé",
  ];

  const normalizedStatus =
    selectedOrder?.status === "PENDING" ? "À valider" : selectedOrder?.status;

  const filledCount =
    normalizedStatus === "Refusé" ||
    normalizedStatus === "En préparation" ||
    normalizedStatus === "Annulée"
      ? 2
      : normalizedStatus === "Prêt à collecter" ||
        normalizedStatus === "Prêt à livrer"
      ? 3
      : normalizedStatus === "Finalisé"
      ? 4
      : statusOrder.indexOf(normalizedStatus) + 1;
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

  const handleOpenEditHistoryModal = (entry) => {
    setSelectedHistoryEntry(entry);
    setEditHistoryDetails({
      completionStatus: entry.completionStatus,
      pharmacyNote: entry.pharmacyNote || "",
    });
    setIsEditHistoryModalOpen(true);
  };

  const handleCloseEditHistoryModal = () => {
    setIsEditHistoryModalOpen(false);
    setEditHistoryDetails({
      completionStatus: "FULLY_COMPLETED",
      pharmacyNote: "",
    });
  };

  const handleUpdateHistory = async () => {
    if (!selectedHistoryEntry || !editHistoryDetails.pharmacyNote.trim()) {
      toast.error("Veuillez entrer une note avant de soumettre");
      return;
    }
    setIsButtonLoading(true);
    try {
      const response = await apiService.updateOrderHistory(
        selectedHistoryEntry.id,
        editHistoryDetails
      );
      // Merge the updated fields with the existing entry
      setOrderHistory((prevHistory) =>
        prevHistory.map((entry) =>
          entry.id === selectedHistoryEntry.id
            ? { ...entry, ...editHistoryDetails }
            : entry
        )
      );
      setIsEditHistoryModalOpen(false);
      toast.success("Historique mis à jour avec succès");
    } catch (error) {
      toast.error(error.message || "Échec de la mise à jour de l'historique");
    } finally {
      setIsButtonLoading(false);
      setEditHistoryDetails({
        completionStatus: "FULLY_COMPLETED",
        pharmacyNote: "",
      });
    }
  };

  return (
    <div className="bg-white flex flex-col overflow-y-auto overflow-x-hidden h-full">
      <div className="mx-2 pt-2">
        <nav className="flex space-x-0 bg-white rounded-lg overflow-hidden border border-gray-300">
          {detailsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailsTab(tab.id)}
              className={`py-2 px-6 text-gray-700 font-medium text-[12px] h-[52px] transition-colors flex-1 ${
                activeDetailsTab === tab.id
                  ? "bg-gray-200 text-gray-900 flex-grow"
                  : "bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800"
              }`}
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
                          person?.lastName
                            ? person.lastName.charAt(0).toUpperCase() +
                              person.lastName.slice(1)
                            : ""
                        }`.trim()}
                      </li>
                      <li className="text-sm">
                        {person?.dateOfBirth
                          ? new Date(person.dateOfBirth).toLocaleDateString(
                              "fr-FR"
                            )
                          : "—"}
                      </li>
                      <li className="text-sm">
                        {selectedOrder?.patient?.phoneNumber || "—"}
                      </li>
                      {person?.email && (
                        <li className="text-sm">{person?.email || "—"}</li>
                      )}
                      <li className="text-sm">{person?.address || "—"}</li>
                      {/* {isFamilyOrder && person?.relationship && (
                        <li className="italic text-gray-500 text-sm">
                          Lien : {person.relationship}
                        </li>
                      )} */}
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
                            : selectedOrder?.orderType === "pickup"
                            ? "Retrait en pharmacie"
                            : "Non spécifié"}
                        </span>
                      </div>
                      <div className="flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1 text-base">
                        <span className="font-bold text-black">Id ordo :</span>
                        <span className="text-black font-normal">
                          {selectedOrder?.id
                            ? selectedOrder.id.slice(0, 6)
                            : "__"}
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
                        className={`flex items-center justify-center w-32 py-1.5 rounded-md text-sm font-normal ${getStatusClass(
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
              {normalizedStatus !== "Finalisé" &&
                normalizedStatus !== "Refusé" &&
                normalizedStatus !== "Annulée" && (
                  <h3 className="text-base sm:text-md font-medium text-gray-900 mb-4">
                    Ordonnance à
                    {normalizedStatus === "En préparation"
                      ? " préparer"
                      : normalizedStatus === "Prêt à collecter"
                      ? " délivrer"
                      : normalizedStatus === "Prêt à livrer"
                      ? " livrer"
                      : " valider"}
                  </h3>
                )}

              {normalizedStatus === "À valider" && (
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    className="w-full sm:w-auto flex-1 bg-red-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-600 transition-colors"
                    onClick={handleRefuse}
                    // onClick={() => setIsRefuseModalOpen(true)}
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
                    // onClick={handleCancel}
                    onClick={() => setIsRefuseModalOpen(true)}
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

              {(normalizedStatus === "Prêt à collecter" ||
                normalizedStatus === "Prêt à livrer") && (
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    // onClick={handleCancel}
                    onClick={() => setIsRefuseModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-red-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-red-600 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="w-full sm:w-auto flex-1 bg-teal-500 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-teal-600 transition-colors"
                  >
                    {normalizedStatus === "Prêt à livrer"
                      ? "Livrer"
                      : "Délivrée"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-transparent py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Historique de délivrance
            </h3>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : orderHistory.length === 0 ? (
              <p className="text-gray-600 text-sm">
                Aucun historique disponible
              </p>
            ) : (
              <div className="space-y-6">
                {orderHistory.map((entry, index) => (
                  <div key={index}>
                    <div className="flex items-center mb-4">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="px-4 text-sm text-gray-600 font-medium">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleDateString(
                              "fr-FR"
                            )
                          : "—"}
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <div className="bg-transparent rounded-lg py-4 px-2 border border-gray-200">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-normal ${
                              entry.completionStatus === "FULLY_COMPLETED"
                                ? "bg-[#D1E8DA] text-[#606161]"
                                : entry.completionStatus ===
                                  "PARTIALLY_COMPLETED"
                                ? "bg-[#FEECCF] text-[#AEA596]"
                                : ""
                            }`}
                          >
                            {entry.completionStatus === "FULLY_COMPLETED"
                              ? "Délivrance complète"
                              : entry.completionStatus === "PARTIALLY_COMPLETED"
                              ? "Délivrance partielle"
                              : entry.completionStatus}
                          </span>

                          <p className="text-sm text-gray-600 mt-3 mb-2">
                            <span className="font-medium">Note :</span>
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            {entry.pharmacyNote}
                          </p>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              <span>Ajouté par </span>
                              <span className={"text-[#63AAAE]"}>
                                {entry?.pharmacy?.name}
                              </span>
                            </p>
                            {entry.isItsOwnPharmacy && (
                              <button
                                onClick={() =>
                                  handleOpenEditHistoryModal(entry)
                                }
                                className="bg-[#FBDAE2] text-[#5A5A5A] px-3 py-1 rounded-full text-sm font-normal hover:bg-pink-200 transition-colors ml-4 border border-pink-200"
                              >
                                Modifier
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Editing History Entry */}
      {isEditHistoryModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseEditHistoryModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
          >
            <div className="pb-4 mb-4">
              <h3 className="text-center text-gray-900 font-medium">
                Modifier les détails de l'historique
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="complete"
                  name="completionStatus"
                  checked={
                    editHistoryDetails.completionStatus === "FULLY_COMPLETED"
                  }
                  onChange={() =>
                    setEditHistoryDetails({
                      ...editHistoryDetails,
                      completionStatus: "FULLY_COMPLETED",
                    })
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
                  name="completionStatus"
                  checked={
                    editHistoryDetails.completionStatus ===
                    "PARTIALLY_COMPLETED"
                  }
                  onChange={() =>
                    setEditHistoryDetails({
                      ...editHistoryDetails,
                      completionStatus: "PARTIALLY_COMPLETED",
                    })
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
                  value={editHistoryDetails.pharmacyNote}
                  onChange={(e) =>
                    setEditHistoryDetails({
                      ...editHistoryDetails,
                      pharmacyNote: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-400 text-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  rows="3"
                  placeholder="Entrez une note..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdateHistory}
                disabled={
                  isButtonLoading || !editHistoryDetails.pharmacyNote.trim()
                }
                className={`px-4 py-2 ${
                  isButtonLoading || !editHistoryDetails.pharmacyNote.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                } text-white rounded-lg transition text-sm`}
              >
                {isButtonLoading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsSidebar;
