import React from 'react';

type DraggableDividerProps = {
    onDrag: (newWidth: number) => void; // Define the type for onDrag
};

const DraggableDivider: React.FC<DraggableDividerProps> = ({ onDrag }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = moveEvent.clientX - startX; // Calculate the new width
            onDrag(newWidth); // Pass the new width directly
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className="cursor-col-resize flex w-2 bg-red-300 dark:bg-gray-700 h-screen"
        />
    );
};

export default DraggableDivider;