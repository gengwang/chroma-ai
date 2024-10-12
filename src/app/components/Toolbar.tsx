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
			<button onClick={() => toggleView("isometric")}>
				{/* <RiLayoutGridLine /> */}
				<RiBox3Line />
			</button>
			<button onClick={() => toggleView("top")}>
				<TbBoxAlignTop /> {/* Top */}
			</button>
			<button onClick={() => toggleView("left")}>
				<TbBoxAlignLeft />
				{/* Left */}
			</button>
			<button onClick={() => toggleView("front")}>
				<TbBoxMargin />
				{/* Front */}
			</button>
			<button onClick={toggleChart}>
				{/* Call the toggle function */}
				<RiBarChartLine /> {/* Icon for Charts */}
				{/* Show text based on visibility */}
				{/* {showRGBGroupedBars ? 'Hide Chart' : 'Show Chart'} */}
			</button>
		</div>
	);
};

export { Toolbar };
