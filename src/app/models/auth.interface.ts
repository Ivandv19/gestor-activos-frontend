export interface UserData {
	id: number;
	email: string;
	nombre: string;
	rol: string;
	foto_url?: string;
	departamento?: string;
}

export interface LoginResponse {
	token: string;
	userData: UserData;
	message: string;
}

export interface TokenPayload {
	id: number;
	email: string;
	rol: string;
	exp: number;
	iat: number;
}
