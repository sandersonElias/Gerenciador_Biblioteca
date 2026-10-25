import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      const tokenLimpo = token.replace(/^Bearer\s+/i, "");
      config.headers.Authorization = `Bearer ${tokenLimpo}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      const tinhaToken = Boolean(localStorage.getItem("auth_token"));
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Evita loop de redirecionamento quando já estamos na tela de login
      if (tinhaToken && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Acesso negado
    if (error.response?.status === 403) {
      const message =
        (error.response?.data as any)?.message ||
        "Acesso negado. Você não tem permissão para esta ação.";
      console.warn("Access denied:", message);
    }

    // Erros do servidor
    if (error.response?.status && error.response.status >= 500) {
      console.error(
        "Server error:",
        error.response.status,
        error.response.data,
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;
