import Animations from "./Animations";
import { hexToHSL } from "../utils/utils";

export default function LabsPage() {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-grow flex-1 w-full border-2 border-orange-500">
				{/* <Animations /> */}
				Hello colors #ff5733:
				{hexToHSL("#ff5733")}
			</div>
		</div>
	)
}
