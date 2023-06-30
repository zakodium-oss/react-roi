import { PositionAction } from '../../context/PositionContext';

export function observeResizing(
  imageRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  positionDispatch: (value: PositionAction) => void,
) {
  return new ResizeObserver((entries) => {
    for (let entry of entries) {
      const content = entry.contentRect;
      if (
        entry.target === imageRef.current &&
        content.height !== 0 &&
        content.width !== 0
      ) {
        positionDispatch({
          type: 'setDelta',
          payload: {
            dx: width / entry.contentRect.width,
            dy: height / entry.contentRect.height,
          },
        });
      }
    }
  });
}
