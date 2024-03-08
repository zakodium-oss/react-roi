import { changeBoxRotationCenter } from './src/utilities/box';

const box = changeBoxRotationCenter(
  {
    x: 20,
    y: -10,
    width: 10,
    height: 20,
    angle: Math.PI / 2,
    xRotationCenter: 'center',
    yRotationCenter: 'top',
  },
  { xRotationCenter: 'right', yRotationCenter: 'bottom' },
);

console.log(box);
