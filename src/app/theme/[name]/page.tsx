import { getColorThemesByName } from "@/app/api/mongodb-data";
import { Theme } from "@/app/api/types";
import ClassicTiles from "@/app/components/visualizers/ClassicTiles";
import React from "react";

export default async function Page({ params }: { params: { name: string } }) {

    // see if we can get theme by this name from db, if yes, display it here
    // if not, go generate one and persist it to the db

    let result;
    //DEBUG
    // await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        result = await getColorThemesByName(params.name);
    } catch (error) {
        console.error('Error fetching color palettes:', error);
    }
	// console.log("result from mongodb::::", result);
    const themes: Theme[] = result ? JSON.parse(result.themes) : null;

    // console.log('---in [name]', themes);

    // // console.log('in name:', themeName);

    // const matchedThemes = themes.filter((theme) => theme.name.toLocaleLowerCase() === themeName);

	const matchedThemes = themes;

    return (
			<>
				{matchedThemes.map((theme, id) => (
					<div className="border-2 border-gray-200 dark:border-neutral-800 rounded-lg p-2 mb-9" key={id}>
						<div className="flex flex-row items-center pt-2">
							<span className="text-xs text-gray-800 dark:text-gray-500">
								Theme:
							</span>
							<span className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-1">
									{theme.name}
							</span>
							<span className="text-xs text-gray-800 dark:text-gray-500 ml-4">
								Model:
							</span>
							<span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
								{theme.model? theme.model: "Unspecified"}
							</span>
						</div>
						<ClassicTiles theme={theme} />
					</div>
				))}
				</>
		);
  }