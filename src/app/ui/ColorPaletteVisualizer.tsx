import { getColorPalettes } from "../api/get-colors";
import KeywordInput from "./KeywordInput";
import ModelSelector from "./ModelSelector";
import { Suspense } from "react";
import ClassicTiles from "./visualizers/ClassicTiles";

function ColorPaletteLoader() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                Generating color palettes...
            </div>
        </div>
    );
}

// Define the type for a color palette
export type ColorPalette = {
	theme: string;
	colors: string[];
};

export default async function ColorPaletteVisualizer({
	model = "mistralai/Mistral-7B-Instruct-v0.3",
    keyword = "Star Trek",
}: {
	model: string;
    keyword: string;
}) {
	const colorPalettes: ColorPalette[] = await getColorPalettes(model, keyword) as ColorPalette[];

	return (
		<div>
			<div className="flex items-center space-x-4">
				<div className="flex-grow flex items-baseline space-x-4 text-gray-600 dark:text-gray-400">
					<h1 className="text-3xl font-bold">ChromaAI</h1>
					<p className="text-lg">Generate color palettes from a keyword prompt using a language model</p>
					<p className="ml-auto"><a href="https://github.com/gengwang/chroma-ai" className="text-blue-500 hover:underline">Source code</a></p>
				</div>
			</div>

            <br />
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <br />
			
            <div className="flex flex-grow space-x-6">
                <KeywordInput initialKeyword={keyword} />
                <ModelSelector model={model} />
            </div>
            
			<ClassicTiles colorPalettes={colorPalettes} />
		</div>
	);
}

// Helper function to determine contrasting text color
function getContrastColor(hexColor: string) {
	const r = parseInt(hexColor.slice(1, 3), 16);
	const g = parseInt(hexColor.slice(3, 5), 16);
	const b = parseInt(hexColor.slice(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
}
