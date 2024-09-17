import { getColorPalettes } from "../api/get-colors";
import KeywordInput from "./KeywordInput";
import ModelSelector from "./ModelSelector";
import ClassicTiles from "./visualizers/ClassicTiles";
// import Tree from "./visualizers/Tree";
import { siteMetadata } from '@/app/data/siteMetadata';

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
					<h1 className="text-3xl font-bold">{(siteMetadata?.title as string) || ''}</h1>
					<p className="text-lg">{(siteMetadata?.description as string) || ''}</p>
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
			{/* <Tree colorPalettes={colorPalettes} keyword={keyword} /> */}
		</div>
	);
}

// Helper function to determine contrasting text color
/* function getContrastColor(hexColor: string) {
	const r = parseInt(hexColor.slice(1, 3), 16);
	const g = parseInt(hexColor.slice(3, 5), 16);
	const b = parseInt(hexColor.slice(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
} */
