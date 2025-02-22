import { clsx, type ClassValue } from 'clsx';
import { UseFormSetError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { EntityError } from './http';
import { toast } from '@/hooks/use-toast';

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
