import React from "react";
import { Settings } from "lucide-react";

const SettingsPanel = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div className="text-center">
        <Settings className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
          Settings
        </h3>
        <p className="text-gray-500 text-sm lg:text-base">
          Settings panel will be implemented here
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
