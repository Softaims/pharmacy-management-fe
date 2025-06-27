import React from "react";

const ValidationScreen = ({ order, onValidate }) => {
  const handleValidation = () => {
    onValidate(order.id);
  };

  return (
    <div className="flex-1 flex p-6 bg-gray-50">
      {/* Left Side: Prescription Image */}
      <div className="w-1/2 pr-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ordonnance</h3>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
            <img
              src={order.documents.prescription}
              alt="Prescription"
              className="max-h-full max-w-full"
            />
          </div>
        </div>
      </div>

      {/* Right Side: Validation Form */}
      <div className="w-1/2 pl-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Pour valider l'ordonnance, merci de :
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Numéro de sécurité sociale"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              placeholder="Nom de l'assuré"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={handleValidation}
            className="mt-6 w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationScreen;
