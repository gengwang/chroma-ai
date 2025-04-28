'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { RGBCubeGrid, RGBCubesProps } from "../components/visualizers/RGBCubes";
import { Capsule } from '../components/visualizers/Capsules';
import DraggableDivider from '../components/DraggableDivider';
import { Palette } from '../components/visualizers/RGBCubes';
import { Toolbar } from '../components/Toolbar';
import AxisStats from '../components/visualizers/AxisStats';
import RGBGroupedBars from '../components/visualizers/RGBGroupedBars';
import RGBTicks from '../components/visualizers/RGBTicks';

const Page: React.FC = () => {
	const [palettes, setPalettes] = useState<Palette[]>([]);
	const [activePalettes, setActivePalettes] = useState<number[]>([]);
	const [rightWidth, setRightWidth] = useState<number>(3); // Initial width for the right div in pixels
	const [showChart, setShowChart] = useState<boolean>(false); // State for visibility
	const [activeCapsules, setActiveCapsules] = useState<string[]>([]); // State to hold active capsule names
	const [cubeGridView, setCubeGridView] = useState<'isometric' | 'top' | 'left' | 'front'>('isometric'); // State for cube grid view

	useEffect(() => {
		const loadColorThemes = async () => {
			try {
				const response = await fetch("/chroma_ai.themes.json");
				const data = await response.json();
				setPalettes(
					data.map(
						(item: { colors: string[]; name: string }, index: number) => ({
							index,
							colors: item.colors,
							name: item.name,
						})
					)
				);
			} catch (error) {
				console.error("Error loading color themes:", error);
			}
		};

		loadColorThemes();
	}, []);

	const handleDrag = (newWidth: number) => {
		setRightWidth((prevWidth) => Math.max(100, prevWidth - newWidth)); // Adjust the width based on drag
	};

	const handleCapsuleClick = (index: number, name: string) => {
		// Toggle the capsule name in the activeCapsules state
		setActiveCapsules((prev) =>
			prev.includes(name)
				? prev.filter((item) => item !== name)
				: [...prev, name]
		);

		//console.log(`Capsule ${index} clicked`);
		setActivePalettes((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
		);
	};

	const views: RGBCubesProps["view"][] = ["front", "left", "top"];

	// Function to toggle RGBGroupedBars visibility
	const toggleChart = () => {
		setShowChart((prev) => !prev);
	};

	const toggleView = (view: 'isometric' | 'top' | 'left' | 'front') => {
		console.log(`Toggling view to ${view}`);
		setCubeGridView(view); // Set the cubeGridView based on the argument
	};

	return (
		<div
			className="flex w-full overflow-hidden"
			style={{ height: "90vh" }}
		>
			{/* TODO: Make this full height without -120px workaround. */}
			{/* Left Side: RGBCubeGrids */}
			<div className="flex grow flex-col relative">
				<div className="flex grow relative">
					<Suspense fallback={<div>Generating...</div>}>
						<RGBCubeGrid
							size={0.1}
							palettes={palettes}
							on={activePalettes}
							view={cubeGridView} // Use the cubeGridView state
						/>
					</Suspense>
					<div className="absolute bottom-0 left-0 m-8">
						<Toolbar toggleChart={toggleChart} showChart={showChart} toggleView={toggleView} />
					</div>
				</div>
				{/* Second Row: Three RGBCubeGrids with different views */}
				<div
					className={`flex flex-row w-full border-orange-300 ${
						showChart ? "" : "collapse"
					}`}
				>
					{true && (
						<Suspense fallback={<div>Generating...</div>}>
							<RGBTicks filter={activeCapsules} />
						</Suspense>
					)}
					{/* Pass activeCapsules as filter */}
					{/* TODO: Fix the layout issue where each AxisStats is too wide to fit in. */}
					<div className="flex flex-row w-[200px] overflow-hidden">
						{false &&
							views.map((view) => (
								<AxisStats
									key={view}
									palettes={palettes}
									activePalettes={activePalettes}
									view={view}
								/>
							))}
					</div>
				</div>
			</div>
			{/* TODO: Draggable divider */}
			{/* Draggable Divider */}
			{/* <DraggableDivider onDrag={handleDrag} /> */}
			{/* Right Side: Capsule List */}
			<Suspense fallback={<div>Generating...</div>}>
				<div className="h-screen overflow-y-auto text-xs flex flex-wrap gap-3 select-none w-[700px]">
					{palettes.length > 0 &&
						palettes.map((item, index) => (
							<Capsule
								key={item.name}
								label={item.name}
								onClick={() => handleCapsuleClick(index, item.name)}
							/>
						))}
				</div>
			</Suspense>
		</div>
	);
};

export default Page;
