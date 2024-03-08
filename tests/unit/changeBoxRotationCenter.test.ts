import { expect, test } from 'vitest';

import { BoxWithRotationCenter } from '../../src';
import { changeBoxRotationCenter } from '../../src/utilities/box';

test('changeBoxRotationCenter left-top to right-bottom and vice versa', () => {
  const originalBox: BoxWithRotationCenter = {
    x: 0,
    y: 0,
    width: 10,
    height: 20,
    angle: Math.PI / 2,
    xRotationCenter: 'left',
    yRotationCenter: 'top',
  };
  const box = changeBoxRotationCenter(originalBox, {
    xRotationCenter: 'right',
    yRotationCenter: 'bottom',
  });

  expectBoxTeBeCloseTo(box, {
    x: -30,
    y: -10,
    width: 10,
    height: 20,
    angle: Math.PI / 2,
    xRotationCenter: 'right',
    yRotationCenter: 'bottom',
  });

  const backToOriginal = changeBoxRotationCenter(box, {
    xRotationCenter: 'left',
    yRotationCenter: 'top',
  });
  expectBoxTeBeCloseTo(backToOriginal, originalBox);
});

test('changeBoxRotationCenter left-top to center-center and vice versa', () => {
  const originalBox: BoxWithRotationCenter = {
    x: 10,
    y: -20,
    width: 10,
    height: 20,
    angle: Math.PI / 2,
    xRotationCenter: 'left',
    yRotationCenter: 'top',
  };
  const box = changeBoxRotationCenter(originalBox, {
    xRotationCenter: 'center',
    yRotationCenter: 'center',
  });

  expectBoxTeBeCloseTo(box, {
    x: -5,
    y: -25,
    width: 10,
    height: 20,
    angle: Math.PI / 2,
    xRotationCenter: 'center',
    yRotationCenter: 'center',
  });

  const backToOriginal = changeBoxRotationCenter(box, {
    xRotationCenter: 'left',
    yRotationCenter: 'top',
  });
  expectBoxTeBeCloseTo(backToOriginal, originalBox);
});

function expectBoxTeBeCloseTo(
  originalBox: BoxWithRotationCenter,
  box: BoxWithRotationCenter,
) {
  expect(box.x).toBeCloseTo(originalBox.x);
  expect(box.y).toBeCloseTo(originalBox.y);
  expect(box.width).toBeCloseTo(originalBox.width);
  expect(box.height).toBeCloseTo(originalBox.height);
  expect(box.angle).toBeCloseTo(originalBox.angle);
  expect(box.xRotationCenter).toBe(originalBox.xRotationCenter);
  expect(box.yRotationCenter).toBe(originalBox.yRotationCenter);
}
