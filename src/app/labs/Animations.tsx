'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'; // Assuming you're using react-three-fiber
import { Box, OrbitControls } from '@react-three/drei'; // Assuming you're using drei for Box component
import { Vector3 } from 'three';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three'

const getRandomPosition = () => {
	return {
		x: Math.random() * 200 - 100, // Random x between -100 and 100
		y: Math.random() * 200 - 100, // Random y between -100 and 100
		z: Math.random() * 200 - 100  // Random z between -100 and 100
	};
};

const Cubes = () => {
	const cubes = Array.from({ length: 6 }, (_, index) => {
		const position = getRandomPosition();
		return (
			// <Box key={index} args={[10, 10, 10]} position={[position.x, position.y, position.z]}>
			// 	<meshStandardMaterial attach="material" color="pink" />
			// </Box>
            <Cube key={index} index={index} position={{x: position.x, y: position.y, z: position.z}} />
		);
	});

	return <>{cubes}</>;
};

const Scene = () => {
	const controlsRef = useRef(null);
    //TODO: zoom/fit to content: https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/6
	useEffect(() => {
		if (controlsRef.current) {
			// Adjust camera position to fit the scene
			const boundingBox = new THREE.Box3().setFromObject(controlsRef.current); // Assuming controlsRef.current is your scene object
			const center = boundingBox.getCenter(new Vector3());
			const size = boundingBox.getSize(new Vector3());
			const maxSize = Math.max(size.x, size.y, size.z);
			const cameraDistance = maxSize * 2; // Adjust this multiplier as needed

			// controlsRef.current.target.copy(center);
			// controlsRef.current.object.position.set(center.x, center.y, cameraDistance);
			// controlsRef.current.update();
		}
	}, [controlsRef]);

	return (
		<Canvas>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<Cubes />
			<OrbitControls zoom0={0.5} ref={controlsRef} />
		</Canvas>
	);
};

export default Scene;

const Cube = ({index, position}: {index: number, position: {
    x: number; 
    y: number; 
    z: number; 
}}) => {
    const [active, setActive] = useState(false);
    const springs = useSpring({ scale: active ? 1.5 : 1, color: active ? 'hotpink' : 'royalblue' })

        return (
            <animated.mesh 
                onClick={() => setActive(!active)} 
                key={index} 
                position={[position.x, position.y, position.z]} 
                scale={springs.scale}
            >
                <boxGeometry args={[10, 10, 10]} />
                <animated.meshPhongMaterial color={springs.color} />
            </animated.mesh>
        );
}
