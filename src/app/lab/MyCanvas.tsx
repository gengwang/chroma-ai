import React, { useRef, useEffect } from 'react';
import { InstancedMesh, Matrix4, BoxGeometry, MeshStandardMaterial } from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const MyCanvas = () => {
	const count = 6; // Number of instances
	const meshRef = useRef<InstancedMesh>(null);

	useEffect(() => {
		if (meshRef.current) {
			for (let i = 0; i < count; i++) {
				const matrix = new Matrix4();
				matrix.setPosition(i * 1.5, 2, 0); // Set position for each instance
				meshRef.current.setMatrixAt(i, matrix);
			}
			meshRef.current.instanceMatrix.needsUpdate = true; // Update the instance matrix
		}
	}, []);

	return (
		<instancedMesh ref={meshRef} args={[new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: "black", emissive: "#ff0000", emissiveIntensity: 1 }), count]}>
			{/* Additional properties can be set here if needed */}
		</instancedMesh>
	);
};

// Use the Canvas component to render your MyCanvas component
const App = () => (
	<Canvas style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
		<MyCanvas />
        <OrbitControls />
	</Canvas>
);

export default App;
