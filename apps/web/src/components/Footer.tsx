export default function Footer({ className = '' }: { className?: string }) {
	return (
		<div
			className={`bg-gray-100 shadow-md border-t border-gray-200 ${className}`}
		>
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<p className="text-gray-600">
					{import.meta.env.VITE_APP_DESCRIPTION}
				</p>
			</div>
		</div>
	);
}
