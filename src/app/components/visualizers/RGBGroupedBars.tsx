import { transformThemes } from "@/app/data/colors";
import * as Plot from "@observablehq/plot";
import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

const RGBGroupedBars = () => {
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
		const plot = Plot.plot({
			height: 120,
            width: 1200,
			x: { axis: null },
			y: { tickFormat: "s", grid: true },
			color: { scheme: "spectral", legend: false },
			marks: [
				Plot.barY(data, {
					x: "paletteName",
					y: "value",
					fill: "channel",
					fx: "channel",
					sort: { x: null, color: null, fx: { value: "-y", reduce: "sum" } },
				}),
				Plot.ruleY([0]),
			],
		});
		if (containerRef.current) {
			containerRef.current.append(plot);
		}
		return () => plot.remove();
	}, [data]);

	return (
		<div className="w-full border-orange-300 text-gray-900 dark:text-white h-32 grow">
			{<div ref={containerRef} />}
		</div>
	);
};

export default RGBGroupedBars;
