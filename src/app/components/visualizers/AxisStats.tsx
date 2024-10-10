import React from 'react';
import {RGBCubeGrid} from '../visualizers/RGBCubes'; // Adjust the import path as necessary
import { Palette } from '../visualizers/RGBCubes';
import { RGBCubesProps } from '../visualizers/RGBCubes';

const AxisStats = ({ palettes, activePalettes, view }: { palettes: Palette[], activePalettes: number[], view: RGBCubesProps['view'] }) => {
    return (
        <div className="flex-1 flex flex-row border border-gray-400">
            <div className='flex flex-1 text-white'>Hello there</div>
            {false && ( // Change 'false' to a condition if needed
                <div className="w-[120px] border border-red-400">
                    <RGBCubeGrid size={1} palettes={palettes} on={activePalettes} view={view} />
                </div>
            )}
        </div>
    );
};

export default AxisStats;
