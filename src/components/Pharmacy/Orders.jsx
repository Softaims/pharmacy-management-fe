import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import OrderSidebar from "./Orders/OrderSidebar.jsx";
import OrderDocumentViewer from "./Orders/OrderDocumentViewer.jsx";
import OrderDetailsSidebar from "./Orders/OrderDetailsSidebar.jsx";
import apiService from "../../api/apiService.js";
import { pdfjs } from "react-pdf";
import attentionLogo from "../../assets/attention.png";
import { FaTimes } from "react-icons/fa"; // Import FaTimes (cross icon) from react-icons
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Orders = React.forwardRef((props, ref) => {
  const [activeOrderTab, setActiveOrderTab] = useState("all");
  const [activeDocumentTab, setActiveDocumentTab] = useState("prescription");
  const [activeDetailsTab, setActiveDetailsTab] = useState("details");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Add ref to prevent duplicate API calls
  const isLoadingRef = useRef(false);
  const lastLoadedPageRef = useRef(0);

  const [deliveryDetails, setDeliveryDetails] = useState({
    type: "complete",
    note: "",
  });

  // Add debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modified fetchOrders function to accept search parameter
  const fetchOrders = async (page = 1, search = "") => {
    if (isLoadingRef.current) return;

    setIsLoading(page === 1);
    isLoadingRef.current = true;

    try {
      // Pass search parameter to API
      const response = await apiService.getOrders(page, ITEMS_PER_PAGE, search);
      console.log("🚀 ~ fetchOrders ~ response:", response.data.orders[0]);

      if (page === 1) {
        // Reset orders for new search or initial load
        setOrders(response.data.orders);
        setCurrentPage(1);
        lastLoadedPageRef.current = 1;

        // Auto-select first order on large screens
        if (window.innerWidth >= 1024) {
          setSelectedOrder(response?.data?.orders[0]);
        } else {
          setSelectedOrder(null);
        }
      } else {
        // Append orders for pagination
        setOrders((prevOrders) => {
          const existingIds = new Set(prevOrders.map((order) => order.id));
          const newOrders = response.data.orders.filter(
            (order) => !existingIds.has(order.id)
          );
          return [...prevOrders, ...newOrders];
        });
        setCurrentPage(page);
        lastLoadedPageRef.current = page;
      }

      setHasMore(response.data.orders.length === ITEMS_PER_PAGE);
    } catch (err) {
      toast.error("Erreur lors de la récupération des ordonnances");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };
  // Expose fetchOrders to the parent component (PharmacyDashboard)
  useImperativeHandle(ref, () => ({
    fetchOrders,
  }));
  // Effect for initial load
  useEffect(() => {
    fetchOrders(1, "");
  }, []);

  // Effect for search - triggers when debouncedSearchTerm changes
  useEffect(() => {
    // Reset pagination and fetch with search term
    setCurrentPage(1);
    lastLoadedPageRef.current = 0;
    fetchOrders(1, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Modified loadMoreOrders function
  const loadMoreOrders = async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingMore || !hasMore || isLoadingRef.current) return;

    const nextPage = currentPage + 1;

    // Prevent loading the same page twice
    if (nextPage <= lastLoadedPageRef.current) return;

    setIsLoadingMore(true);
    isLoadingRef.current = true;

    try {
      // Use debouncedSearchTerm for consistency
      const response = await apiService.getOrders(
        nextPage,
        ITEMS_PER_PAGE,
        debouncedSearchTerm
      );

      if (response.data.orders.length > 0) {
        // Use Set to prevent duplicate orders based on ID
        setOrders((prevOrders) => {
          const existingIds = new Set(prevOrders.map((order) => order.id));
          const newOrders = response.data.orders.filter(
            (order) => !existingIds.has(order.id)
          );
          return [...prevOrders, ...newOrders];
        });

        setCurrentPage(nextPage);
        lastLoadedPageRef.current = nextPage;
        setHasMore(response.data.orders.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      // toast.error("Erreur lors du chargement des ordonnances supplémentaires");
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (isLargeScreen && !selectedOrder && orders.length > 0) {
      setSelectedOrder(orders[0]);
    } else if (!isLargeScreen) {
      setSelectedOrder(null);
    }
  }, [isLargeScreen, orders]);

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

  // Remove the frontend filtering function since search is now handled by backend
  const getFilteredOrders = () => {
    const ordersArray = Array.isArray(orders) ? orders : orders.orders || [];
    switch (activeOrderTab) {
      case "preparation":
        return ordersArray.filter((order) =>
          [
            "À valider",
            "PENDING",
            "En préparation",
            "Prêt à collecter",
            "Prêt à livrer",
          ].includes(order.status)
        );
      case "past":
        return ordersArray.filter(
          (order) =>
            order.status === "Finalisé" ||
            order.status === "Refusé" ||
            order.status === "Annulée"
        );
      default:
        return ordersArray;
    }
  };

  const handleValidate = async () => {
    if (!selectedOrder) return;
    setIsButtonLoading(true);
    try {
      await apiService.changeOrderStatus(selectedOrder.id, "En préparation");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: "En préparation",
              }
            : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === selectedOrder.id
          ? {
              ...prev,
              status: "En préparation",
            }
          : prev
      );
      setIsModalOpen(false);
      toast.success(
        "Ordonnance validée avec succès et passée en En préparation"
      );
    } catch (error) {
      toast.error(
        error.message || "Échec de la mise à jour du statut de la commande"
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handlePrepare = async () => {
    if (!selectedOrder) return;
    setIsPrepModalOpen(false);
    setDeliveryDetails({ type: "complete", note: "" });
    setIsDeliveryModalOpen(true);
  };

  const handleDelivery = async () => {
    if (!selectedOrder) return;
    if (!deliveryDetails.note.trim()) {
      toast.error("Veuillez entrer une note avant de soumettre");
      return;
    }
    setIsButtonLoading(true);
    let newStatus = "Prêt à collecter";
    if (selectedOrder.orderType === "delivery") {
      newStatus = "Prêt à livrer";
    }
    try {
      const updatedOrder = await apiService.changeOrderStatusWithDetails(
        selectedOrder.id,
        newStatus,
        deliveryDetails
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: newStatus,
                deliveryDetails: updatedOrder.deliveryDetails,
              }
            : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === selectedOrder.id
          ? {
              ...prev,
              status: newStatus,
              deliveryDetails: updatedOrder.deliveryDetails,
            }
          : prev
      );
      setIsDeliveryModalOpen(false);
      toast.success("Détails de livraison ajoutés avec succès");
    } catch (error) {
      toast.error(
        error.message || "Échec de la mise à jour du statut de la commande"
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedOrder) return;
    setIsButtonLoading(true);
    try {
      await apiService.changeOrderStatus(selectedOrder.id, "Finalisé");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: "Finalisé",
              }
            : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === selectedOrder.id
          ? {
              ...prev,
              status: "Finalisé",
            }
          : prev
      );
      setIsWithdrawModalOpen(false);
      toast.success("Ordonnance retirée avec succès et marquée comme Finalisé");
    } catch (error) {
      toast.error(
        error.message || "Échec de la mise à jour du statut de la commande"
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleRefuse = async () => {
    if (!selectedOrder) return;
    setIsButtonLoading(true);
    try {
      await apiService.changeOrderStatus(selectedOrder.id, "Refusé");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: "Refusé",
              }
            : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === selectedOrder.id
          ? {
              ...prev,
              status: "Refusé",
            }
          : prev
      );
      toast.success("Commande refusée avec succès");
    } catch (error) {
      toast.error(
        error.message || "Échec de la mise à jour du statut de la commande"
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    setIsButtonLoading(true);
    try {
      await apiService.changeOrderStatus(selectedOrder.id, "Annulée");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: "Annulée",
              }
            : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === selectedOrder.id
          ? {
              ...prev,
              status: "Annulée",
            }
          : prev
      );
      setIsRefuseModalOpen(false);
      toast.success("Ordonnance annulée avec succès et revenue à À valider");
    } catch (error) {
      toast.error(
        error.message || "Échec de la mise à jour du statut de la commande"
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCloseDeliveryModal = () => {
    setIsDeliveryModalOpen(false);
    setDeliveryDetails({ type: "complete", note: "" });
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-y-hidden">
  //       <div className="text-center">
  //         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#069AA2]"></div>
  //       </div>
  //     </div>
  //   );
  // }

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
        loadMoreOrders={loadMoreOrders}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
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
              handleRefuse={handleRefuse}
              handleCancel={handleCancel}
              setIsRefuseModalOpen={setIsRefuseModalOpen}
            />
          )}
        </div>
      )}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-[60%]">
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
            handleRefuse={handleRefuse}
            handleCancel={handleCancel}
            setIsRefuseModalOpen={setIsRefuseModalOpen}
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
                onClick={handleValidate}
                disabled={isButtonLoading}
                className={`px-4 py-2 w-[14rem] ${
                  isButtonLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#069AA2] hover:bg-[#05828A]"
                } text-white rounded-lg transition text-sm`}
              >
                {isButtonLoading ? "Validation..." : "Oui"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 w-[14rem] text-white border bg-[#E9486C] border-gray-300 hover:bg-[#D1365A] rounded-lg transition text-sm"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
      {isRefuseModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsRefuseModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
          >
            <div className="">
              <img
                src={attentionLogo}
                className="w-[4rem] h-[4rem] text-center mx-auto mb-4"
                alt=""
              />
            </div>
            <div className="pb-4 mb-4 mt-6 text-center">
              <p className="text-gray-900">
                Êtes-vous sûr de vouloir annuler la commande ?
              </p>
              <p className="text-gray-900">
                Une fois confirmé, le patient sera notifié et vous ne pourrez
                plus retourner en arrière.
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <button
                onClick={handleCancel}
                disabled={isButtonLoading}
                className={`px-4 py-2 w-[14rem] ${
                  isButtonLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#069AA2] hover:bg-[#05828A]"
                } text-white rounded-lg transition text-sm`}
              >
                {isButtonLoading ? "Annulation..." : "Oui"}
              </button>
              <button
                onClick={() => setIsRefuseModalOpen(false)}
                className="px-4 py-2 w-[14rem] bg-[#E9486C] hover:bg-[#D1365A] text-white rounded-lg transition text-sm"
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
                disabled={isButtonLoading}
                className={`px-4 py-2 w-[14rem] ${
                  isButtonLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                } text-white rounded-lg transition text-sm`}
              >
                {isButtonLoading ? "Préparation..." : "Prête"}
              </button>
              <button
                onClick={() => setIsPrepModalOpen(false)}
                className="px-4 py-2 w-[14rem] text-white border bg-red-500 border-gray-300 hover:bg-red-600 rounded-lg transition text-sm"
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
          onClick={handleCloseDeliveryModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6 relative"
          >
            {/* Cross button */}
            <button
              onClick={handleCloseDeliveryModal}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5 stroke-1" />
            </button>

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
                  className="w-full px-3 py-2 placeholder:text-gray-400 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  rows="3"
                  placeholder="Entrez une note..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDelivery}
                disabled={isButtonLoading || !deliveryDetails.note.trim()}
                className={`px-4 py-2 ${
                  isButtonLoading || !deliveryDetails.note.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                } text-white rounded-lg transition text-sm`}
              >
                {isButtonLoading ? "Ajout en cours..." : "Ajouter"}
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
                disabled={isButtonLoading}
                className={`px-4 py-2 w-[14rem] ${
                  isButtonLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#069AA2] hover:bg-[#05828A]"
                } text-white rounded-lg transition text-sm`}
              >
                {isButtonLoading ? "Retrait..." : "Oui"}
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
});

export default Orders;
