import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
	const getMatches = () =>
		typeof window !== 'undefined' ? window.matchMedia(query).matches : false;
	const [matches, setMatches] = useState(() => getMatches());

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		setMatches(mediaQuery.matches);
		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [query]);

	return matches;
};
