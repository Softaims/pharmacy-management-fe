// components/Pharmacy/Settings.jsx
export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Notifications Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notifications
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive order updates via email
                </p>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600"
                defaultChecked
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  SMS Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive urgent notifications via SMS
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Business Hours
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Time
              </label>
              <input
                type="time"
                value="09:00"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Time
              </label>
              <input
                type="time"
                value="21:00"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>

          <div className="space-y-4">
            <button className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Change Password
            </button>

            <button className="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors ml-0 md:ml-3">
              Logout
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
