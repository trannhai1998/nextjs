'use client';

import { useAppContext } from '@/components/app-provider';
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const Logout = () => {
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
	}, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);
	return <div>Logout...</div>;
};

export default Logout;
