import api from "@/lib/api";
import { UserProfile } from "@/store/auth.store";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: UserProfile;
}

export const loginUser = async (
	payload: LoginPayload
): Promise<LoginResponse> => {
	const response = await api.post(
		"/auth/login",
		payload
	);

	return response.data;
};

export const registerUser = async (
	payload: RegisterPayload
) => {
	const response = await api.post(
		"/auth/register",
		payload
	);

	return response.data;
};

export const getProfile = async (): Promise<UserProfile> => {
	const response = await api.get("/auth/profile");
	return response.data;
};

export interface UpdateProfilePayload {
	name?: string;
	phone?: string | null;
	linkedin?: string | null;
	github?: string | null;
	profilePicture?: string | null;
}

export const updateProfile = async (
	payload: UpdateProfilePayload
): Promise<UserProfile> => {
	const response = await api.put("/auth/profile", payload);
	return response.data;
};

export interface UpdatePasswordPayload {
	currentPassword?: string;
	newPassword?: string;
}

export const updatePassword = async (
	payload: UpdatePasswordPayload
): Promise<{ message: string }> => {
	const response = await api.put("/auth/password", payload);
	return response.data;
};

export const upgradePlan = async (): Promise<UserProfile> => {
	const response = await api.post("/auth/upgrade");
	return response.data;
};

