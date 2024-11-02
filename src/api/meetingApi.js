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

export const joinMeetingApi = async (meetingId) => {
  try {
    // Send meeting_id as a query parameter
    const response = await axiosInstance.post(`/meeting/join/?meeting_id=${meetingId}`);
    return response.data; // returns a message indicating the join status
  } catch (error) {
    console.error("Error joining meeting:", error);
    throw error.response?.data?.detail || "Failed to join meeting";
  }
};

export const getMeetingApi = async (meetingId) => {
  try {
    const response = await axiosInstance.get(`/meeting/${meetingId}`);
    return response.data; // returns meeting details including participants
  } catch (error) {
    console.error("Error fetching meeting details:", error);
    throw error.response?.data?.detail || "Failed to fetch meeting details";
  }
};