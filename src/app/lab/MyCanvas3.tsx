import React, { useRef, useEffect } from 'react';
import { InstancedMesh, Matrix4, BoxGeometry, MeshStandardMaterial, Color } from 'three';
import { Canvas } from '@react-three/fiber';
import { MeshTransmissionMaterial, OrbitControls } from '@react-three/drei';

const gridSize = 3;
const totalInstances = gridSize * gridSize * gridSize;

const MyComponent = () => {
	const count = 3; // Number of instances
	const meshRef = useRef<InstancedMesh>(null);
	const colors = useRef(new Float32Array([
        1.0, 0.0, 0.0, // Red
        0.0, 1.0, 0.0, // Green
        0.0, 0.0, 1.0, // Blue
        1.0, 1.0, 0.0, // Yellow
        1.0, 0.0, 1.0, // Magenta
        0.0, 1.0, 1.0, // Cyan
        1.0, 0.5, 0.0, // Orange
        0.5, 0.0, 0.5, // Purple
        0.5, 0.5, 0.5  // Gray
    ])); // Array to hold colors

	useEffect(() => {
		const spacing = 1.1; // Adjust this value for the desired gap

		if (meshRef.current) {
			for (let i = 0; i < totalInstances; i++) {
				// const matrix = new Matrix4();
				// matrix.setPosition(i * 1.5, 2, 0); // Set position for each instance
				// meshRef.current.setMatrixAt(i, matrix);

				// const index = i % (colors.current.length / 3); // Calculate the index for the color
                // const r = colors.current[index * 3];     // Red component
                // const g = colors.current[index * 3 + 1]; // Green component
                // const b = colors.current[index * 3 + 2]; // Blue component
                // console.log("RGB Values:", r, g, b); // Log the RGB values
                // const color = new Color(r, g, b);   // Create a THREE.Color instance
                // console.log("===", color);
				// (meshRef.current.material as MeshStandardMaterial).emissive = color; 

				const x = (i % gridSize) * spacing - (gridSize * spacing) / 2; // X position with gap
                const y = Math.floor((i / gridSize) % gridSize) * spacing - (gridSize * spacing) / 2; // Y position with gap
                const z = Math.floor(i / (gridSize * gridSize)) * spacing - (gridSize * spacing) / 2; // Z position with gap

				const matrix = new Matrix4().makeTranslation(x, y, z);
                meshRef.current.setMatrixAt(i, matrix);
			}
			meshRef.current.instanceMatrix.needsUpdate = true; // Update the instance matrix

			// (meshRef.current.material as MeshStandardMaterial).emissiveIntensity = 1; // Adjust intensity
			(meshRef.current.material as MeshStandardMaterial).emissive = new Color(1, 0, 0);
		}
	}, [meshRef]);

	return (
		// <instancedMesh ref={meshRef} args={[new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ emissiveIntensity: 1 }), count]}>
		<instancedMesh ref={meshRef} args={[undefined, new MeshStandardMaterial({ emissiveIntensity: 1, color: "black", emissive: "red" }), totalInstances]}>
			<mesh>
				<boxGeometry args={[1, 1, 1]}/>
				{/* <meshStandardMaterial emissiveIntensity={1} /> */}
			</mesh>
			{/* Additional properties can be set here if needed */}
		</instancedMesh>
	);
};

// Use the Canvas component to render your MyCanvas component
const MyCanvas3 = () => (
	<Canvas camera={{ position: [6, 8, 9] }} style={{ width: '100%', height: '100%', backgroundColor: 'gray' }}>
		<MyComponent />
        <OrbitControls />
	</Canvas>
);

export default MyCanvas3;
