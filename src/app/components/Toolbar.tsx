import {
	RiBox1Line,
	RiBarChartLine,
	RiLayoutGridLine,
	RiBox3Line,
} from "react-icons/ri";
import {
	TbBoxAlignBottom,
	TbBoxAlignLeft,
	TbBoxAlignTop,
	TbBoxMargin,
} from "react-icons/tb";

interface ToolbarProps {
	toggleChart: () => void; // Add prop type
	showChart: boolean; // Add prop to track visibility
	toggleView: (view: "isometric" | "top" | "left" | "front") => void; // Update type here
}

const Toolbar: React.FC<ToolbarProps> = ({
	toggleChart,
	showChart,
	toggleView,
}) => {
	return (
		<div className="flex flex-row justify-between gap-4 bg-gray-900 text-white p-2 rounded-lg">
			<button 
				onClick={() => toggleView("isometric")} 
				title="Isometric View"
			>
				<RiBox3Line />
			</button>
			<button 
				onClick={() => toggleView("top")}
				title="Top View"
			>
				<TbBoxAlignTop /> {/* Top */}
			</button>
			<button 
				onClick={() => toggleView("left")}
				title="Left View"
			>
				<TbBoxAlignLeft />
				{/* Left */}
			</button>
			<button 
				onClick={() => toggleView("front")}
				title="Front View"
			>
				<TbBoxMargin />
				{/* Front */}
			</button>
			<button 
				onClick={toggleChart}
				title="Toggle Chart"
			>
				<RiBarChartLine /> {/* Icon for Charts */}
				{/* Show text based on visibility */}
				{/* {showRGBGroupedBars ? 'Hide Chart' : 'Show Chart'} */}
			</button>
		</div>
	);
};

export { Toolbar };
