import React from 'react';
import { Theme } from '@/app/api/types';
import { getContrastColor } from '@/app/utils/utils';

interface ClassicTilesProps {
    theme: Theme; // Change from colorPalettes to theme
}

/* This is one tile for a palette.*/
const ClassicTiles: React.FC<ClassicTilesProps> = ({ theme }) => {
    return (
			<div className="flex flex-wrap justify-start items-center gap-6">
				{theme.palettes.map(
					(
						palette,
						index // Use theme.palettes
					) => (
						<div
							key={index}
							className="overflow-hidden"
						>
							<div className="p-2">
								<h2 className="font-semibold mb-2 text-sm text-gray-800 dark:text-gray-200">
									{palette.name}
								</h2>
								<div className="flex flex-wrap">
									{palette.colors.map((color, colorIndex) => {
										console.log(`Color: ${color}, Index: ${colorIndex}, Is Name: ${palette.name}`);
										return (
											<div
												key={colorIndex}
												className={`w-9 h-8 flex items-center justify-center text-sm ${colorIndex === 0 ? 'rounded-l' : ''} ${colorIndex === palette.colors.length - 1 ? 'rounded-r' : ''}`}
												style={{
													backgroundColor: color,
													color: getContrastColor(color),
													transform: palette.name.startsWith('Error:') ? `rotate(${-90 + colorIndex * 15}deg)` : 'none', // Apply rotation only if palette name starts with "Error:"
												}}
											>
												{/* {color} */}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)
					)}
			</div>
				);
};

export default ClassicTiles;
