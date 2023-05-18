import { DataContextProps } from '../../context/DataContext';

export function onMouseUpOutside(componentState: DataContextProps) {
  const { eventDispatch } = componentState;
  eventDispatch({ type: 'setIsMouseDown', payload: false });
  // TODO: Find out how to handle events outside of boundaries
  // const x =
  //   event.clientX > width / delta.width ? width / delta.width : event.clientX;
  // const y =
  //   event.clientY > height / delta.height
  //     ? height / delta.height
  //     : event.clientY;
}
