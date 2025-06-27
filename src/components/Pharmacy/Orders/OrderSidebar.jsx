import React from "react";

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
      className={`w-full md:w-76 bg-white border-r border-gray-200 flex flex-col ${
        selectedOrder ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Rechercher</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg
              className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
          {orderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveOrderTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeOrderTab === tab.id
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className="ml-1 text-xs">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto">
        {getFilteredOrders().map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              selectedOrder?.id === order.id
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {order.patientName}
                </h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enquête le {order.inquiryDate}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                {getStatusCircles(order.status).map((color, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${color}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSidebar;
