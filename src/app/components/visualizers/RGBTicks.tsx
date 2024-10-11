import { transformThemes } from "@/app/data/colors";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RGBTicksProps {
	filter?: string[]; // Make filter prop optional
}

const RGBTicks: React.FC<RGBTicksProps> = ({ filter = [] }) => {
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
		if (filter == undefined) return;

		// Apply filtering based on the filter prop
		const filteredData =
			filter.length > 0
				? data.filter((item) => filter.includes(item.paletteName))
				: data;
		// Source: https://observablehq.com/plot/features/transforms
		const plot = Plot.plot({
			marginLeft: 60,
			marginRight: 10,
			width: 1200,
			x: { label: "R/G/B values" },
			y: { label: null },
			marks: [
				Plot.ruleX([0]),
				Plot.tickX(filteredData, {
					x: "value",
					y: "channel",
					strokeOpacity: 0.6,
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
									? "#ff0000"
									: d.channel === "g"
									? "#00ff00"
									: d.channel === "b"
									? "#0000ff"
									: "white", // Conditional stroke color
							strokeWidth: 4,
							// sort: { y: "x" },
						}
					)
				),
			],
		});

		if (containerRef.current) {
			containerRef.current.append(plot);
		}
		return () => plot.remove();
	}, [data, filter]);

	return (
		<div className="w-full border-orange-300 text-gray-900 dark:text-white h-32 grow">
			{<div ref={containerRef} />}
		</div>
	);
};

export default RGBTicks;
