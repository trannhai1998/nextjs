import http from '@/lib/http';
import {
	AccountResType,
	ChangePasswordBodyType,
} from '@/schemaValidations/account.schema';

const accountApiRequest = {
	me: () => http.get<AccountResType>('accounts/me'),
	updateMe: (body: any) => http.put<AccountResType>('accounts/me', body),
	changePassword: (body: ChangePasswordBodyType) =>
		http.put<AccountResType>('accounts/change-password', body),
};

export default accountApiRequest;
