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
					<React.Fragment key={id}>
						<div className="flex flex-row items-center mt-8 mb-1">
							<span className="text-sm text-gray-800 dark:text-gray-400">
								Theme:
							</span>
							<span className="text-sm font-semibold  text-gray-600 dark:text-gray-50 ml-1">
								{theme.name}
							</span>
							<span className="text-sm text-gray-800 dark:text-gray-400 ml-4">
								Model:
							</span>
							<span className="text-sm font-semibold  text-gray-600 dark:text-gray-50 ml-1">
								{theme.model || 'Unspecified'}
							</span>
						</div>
						<ClassicTiles theme={theme} />
					</React.Fragment>
				))}
			</>
		);
  }