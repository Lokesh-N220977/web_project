
import { request } from './apiClient';

export const authApi = {
    login: (email: string, password: string) =>
        request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

    register: (data: any) =>
        request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

    getProfile: () => request("/auth/my-profile"),
};
