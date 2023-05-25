import { DynamicAction } from '../../context/DynamicContext';

export function observeResizing(
  imageRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  return new ResizeObserver((entries) => {
    for (let entry of entries) {
      const content = entry.contentRect;
      if (
        entry.target === imageRef.current &&
        content.height !== 0 &&
        content.width !== 0
      ) {
        dynamicDispatch({
          type: 'setRatio',
          payload: {
            x: width / entry.contentRect.width,
            y: height / entry.contentRect.height,
          },
        });
      }
    }
  });
}
