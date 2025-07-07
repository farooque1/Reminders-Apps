import axios, { AxiosInstance } from 'axios';
import settings from "./settings";

const apiClient: AxiosInstance = axios.create({
  baseURL: settings.API_BASE_URL,
});

export default apiClient;
