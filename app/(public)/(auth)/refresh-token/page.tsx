'use client';

import { toast } from '@/hooks/use-toast';
import {
	checkAndRefreshToken,
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const Logout = () => {
	const router = useRouter();
	const ref = useRef<any>(null);
	const searchParams = useSearchParams();
	const refreshTokenFromUrl = searchParams.get('refreshToken');
	const redirect = searchParams.get('redirect');
	useEffect(() => {
		if (
			redirect &&
			!!refreshTokenFromUrl &&
			refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
		) {
			checkAndRefreshToken({
				onSuccess: () => router.push(redirect || '/'),
			});

			return;
		} else {
			router.push('/');
		}
	}, [router, refreshTokenFromUrl, redirect]);
	return <div>Refresh token...</div>;
};

export default Logout;
