'use client';

import {
	checkAndRefreshToken,
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
	useEffect(() => {
		if (UNAUTHENTICATED_PATHS.includes(pathname)) {
			return;
		}

		// Don't move out the logic get access and refresh token in function `checkAndRefreshToken`
		// because when checkAndRefreshToken call => we have new tokens
		// Avoid bug old token when refresh token

		let interval: any = null;

		checkAndRefreshToken({
			onError: () => {
				clearInterval(interval);
			},
		});

		interval = setInterval(checkAndRefreshToken, TIMEOUT);

		return () => {
			clearInterval(interval);
		};
	}, [pathname]);

	return null;
}
