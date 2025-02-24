'use client';

import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RefreshToken from './refresh-token';
import {
	getAccessTokenFromLocalStorage,
	removeTokensFromLocalStorage,
} from '@/lib/utils';
import { useContext, useEffect, useState, createContext } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	},
});

const AppContext = createContext({
	isAuth: false,
	setIsAuth: (isAuth: boolean) => {},
});

export const useAppContext = () => {
	return useContext(AppContext);
};

export default function App({ children }: { children: React.ReactNode }) {
	const [isAuth, setIsAuthState] = useState(false);

	useEffect(() => {
		const accessToken = getAccessTokenFromLocalStorage();
		if (accessToken) {
			setIsAuthState(true);
		}
	}, []);

	const setIsAuth = (isAuth: boolean) => {
		setIsAuthState(!!isAuth);

		if (!isAuth) {
			removeTokensFromLocalStorage();
		}
	};

	return (
		// Provide the client to your App
		<AppContext value={{ isAuth, setIsAuth }}>
			<QueryClientProvider client={queryClient}>
				{children}
				<RefreshToken />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AppContext>
	);
}
