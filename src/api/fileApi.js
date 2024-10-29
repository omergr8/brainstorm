import axiosInstance from "./axiosInstance";

export const uploadDocumentApi = async (file, meetingId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("meeting_id", meetingId);
    // Send POST request to upload file
    const response = await axiosInstance.post("/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Required for file upload
      },
    });

    return response.data; // Return success message
  } catch (error) {
    throw error.response?.data?.detail || "File upload failed";
  }
};
