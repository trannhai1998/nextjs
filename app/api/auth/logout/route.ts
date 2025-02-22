import { authApiRequest } from '@/app/apiRequests/auth';
import { LoginBodyType } from '@/schemaValidations/auth.schema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { HttpError } from '@/lib/http';

export async function POST(request: Request) {
	const cookieStore = await cookies();
	try {
		const accessToken = cookieStore.get('accessToken')?.value;
		const refreshToken = cookieStore.get('refreshToken')?.value;

		cookieStore.delete('accessToken');
		cookieStore.delete('refreshToken');

		if (!accessToken || !refreshToken) {
			return Response.json(
				{
					message: 'Token not found',
				},
				{
					status: 200,
				},
			);
		}

		const result = await authApiRequest.sLogout({
			refreshToken,
			accessToken,
		});

		return Response.json(result.payload);
	} catch (error) {
		if (error instanceof HttpError) {
			return Response.json(error.payload, {
				status: error.status,
			});
		} else {
			return Response.json(
				{
					message: 'Something went wrong',
				},
				{
					status: 500,
				},
			);
		}
	}
}
