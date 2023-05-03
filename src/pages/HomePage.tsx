import * as Image from "image-js";

import {} from "../../data/test.png";
import { useContext, useEffect, useState } from "react";
import { ImageViewer } from "../components/ImageViewer";
import { DragProvider, DragContext } from "../context/DragContext";
import { ObjectInspector } from "react-inspector";

export function HomePage() {
  const imageURL = new URL(`../../data/test.png`, import.meta.url);
  const [image, setImage] = useState<Image.Image>(new Image.Image(1, 1));
  useEffect(() => {
    fetchImage(imageURL, setImage);
  }, []);
  return <DraggableComponent image={image} />;
}

function DraggableComponent({ image }: { image: Image.Image }) {
  return (
    <DragProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <ImageViewer
          image={image}
          options={{ width: image.width, height: image.height }}
        />
        <div
          style={{
            position: "relative",
            backgroundColor: "grey",
            width: "50%",
            height: "50%",
          }}
        >
          <StateObject />
        </div>
      </div>
    </DragProvider>
  );
}

function StateObject() {
  const { state } = useContext(DragContext);
  return <ObjectInspector expandLevel={2} data={state} />;
}

async function fetchImage(url: URL, setImage: React.Dispatch<Image.Image>) {
  const response = await fetch(url.pathname);
  const buffer = await response.arrayBuffer();
  const image = Image.decode(new Uint8Array(buffer));
  setImage(image);
}
