import React, { useEffect, useRef, useCallback } from "react";
import { FaCircle, FaRegCircle } from "react-icons/fa";

const OrderSidebar = ({
  activeOrderTab,
  setActiveOrderTab,
  orders,
  selectedOrder,
  setSelectedOrder,
  searchTerm,
  setSearchTerm,
  getFilteredOrders,
  // Infinite scrolling props
  loadMoreOrders,
  hasMore,
  isLoadingMore,
}) => {
  const scrollContainerRef = useRef(null);
  const loadingTriggerRef = useRef(null);

  const orderTabs = [
    { id: "all", label: "Toutes", count: orders.length },
    {
      id: "preparation",
      label: "En cours",
      count: orders.filter(
        (o) =>
          o.status === "À valider" ||
          o.status === "En préparation" ||
          o.status === "Prêt à collecter" ||
          o.status === "Prêt à livrer" ||
          o.status === "PENDING"
      ).length,
    },
    {
      id: "past",
      label: "Passées",
      count: orders.filter(
        (o) =>
          o.status === "Finalisé" ||
          o.status === "Refusé" ||
          o.status === "Annulée"
      ).length,
    },
  ];

  const statusOrder = [
    "À valider",
    "Refusé",
    "Annulée",
    "En préparation",
    "Prêt à collecter",
    "Prêt à livrer",
    "Finalisé",
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Intersection Observer for infinite scrolling
  const handleIntersection = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoadingMore && !searchTerm) {
        loadMoreOrders();
      }
    },
    [hasMore, isLoadingMore, loadMoreOrders, searchTerm]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: scrollContainerRef.current,
      rootMargin: "100px", // Trigger 100px before reaching the bottom
      threshold: 0.1,
    });

    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current);
    }

    return () => {
      if (loadingTriggerRef.current) {
        observer.unobserve(loadingTriggerRef.current);
      }
    };
  }, [handleIntersection]);

  // Handle manual scroll-based loading as fallback
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || searchTerm) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Trigger loading when 90% scrolled
    if (scrollPercentage > 0.9 && hasMore && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [hasMore, isLoadingMore, loadMoreOrders, searchTerm]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div
      className={`w-full lg:w-66 bg-white border-r border-gray-200 flex flex-col ${
        selectedOrder ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 w-[90%]">
        <div className="flex items-center w-full mb-4">
          <input
            type="text"
            placeholder="Rechercher patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-1 pl-3 bg-[#F0F0F0] rounded-xl w-full text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-between">
          {orderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveOrderTab(tab.id)}
              className={`text-sm font-medium relative transition-colors ${
                activeOrderTab === tab.id
                  ? "text-[#069AA2]"
                  : "text-gray-900 hover:text-gray-900"
              }`}
            >
              <p className="font-semibold">{tab.label}</p>
              {activeOrderTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#069AA2] transform translate-y-1"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
        }}
      >
        {getFilteredOrders().map((order) => {
          const normalizedStatus =
            order.status === "PENDING" ? "À valider" : order.status;
          let statusClass = "";
          if (normalizedStatus === "À valider") {
            statusClass = "bg-[#FEEEB8] text-black border-2 border-[#FAC710]";
          } else if (normalizedStatus === "Finalisé") {
            statusClass = "bg-[#DEF1CB] text-black border-2 border-[#8FD14F]";
          } else if (normalizedStatus === "Prêt à collecter") {
            statusClass = "bg-[#B8F0F2] text-black border-2 border-[#12CDD4]";
          } else if (normalizedStatus === "Prêt à livrer") {
            statusClass = "bg-[#DEDAFF] text-black border-2 border-[#6631D7]";
          } else if (normalizedStatus === "En préparation") {
            statusClass = "bg-[#E7D5AA] text-black border-2 border-[#FAA010]";
          } else {
            statusClass = "bg-gray-100 text-black border-2 border-gray-300";
          }

          // Status-specific circle filling logic
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
                <FaCircle key={index} className="text-black w-3 h-3" />
              ) : (
                <FaRegCircle key={index} className="text-gray-300 w-3 h-3" />
              )
            );

          const name =
            order.orderFor === "familymember"
              ? `${order.familyMember?.firstName || "N/A"} ${
                  order.familyMember?.lastName || ""
                }`
              : `${order.patient?.firstName || "N/A"} ${
                  order.patient?.lastName || ""
                }`;

          return (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`p-4 border-b border-gray-100 cursor-pointer ${
                selectedOrder?.id === order.id
                  ? "bg-[#DFEBEC] "
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex  items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {name.trim()}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`flex items-center justify-center w-30 py-1 rounded-md text-xs font-medium ${statusClass}`}
                    >
                      {normalizedStatus}
                    </span>
                    <div className="flex gap-2 ml-2">{statusIcons}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enquête le {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Trigger Element (for Intersection Observer) */}
        {hasMore && !searchTerm && (
          <div
            ref={loadingTriggerRef}
            className="h-20 flex items-center justify-center"
          >
            {isLoadingMore && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#069AA2]"></div>
                <span className="text-sm text-gray-500">
                  Chargement des ordonnances...
                </span>
              </div>
            )}
          </div>
        )}

        {/* End of Results Message */}
        {!hasMore && orders.length > 0 && !searchTerm && (
          <div className="p-4 text-center text-gray-500 text-sm border-t border-gray-100">
            Toutes les ordonnances ont été chargées
          </div>
        )}

        {/* No Results Message */}
        {getFilteredOrders().length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-lg mb-2">📋</div>
            <p className="text-sm">
              {searchTerm
                ? "Aucune ordonnance trouvée pour cette recherche"
                : "Aucune ordonnance disponible"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSidebar;
