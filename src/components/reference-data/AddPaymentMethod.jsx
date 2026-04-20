import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { usePaymentMethod } from "../../hooks/usePaymentMethod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

const AddPaymentMethod = ({ isOpen, onClose, editData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { useCreatePaymentMethod, useUpdatePaymentMethod } = usePaymentMethod();
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();
  const { addToast } = useUiStore();

  useEffect(() => {
    if (editData) {
      setValue("name", editData?.data?.name || "");
    }
  }, [editData, setValue]);

  const onSubmit = async (formData) => {
    try {
      const formDataToSubmit = { ...formData };

      const action = editData ? updateMutation : createMutation;
      const payload = editData
        ? { id: editData.data._id, paymentMethodData: formDataToSubmit }
        : formDataToSubmit;

      action.mutate(payload, {
        onSuccess: (data) => {
          addToast({ type: "success", message: data?.message });
          resetAndClose();
        },
        onError: (error) => {
          addToast({ type: "error", message: error?.response?.data?.message });
        },
      });
    } catch (error) {
      addToast({ type: "error", message: error.message });
    }
  };

  const resetAndClose = () => {
    reset({
      name: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-xl p-4 max-h-[80vh] min-h-[300px] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {editData ? "Edit Payment Method" : "Add New Payment Method"}
          </h2>
          <button
            onClick={() => resetAndClose()}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Name</label>
              <input
                {...register("name")}
                className={inputClass}
                value={watch("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            <StyledButton
              name="Cancel"
              onClick={() => resetAndClose()}
              variant="tertiary"
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
            />
            <StyledButton
              name={editData ? "Update" : "Add Payment Method"}
              type="submit"
              variant="primary"
              isLoading={
                createMutation.isPending || updateMutation.isPending
              }
              loadingLabel={editData ? "Saving…" : "Adding…"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethod;
