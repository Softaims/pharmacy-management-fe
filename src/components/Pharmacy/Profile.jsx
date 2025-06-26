// components/Pharmacy/Profile.jsx
export default function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            PH
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              City Pharmacy
            </h2>
            <p className="text-gray-600">Licensed Pharmacy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pharmacy Name
            </label>
            <input
              type="text"
              value="City Pharmacy"
              className="w-full p-3 border border-gray-300 rounded-md"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number
            </label>
            <input
              type="text"
              value="PH-2024-001"
              className="w-full p-3 border border-gray-300 rounded-md"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              value="+1 (555) 123-4567"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value="contact@citypharmacy.com"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value="123 Main Street, Downtown, City, State 12345"
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
