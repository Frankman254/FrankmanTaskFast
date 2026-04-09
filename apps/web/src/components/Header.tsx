import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Monitor, LayoutTemplate, Sparkles } from 'lucide-react';

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
		<header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
			<div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#34d399,#22d3ee)] flex items-center justify-center shadow-[0_10px_30px_rgba(34,211,238,0.28)]">
						<LayoutTemplate className="w-5 h-5 text-slate-950" />
					</div>
					<div>
						<div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan-300/80 mb-1 font-display">
							<Sparkles className="w-3 h-3" />
							MVP Workspace
						</div>
						<h1 className="text-lg font-display font-bold text-white leading-tight">
							{import.meta.env.VITE_APP_NAME}
						</h1>
						<p className="text-[11px] text-slate-400 leading-tight">
							{import.meta.env.VITE_APP_DESCRIPTION}
						</p>
					</div>
				</div>

				<button
					onClick={cycleTheme}
					className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
					title={`Tema: ${themeLabel}`}
				>
					<ThemeIcon className="w-4 h-4" />
					<span className="hidden sm:inline text-xs">{themeLabel}</span>
				</button>
			</div>
		</header>
	);
}
