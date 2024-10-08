import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useState } from "react";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
// Ref: Mass InstancedMesh https://sbedit.net/564a06d91ca806757716b7c73223348b5dc4938f

const hexToRgb = (hex: string) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
};

interface Swatch {
	paletteName: string;
	color: string;
}

interface Palette {
	name: string;
	colors: string[];
};

interface SwatchCubeProps extends Swatch {
	size: number;
	intensity?: number;
	isHighlighted?: boolean;
	// isHidden?: boolean; // We only need to hide the group (PaletteCubes), not individual cubes (SwatchCube)
}

interface PaletteCubesProps {
	palette: Palette;
	isHighlighted?: boolean;
	isHidden?: boolean;
}

interface RGBCubesProps {
	palettes: Palette[];
	size: number; // Define the size prop as a single number
	intensity?: number; // Define the new prop
	on?: number[]; // New prop for indices to turn on
	off?: number[]; // New prop for indices to turn off
}

const defaultProps = {
	intensity: 0.5, // Default value for intensity
	size: 0.5,
};

const SwatchCube: React.FC<SwatchCubeProps> = ({
	paletteName,
	color,
	size = defaultProps.size,
	intensity = defaultProps.intensity,
	isHighlighted = false,
}) => {
	const meshRef = useRef<THREE.Mesh>(null);
	const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

	useEffect(() => {
		if (meshRef.current) {
			const { r, g, b } = hexToRgb(color) || { r: 0, g: 0, b: 0 };
			setPosition(new THREE.Vector3(r / 10, g / 10, b / 10));
		}
	}, [color, meshRef]); // Update position when color changes

	return (
		<mesh
			ref={meshRef}
			position={position}
			scale={isHighlighted ? [2, 2, 2] : [1, 1, 1]} // Use scale to change size
		>
			<boxGeometry args={[size, size, size]} /> {/* Original size for geometry */}
			<meshStandardMaterial
				color={"black"}
				emissive={new THREE.Color(color)}
				emissiveIntensity={isHighlighted ? 1 : intensity} // Use isHighlighted to determine intensity
				opacity={1} // Set the desired opacity (0.0 is fully transparent, 1.0 is fully opaque)
				transparent={true} // Enable transparency
			/>
		</mesh>
	);
};
const PaletteCubes: React.FC<PaletteCubesProps> = ({ palette, isHighlighted = false, isHidden = false }) => {
	const originalIntensity = 0.1; // Original intensity value
	const [intensity, setIntensity] = useState(originalIntensity);
	const [localIsHighlighted, setLocalIsHighlighted] = useState(isHighlighted);
	
	useEffect(() => {
		setLocalIsHighlighted(isHighlighted); // Sync local state with prop changes
		console.log("isHighlighted==>", isHighlighted);
	}, [isHighlighted]);

	const handleClick = () => {
		// console.log("handleClick==>", isHighlighted);
		setIntensity(prevIntensity => prevIntensity === 1 ? originalIntensity : 1);
		setLocalIsHighlighted(prevIsHighlighted => !prevIsHighlighted);
	}

	return (
		<group visible={!isHidden} onClick={handleClick} dispose={null}>
			{palette.colors.map((color, index) => (
				<SwatchCube 
					key={index} 
					color={color} 
					paletteName={palette.name} 
					intensity={intensity} 
					size={0.5} 
					isHighlighted={localIsHighlighted} 
				/>
			))}
		</group>
	);
}
// A color palette is an array of colors with a name, each color is represented as a hex string
const RGBCubeGrid: React.FC<RGBCubesProps> = ({ palettes, on = [] }) => {
	const distance = 26;
	return (
		<Canvas gl={{ antialias: false }} orthographic={true} camera={{
			position: [distance * 2, distance * 2, distance * 2], // Adjust as needed
			near: 0.1,
			far: 1000,
			zoom: 5,
		}}frameloop="demand">
			{palettes.map((palette, paletteIndex) => {
				if (!palette || !Array.isArray(palette.colors)) {
					// error?
					const geometry = new BoxGeometry(1, 1, 1);
					const material = new MeshStandardMaterial({
						color: "black",
						emissive: "red",
						transparent: false,
					});
					return (
						<group key="fallback">
							<mesh geometry={geometry} scale={defaultProps.size} material={material} />
						</group>
					);
				} else {
					const isHighlighted = on.includes(paletteIndex);
					const isHidden = on.length > 0 && !isHighlighted;
					return (
						<PaletteCubes 
							key={palette.name} 
							palette={palette} 
							isHighlighted={isHighlighted} 
							isHidden={isHidden}
						/>
					);
				}
			})}
			<axesHelper args={[distance]} />
			<OrbitControls />
			<Stats />
		</Canvas>
	);
};

const CoordinateHelper = () => {
	const distance = 10; // Adjust this value as needed

	return (
		<Canvas orthographic={true} camera={{
			position: [distance * 2, distance * 2, distance * 2], // Adjust as needed
			near: 0.1,
			far: 1000,
			zoom: 20,
		}}>
			
			<group>
				<mesh position={[0, 0, 0]}>
ro					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial emissive="white" />
				</mesh>
					<mesh position={[distance, 0, 0]}>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial emissive="red" />
				</mesh>
					<mesh position={[0, 0, distance]}>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial emissive="blue" />
				</mesh>
					<mesh position={[0, distance, 0]}>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial emissive="green" />
				</mesh>
			</group>
			<axesHelper args={[distance]} />
			{/* <perspectiveCamera ref={cameraRef} fov={75} near={0.1} far={1000} /> */}
			<OrbitControls />
		</Canvas>
	);
}

export default RGBCubeGrid;
export { CoordinateHelper };
export type { Palette };