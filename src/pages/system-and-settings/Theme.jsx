import React, { useState, useEffect } from "react";
import StyledButton from "../../ui/StyledButton";
import { useThemeSettings } from "../../hooks/useThemeSettings";
import useUiStore from "../../store/ui";

const Theme = () => {
  const { useGetThemeSettings, useResetThemeSettings, useUpdateThemeSettings } =
    useThemeSettings();
  const updateMutation = useUpdateThemeSettings();
  const resetMutation = useResetThemeSettings();
  const { data: themeData } = useGetThemeSettings();
  const { addToast } = useUiStore();
  const [localTheme, setLocalTheme] = useState(themeData?.data || {});

  useEffect(() => {
    if (themeData?.data) {
      setLocalTheme(themeData.data);
    }
  }, [themeData]);

  const handleThemeChange = (key, value) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    updateMutation.mutate(
      {
        themeData: localTheme,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Theme settings updated successfully.",
          });
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.message,
          });
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Theme Settings
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <StyledButton
            name="Save Changes"
            onClick={handleSaveChanges}
            isLoading={updateMutation.isPending}
            loadingLabel="Saving…"
            disabled={resetMutation.isPending}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Colors</h2>
          <div className="space-y-4">
            {["primaryColor", "secondaryColor", "accentColor"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace("Color", "")}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded border shadow-sm"
                    style={{ backgroundColor: localTheme[key] }}
                  />
                  <input
                    type="text"
                    value={localTheme[key] || ""}
                    onChange={(e) => handleThemeChange(key, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={localTheme.fontFamily || "Inter"}
                onChange={(e) =>
                  handleThemeChange("fontFamily", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Font Size
              </label>
              <select
                value={localTheme.baseFontSize || "Medium (16px)"}
                onChange={(e) =>
                  handleThemeChange("baseFontSize", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Small (14px)">Small (14px)</option>
                <option value="Medium (16px)">Medium (16px)</option>
                <option value="Large (18px)">Large (18px)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
            <p
              style={{
                fontFamily: localTheme.fontFamily,
                fontSize: localTheme.baseFontSize,
              }}
            >
              This is how your text will look
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Layout</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius
              </label>
              <select
                value={localTheme.borderRadius || "Medium (8px)"}
                onChange={(e) =>
                  handleThemeChange("borderRadius", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Small (4px)">Small (4px)</option>
                <option value="Medium (8px)">Medium (8px)</option>
                <option value="Large (12px)">Large (12px)</option>
                <option value="Extra Large (16px)">Extra Large (16px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Spacing
              </label>
              <select
                value={localTheme.baseSpacing || "Normal (16px)"}
                onChange={(e) =>
                  handleThemeChange("baseSpacing", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Compact (12px)">Compact (12px)</option>
                <option value="Normal (16px)">Normal (16px)</option>
                <option value="Relaxed (20px)">Relaxed (20px)</option>
                <option value="Spacious (24px)">Spacious (24px)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <StyledButton
              name="Reset to Defaults"
              variant="secondary"
              className="w-full justify-center"
              onClick={() =>
                resetMutation.mutate(undefined, {
                  onSuccess: () => {
                    addToast({
                      type: "success",
                      message: "Theme reset to defaults.",
                    });
                  },
                  onError: (error) => {
                    addToast({
                      type: "error",
                      message:
                        error?.response?.data?.message ?? "Reset failed.",
                    });
                  },
                })
              }
              isLoading={resetMutation.isPending}
              loadingLabel="Resetting…"
              disabled={updateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Theme;
