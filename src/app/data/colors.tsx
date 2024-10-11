import { hexToRgb } from "../utils/utils";
const colors = [
    "#FFC300",
    "#FFD700",
    "#008080",
    "#00FFFF",
    "#9900FF",
    "#FF00FF",
    "#C69300",
];

// Function to convert hex to RGB
// const hexToRgb = (hex: string) => {
//     const bigint = parseInt(hex.replace(/^#/, ''), 16);
//     return [
//         (bigint >> 16) & 255, // R
//         (bigint >> 8) & 255,  // G
//         bigint & 255          // B
//     ];
// };


// Transform colors to nested array of R, G, B values
// const nestedColors = colors.map(hexToRgb).reduce((acc, [r, g, b]) => {
//     acc[0].push(r);
//     acc[1].push(g);
//     acc[2].push(b);
//     return acc;
// }, [[], [], []]);

// console.log(nestedColors);

function transformThemes(themes: { name: string; colors: string[] }[]) {
    const transformed: { paletteName: string; channel: string; value: number }[] = [];

    themes.forEach(theme => {
        const { name, colors } = theme;
        // console.log("theme...", name, ";", colors)
        if (colors) {
            colors.forEach(color => {
                const rgb = hexToRgb(color);
                console.log('color:', color, '; rgb:', rgb);
                if (typeof rgb === 'object' && rgb !== null) { // Check if rgb is an object
                    const { r, g, b } = rgb; // Destructure the properties directly
                    transformed.push(
                        { paletteName: name, channel: 'r', value: r },
                        { paletteName: name, channel: 'g', value: g },
                        { paletteName: name, channel: 'b', value: b }
                    );
                }
            });
        } else {
            console.warn("Colors array is undefined");
        }
    }); 

    return transformed;
}

// // Example usage with the provided JSON data
// const themes = [
//     {
//         "name": "Klingon Empire",
//         "colors": [
//             "#FF4500",
//             "#C69300",
//             "#FF9900",
//             "#99FF99",
//             "#00C6FF",
//             "#9900FF"
//         ]
//     },
//     // ... other themes
// ];

// const result = transformThemes(themes);
// console.log(result);
export { colors, transformThemes };