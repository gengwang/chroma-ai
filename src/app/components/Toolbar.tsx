import { RiBox1Line, RiBarChartLine, RiLayoutGridLine } from 'react-icons/ri';

interface ToolbarProps {
	toggleRGBGroupedBars: () => void; // Add prop type
	showRGBGroupedBars: boolean; // Add prop to track visibility
}

const Toolbar: React.FC<ToolbarProps> = ({ toggleRGBGroupedBars, showRGBGroupedBars }) => {
	return (
		<div className="flex flex-row justify-between gap-4 bg-gray-900 text-white p-2 rounded-lg">
			<button>
				<RiLayoutGridLine /> {/* Icon for 3D */}
			</button>
			<button onClick={toggleRGBGroupedBars}> {/* Call the toggle function */}
				<RiBarChartLine /> {/* Icon for Charts */}
				{/* Show text based on visibility */}
				{/* {showRGBGroupedBars ? 'Hide Chart' : 'Show Chart'} */}
			</button>
		</div>
	);
}

export { Toolbar };