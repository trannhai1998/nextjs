'use client';

import { useAppContext } from '@/components/app-provider';
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef } from 'react';

function Logout() {
	const { mutateAsync } = useLogoutMutation();
	const router = useRouter();
	const ref = useRef<any>(null);
	const searchParams = useSearchParams();
	const refreshTokenFromUrl = searchParams.get('refreshToken');
	const accessTokenFromUrl = searchParams.get('accessToken');
	const { setIsAuth } = useAppContext();

	useEffect(() => {
		if (
			(!ref.current &&
				!!refreshTokenFromUrl &&
				refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
			(!ref.current &&
				!!accessTokenFromUrl &&
				accessTokenFromUrl === getAccessTokenFromLocalStorage())
		) {
			ref.current = mutateAsync;
			mutateAsync().then((res) => {
				setTimeout(() => {
					ref.current = null;
				}, 1000);
				setIsAuth(false);
				router.push('/login');
			});
		} else {
			router.push('/');
		}
	}, [
		mutateAsync,
		router,
		refreshTokenFromUrl,
		accessTokenFromUrl,
		setIsAuth,
	]);
	return <div>Logout...</div>;
}

const LogoutPage = () => {
	return (
		<Suspense>
			<Logout />
		</Suspense>
	);
};

export default LogoutPage;
