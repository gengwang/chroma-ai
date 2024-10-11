import { RiBox1Line, RiBarChartLine, RiLayoutGridLine } from 'react-icons/ri';

interface ToolbarProps {
	toggleChart: () => void; // Add prop type
	showChart: boolean; // Add prop to track visibility
}

const Toolbar: React.FC<ToolbarProps> = ({
	toggleChart,
	showChart,
}) => {
	return (
		<div className="flex flex-row justify-between gap-4 bg-gray-900 text-white p-2 rounded-lg">
			<button>
				<RiLayoutGridLine /> {/* Icon for 3D */}
			</button>
			<button onClick={toggleChart}>
				{" "}
				{/* Call the toggle function */}
				<RiBarChartLine /> {/* Icon for Charts */}
				{/* Show text based on visibility */}
				{/* {showRGBGroupedBars ? 'Hide Chart' : 'Show Chart'} */}
			</button>
		</div>
	);
};

export { Toolbar };