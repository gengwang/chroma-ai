import React, { useState } from 'react';

interface CapsuleProps {
	label: string;
	borderColor?: string;
	borderWidth?: number;
	onClick?: () => void; // Add this line
}

const Capsule: React.FC<CapsuleProps> = ({ label, onClick }) => {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(prev => !prev); // Toggle the active state
		if (onClick) onClick(); // Call the passed onClick handler only if it's defined
	};

	return (
		<div 
			onClick={handleClick} 
			className={`capsule border-2 rounded-lg px-4 py-1 cursor-pointer ${isActive ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'}`}
		>
			{label}
		</div>
	);
};

const Capsules = ({ labels, borderColor = "black", backgroundColor = "white", borderWidth = 1 }: { labels: string[]; borderColor?: string; backgroundColor?: string, borderWidth?: number }) => {
	return (
		<div className="flex flex-wrap gap-3 select-none"> {/* Add select-none class */}
			{labels.map((label, index) => (
				<Capsule key={index} label={label} borderColor={borderColor} borderWidth={borderWidth} />
			))}
		</div>
	);
};
export {Capsule, Capsules};
