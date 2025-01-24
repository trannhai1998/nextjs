'use client';

import { getAccessTokenFromLocalStorage } from '@/lib/utils';
import { get } from 'http';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const menuItems = [
	{
		title: 'Món ăn',
		href: '/menu',
	},
	{
		title: 'Đơn hàng',
		href: '/orders',
	},
	{
		title: 'Đăng nhập',
		href: '/login',
		authRequired: false, // False mean when user is not logged in it will show this link
	},
	{
		title: 'Quản lý',
		href: '/manage/dashboard',
		authRequired: true,
	},
];

export default function NavItems({ className }: { className?: string }) {
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
	}, []);

	return menuItems.map((item) => {
		if (
			(item.authRequired === false && isAuth) ||
			(item.authRequired === true && !isAuth)
		)
			return null;
		return (
			<Link href={item.href} key={item.href} className={className}>
				{item.title}
			</Link>
		);
	});
}
