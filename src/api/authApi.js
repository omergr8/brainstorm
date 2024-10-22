import axiosInstance from "./axiosInstance";

export const loginApi = async (credentials) => {
  const formData = new FormData();
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);
  console.log(credentials);
  const response = await axiosInstance.post("/login/", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
    },
  });

  return response.data;
};

export const signupApi = async (data) => {
  const response = await axiosInstance.post("/signup/", data);
  return response.data;
};
