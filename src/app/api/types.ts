export type ColorPalette = {
    name: string;
    colors: string[];
};
export type Theme = {
    name: string;
    model: string | null;
    timestamp: string,
    palettes: ColorPalette[];
};
