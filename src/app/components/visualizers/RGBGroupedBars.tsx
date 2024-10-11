import { transformThemes } from "@/app/data/colors";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RGBGroupedBarsProps {
    filter?: string[]; // Make filter prop optional
}

const RGBGroupedBars: React.FC<RGBGroupedBarsProps> = ({ filter = [] }) => { // Default to an empty array
	const containerRef = useRef<HTMLDivElement | null>(null); // Ensure the ref is typed correctly
	const [data, setData] = useState<
		{ paletteName: string; channel: string; value: number }[]
	>([]);

	useEffect(() => {
		d3.json("/chroma_ai.themes.json").then((data: any) => {
			// console.log("data:", data);
			const transformed = transformThemes(data);
			setData(transformed);
		});
	}, []);

	useEffect(() => {
		if (data == undefined) return;
        if(filter == undefined) return;

		// Apply filtering based on the filter prop
		const filteredData = filter.length > 0 
			? data.filter(item => filter.includes(item.paletteName)) 
			: data;

		const plot = Plot.plot({
			height: 120,
			width: 1200,
			x: { axis: null },
			y: { tickFormat: "s", grid: true },
			color: { 
				// Use RGBA colors for 50% opacity
				domain: ['r', 'g', 'b'],
				// range: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'],
                range: ['#f24b39', '#62be62', '#0c77c1'],
				legend: false 
			},
			marks: [
				Plot.barY(filteredData, {
					x: "channel",
					y: "value",
					fill: 'channel',
					fx: "paletteName",
					sort: { x: null, color: null, fx: { value: "-y", reduce: "sum" } },
				}),
				Plot.ruleY([0]),
			],
		});
		if (containerRef.current) {
			containerRef.current.append(plot);
		}
		return () => plot.remove();
	}, [data, filter]); // Add filter to dependency array

	return (
		<div className="w-full border-orange-300 text-gray-900 dark:text-white h-32 grow">
			{<div ref={containerRef} />}
		</div>
	);
};

export default RGBGroupedBars;
