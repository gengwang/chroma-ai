'use client';

import React, { useState, useEffect } from 'react';
import RGBCubeGrid, { CoordinateHelper } from "../components/visualizers/RGBCubes";
import { Palette } from "../components/visualizers/RGBCubes";
import { Capsule, Capsules } from '../components/visualizers/Capsules';

const Page = () => {
	const [palettes, setPalettes] = useState<Palette[]>([]);
	const [activePalettes, setActivePalettes] = useState<number[]>([]); // Track active palettes

	useEffect(() => {
		const loadColorThemes = async () => {
			try {
				const response = await fetch("/chroma_ai.themes.json");
				const data = await response.json();

				const palettes = data.map(
					(item: { colors: string[]; name: string }, index: number) => ({
						index: index,
						colors: item.colors,
						name: item.name,
					})
				);
				setPalettes(palettes);
			} catch (error) {
				console.error("Error loading color themes:", error);
			}
		};

		loadColorThemes();
	}, []);

	const handleEnableClick = () => {
		setActivePalettes(prev => prev.length === 0 ? Array.from({ length: 51 }, (_, i) => i) : []); // Toggle between 0-50 and empty
	};

	const handleCapsuleClick = (index: number) => {
		console.log(`Capsule ${index} clicked`);
		setActivePalettes(prev => 
			prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
		);
	};

	return (
		<div>
			<h1 className="text-xl font-bold">Welcome to the Color Lab!</h1>
			{/* <div className="w-full h-[40vw] bg-gray-100 dark:bg-gray-900">
				<CoordinateHelper />
			</div> */}
			<div className="w-full h-[20vw] bg-gray-100 dark:bg-gray-900">
				<RGBCubeGrid size={0.1} palettes={palettes} on={activePalettes} />
			</div>
			<div className='text-lg my-4 flex flex-row gap-4'>
				<Capsule label="Toggle highlights 0~50" onClick={handleEnableClick} />
			</div>	
			<div className='text-sm flex flex-wrap gap-3 select-none'>
				{palettes.map((item, index) => (
					<Capsule key={item.name} label={item.name} onClick={() => handleCapsuleClick(index)} />
				))}
			</div>
		</div>
	);
};

export default Page;
