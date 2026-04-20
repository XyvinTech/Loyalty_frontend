import React, { useState } from "react";
import StyledButton from "../../ui/StyledButton";

const ForcePasswordChangeModal = ({
  isOpen,
  onSubmit,
  isSubmitting = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentPassword.length < 6) {
      setError("Current password must be at least 6 characters.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    onSubmit({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            For security, please create a new password before continuing.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter current password"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <StyledButton
            type="submit"
            name="Update Password"
            isLoading={isSubmitting}
            loadingLabel="Saving…"
            className="w-full justify-center"
          />
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChangeModal;

