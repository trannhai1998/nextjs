'use client';

import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
	setAccessTokenToLocalStorage,
	setRefreshTokenToLocalStorage,
} from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { authApiRequest } from '@/app/apiRequests/auth';

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token'];
const TIMEOUT = 1000;

export default function RefreshToken() {
	const pathname = usePathname();
	console.log(pathname);
	useEffect(() => {
		if (UNAUTHENTICATED_PATHS.includes(pathname)) {
			return;
		}

		// Don't move out the logic get access and refresh token in function `checkAndRefreshToken`
		// because when checkAndRefreshToken call => we have new tokens
		// Avoid bug old token when refresh token

		let interval: any = null;
		const checkAndRefreshToken = async () => {
			const accessToken = getAccessTokenFromLocalStorage();
			const refreshToken = getRefreshTokenFromLocalStorage();

			console.log('Run refresh');

			if (!accessToken || !refreshToken) {
				return;
			}

			// Decode get expired time of token
			const decodedAccessToken = jwt.decode(accessToken) as {
				exp: number;
				iat: number;
			};
			const decodedRefreshToken = jwt.decode(refreshToken) as {
				exp: number;
				iat: number;
			};

			console.log(accessToken);

			// expired time of token is epoch time (second)
			// when u use new Date().getTime() => u get epoch time (millisecond)

			const now = Math.round(new Date().getTime() / 1000);

			// When token is expired
			if (decodedAccessToken.exp <= now) {
				return;
			}
			// When token exp - now < 1/3 of token life time => refresh token
			if (
				decodedAccessToken.exp - now <
				(decodedAccessToken.exp - decodedAccessToken.iat) / 3
			) {
				// Call refresh token API
				try {
					const res = await authApiRequest.refreshToken();
					console.log('Res:::', res.payload.data);
					setAccessTokenToLocalStorage(res.payload.data.accessToken);
					setRefreshTokenToLocalStorage(
						res.payload.data.refreshToken,
					);
				} catch (error) {
					clearInterval(interval);
				}
			}
		};
		checkAndRefreshToken();

		interval = setInterval(checkAndRefreshToken, TIMEOUT);

		return () => {
			clearInterval(interval);
		};
	}, [pathname]);

	return null;
}
