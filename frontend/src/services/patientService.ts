
import { request } from './apiClient';

export const getPatientProfile = () => request("/patients/profile");

export const updatePatientProfile = (data: any) =>
    request("/patients/profile", { method: "PUT", body: JSON.stringify(data) });

export const getPatientDashboardStats = () => request("/patients/dashboard/stats");
