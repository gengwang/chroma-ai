import React from 'react';
import { Theme } from '@/app/api/types';
import { getContrastColor } from '@/app/utils/utils';

interface ClassicTilesProps {
    theme: Theme; // Change from colorPalettes to theme
}

const ClassicTiles: React.FC<ClassicTilesProps> = ({ theme }) => {
    return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{theme.palettes.map(
					(
						palette,
						index // Use theme.palettes
					) => (
						<div
							key={index}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
						>
							<div className="p-4">
								<h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
									{palette.name}
								</h2>
								<div className="flex flex-wrap">
									{palette.colors.map((color, colorIndex) => (
										<div
											key={colorIndex}
											className="w-1/3 h-12 flex items-center justify-center text-sm"
											style={{
												backgroundColor: color,
												color: getContrastColor(color),
											}}
										>
											{color}
										</div>
									))}
								</div>
							</div>
						</div>
					)
				)}
			</div>
		);
};

export default ClassicTiles;
