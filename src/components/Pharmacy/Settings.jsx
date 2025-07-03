import { useState } from "react";
import imgicon from "../../assets/ajouter-une-image.png"; // Assuming you have an image icon

const Settings = () => {
  const [pharmacyName, setPharmacyName] = useState(
    "Pharmacie de la gare de Saint-Denis"
  );
  const [address, setAddress] = useState(
    "13 avenue Victor Hugo, 93200 Saint-Denis"
  );
  const [clickAndCollect, setClickAndCollect] = useState(true);
  const [homeDelivery, setHomeDelivery] = useState(false);

  const [schedule, setSchedule] = useState({
    lundi: {
      open: false, // Initially off
      morning: { start: "9:00", end: "12:00" },
      afternoon: { start: "14:00", end: "20:00" },
    },
    mardi: {
      open: true,
      morning: { start: "9:00", end: "12:00" },
      afternoon: { start: "14:00", end: "20:00" },
    },
    mercredi: { open: false },
    jeudi: { open: false },
    vendredi: { open: false },
    samedi: { open: false },
    dimanche: { open: false },
  });

  const days = [
    { key: "lundi", label: "Lundi" },
    { key: "mardi", label: "Mardi" },
    { key: "mercredi", label: "Mercredi" },
    { key: "jeudi", label: "Jeudi" },
    { key: "vendredi", label: "Vendredi" },
    { key: "samedi", label: "Samedi" },
    { key: "dimanche", label: "Dimanche" },
  ];

  const timeOptions = [
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const handleToggle = (day) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        open: !prevSchedule[day].open,
      },
    }));
  };

  const handleHomeDeliveryToggle = () => {
    setHomeDelivery((prev) => !prev);
  };

  return (
    <div className="mx-auto py-6 px-12 bg-white">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Paramètres</h1>
      {/* Pharmacy Profile Name and Address */}
      <div className="w-[60%]">
        {/* Pharmacy Name */}
        <div className="mb-6 flex items-center border-b-1 border-gray-300 pb-4">
          <label className="w-[30%] text-sm font-medium text-gray-700 mb-2 mr-4">
            Nom de la pharmacie :
          </label>
          <input
            type="text"
            value={pharmacyName}
            onChange={(e) => setPharmacyName(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-[#F6F6F6] text-gray-700"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6 flex items-center border-b-1 border-gray-300 pb-4">
          <label className="w-[30%] text-sm font-medium text-gray-700 mb-2 mr-4">
            Image :
          </label>
          <div className="w-full">
            <div className="w-50 h-32 bg-[#F1F1F3] border-2 border-dashed border-gray-300 rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <img src={imgicon} className="w-[3rem] h-[3rem]" alt="" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6 flex items-center border-b-1 border-gray-300 pb-4">
          <label className="w-[30%] text-sm font-medium text-gray-700 mb-2 mr-4">
            Adresse :
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-[#F6F6F6] text-gray-700"
          />
        </div>
        {/* Opening Hours */}
        <div className="mb-8 border-b-1 border-gray-300 pb-4">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Horaires :
          </label>

          <div className="space-y-3">
            {days.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-700">{label}</div>

                {/* Toggle Switch */}
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule[key].open}
                    onChange={() => handleToggle(key)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {schedule[key].open ? "Ouvert" : "Fermé"}
                  </span>
                </label>

                {/* Time Selectors */}
                {schedule[key].open && (
                  <div className="flex items-center gap-2">
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                      <option>{schedule[key].morning?.start || "9:00"}</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-500">-</span>
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                      <option>{schedule[key].morning?.end || "12:00"}</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>

                    {schedule[key].afternoon && (
                      <>
                        <div className="w-3 h-3 rounded-full bg-teal-500 ml-4"></div>
                        <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                          <option>{schedule[key].afternoon.start}</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-500">-</span>
                        <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                          <option>{schedule[key].afternoon.end}</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6  flex items-center gap-4 border-b-1 border-gray-300 pb-8">
          <label className="w-[30%] text-sm font-medium text-gray-700">
            Click and collect :
          </label>
          <div className="flex bg-gray-200 w-[10rem] h-[2rem] rounded-full">
            <div className="flex-1 text-center font-medium text-gray-500 cursor-not-allowed opacity-50"></div>
            <div className="flex-1 text-center justify-center items-center font-medium text-white bg-[#B0B0B0] rounded-full cursor-not-allowed opacity-80">
              Active
            </div>
          </div>
        </div>

        <div className="mb-6  flex items-center gap-4 border-b-1 border-gray-300 pb-8">
          <label className="w-[30%] text-sm font-medium text-gray-700">
            Livraison à domicile :
          </label>
          <div
            className="flex bg-gray-200 w-[10rem] h-[2rem] rounded-full cursor-pointer"
            onClick={handleHomeDeliveryToggle}
          >
            <div
              className={`flex-1 text-center font-medium ${
                homeDelivery
                  ? "text-transparent bg-transparent"
                  : "text-white bg-[#E9486C]"
              } rounded-full transition-colors`}
            >
              Désactivé
            </div>
            <div
              className={`flex-1 text-center font-medium ${
                homeDelivery
                  ? "text-white bg-[#069AA2]"
                  : "text-transparent bg-transparent"
              } rounded-full transition-colors`}
            >
              Active
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-[#069AA2] hover:bg-teal-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default Settings;
