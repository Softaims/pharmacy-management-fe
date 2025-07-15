import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import imgicon from "../../assets/ajouter-une-image.png";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";

const Settings = () => {
  const { user, logout } = useAuth();

  // Initialize state based on API response
  const [pharmacyName, setPharmacyName] = useState(user?.pharmacy?.name || "");
  const [address, setAddress] = useState(user?.pharmacy?.address || "");
  const [isActive, setIsActive] = useState(user?.pharmacy?.isActive || false);
  const [canDeliver, setCanDeliver] = useState(
    user?.pharmacy?.canDeliver || false
  );
  const [deliveryPrice, setDeliveryPrice] = useState(
    user?.pharmacy?.deliveryPrice || 1
  );
  const [isSaving, setIsSaving] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [imageKey, setImageKey] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    user?.pharmacy?.imageUrl || ""
  );
  console.log(
    "🚀 ~ Settings ~ uploadedImageUrl:,,,,,,,,,,,,,,,,,,",
    uploadedImageUrl
  );

  // Initialize schedule state based on API response
  const [schedule, setSchedule] = useState({
    monday: { isOpen: false, timeSlots: [] },
    tuesday: { isOpen: false, timeSlots: [] },
    wednesday: { isOpen: false, timeSlots: [] },
    thursday: { isOpen: false, timeSlots: [] },
    friday: { isOpen: false, timeSlots: [] },
    saturday: { isOpen: false, timeSlots: [] },
    sunday: { isOpen: false, timeSlots: [] },
  });

  useEffect(() => {
    if (user?.pharmacy) {
      // Update pharmacy details
      setPharmacyName(user.pharmacy.name || "");
      setAddress(user.pharmacy.address || "");
      setIsActive(user.pharmacy.isActive || false);
      setCanDeliver(user.pharmacy.canDeliver || false);
      setDeliveryPrice(user.pharmacy.deliveryPrice || 1);
      setUploadedImageUrl(user.pharmacy.imageUrl || "");

      // Transform API schedules to match component's schedule format
      if (user.pharmacy.schedules) {
        const formattedSchedule = {
          monday: { isOpen: false, timeSlots: [] },
          tuesday: { isOpen: false, timeSlots: [] },
          wednesday: { isOpen: false, timeSlots: [] },
          thursday: { isOpen: false, timeSlots: [] },
          friday: { isOpen: false, timeSlots: [] },
          saturday: { isOpen: false, timeSlots: [] },
          sunday: { isOpen: false, timeSlots: [] },
        };

        user.pharmacy.schedules.forEach(({ schedule }) => {
          const dayKey = schedule.dayOfWeek.toLowerCase();
          formattedSchedule[dayKey] = {
            isOpen: schedule.isOpen,
            timeSlots: schedule.timeSlots.map((slot) => ({
              openTime: slot.openTime,
              closeTime: slot.closeTime,
            })),
          };
        });

        setSchedule(formattedSchedule);
      }
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

  const handleDeliveryPriceChange = (increment) => {
    setDeliveryPrice((prev) => {
      const newPrice = prev + (increment ? 1 : -1);
      return newPrice >= 1 ? newPrice : 1;
    });
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
      newSlots[slotIndex] = { ...newSlots[slotIndex], [timeField]: value };
      if (timeField === "openTime" && newSlots[slotIndex].closeTime <= value) {
        newSlots[slotIndex].closeTime = getNextTimeOption(value);
      }
      return {
        ...prevSchedule,
        [day]: { ...currentDay, timeSlots: newSlots },
      };
    });
  };

  const getNextTimeOption = (currentTime) => {
    const index = timeOptions.indexOf(currentTime);
    return timeOptions[index + 1] || timeOptions[index];
  };

  const getSignedUrl = async () => {
    try {
      const response = await axiosInstance.get(
        `/family/signed-url?contentType=image/png&uploadType=profile-image`
      );
      setSignedUrl(response.data.signedUrl);
      setImageKey(response.data.key);
      return response.data.signedUrl;
    } catch (error) {
      console.log("🚀 ~ getSignedUrl ~ error:", error);
      toast.error("Erreur lors de la récupération de l'URL signée");
      return null;
    }
  };

  const uploadImage = async (file) => {
    let url = signedUrl;
    if (!url) {
      url = await getSignedUrl();
    }
    if (!url) {
      setSignedUrl(null);
      return;
    }
    try {
      const response = await axios.put(url, file, {
        // headers: { "Content-Type": "image/*" },
        headers: { "Content-Type": file.type },
      });
    } catch (error) {
      setImageKey(null);
      console.error("Error uploading image:,,,,,,,,,,,,,,,,,,", error);
      setSignedUrl(null);
      toast.error("Erreur lors du téléchargement de l'image");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/png") {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUploadedImageUrl(previewUrl);
      await uploadImage(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      name: pharmacyName,
      address: address,
      isActive: isActive,
      canDeliver: canDeliver,
      deliveryPrice: deliveryPrice,
      schedules: {},
    };

    if (imageKey) {
      payload.imageUrl = imageKey;
    }

    for (const day in schedule) {
      if (schedule[day].isOpen && schedule[day].timeSlots.length > 0) {
        payload.schedules[day] = {
          isOpen: schedule[day].isOpen,
          timeSlots: schedule[day].timeSlots.filter((slot) => {
            const openIndex = timeOptions.indexOf(slot.openTime);
            const closeIndex = timeOptions.indexOf(slot.closeTime);
            return closeIndex > openIndex;
          }),
        };
      }
    }

    try {
      await axiosInstance.patch(`/pharmacy/update`, payload);
      toast.success("Paramètres mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto py-6 px-12 bg-white">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Paramètres</h1>
      <div className="w-[70%]">
        {/* Nom de la pharmacie */}
        <div className="mb-6 flex items-center border-b border-gray-300 pb-4">
          <label className="w-[25%] text-md font-bold text-gray-700 mr-4">
            Nom de la pharmacie :
          </label>
          <input
            type="text"
            value={pharmacyName}
            onChange={(e) => setPharmacyName(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-[#F6F6F6] text-gray-700"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-6 flex items-start border-b border-gray-300 pb-4">
          <label className="w-[25%] text-md font-bold text-gray-700 mr-4">
            Image :
          </label>
          <div className="w-full">
            <div className="flex items-center space-x-4">
              <div
                className="w-48 flex items-center justify-center  h-32 bg-gray-100 rounded-3xl overflow-hidden cursor-pointer"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                {uploadedImageUrl ? (
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={imgicon}
                    alt="Upload Icon"
                    className="w-12 h-12 flex items-center justify-center mx-auto "
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/png"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="mb-6 flex items-center border-b border-gray-300 pb-4">
          <label className="w-[25%] text-md font-bold text-gray-700 mr-4">
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
        <div className="mb-8 border-b border-gray-300 pb-4">
          <label className="block text-md font-bold text-gray-700 mb-4">
            Horaires :
          </label>
          <div className="space-y-3 pl-12">
            {days.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-10">
                <div className="w-20 text-sm text-gray-700">{label}</div>
                <label className="inline-flex items-center cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={schedule[key]?.isOpen ?? false}
                    onChange={() => handleToggle(key)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-blue-300  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#069AA2] "></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 ">
                    {schedule[key]?.isOpen ? "Ouvert" : "Fermé"}
                  </span>
                </label>
                {schedule[key]?.isOpen && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {schedule[key].timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 mb-2 px-2"
                      >
                        <select
                          className="px-2 py-1  rounded-2xl text-sm text-black bg-gray-100"
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
                          className="px-2 py-1 rounded-2xl text-sm text-black bg-gray-100"
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
                        className="ml-2 w-6 h-6 flex items-center justify-center bg-teal-500 text-white rounded-full hover:bg-teal-600 mx-auto"
                        onClick={() => addTimeSlot(key)}
                      >
                        <span className="flex items-center justify-center">
                          <IoIosAdd className="text-md" />
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4 border-b border-gray-300 pb-8">
          <label className="w-[25%] text-md font-bold text-gray-700">
            Click and Collect
          </label>
          <div className="flex bg-gray-200 w-[13rem] h-[2rem] rounded-full">
            <div className="flex-1 text-center font-medium text-gray-500 cursor-not-allowed opacity-50"></div>
            <div className="flex-1 text-center justify-center items-center font-medium text-white bg-[#069AA2] rounded-full cursor-not-allowed opacity-80">
              <span className=" mt-[3.5px] flex items-center justify-center text-center">
                {" "}
                {isActive ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 pb-8 mb-6">
          <div className=" flex items-center gap-4 ">
            <label className="w-[25%] text-md font-bold text-gray-700">
              Livraison à domicile
            </label>
            <div
              className="flex bg-gray-200 w-[13rem] h-[2rem] rounded-full cursor-pointer"
              onClick={handleHomeDeliveryToggle}
            >
              <div
                className={`flex-1 text-center justify-center font-medium ${
                  canDeliver
                    ? "text-transparent bg-transparent"
                    : "text-white bg-[#E9486C]"
                } rounded-full transition-colors`}
              >
                <span className=" flex items-center justify-center mt-0.5">
                  {" "}
                  Désactivé
                </span>
              </div>
              <div
                className={`flex-1 text-center font-medium ${
                  canDeliver
                    ? "text-white bg-[#069AA2]"
                    : "text-transparent bg-transparent"
                } rounded-full transition-colors`}
              >
                <span className=" flex items-center justify-center mt-0.5">
                  {" "}
                  Actif
                </span>
              </div>
            </div>
          </div>
          {canDeliver && (
            <div className="flex items-center gap-6 mt-6 mx-8">
              <label className="text-md w-[25%] font-bold text-gray-700">
                Prix d'une livraison :
              </label>
              <div className="flex items-center gap-2 bg-[#F6F6F6] rounded-2xl">
                <button
                  className="px-2 text-lg font-bold rounded text-gray-900"
                  onClick={() => handleDeliveryPriceChange(false)}
                >
                  -
                </button>
                <span className="text-gray-900">{deliveryPrice}</span>
                <button
                  className="px-2 text-lg font-bold text-gray-900"
                  onClick={() => handleDeliveryPriceChange(true)}
                >
                  +
                </button>
              </div>
              <h4 className="text-gray-900">Euros</h4>
            </div>
          )}
        </div>

        <button
          className="bg-[#069AA2] hover:bg-teal-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          onClick={() => {
            console.log("Button clicked");
            handleSave();
          }}
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
