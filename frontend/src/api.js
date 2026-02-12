import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor to handle 401 errors (token expiry)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
          
          localStorage.setItem("access", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return API(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/";
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem("access");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

// Auth API calls
export const authAPI = {
  login: (credentials) => API.post("token/", credentials),
  register: (userData) => API.post("register/", userData),
  refreshToken: (refresh) => API.post("token/refresh/", { refresh }),
  getProfile: () => API.get("profile/"),
  updateProfile: (userData) => API.put("profile/", userData),
  deleteProfile: () => API.delete("profile/"),
  requestPasswordReset: (email) => API.post("password-reset/", { email }),
  resetPassword: (uidb64, token, password) => 
    API.post(`password-reset/${uidb64}/${token}/`, { password }),
};

