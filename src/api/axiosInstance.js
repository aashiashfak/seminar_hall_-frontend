import axios from "axios";

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to include the access token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.access_token) {
      config.headers["Authorization"] = `Bearer ${userData.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const userData = JSON.parse(localStorage.getItem("userData"));
      const refreshToken = userData?.refresh_token;

      try {
        const response = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        // Update local storage with new access token
        userData.access_token = response.data.access;
        localStorage.setItem("userData", JSON.stringify(userData));

        // Update the original request with the new token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error", refreshError);
        // Handle refresh token failure (e.g., redirect to login)
        localStorage.removeItem("userData");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
