import React from "react";

const OrderModal = ({
  isOpen,
  setIsOpen,
  title,
  message,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setIsOpen(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[27rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
      >
        <div className="pb-4 mb-4">
          <p className="flex items-center justify-center text-gray-900">
            {message}
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3">
          <button
            onClick={onPrimaryAction}
            className="px-4 py-2 w-[14rem] bg-[#069AA2] hover:bg-[#05828A] text-white rounded-lg transition text-sm"
          >
            {primaryActionLabel}
          </button>
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2 w-[14rem] text-gray-700 border bg-[#E9486C] border-gray-300 hover:bg-[#D1365A] rounded-lg transition text-sm"
          >
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
