import { transformThemes } from "@/app/data/colors";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { scaleLinear } from 'd3-scale'; // Make sure to import scaleLinear

interface RGBTicksProps {
	filter?: string[]; // Make filter prop optional
}

const RGBTicks: React.FC<RGBTicksProps> = ({ filter = [] }) => {
	const containerRef = useRef<HTMLDivElement | null>(null); // Ensure the ref is typed correctly
	const [data, setData] = useState<
		{ paletteName: string; channel: string; value: number }[]
	>([]);

	const lowerRange = 125; // Define the lower range variable

	// Create a linear scale
	const colorScale = scaleLinear()
		.domain([0, 255]) // Input domain
		.range([lowerRange, 255]); // Output range

	useEffect(() => {
		d3.json("/chroma_ai.themes.json").then((data: any) => {
			// console.log("data:", data);
			const transformed = transformThemes(data);
			setData(transformed);
		});
	}, []);

	useEffect(() => {
		if (data == undefined) return;
		if (filter == undefined) return;

		// Apply filtering based on the filter prop
		const filteredData =
			filter.length > 0
				? data.filter((item) => filter.includes(item.paletteName))
				: data;
		// Source: https://observablehq.com/plot/features/transforms
		const plot = Plot.plot({
			marginLeft: 40,
			marginRight: 10,
			width: 1200,
			// style: {
			// 	backgroundColor: "#888888",
			// },
			x: { label: "R/G/B values" },
			y: { label: null },
			marks: [
				// Plot.ruleX([0]),
				Plot.tickX(filteredData, {
					x: "value",
					y: "channel",
					stroke: "#888888",
					// stroke: (d) =>
					// 	d.channel === "r"
					// 		? `rgb(${colorScale(d.value)}, 0, 0)` // Red channel
					// 		: d.channel === "g"
					// 		? `rgb(0, ${colorScale(d.value)}, 0)` // Green channel
					// 		: d.channel === "b"
					// 		? `rgb(0, 0, ${colorScale(d.value)})` // Blue channel
					// 		: "white", // Default color
					strokeOpacity: 1,
				}),
				Plot.tickX(
					filteredData,
					Plot.groupY(
						{ x: "median" },
						{
							x: "value",
							y: "channel",
							stroke: (d) =>
								d.channel === "r"
									? "rgba(255, 0, 0, 1)"
									: d.channel === "g"
									? "rgba(0, 255, 0, 1)"
									: d.channel === "b"
									? "rgba(0, 0, 255, 1)"
									: "white", // Conditional stroke color
							strokeWidth: 4,
							// sort: { y: "x" },
						}
					)
				),
				// Plot.axisX({ label: null, lineWidth: 8, marginBottom: 40 }),
				// Plot.axisY({ label: "R/G/B values" }),
				// Plot.ruleY([0])
			],
		});

		if (containerRef.current) {
			containerRef.current.append(plot);
		}
		return () => plot.remove();
	}, [data, filter]);

	return (
		<div className="flex w-full border-red-600">
			{<div ref={containerRef} />}
		</div>
	);
};

export default RGBTicks;
