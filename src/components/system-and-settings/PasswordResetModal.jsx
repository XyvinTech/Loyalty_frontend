import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useSubAdmin } from "../../hooks/useSubAdmin";

const PasswordResetModal = ({ isOpen, onClose, request }) => {
  const [newPassword, setNewPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useUiStore();
  const { useApprovePasswordChangeRequest, useRejectPasswordChangeRequest } = useSubAdmin();
  const approveMutation = useApprovePasswordChangeRequest();
  const rejectMutation = useRejectPasswordChangeRequest();

  const handleApprove = () => {
    if (!newPassword || newPassword.length < 8) {
      addToast({
        type: "error",
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    approveMutation.mutate(
      { requestId: request._id, data: { newPassword, notes } },
      {
        onSuccess: (response) => {
          addToast({
            type: "success",
            message: response?.message || "Password reset approved successfully",
          });
          onClose();
          setNewPassword("");
          setNotes("");
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.message || "Failed to approve request",
          });
        },
      }
    );
  };

  const handleReject = () => {
    rejectMutation.mutate(
      { requestId: request._id, data: { notes } },
      {
        onSuccess: (response) => {
          addToast({
            type: "success",
            message: response?.message || "Password reset request rejected",
          });
          onClose();
          setNotes("");
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.message || "Failed to reject request",
          });
        },
      }
    );
  };

  if (!isOpen || !request) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-md p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Password Reset Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm">
              <span className="font-medium">User:</span> {request?.user?.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {request?.user?.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Role:</span> {request?.user?.role?.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Requested:</span>{" "}
              {new Date(request?.requestedAt).toLocaleString()}
            </p>
          </div>

          {/* New Password Field */}
          <div>
            <label className={labelClass}>Set New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <div className="mt-2">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="mr-2"
                />
                Show password
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This password will be shared with the user. They will be forced to change it on their next login.
            </p>
          </div>

          {/* Notes Field */}
          <div>
            <label className={labelClass}>Notes (Optional)</label>
            <textarea
              placeholder="Add any notes about this password reset"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <StyledButton
              name="Reject"
              onClick={handleReject}
              variant="tertiary"
              disabled={rejectMutation.isPending}
            />
            <StyledButton
              name="Approve & Reset"
              onClick={handleApprove}
              variant="primary"
              disabled={approveMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;

