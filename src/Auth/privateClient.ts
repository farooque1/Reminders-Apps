import { create, ApisauceInstance } from "apisauce";
import Cookies from "universal-cookie";
import settings from "./settings";

const cookies = new Cookies();

// Function to retrieve token from cookies
const getToken = async (): Promise<string | undefined> => {
  try {
    return cookies.get("token");
  } catch (e) {
    console.error("Error getting access token:", e);
    return undefined;
  }
};

const privateAPIClient: ApisauceInstance = create({
  baseURL: settings.API_BASE_URL,
});

// Attach authorization headers before request is sent
privateAPIClient.addAsyncRequestTransform(async (request) => {
  const authToken = await getToken();
  console.log("🚀 Token:", authToken);

  if (!authToken) {
    console.warn("------ Invalid Access ------");
    return;
  }

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };
});

// Optional: Uncomment and update this section as needed
/*
privateAPIClient.addResponseTransform((response) => {
  if (response.status === 401) {
    alert("Session is Expired");
    cookies.remove("auth_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("Roles");
    localStorage.removeItem("Roles_id");
    localStorage.removeItem("Name");
    localStorage.removeItem("Menu");
    window.location.href = "/login";
  }
});
*/

export default privateAPIClient;



// import axios, { AxiosInstance } from "axios";
// import { getToken } from "../utils/cookies";
// import settings from "./settings";

// const privateAPIClient: AxiosInstance = axios.create({
//   baseURL: settings.API_BASE_URL,
// });

// // Request Interceptor for adding the Authorization token
// privateAPIClient.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// privateAPIClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Handle 401 (Unauthorized)
//     if (error.response?.status === 401) {
//       // Handle session expiration or unauthorized access
//       // You can add logic here to redirect to login, etc.
//       console.error("Session expired or unauthorized access");
//     }
//     return Promise.reject(error);
//   }
// );

// export default privateAPIClient;

