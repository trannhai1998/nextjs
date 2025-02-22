import accountApiRequest from '@/app/apiRequests/account';
import { authApiRequest } from '@/app/apiRequests/auth';
import { cookies } from 'next/headers';
import React from 'react';

const DashboardManage = async () => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('accessToken')?.value!;

	let name = '';
	try {
		const result = await accountApiRequest.sMe(accessToken);
		name = result.payload.data.name;
	} catch (error: any) {
		if (error?.digest?.includes('NEXT_REDIRECT')) {
			throw error;
		}
	}
	return <div>Dashboard {name}</div>;
};

export default DashboardManage;
