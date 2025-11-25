export default function RightBar({ className = '' }: { className?: string }) {
	return (
		<div
			className={`shadow-md border-l border-gray-200 bg-gray-100 h-full w-1/4 ${className}`}
		>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-full">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					Table of Contents
				</h2>
				<ul className="list-disc list-inside">
					<li>
						<a href="#section1">Section 1</a>
					</li>
				</ul>
				<ul className="list-disc list-inside">
					<li>
						<a href="#section1">Section 2</a>
					</li>
				</ul>
				<ul className="list-disc list-inside">
					<li>
						<a href="#section1">Section 3</a>
					</li>
				</ul>
			</div>
		</div>
	);
}
