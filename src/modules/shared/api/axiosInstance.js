import axios from "axios";
import { clearSession, getToken } from "../helpers/tokenStorage.js";
import { toApiError } from "./apiError.js";

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const token = getToken();

  if (config.skipAuth) {
    config.headers.delete("Authorization");
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.params) {
    config.params = Object.fromEntries(
      Object.entries(config.params).filter(
        ([, value]) =>
          value !== "" &&
          value !== null &&
          value !== undefined,
      ),
    );
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const currentToken = getToken();
    const sentAuthorization = error.config?.headers?.Authorization;

    const rejectedCurrentSession =
      !error.config?.skipAuth &&
      apiError.status === 401 &&
      currentToken &&
      sentAuthorization === `Bearer ${currentToken}`;

    if (rejectedCurrentSession) {
      clearSession();
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(apiError);
  },
);

export { instance };