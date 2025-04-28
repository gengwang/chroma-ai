import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useState } from "react";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
import { useSpring, animated } from '@react-spring/three';
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
	isDimmed?: boolean; // We only need to hide the group (PaletteCubes), not individual cubes (SwatchCube)
}

interface PaletteCubesProps {
	palette: Palette;
	isHighlighted?: boolean;
	isDimmed?: boolean;
}

interface RGBCubesProps {
	palettes: Palette[];
	distance?: number;
	size: number; // Define the size prop as a single number
	intensity?: number; // Define the new prop
	on?: number[]; // New prop for indices to turn on
	off?: number[]; // New prop for indices to turn off
	view?: 'isometric' | 'top' | 'left' | 'front'; // New prop for view type
}

const defaultProps = {
	intensity: 0.5, // Default value for intensity
	size: 0.5,
};
// TODO: need a basic heuristic for size based on intensity!
const SwatchCube: React.FC<SwatchCubeProps> = ({
	paletteName,
	color,
	// size = defaultProps.size,
	// intensity = defaultProps.intensity,
	isHighlighted: isPropHighlighted = false,
	isDimmed: isPropDimmed = false,
}) => {
	const meshRef = useRef<THREE.Mesh>(null);
	const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
	const [isHighlighted, setIsHighlighted] = useState(isPropHighlighted);
	const [isDimmed, setIsDimmed] = useState(isPropDimmed);
	useEffect(() => {
		if (meshRef.current) {
			const { r, g, b } = hexToRgb(color) || { r: 0, g: 0, b: 0 };
			setPosition(new THREE.Vector3(r / 10, g / 10, b / 10));
		}
	}, [color, meshRef]); // Update position when color changes

	useEffect(() => {
		setIsHighlighted(isPropHighlighted);
		setIsDimmed(isPropDimmed);
	}, [isPropHighlighted, isPropDimmed]);

	const springs = useSpring({
		emissiveIntensity: isHighlighted ? 1 : 0.5,
		scale: isHighlighted ? 2.8 : 1,
		opacity: isDimmed ? 0.1 : 1,
	});

	return (
		<animated.mesh
			ref={meshRef}
			position={position}
			scale={springs.scale}
		>
			<boxGeometry args={[0.3, 0.3, 0.3]} /> {/* Original size for geometry */}
			<animated.meshStandardMaterial
				color={"black"}
				emissive={new THREE.Color(color)}
				emissiveIntensity={springs.emissiveIntensity}
				opacity={springs.opacity}
				transparent={true}
			/>
		</animated.mesh>
	);
};
const PaletteCubes: React.FC<PaletteCubesProps> = ({
	palette,
	isHighlighted = false,
	isDimmed = false,
}) => {
	const originalIntensity = 0.1; // Original intensity value
	const [intensity, setIntensity] = useState(originalIntensity);
	const [localIsHighlighted, setLocalIsHighlighted] = useState(isHighlighted);

	useEffect(() => {
		setLocalIsHighlighted(isHighlighted); // Sync local state with prop changes
		console.log("isHighlighted==>", isHighlighted);
	}, [isHighlighted]);

	const handleClick = () => {
		// console.log("handleClick==>", isHighlighted);
		setIntensity((prevIntensity) =>
			prevIntensity === 1 ? originalIntensity : 1
		);
		setLocalIsHighlighted((prevIsHighlighted) => !prevIsHighlighted);
	};

	return (
		<group onClick={handleClick} dispose={null}>
			{palette.colors.map((color, index) => (
				<SwatchCube
					key={index}
					color={color}
					paletteName={palette.name}
					intensity={intensity}
					size={0.5}
					isHighlighted={localIsHighlighted}
					isDimmed={isDimmed}
				/>
			))}
		</group>
	);
};

const CameraController: React.FC<{ view: 'isometric' | 'top' | 'left' | 'front'; distance: number }> = ({ view, distance }) => {
	const { camera } = useThree(); // Access the camera from the context
	const camera_initial_position = new THREE.Vector3(0, 0, distance); // Define initial camera position
	const camera_initial_target = new THREE.Vector3(0, 0, 0); // Define initial target

	useEffect(() => {
		// Reset camera position and rotation whenever the view changes
		switch (view) {
			case 'top':
				camera.position.set(0, distance * 1, 0);
				camera.rotation.set(-Math.PI / 2, 0, 0); // Looking straight down
				break;
			case 'left':
				camera.position.set(-distance * 1, 0, 0);
				camera.rotation.set(0, Math.PI / 2, 0); // Looking from the left
				break;
			case 'front':
				camera.position.set(0, 0, distance * 1);
				camera.rotation.set(0, Math.PI, 0); // Looking from the front
				break;
			case 'isometric':
			default:
				camera.position.set(distance * 1, distance * 1, distance * 1);
				camera.rotation.set(-Math.PI / 4, Math.PI / 4, 0); // Isometric view
		}
		camera.updateProjectionMatrix(); // Update the camera projection matrix
	}, [view, distance, camera]); // Include camera in the dependency array

	return null; // This component does not render anything
};

const RGBCubeGrid: React.FC<RGBCubesProps> = ({ palettes, on = [], distance = 26, view = 'isometric' }) => {
	const camera_initial_target = new THREE.Vector3(0, 0, 0); // Define the camera target here

	return (
		<Canvas gl={{ antialias: false }} orthographic={true} camera={{
			near: 0.1,
			far: 1000,
			zoom: 16,
		}} >
			<CameraController view={view} distance={distance} />
			{true && <OrbitControls enableRotate={view === 'isometric'} target={camera_initial_target} />} {/* Pass target prop */}
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
					const isDimmed = on.length > 0 && !isHighlighted;
					return (
						<PaletteCubes 
							key={palette.name} 
							palette={palette} 
							isHighlighted={isHighlighted} 
							isDimmed={isDimmed}
						/>
					);
				}
			})}
			<axesHelper args={[distance]} />
			{/* <Stats /> */}
		</Canvas>
	);
};

const CoordinateHelper = () => {
	const distance = 10; // Adjust this value as needed

	return (
		<Canvas gl={{ antialias: false }} orthographic={true}>
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
			{/* <OrbitControls enablePan={false} /> */}
		</Canvas>
	);
}

export { RGBCubeGrid, CoordinateHelper }; // Consolidated exports
export type { Palette, RGBCubesProps };
