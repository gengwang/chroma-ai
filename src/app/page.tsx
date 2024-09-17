// import Image from "next/image";
import ColorPaletteVisualizer from "./ui/ColorPaletteVisualizer";
import Footer from "@/app/ui/visualizers/Footer";
// import ClientColorPaletteVisualizer from "./ui/ClientColorPaletteVisualizer";

export default function Home({searchParams}: {searchParams: {model: string, keyword: string}}) {
  return (
    <>
      <div className="m-12">
        <ColorPaletteVisualizer model={searchParams.model} keyword={searchParams.keyword || ""} />
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <Footer />
      </div>
    </>
  );
}
