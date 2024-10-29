import axiosInstance from "./axiosInstance";

export const createMeetingApi = async (meetingData) => {
  try {
    const response = await axiosInstance.post("/meeting/", meetingData);
    return response.data; // { meetingId: "...", name: "..." }
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
