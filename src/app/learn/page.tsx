'use client';

import React, { useState, useEffect } from 'react';
import { RGBCubeGrid } from "../components/visualizers/RGBCubes";
import { Capsule } from '../components/visualizers/Capsules';
import DraggableDivider from '../components/DraggableDivider';
import { Palette } from '../components/visualizers/RGBCubes';
import { Toolbar } from '../components/Toolbar';

const Page = () => {
	const [palettes, setPalettes] = useState<Palette[]>([]);
	const [activePalettes, setActivePalettes] = useState<number[]>([]);
	const [rightWidth, setRightWidth] = useState<number>(3); // Initial width for the right div in pixels

	useEffect(() => {
		const loadColorThemes = async () => {
			try {
				const response = await fetch("/chroma_ai.themes.json");
				const data = await response.json();
				setPalettes(data.map((item: { colors: string[]; name: string }, index: number) => ({
					index,
					colors: item.colors,
					name: item.name,
				})));
			} catch (error) {
				console.error("Error loading color themes:", error);
			}
		};

		loadColorThemes();
	}, []);

	const handleDrag = (newWidth: number) => {
		setRightWidth(prevWidth => Math.max(100, prevWidth - newWidth)); // Adjust the width based on drag
	};

	const handleCapsuleClick = (index: number) => {
		console.log(`Capsule ${index} clicked`);
		setActivePalettes(prev => 
			prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
		);
	};

	return (
		<div className="flex w-full h-[calc(100%-120px)] overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white"> {/* TODO: Make this full height without -120px workaround. */}
			{/* Left Side: RGBCubeGrids */}
			<div className="flex grow flex-col">
				{/* First Row: RGBCubeGrid with isometric view */}
				<div className="flex flex-1 relative border border-orange-400"> {/* Ensure this takes available space */}
					<RGBCubeGrid size={0.1} palettes={palettes} on={activePalettes} view="isometric" />
					<div className="absolute bottom-0 left-0 m-4"> {/* Toolbar positioned at bottom right */}
						<Toolbar />
					</div>
				</div>

				{/* Second Row: Three RGBCubeGrids with different views */}
				{/* TODO: Toolbar for showing these views */}
				{/* <div className="flex h-[300px] border border-gray-300 dark:border-gray-700">
					<div className="flex-1 border border-red-400">
						<RGBCubeGrid size={0.1} palettes={palettes} on={activePalettes} view="top" />
					</div>
					<div className="flex-1 border border-blue-400">
						<RGBCubeGrid size={0.1} palettes={palettes} on={activePalettes} view="front" />
					</div>
					<div className="flex-1 border border-green-400">
						<RGBCubeGrid size={0.1} palettes={palettes} on={activePalettes} view="left" />
					</div>
				</div> */}
			</div>

			{/* Draggable Divider */}
			{/* <DraggableDivider onDrag={handleDrag} /> */}

			{/* Right Side: Capsule List */}
			<div className={`w-1/${rightWidth} overflow-y-scroll text-xs flex flex-wrap gap-3 select-none`}>
				{palettes.length > 0 && palettes.map((item, index) => (
					<Capsule key={item.name} label={item.name} onClick={() => handleCapsuleClick(index)} />
				))}
			</div>
		</div>
	);
};

export default Page;
