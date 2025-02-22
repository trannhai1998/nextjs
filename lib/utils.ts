import { clsx, type ClassValue } from 'clsx';
import { UseFormSetError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { EntityError } from './http';
import { toast } from '@/hooks/use-toast';
import jwt from 'jsonwebtoken';
import { authApiRequest } from '@/app/apiRequests/auth';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
	return path.replace(/\/+/g, '/');
};

export const handleErrorApi = ({
	error,
	setError,
	duration,
}: {
	error: any;
	setError?: UseFormSetError<any>;
	duration?: number;
}) => {
	if (error instanceof EntityError && setError) {
		error.payload.errors.forEach((item) => {
			setError(item.field, {
				type: 'server',
				message: item.message,
			});
		});
	} else {
		toast({
			title: 'Lỗi',
			description: error?.payload?.message ?? 'Lỗi không xác định',
			variant: 'destructive',
			duration: duration ?? 5000,
		});
	}
};

const isWindow = typeof window !== 'undefined';
export const getAccessTokenFromLocalStorage = () => {
	return isWindow ? localStorage?.getItem('accessToken') : null;
};

export const getRefreshTokenFromLocalStorage = () => {
	return isWindow ? localStorage?.getItem('refreshToken') : null;
};

export const setAccessTokenToLocalStorage = (token: string) => {
	return isWindow ? localStorage?.setItem('accessToken', token) : null;
};

export const setRefreshTokenToLocalStorage = (token: string) => {
	return isWindow ? localStorage?.setItem('refreshToken', token) : null;
};

export const removeTokensFromLocalStorage = () => {
	if (isWindow) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	}
};

export const checkAndRefreshToken = async (params: {
	onError?: () => void;
	onSuccess?: () => void;
}) => {
	const accessToken = getAccessTokenFromLocalStorage();
	const refreshToken = getRefreshTokenFromLocalStorage();

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

	// expired time of token is epoch time (second)
	// when u use new Date().getTime() => u get epoch time (millisecond)

	const now = Math.round(new Date().getTime() / 1000);

	console.log('Run check refresh token');
	// When refresh token is expired
	if (decodedRefreshToken.exp <= now) {
		removeTokensFromLocalStorage();

		params.onError && params.onError();
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
			setAccessTokenToLocalStorage(res.payload.data.accessToken);
			setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
			params.onSuccess && params.onSuccess();
		} catch (error) {
			if (params?.onError) {
				params.onError();
			}
		}
	}
};
