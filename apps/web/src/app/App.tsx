import { type FC } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PrincipalTable from '@/components/PrincipalTable';
import RightBar from '@/components/RightBar';

const App: FC = () => {
	return (
		<>
			<div className="min-h-screen flex flex-col justify-between">
				<Header className="" />
				<div className="flex flex-col justify-center bg-gray-100 max-w-[2000px]">
					<main className="">
						<div className="flex flex-row h-[calc(80vh-100px)]">
							<RightBar className=" color-red-500" />
							<PrincipalTable className="" />
						</div>
					</main>
				</div>
				<Footer className="w-full mb-0" />
			</div>
		</>
	);
};

export default App;
