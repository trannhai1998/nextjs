import accountApiRequest from '@/app/apiRequests/account';
import { AccountResType } from '@/schemaValidations/account.schema';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAccountMe = () => {
	return useQuery({
		queryKey: ['accountProfile'],
		queryFn: accountApiRequest.me,
	});
};

export const useUpdateMe = () => {
	return useMutation({
		mutationFn: accountApiRequest.updateMe,
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: accountApiRequest.changePassword,
	});
};
