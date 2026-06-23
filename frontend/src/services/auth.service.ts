import api from "@/lib/api";

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
