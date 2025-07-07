import { create, ApisauceInstance} from "apisauce";
import Cookies from "universal-cookie";
import settings from "./settings";

const cookies = new Cookies();

const getToken = async (): Promise<string | undefined> => {
  try {
    return cookies.get("auth_token");
  } catch (e) {
    console.error("Error getting access token: ", e);
    return undefined;
  }
};

const privateAPIClientMultiForm: ApisauceInstance = create({
  baseURL: settings.API_BASE_URL,
});

privateAPIClientMultiForm.addAsyncRequestTransform(async (request) => {
  const authToken = await getToken();
  if (!authToken) {
    console.warn("No auth token found");
    return;
  }

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "multipart/form-data",
  };
});

export default privateAPIClientMultiForm;
