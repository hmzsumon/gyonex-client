'use client';
import React from 'react';
import './CornerFrame.css';

type CornerFrameProps = {
	image1: string;
	image2: string;
	text: string;
};

const CornerFrame: React.FC<CornerFrameProps> = ({ image1, image2, text }) => {
	return (
		<div>
			<div className=' relative grid w-fit  card-wrapper'>
				<span className='corner-frame-card'></span>
				<span className='card-inner w-[9.7rem]'>
					<img
						src={image1}
						alt='img1'
						className='hover:scale-110 transition-transform duration-300'
					/>
				</span>
				<span className='card-inner w-[9.7rem]'>
					<img src={image2} alt='img2' className='' />
				</span>
				<span className='card_text_wrapper'>
					<span className='card_text'>{text}</span>
				</span>
			</div>
		</div>
	);
};

export default CornerFrame;
