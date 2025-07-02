import React from "react";
import { FaCircle, FaRegCircle } from "react-icons/fa"; // Import icons

const OrderSidebar = ({
  activeOrderTab,
  setActiveOrderTab,
  orders,
  selectedOrder,
  setSelectedOrder,
  searchTerm,
  setSearchTerm,
  getStatusCircles,
  getFilteredOrders,
}) => {
  const orderTabs = [
    { id: "all", label: "Toutes", count: orders.length },
    {
      id: "preparation",
      label: "En cours",
      count: orders.filter(
        (o) =>
          o.status === "À valider" ||
          o.status === "En préparation" ||
          o.status === "Prêt à collecter"
      ).length,
    },
    {
      id: "past",
      label: "Passées",
      count: orders.filter((o) => o.status === "Finalisé").length,
    },
  ];

  return (
    <div
      className={`w-full lg:w-76 bg-white border-r border-gray-200 flex flex-col  ${
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
            className="py-1 pl-3 bg-[#F0F0F0] rounded-xl w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <p className="pt-2 font-semibold text-sm text-black">
          Renouvellements automatiques
        </p>
      </div>
      {/* Orders List */}
      <div className="flex-1 overflow-y-auto">
        {getFilteredOrders().map((order) => {
          let statusClass = "";
          if (order.status === "À valider") {
            statusClass = "bg-[#FEEEB8] text-[#] border-2 border-[#FAC710]";
          } else if (order.status === "Finalisé") {
            statusClass = "bg-[#DEF1CB] text-[#] border-2 border-[#8FD14F]";
          } else if (order.status === "Prêt à collecter") {
            statusClass = "bg-[#B8F0F2]  border-2 border-[#12CDD4]";
          } else if (order.status === "En préparation") {
            statusClass = "bg-[#E7D5AA] text-[#] border-2 border-[#FAA010]";
          }

          // Get status progress
          const statusOrder = [
            "À valider",
            "En préparation",
            "Prêt à collecter",
            "Finalisé",
          ];
          const filledCount = statusOrder.indexOf(order.status) + 1;
          const statusIcons = Array(4)
            .fill()
            .map((_, index) =>
              index < filledCount ? (
                <FaCircle key={index} className="text-black w-3 h-3" />
              ) : (
                <FaRegCircle key={index} className="-300 w-3 h-3" />
              )
            );

          return (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`p-4 border-b border-gray-100 cursor-pointer  ${
                selectedOrder?.id === order.id
                  ? "bg-[#DFEBEC] border-l-4 border-l-[#89d5dc]"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {order.patientName}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`flex items-center justify-center w-30 py-1 rounded-md text-xs font-medium ${statusClass}`}
                    >
                      {order.status}
                    </span>
                    <div className="flex gap-2 ml-2">{statusIcons}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enquête le {order.inquiryDate}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderSidebar;
