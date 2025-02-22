import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/manage'];
const unAuthPaths = ['/login'];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('accessToken')?.value;
	const refreshToken = request.cookies.get('refreshToken')?.value;
	// Private path and NOT authenticated => login
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!refreshToken
	) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Login path and YES authenticated => home
	if (
		unAuthPaths.some((path) => pathname.startsWith(path)) &&
		!!refreshToken
	) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	// Private path and YES authenticated But accessToken expired => login
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!accessToken &&
		refreshToken
	) {
		const url = new URL('/logout', request.url);
		url.searchParams.set('refreshToken', refreshToken);

		return NextResponse.redirect(url);
	}

	return NextResponse.next();
	// return NextResponse.redirect(new URL('/home', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/manage/:path*', '/login'],
};
