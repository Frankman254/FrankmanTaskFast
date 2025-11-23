export default function Header({ className = '' }: { className?: string }) {
	return (
		<div
			className={`bg-gray-100 shadow-md border-b border-gray-200 ${className}`}
		>
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-gray-900">
					{import.meta.env.VITE_APP_NAME}
				</h1>
				<p className="mt-2 text-gray-600">
					{import.meta.env.VITE_APP_DESCRIPTION}
				</p>
			</div>
		</div>
	);
}
