// components/Pharmacy/Orders.jsx
export default function Orders() {
  const orders = [
    {
      id: 1,
      customer: "John Doe",
      items: 3,
      status: "Pending",
      total: "$45.99",
    },
    {
      id: 2,
      customer: "Jane Smith",
      items: 1,
      status: "Ready",
      total: "$12.50",
    },
    {
      id: 3,
      customer: "Bob Wilson",
      items: 2,
      status: "Completed",
      total: "$28.75",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.customer}</td>
                  <td className="px-4 py-3 text-sm">{order.items}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Ready"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {order.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
