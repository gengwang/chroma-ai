import { transformThemes } from "@/app/data/colors";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { scaleLinear } from 'd3-scale'; // Make sure to import scaleLinear

interface RGBTicksProps {
	filter?: string[]; // Make filter prop optional
}

interface Color {
	name: string;
	colors: string[];
}
interface ColorWithName {
	name: string;
	color: string;
}

interface ColorData {
	r: number;
	g: number;
	b: number;
	name: string;
}

const RGBTicks: React.FC<RGBTicksProps> = ({ filter = [] }) => {
	const containerRef = useRef<HTMLDivElement | null>(null); // Ensure the ref is typed correctly
	const [rawData, setRawData] = useState<ColorWithName[]>([]);

	const [data, setData] = useState<
		{ paletteName: string; channel: string; value: number }[]
	>([]);

	const lowerRange = 125; // Define the lower range variable
	const colorSpectrum = d3.range(360).map((d) => "hsl(" + d + ",100%,60%)"); // The "hue" in hsl ranges from 0 to 360.

	// Create a linear scale
	const colorScale = scaleLinear()
		.domain([0, 255]) // Input domain
		.range([lowerRange, 255]); // Output range

	function transformArray(data: Color[]): ColorWithName[] {  // Add return type
		return d3.merge(
			data.map((item) =>
				Array.isArray(item.colors)
					? item.colors.map((color) => ({ name: item.name, color: color }))
					: []
			)
		) as ColorWithName[];  // Add type assertion
	}

	useEffect(() => {
		d3.json<Color[]>("/chroma_ai.themes.json").then((data) => {
			console.log("raw data:", data);
			if (data) {
				setRawData(transformArray(data));
				const transformed = transformThemes(data);
				setData(transformed);
			}
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

		const filteredNamedData = filter.length > 0 
		? rawData.filter(d => filter.includes(d.name))
		: rawData
		// console.log("filteredData:", filteredData);
		// console.log("data:::::::\n", data);
		// Source: https://observablehq.com/plot/features/transforms
		const plot = Plot.plot({
      marginLeft: 40,
      marginRight: 10,
      width: 1600,
	//   height: 160,
      // style: {
      // 	backgroundColor: "#888888",
      // },
      // x: { label: "R/G/B values" },
      x: { 
        domain: [0, 360],  // Add this to match the colorSpectrum range
        label: null,
        axis: false
      },
      y: { domain: ["hue", " ", "r", "g", "b"], label: null },
      // TODO: Add axes: top for hue [0, 360] and bottom for RGB [0, 255]
      marks: [
        // Plot.ruleX([0]),
        Plot.tickX(filteredData, {
          x: d => d.value * (360/255),  // Scale RGB values (0-255) to match hue range (0-360)
          y: "channel",
          stroke: "#888888",
          strokeOpacity: 1,
        }),
        Plot.tickX(
          filteredData,
          Plot.groupY(
            { x: "median" },
            {
              x: d => d.value * (360/255),  // Scale here too
              y: "channel",
              stroke: (d) =>
                d.channel === "r"
                  ? "rgba(255, 0, 0, 1)"
                  : d.channel === "g"
                  ? "rgba(0, 255, 0, 1)"
                  : d.channel === "b"
                  ? "rgba(0, 0, 255, 1)"
                  : "white",
              strokeWidth: 4,
            }
          )
        ),
        // Color wheel/bar chart
        Plot.tickX(colorSpectrum, {
          x: Plot.indexOf,
          y: d => "hue",
          // stroke: (d) => d3.color(d)?.toString(),
          stroke: Plot.identity,
          // strokeWidth: 2
        }),
        Plot.dot(
          // Filter rawData based on active capsules
          filteredNamedData, 
          {
            x: (d) => d3.hsl(d.color).h,
            y: d => " ",
            fill: (d) => d3.color(d.color)?.toString(),
            fillOpacity: (d) =>
              d3.scalePow([1, 600], [1, 0.2]).exponent(1)(filteredNamedData.length),
          }
        ),
      ],
    });

		if (containerRef.current) {
			containerRef.current.append(plot);
		}
		return () => plot.remove();
	}, [data, filter, colorSpectrum, rawData]);

	return (
		<div className="min-h-24 flex w-full border-red-600">
			{<div ref={containerRef} />}
		</div>
	);
};

export default RGBTicks;
