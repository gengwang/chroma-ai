import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { InstancedMesh, Matrix4, MeshStandardMaterial, Color, BufferAttribute } from 'three';

const gridSize = 3;
const totalInstances = gridSize * gridSize * gridSize;

// Predefined colors for 6x6x6 grid
const predefinedColors = [
    new Color(1, 0, 0), new Color(0, 1, 0), new Color(0, 0, 1),
    new Color(1, 1, 0), new Color(1, 0, 1), new Color(0, 1, 1),
    // Add more colors as needed to fill the 6x6x6 grid
    // Ensure you have a total of 216 colors (6 * 6 * 6)
];

const MyComponent = () => {
    const ref = useRef<InstancedMesh>(null);
    const colors = useRef(new Float32Array([
        1.0, 0.0, 0.0, // Red
        0.0, 1.0, 0.0, // Green
        0.0, 0.0, 1.0, // Blue
        // Add more colors as needed
    ])); // Array to hold colors


    useEffect(() => {
        const spacing = 1.1; // Adjust this value for the desired gap

        if (ref.current) {
            for (let i = 0; i < totalInstances; i++) {

                const index = i % (colors.current.length / 3); // Calculate the index for the color
                const r = colors.current[index * 3];     // Red component
                const g = colors.current[index * 3 + 1]; // Green component
                const b = colors.current[index * 3 + 2]; // Blue component
                const color = new Color(r, g, b);   // Create a THREE.Color instance
                console.log("===", color);
                // colors.current.set([color.r, color.b], i * 3); // Set color in the array


                const x = (i % gridSize) * spacing - (gridSize * spacing) / 2; // X position with gap
                const y = Math.floor((i / gridSize) % gridSize) * spacing - (gridSize * spacing) / 2; // Y position with gap
                const z = Math.floor(i / (gridSize * gridSize)) * spacing - (gridSize * spacing) / 2; // Z position with gap

                const matrix = new Matrix4().makeTranslation(x, y, z);
                ref.current.setMatrixAt(i, matrix);
                // ref.current.setColorAt(i, color);
                (ref.current.material as MeshStandardMaterial).emissive = color; // Ensure color is a THREE.Color instance
            }
            ref.current.instanceMatrix.needsUpdate = true;
            // ref.current.geometry.setAttribute('color', new BufferAttribute(colors.current, 3));
            // ref.current.geometry.setAttribute('emissive', new BufferAttribute(colors.current, 3));
        }
    }, [ref]);

    return (
        <instancedMesh ref={ref} args={[undefined, undefined, totalInstances]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
            color={new Color(0, 0, 0)}
                // emissive={new Color(1, 0, 0)} // Default emissive color
                emissiveIntensity={0.5} // Adjust intensity for the glow effect
            />
        </instancedMesh>
    );
};

// Set emissive colors for each instance
// useEffect(() => {
//     if (ref.current) {
//         for (let i = 0; i < totalInstances; i++) {
//             const color = predefinedColors[i % predefinedColors.length]; // Loop through colors if fewer than instances
//             ref.current.material.emissive = color; // Set the emissive color for the material
//         }
//     }
// }, [ref]);

const MyCanvas2 = () => {
    return (
        <Canvas camera={{ position: [6, 8, 9] }}>
            <MyComponent />
            <OrbitControls target-y={0} />
            <Stats />
        </Canvas>
    );
};

export default MyCanvas2;