import http from '@/lib/http';
import { AccountResType } from '@/schemaValidations/account.schema';

const accountApiRequest = {
	me: () => http.get<AccountResType>('accounts/me'),
	updateMe: (body: any) => http.put<AccountResType>('accounts/me', body),
};

export default accountApiRequest;
