import axios from "axios";

export const ACCESS_TOKEN_KEY = "accessToken";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAxiosAccessToken = (accessToken: string | null) => {
  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return;
  }

  delete axiosInstance.defaults.headers.common.Authorization;
};

export default axiosInstance;
