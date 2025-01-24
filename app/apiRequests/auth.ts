import http from '@/lib/http';
import {
	LoginBodyType,
	LoginResType,
	LogoutBodyType,
} from '@/schemaValidations/auth.schema';

export const authApiRequest = {
	sLogin: (body: LoginBodyType) =>
		http.post<LoginResType>('auth/login', body),
	login: (body: LoginBodyType) =>
		http.post<LoginResType>('api/auth/login', body, {
			baseUrl: '',
		}),
	sLogout: (body: LogoutBodyType & { accessToken: string }) => {
		console.log('AccessToken:::', body.accessToken);
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
	logout: () => http.post('api/auth/logout', {}, {baseUrl: ''}),
};
