import { EventActions } from '../../context/EventReducer';

export function observeResizing(
  imageRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number,
  eventDispatch: (value: EventActions) => void
) {
  return new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target === imageRef.current) {
        eventDispatch({
          type: 'setDelta',
          payload: {
            width: width / entry.contentRect.width,
            height: height / entry.contentRect.height,
          },
        });
      }
    }
  });
}
