export default function PrincipalTable({
	className = '',
}: {
	className?: string;
}) {
	return (
		<div
			className={`w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-full ${className}`}
		>
			<div className="border-4 border-dashed border-gray-200 rounded-lg h-full flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">
						Welcome to {import.meta.env.VITE_APP_NAME}
					</h2>
					<p className="text-gray-500">
						{import.meta.env.VITE_APP_DESCRIPTION}
					</p>
				</div>
			</div>
		</div>
	);
}
