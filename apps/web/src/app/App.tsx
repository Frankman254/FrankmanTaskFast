import { type FC } from 'react';

import Header from '@/components/Header';
import BodyFull from '@/components/BodyFull';

const App: FC = () => {
	return (
		<div className="min-h-screen flex flex-col bg-surface-primary text-content-primary transition-colors duration-300">
			<Header />
			<main className="flex-1 overflow-hidden">
				<BodyFull />
			</main>
			<footer className="border-t border-gray-200 dark:border-gray-800 py-3 px-6 text-center text-xs text-content-tertiary">
				{import.meta.env.VITE_APP_NAME} &middot; {import.meta.env.VITE_APP_DESCRIPTION}
			</footer>
		</div>
	);
};

export default App;
