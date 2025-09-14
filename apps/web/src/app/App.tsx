import { type FC } from 'react'

const App: FC = () => {
	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold text-gray-900">
						{import.meta.env.VITE_APP_NAME || 'FrankmanTaskFast'}
					</h1>
					<p className="mt-2 text-gray-600">
						{import.meta.env.VITE_APP_DESCRIPTION || 'Kanban-Gantt Project Management'}
					</p>
				</div>
			</header>
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
						<div className="text-center">
							<h2 className="text-2xl font-semibold text-gray-700 mb-4">
								Welcome to {import.meta.env.VITE_APP_NAME || 'FrankmanTaskFast'}
							</h2>
							<p className="text-gray-500">
								Your project management application is ready!
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default App
