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
