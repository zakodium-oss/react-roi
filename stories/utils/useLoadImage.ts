import { Image, readImg } from 'image-js';
import { RefObject, useEffect, useState } from 'react';

export function useLoadImage(
  imgId: string,
  canvas: RefObject<HTMLCanvasElement>,
) {
  const [image, setImage] = useState<Image | null>(null);

  // Effect to load the
  useEffect(() => {
    const img = document.getElementById(imgId) as HTMLImageElement;
    if (!canvas.current || !img) {
      return;
    }

    function onLoad() {
      const image = readImg(img);
      setImage(image);
    }
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, [imgId, canvas]);

  return image;
}
