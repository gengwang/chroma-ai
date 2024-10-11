import React from 'react';
import {RGBCubeGrid} from '../visualizers/RGBCubes'; // Adjust the import path as necessary
import { Palette } from '../visualizers/RGBCubes';
import { RGBCubesProps } from '../visualizers/RGBCubes';
import { hexToRgb } from '@/app/utils/utils';
import { transformThemes } from '@/app/data/colors';
import { DiVim } from 'react-icons/di';
// import { hexToRgb } from '@/app/data/colors';

const AxisStats = ({ palettes, activePalettes, view }: { palettes: Palette[], activePalettes: number[], view: RGBCubesProps['view'] }) => {

    return (
				<>
				{true && ( // Change 'false' to a condition if needed
					<div>
						<RGBCubeGrid
							size={1}
							palettes={palettes}
							on={activePalettes}
							view={view}
						/>
					</div>
				)}
                </>
		);
};

export default AxisStats;
