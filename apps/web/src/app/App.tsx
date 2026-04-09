import { type FC } from 'react';

import Header from '@/components/Header';
import BodyFull from '@/components/BodyFull';

const App: FC = () => {
	return (
		<div className="min-h-screen flex flex-col text-content-primary transition-colors duration-300 relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-32 left-[8%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
				<div className="absolute top-24 right-[10%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
				<div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
			</div>
			<Header />
			<main className="flex-1 overflow-hidden relative z-10">
				<BodyFull />
			</main>
			<footer className="relative z-10 px-6 pb-5 pt-2">
				<div className="mx-auto max-w-[1800px] rounded-full border border-white/10 bg-slate-950/50 backdrop-blur-xl py-3 px-6 text-center text-xs text-slate-400">
					{import.meta.env.VITE_APP_NAME} · {import.meta.env.VITE_APP_DESCRIPTION}
				</div>
			</footer>
		</div>
	);
};

export default App;
