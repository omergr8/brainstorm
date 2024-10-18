import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:5000", // Set the base URL for all requests
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/upload", formData);
    return response.data;
};

export const transcribeAudio = async (audio) => {
    const formData = new FormData();
    formData.append("audio", audio);
    console.log([...formData], audio); // Log FormData contents
    const response = await apiClient.post("/transcribe", formData);
    return response.data;
};
