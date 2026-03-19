
import { request } from './apiClient';

export const getAllDoctors = (params?: { specialization?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/doctors${query ? `?${query}` : ""}`);
};

export const getDoctorSlots = (doctorId: string, date: string) => 
    request(`/doctors/${doctorId}/slots?date=${date}`);
