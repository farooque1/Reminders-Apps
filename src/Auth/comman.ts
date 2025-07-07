import apiClient from "./client";
import privateAPIClient from "./privateClient";
import { APIUrlStrings } from "./endpoint";
import { create } from "apisauce";
import settings from "./settings";
import privateAPIClientDownload from "./privateClientDownload";

interface LoginPayload {
  email: string;
  password: string;
}

interface HeaderType {
  [key: string]: string;
}

interface GenericPayload {
  [key: string]: any;
}

const GlobalAPI = create({
  baseURL: settings.API_BASE_URL,
});

// Login

export const APIRegister = (payload: any) => {
  return apiClient.post(APIUrlStrings.register, payload);
};

export const APILogin = (payload: LoginPayload) => {
  return apiClient.post(APIUrlStrings.login, payload);
};

export const APIForget = (payload: any) => {
  return apiClient.post(APIUrlStrings.forget, payload);
};

export const APIResetForget = (payload: any) => {
  return apiClient.post(APIUrlStrings.reset_password, payload);
};

export const APILogout = () => {
  return privateAPIClient.post(APIUrlStrings.logout);
};

export const APIUserRegister = (payload: any) => {
  return privateAPIClient.post(APIUrlStrings.user_register, payload);
};



export const APIRemindersList = () => {
  return privateAPIClient.get(APIUrlStrings.Reminders);
};

export const APIAddReminder = (payload:any) => {
  return privateAPIClient.post(APIUrlStrings.Reminders, payload);
};


export const APIUserAppointmentAdd = (payload: any) => {
  return privateAPIClient.post(APIUrlStrings.patient_add, payload);
};

export const APIPatientRecords = (payload: any) => {
  return privateAPIClient.get(APIUrlStrings.patient_records, payload);
};

export const APIPatientDetails = (id:number) => {
  return privateAPIClient.get(`${APIUrlStrings.patient_details}/${id}`);
};

export const APIDoctorAvailable = (payload: any) => {
  return privateAPIClientDownload.get(APIUrlStrings.Doctor_available_slots_Appointment,payload);
};



export const APIPatientPayment = (payload: any) => {
  return privateAPIClientDownload.post(APIUrlStrings.patient_payment, payload,{
    responseType: "blob",
  });
};

export const APIUserAppointmentBook = (payload: any) => {
  return privateAPIClient.post(APIUrlStrings.patient_appointments_add, payload);
};

export const APIDoctorRegister = (payload: any) => {
  return privateAPIClientDownload.post(APIUrlStrings.Doctor_Register, payload);
};

export const APIDoctorNameList = () => {
  return privateAPIClientDownload.get(APIUrlStrings.Doctors_name);
};

export const APIDoctorSlots = (payload: any) => {
  return privateAPIClientDownload.post(APIUrlStrings.Doctor_Slots, payload);
};

export const APITimeSlots = () => {
  return privateAPIClientDownload.get(APIUrlStrings.Time_slote);
};
