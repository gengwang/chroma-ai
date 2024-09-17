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
    keyword,
}: {
	model: string;
    keyword?: string;
}) {
	const colorPalettes: ColorPalette[] | null = keyword ? await getColorPalettes(model, keyword) as ColorPalette[] : null;

	return (
		<div>
            <div className="flex flex-grow space-x-6">
                <KeywordInput initialKeyword={keyword || ''} />
                <ModelSelector model={model} />
            </div>
            
			{colorPalettes && <ClassicTiles colorPalettes={colorPalettes} />}
			{/* <Tree colorPalettes={colorPalettes} keyword={keyword} /> */}
		</div>
	);
}
