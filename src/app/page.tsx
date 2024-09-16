// import Image from "next/image";
import ColorPaletteVisualizer from "./ui/ColorPaletteVisualizer";
// import ClientColorPaletteVisualizer from "./ui/ClientColorPaletteVisualizer";

export default function Home({searchParams}: {searchParams: {model: string, keyword: string}}) {
  return (
    <div className="m-12">
      <ColorPaletteVisualizer model={searchParams.model} keyword={searchParams.keyword || ""} />
    </div>
  );
}
