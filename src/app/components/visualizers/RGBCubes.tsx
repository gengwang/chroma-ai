import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useState } from "react";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";
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
	intensity?: number;
}

interface PaletteCubesProps {
	palette: Palette;
	intensity?: number;
}

interface RGBCubesProps {
	palettes: Palette[];
	intensity?: number; // Define the new prop
}

const defaultProps = {
	intensity: 0.2, // Default value for intensity
};

const SwatchCube: React.FC<SwatchCubeProps> = ({
	paletteName,
	color,
	intensity = defaultProps.intensity,
}) => {
	const meshRef = useRef<THREE.Mesh>(null);
	const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

	useEffect(() => {
		if (meshRef.current) {
			const { r, g, b } = hexToRgb(color) || { r: 0, g: 0, b: 0 };
			// console.log('position:', position);
			setPosition(new THREE.Vector3(r / 10, g / 10, b / 10));
		}
	}, [color, meshRef]); // Update position when color changes

	// meshRef.current.instanceMatrix.needsUpdate = true;

	return (
		<mesh
			// onClick={(e) => {
			// 	console.log("color>>", color, "paletteName>>", paletteName); // Log the color
			// }}
			ref={meshRef}
			position={position}
		>
			<boxGeometry args={[0.6, 0.6, 0.6]} />
			<meshStandardMaterial
				color={"black"}
				emissive={new THREE.Color(color)}
				emissiveIntensity={intensity}
				opacity={1} // Set the desired opacity (0.0 is fully transparent, 1.0 is fully opaque)
				transparent={true} // Enable transparency
			/>
		</mesh>
	);
};
const PaletteCubes: React.FC<PaletteCubesProps> = ({ palette }) => {
	const originalIntensity = 0.1; // Original intensity value
	const [intensity, setIntensity] = useState(originalIntensity);

	return (
		<group onClick={(event) => {
			event.stopPropagation(); // Prevent the click from bubbling up
			console.log("palette clicked", palette.name);
			// Toggle intensity
			setIntensity(prevIntensity => prevIntensity === 1 ? originalIntensity : 1);
		}}>
			{palette.colors.map((color, index) => (
				<SwatchCube key={index} color={color} paletteName={palette.name} intensity={intensity} />
			))}
		</group>
	)
}
// A color palette is an array of colors with a name, each color is represented as a hex string
const RGBCubeGrid: React.FC<RGBCubesProps> = ({ palettes }) => {
	// Log the total number of groups instantiated
	console.log("Total number of groups instantiated:", palettes.length);

	return (
		<Canvas frameloop="demand">
			{palettes.map((palette, paletteIndex) => {
				if (!palette || !Array.isArray(palette.colors)) {
					// Handle the case where palette is not defined or colors is not an array
					const geometry = new BoxGeometry(1, 1, 1); // Create a box geometry
					const material = new MeshStandardMaterial({
						color: "black",
						emissive: "black",
					}); // Create a material with black emission
					return (
						<group key="fallback">
							<mesh geometry={geometry} material={material} />{" "}
							{/* Return the mesh */}
						</group>
					);
				} else {
					return (
						<PaletteCubes key={palette.name} palette={palette} />
					);
				}
			})}
			<OrbitControls target-y={12} target-x={12} target-z={12} />
			<Stats />
		</Canvas>
	);
};

export default RGBCubeGrid;
export type { Palette };