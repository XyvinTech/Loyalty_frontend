import apiClient from "./client";
import { validateImageFileForUpload } from "../utils/validateImageFile";

const uploadUrl = "/upload";

const uploadApi = {
  // Upload Image
  uploadImage: async (imageFile) => {
    const check = validateImageFileForUpload(imageFile);
    if (!check.ok) {
      throw new Error(check.message);
    }

    const formData = new FormData();
    formData.append("photo", imageFile);

    const response = await apiClient.post(`${uploadUrl}/single`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update Image
  updateImage: async (imageFile) => {
    const check = validateImageFileForUpload(imageFile);
    if (!check.ok) {
      throw new Error(check.message);
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.put(`${uploadUrl}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Delete Image
  deleteImage: async () => {
    const response = await apiClient.delete(`${uploadUrl}/image`);
    return response.data;
  },
};

export default uploadApi;
