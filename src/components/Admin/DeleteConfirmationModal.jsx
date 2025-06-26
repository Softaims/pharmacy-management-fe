import { X } from "lucide-react";
import { useEffect, useRef } from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  pharmacyName,
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Focus management and Escape key handler
  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus();
      const handleEscape = (e) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Close on clicking outside the modal
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 px-8 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white/95 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 ease-out animate-slide-up"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{pharmacyName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmationModal;
