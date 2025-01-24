import accountApiRequest from '@/app/apiRequests/account';
import { useQuery } from '@tanstack/react-query';

export const useAccountProfile = () => {
	return useQuery({
		queryKey: ['accountProfile'],
		queryFn: accountApiRequest.me,
	});
};