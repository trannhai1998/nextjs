import http from '@/lib/http';
import {
	LoginBodyType,
	LoginResType,
	LogoutBodyType,
	RefreshTokenBodyType,
	RefreshTokenResType,
} from '@/schemaValidations/auth.schema';

export const authApiRequest = {
	sLogin: (body: LoginBodyType) =>
		http.post<LoginResType>('auth/login', body),
	login: (body: LoginBodyType) =>
		http.post<LoginResType>('api/auth/login', body, {
			baseUrl: '',
		}),
	sLogout: (body: LogoutBodyType & { accessToken: string }) => {
		return http.post(
			'auth/logout',
			{ refreshToken: body.refreshToken },
			{
				headers: {
					Authorization: `Bearer ${body.accessToken}`,
				},
			},
		);
	},
	logout: () => http.post('api/auth/logout', {}, { baseUrl: '' }),
	sRefreshToken: (body: RefreshTokenBodyType) => {
		return http.post<RefreshTokenResType>('auth/refresh-token', body);
	},
	refreshTokenRequest: null as Promise<{
		status: number;
		payload: RefreshTokenResType;
	}> | null,
	refreshToken: async function () {
		if (this.refreshTokenRequest) {
			return this.refreshTokenRequest;
		}

		this.refreshTokenRequest = http.post<RefreshTokenResType>(
			'api/auth/refresh-token',
			{},
			{ baseUrl: '' },
		);
		const result = await this.refreshTokenRequest;
		this.refreshTokenRequest = null;

		return result;
	},
};
