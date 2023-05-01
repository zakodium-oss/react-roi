import * as Image from "image-js";

import {} from "../../data/test.png";
import { useEffect, useState } from "react";
import { ImageViewer } from "../components/ImageViewer";
import { DragProvider } from "../context/DragContext";

export function HomePage() {
  // TODO: this is hardcoded. Find the way to make it reusable.
  const imageURL = new URL(`../../data/test.png`, import.meta.url);
  const [image, setImage] = useState<Image.Image>(new Image.Image(1, 1));
  useEffect(() => {
    fetchImage(imageURL, setImage);
  }, []);
  return <DraggableComponent image={image} />;
}

function DraggableComponent({ image }: { image: Image.Image }) {
  console.log("image", { width: image.width, height: image.height });
  return (
    <DragProvider>
      <ImageViewer image={image} />
    </DragProvider>
  );
}

async function fetchImage(url: URL, setImage: React.Dispatch<Image.Image>) {
  const response = await fetch(url.pathname);
  const buffer = await response.arrayBuffer();
  const image = Image.decode(new Uint8Array(buffer));
  setImage(image);
}
