import React from 'react';

const HomeLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div>
			<div className='flex flex-col min-h-[53vh] md:min-h-[61vh] '>
				{children}
			</div>
			<footer className='bg-gray-800 text-white py-0 text-center'>
				<p>© 2023 Your Company. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default HomeLayout;
