'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'; // Assuming you're using react-three-fiber
import { Box, OrbitControls } from '@react-three/drei'; // Assuming you're using drei for Box component
import { Vector3 } from 'three';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three'

// Move this function outside of the component
const getRandomPosition = () => {
	return {
		x: Math.random() * 200 - 100, // Random x between -100 and 100
		y: Math.random() * 200 - 100, // Random y between -100 and 100
		z: Math.random() * 200 - 100  // Random z between -100 and 100
	};
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
			<Cubes active={false} />
			<OrbitControls zoom0={0.1} ref={controlsRef} />
		</Canvas>
	);
};

export default Scene;

const Cubes = ({active: propActive = false}: {active: boolean}) => {
    const [active, setActive] = useState(propActive);

    useEffect(() => {
        setActive(propActive);
    }, [propActive]);

    const numberOfCubes = 6; // Assuming you want 6 cubes
    const [positions, setPositions] = useState(Array.from({ length: numberOfCubes }, () => getRandomPosition()));

    useEffect(() => {
        const initialPositions = Array.from({ length: numberOfCubes }, () => getRandomPosition());
        setPositions(initialPositions); // Assuming you have a state to hold positions
    }, []); // Empty dependency array ensures this runs only once on mount

    const cubes = Array.from({ length: numberOfCubes }, (_, index) => {
		const position = positions[index];
		return (
			// <Box key={index} args={[10, 10, 10]} position={[position.x, position.y, position.z]}>
			// 		<meshStandardMaterial attach="material" color="pink" />
			// </Box>
            <Cube 
                key={index} 
                index={index} 
                position={{x: position.x, y: position.y, z: position.z}} 
                active={active} 
                onClick={() => setActive(!active)}
            />
		);
	});

	return <>{cubes}</>;
};

const Cube = ({
	index,
	position,
	active: propActive,
	onClick,
}: {
	index: number;
	position: { x: number; y: number; z: number };
	active: boolean;
	onClick: () => void;
}) => {
	const [active, setActive] = useState(propActive);
	const springs = useSpring({
		scale: active ? 1.5 : 1,
		color: active ? "hotpink" : "royalblue",
	});

	useEffect(() => {
		setActive(propActive);
	}, [propActive]);

	return (
		<animated.mesh
			onClick={onClick} // Use the onClick prop from the parent
			key={index}
			position={[position.x, position.y, position.z]}
			scale={springs.scale}
		>
			<boxGeometry args={[10, 10, 10]} />
			<animated.meshPhongMaterial color={springs.color} />
		</animated.mesh>
	);
};
