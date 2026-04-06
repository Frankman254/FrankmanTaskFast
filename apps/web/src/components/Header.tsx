import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Monitor, LayoutTemplate } from 'lucide-react';

export default function Header() {
	const { theme, setTheme } = useTheme();

	const cycleTheme = () => {
		if (theme === 'light') setTheme('dark');
		else if (theme === 'dark') setTheme('system');
		else setTheme('light');
	};

	const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
	const themeLabel = theme === 'dark' ? 'Oscuro' : theme === 'light' ? 'Claro' : 'Sistema';

	return (
		<header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
			<div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
						<LayoutTemplate className="w-4 h-4 text-white" />
					</div>
					<div>
						<h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
							{import.meta.env.VITE_APP_NAME}
						</h1>
						<p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
							{import.meta.env.VITE_APP_DESCRIPTION}
						</p>
					</div>
				</div>

				<button
					onClick={cycleTheme}
					className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
					title={`Tema: ${themeLabel}`}
				>
					<ThemeIcon className="w-4 h-4" />
					<span className="hidden sm:inline text-xs">{themeLabel}</span>
				</button>
			</div>
		</header>
	);
}
