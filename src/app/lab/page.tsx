'use client';

import React, { useState, useEffect } from 'react';
import RGBCubeGrid from "../components/visualizers/RGBCubes";
import { Palette } from "../components/visualizers/RGBCubes";

const Page = () => {
	const [paletteName, setPaletteName] = useState<string[]>([]); // Change to string[]
	const [colorThemes, setColorThemes] = useState<string[][]>([
		["#FF0000", "#00FF00"],
		["#0000FF", "#FFFF00"],
	]);

	const [palettes, setPalettes] = useState<Palette[]>([]);

	useEffect(() => {
		const loadColorThemes = async () => {
			try {
				const response = await fetch("/chroma_ai.themes.json");
				const data = await response.json();
				console.log("data==>", data);

				// Transform data into palettes
				const palettes = data.map(
					(item: { colors: string[]; name: string }) => ({
						colors: item.colors,
						name: item.name,
					})
				);
				console.log("palettes==>", palettes);
				setPalettes(palettes); // Set the transformed palettes
			} catch (error) {
				console.error("Error loading color themes:", error);
			}
		};

		loadColorThemes();
	}, []);

	return (
		<div>
			<h1 className="text-xl font-bold">Welcome to the Color Lab😎</h1>
			<div className="w-full h-screen bg-black">
				<RGBCubeGrid palettes={palettes} />
			</div>
		</div>
	);
};

export default Page;