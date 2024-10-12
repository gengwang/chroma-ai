// Define a type for the elements of the array, modify as needed
type ContentElement = string | number | object | null; // You can add more types as necessary

type ContentType = ContentElement | ContentElement[]; // Union type that can be a single item or an array of items

export function getContentType(content: ContentType) {
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

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function hexToHSL(hex: string) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the maximum and minimum values of r, g, b
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: 
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g: 
                h = (b - r) / d + 2;
                break;
            case b: 
                h = (r - g) / d + 4;
                break;
        }
        if (h !== undefined) {
            h /= 6;
        }
    }

    // Convert h, s, l to percentages
    if (h !== undefined) {
        h = Math.round(h * 360);
    }
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}
