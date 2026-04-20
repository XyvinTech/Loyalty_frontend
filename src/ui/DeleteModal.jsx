import StyledButton from "./StyledButton";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  confirmLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Confirm Deletion
        </h2>
        <p className="mt-4 text-gray-600 text-sm">
          Are you sure you want to delete this {data}? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <StyledButton
            onClick={onClose}
            name={"Cancel"}
            variant="tertiary"
            disabled={confirmLoading}
          />
          <StyledButton
            onClick={onConfirm}
            name={"Delete"}
            variant="delete"
            isLoading={confirmLoading}
            loadingLabel="Deleting…"
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
