import { FiLogOut, FiUser, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  // Get user data from AuthContext
  const { user, logout } = useAuth();
  console.log("🚀 ~ Profile ~ user:", user);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="mx-auto max-w-[80%]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className=" font-bold text-gray-900">Profil</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-md"
          >
            <FiLogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>

        {/* Profile Fields */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 gap-6">
            {/* Pharmacy Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiUser className="w-4 h-4 text-blue-600" />
                Nom de la pharmacie
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user.pharmacy?.name : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiMapPin className="w-4 h-4 text-green-600" />
                Adresse
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user?.pharmacy.address : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiMail className="w-4 h-4 text-purple-600" />
                E-mail
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user.email : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiPhone className="w-4 h-4 text-orange-600" />
                Numéro de téléphone
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user.phoneNumber : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
