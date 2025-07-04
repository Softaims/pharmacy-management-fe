import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import imgicon from "../../assets/ajouter-une-image.png"; // Assuming you have an image icon
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const Settings = () => {
  const { user, logout } = useAuth(); // Accéder à l'utilisateur et à la fonction de déconnexion depuis AuthContext
  console.log("🚀 ~ Paramètres ~ utilisateur :", user);

  const [pharmacyName, setPharmacyName] = useState(
    user?.pharmacy.name || "Pharmacie de la gare de Saint-Denis"
  );
  const [address, setAddress] = useState(
    user?.pharmacy.address || "13 avenue Victor Hugo, 93200 Saint-Denis"
  );
  const [isActive, setIsActive] = useState(true); // Renommé depuis clickAndCollect
  const [canDeliver, setCanDeliver] = useState(false); // Renommé depuis homeDelivery
  const [isSaving, setIsSaving] = useState(false); // State to track save operation

  const [schedule, setSchedule] = useState({
    monday: { isOpen: false, timeSlots: [] },
    tuesday: {
      isOpen: true,
      timeSlots: [{ openTime: "9:00", closeTime: "12:00" }],
    },
    wednesday: { isOpen: false, timeSlots: [] },
    thursday: { isOpen: false, timeSlots: [] },
    friday: { isOpen: false, timeSlots: [] },
    saturday: { isOpen: false, timeSlots: [] },
    sunday: { isOpen: false, timeSlots: [] },
  });

  // Sync schedule with user data if available
  useEffect(() => {
    if (user?.pharmacy?.schedules) {
      setSchedule((prev) => ({
        ...prev,
        ...user.pharmacy.schedules,
      }));
    }
  }, [user]);

  const days = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "samedi", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
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
    setSchedule((prevSchedule) => {
      // Ensure the day exists in the schedule, default to a valid structure
      const currentDay = prevSchedule[day] || { isOpen: false, timeSlots: [] };
      const newOpen = !currentDay.isOpen;
      return {
        ...prevSchedule,
        [day]: {
          ...currentDay,
          isOpen: newOpen,
          timeSlots: newOpen ? [{ openTime: "9:00", closeTime: "12:00" }] : [],
        },
      };
    });
  };

  const handleHomeDeliveryToggle = () => {
    setCanDeliver((prev) => !prev);
  };

  const addTimeSlot = (day) => {
    setSchedule((prevSchedule) => {
      const currentDay = prevSchedule[day] || { isOpen: false, timeSlots: [] };
      if (currentDay.timeSlots.length < 2) {
        return {
          ...prevSchedule,
          [day]: {
            ...currentDay,
            timeSlots: [
              ...currentDay.timeSlots,
              { openTime: "9:00", closeTime: "12:00" },
            ],
          },
        };
      }
      return prevSchedule;
    });
  };

  const handleTimeChange = (day, slotIndex, timeField, value) => {
    setSchedule((prevSchedule) => {
      const currentDay = prevSchedule[day] || { isOpen: false, timeSlots: [] };
      const newSlots = [...currentDay.timeSlots];
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        [timeField]: value,
      };
      // Ensure closeTime is after openTime
      if (timeField === "openTime" && newSlots[slotIndex].closeTime <= value) {
        newSlots[slotIndex].closeTime = getNextTimeOption(value);
      }
      return {
        ...prevSchedule,
        [day]: {
          ...currentDay,
          timeSlots: newSlots,
        },
      };
    });
  };

  // Helper function to get the next available time option
  const getNextTimeOption = (currentTime) => {
    const index = timeOptions.indexOf(currentTime);
    return timeOptions[index + 1] || timeOptions[index]; // Default to current if no next option
  };

  // Fonction pour gérer l'enregistrement (intégration avec l'API PATCH)
  const handleSave = async () => {
    setIsSaving(true); // Disable button and change text
    const payload = {
      name: pharmacyName,
      address: address,
      isActive: isActive,
      canDeliver: canDeliver,
      schedules: {
        monday: {
          isOpen: schedule.monday.isOpen,
          timeSlots: schedule.monday.timeSlots,
        },
        tuesday: {
          isOpen: schedule.tuesday.isOpen,
          timeSlots: schedule.tuesday.timeSlots,
        },
        wednesday: {
          isOpen: schedule.wednesday.isOpen,
          timeSlots: schedule.wednesday.timeSlots,
        },
        thursday: {
          isOpen: schedule.thursday.isOpen,
          timeSlots: schedule.thursday.timeSlots,
        },
        friday: {
          isOpen: schedule.friday.isOpen,
          timeSlots: schedule.friday.timeSlots,
        },
        saturday: {
          isOpen: schedule.saturday.isOpen,
          timeSlots: schedule.saturday.timeSlots,
        },
        sunday: {
          isOpen: schedule.sunday.isOpen,
          timeSlots: schedule.sunday.timeSlots,
        },
      },
    };

    // Validate payload before sending
    for (const day in payload.schedules) {
      payload.schedules[day].timeSlots = payload.schedules[
        day
      ].timeSlots.filter((slot) => {
        const openIndex = timeOptions.indexOf(slot.openTime);
        const closeIndex = timeOptions.indexOf(slot.closeTime);
        return closeIndex > openIndex; // Remove invalid slots
      });
    }

    try {
      console.log("🚀 ~ handleSave ~ payload:", payload);
      await axiosInstance.patch(`/pharmacy/update`, payload);
      toast.success("Paramètres mis à jour avec succès"); // Success notification
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
      toast.error("Erreur lors de la mise à jour des paramètres"); // Error notification
    } finally {
      setIsSaving(false); // Re-enable button and revert text
    }
  };

  return (
    <div className="mx-auto py-6 px-12 bg-white">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Paramètres</h1>
      {/* Profil de la pharmacie - Nom et Adresse */}
      <div className="w-[60%]">
        {/* Nom de la pharmacie */}
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

        {/* Téléchargement d'image */}
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

        {/* Adresse */}
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
        {/* Horaires d'ouverture */}
        <div className="mb-8 border-b-1 border-gray-300 pb-4">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Horaires :
          </label>

          <div className="space-y-3">
            {days.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-700">{label}</div>

                {/* Interrupteur de bascule */}
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule[key]?.isOpen ?? false} // Guard against undefined
                    onChange={() => handleToggle(key)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {schedule[key]?.isOpen ? "Ouvert" : "Fermé"}
                  </span>
                </label>

                {/* Sélecteurs de temps */}
                {schedule[key]?.isOpen && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {schedule[key].timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                          value={slot.openTime || "9:00"}
                          onChange={(e) =>
                            handleTimeChange(
                              key,
                              index,
                              "openTime",
                              e.target.value
                            )
                          }
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-500">-</span>
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                          value={slot.closeTime || "12:00"}
                          onChange={(e) =>
                            handleTimeChange(
                              key,
                              index,
                              "closeTime",
                              e.target.value
                            )
                          }
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    {schedule[key].timeSlots.length < 2 && (
                      <button
                        className="ml-2 px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                        onClick={() => addTimeSlot(key)}
                      >
                        +
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6 flex items-center gap-4 border-b-1 border-gray-300 pb-8">
          <label className="w-[30%] text-sm font-medium text-gray-700">
            Click and Collect :
          </label>
          <div className="flex bg-gray-200 w-[10rem] h-[2rem] rounded-full">
            <div className="flex-1 text-center font-medium text-gray-500 cursor-not-allowed opacity-50"></div>
            <div className="flex-1 text-center justify-center items-center font-medium text-white bg-[#B0B0B0] rounded-full cursor-not-allowed opacity-80">
              {isActive ? "Actif" : "Inactif"}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4 border-b-1 border-gray-300 pb-8">
          <label className="w-[30%] text-sm font-medium text-gray-700">
            Livraison à domicile :
          </label>
          <div
            className="flex bg-gray-200 w-[10rem] h-[2rem] rounded-full cursor-pointer"
            onClick={handleHomeDeliveryToggle}
          >
            <div
              className={`flex-1 text-center font-medium ${
                canDeliver
                  ? "text-transparent bg-transparent"
                  : "text-white bg-[#E9486C]"
              } rounded-full transition-colors`}
            >
              Désactivé
            </div>
            <div
              className={`flex-1 text-center font-medium ${
                canDeliver
                  ? "text-white bg-[#069AA2]"
                  : "text-transparent bg-transparent"
              } rounded-full transition-colors`}
            >
              Actif
            </div>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <button
          className="bg-[#069AA2] hover:bg-teal-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving
            ? "Mise à jour en cours..."
            : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
