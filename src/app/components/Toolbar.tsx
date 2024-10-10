import { RiBox1Line, RiBarChartLine, RiLayoutGridLine } from 'react-icons/ri';

const Toolbar = () => {
	return (
		<div className="flex flex-row justify-between gap-4 bg-gray-900 text-white p-2 rounded-lg">
			
				<button>
					<RiLayoutGridLine /> {/* Icon for 3D */}
				</button>
				<button>
					<RiBarChartLine /> {/* Icon for Charts */}
				</button>
		</div>
	);
}

export { Toolbar };