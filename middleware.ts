import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/manage'];
const unAuthPaths = ['/login'];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	console.log(request.cookies);
	const isAuth = !!request.cookies.get('accessToken');
	console.log(request.cookies.get('accessToken'));
	console.log(isAuth);
	if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
	// return NextResponse.redirect(new URL('/home', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/manage/:path*', '/login'],
};
