import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth")
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = res?.data?.accessToken;

          if (newAccessToken) {
            localStorage.setItem("token", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (err) {
          // RefreshToken bhi expire — tab hi logout karo
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        // Koi refreshToken nahi — logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;