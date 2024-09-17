export function getContentType(content) {
    if (Array.isArray(content)) {
        const firstItem = content.length > 0 ? JSON.stringify(content[0]).slice(0, 50) : 'empty array';
        return {
            type: 'array',
            details: `Array length: ${content.length}, First item: ${firstItem}${firstItem.length >= 50 ? '...' : ''}`
        };
    } else if (typeof content === 'string') {
        return {
            type: 'string',
            details: `String length: ${content.length}`
        };
    } else if (typeof content === 'object' && content !== null) {
        return {
            type: 'object',
            details: `Object keys: ${Object.keys(content).join(', ')}`
        };
    } else {
        return {
            type: 'other',
            details: `Type: ${typeof content}`
        };
    }
}

// Helper function to determine contrasting text color
export function getContrastColor(hexColor: string) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
}

