import {
  render,
  fireEvent,
  act,
  getByTestId,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';

import { RoiComponent } from '../components/RoiComponent';
import { RoiProvider, sharedRois } from '../context/RoiContext';

afterEach(cleanup);

test('Test roi component with a div element', async () => {
  const { container } = render(
    <RoiProvider>
      <RoiComponent>
        <div
          data-testid="div-id"
          style={{
            width: 100,
            height: 100,
            top: 0,
            left: 0,
          }}
        />
      </RoiComponent>
    </RoiProvider>,
  );

  await waitFor(() => {
    const element = getByTestId(container, 'div-id');
    Object.defineProperty(element, 'getBoundingClientRect', {
      value: () => ({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
      }),
    });
  });

  const roiComponent = document.getElementById(
    'container-component',
  ) as HTMLElement;

  /** Drawing the first square */
  act(() => {
    fireEvent.mouseDown(roiComponent, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(roiComponent, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(roiComponent, { clientX: 20, clientY: 20 });
  });

  expect(sharedRois[0].rectangle).toStrictEqual({
    origin: { row: 10, column: 10 },
    width: 10,
    height: 10,
  });

  /** Drawing the second square */
  act(() => {
    fireEvent.mouseDown(roiComponent, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(roiComponent, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(roiComponent, { clientX: 50, clientY: 50 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 30, column: 30 },
    width: 20,
    height: 20,
  });

  expect(sharedRois).toHaveLength(2);

  /**
   * Dragging the second square.
   * The column and row positions of the rectangle should increase by 10.
   */
  const box = document.getElementById(`${sharedRois[1].id}`) as HTMLElement;
  act(() => {
    fireEvent.mouseDown(box, { clientX: 35, clientY: 35 });
    fireEvent.mouseMove(box, { clientX: 45, clientY: 45 });
    fireEvent.mouseUp(box, { clientX: 45, clientY: 45 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 40, column: 40 },
    width: 20,
    height: 20,
  });

  /**
   * Resizing the second square using the bottom-right pointer.
   * The width and height should increase by 10.
   */
  const pointer2 = document.getElementById('pointer-2') as HTMLElement;

  act(() => {
    fireEvent.mouseDown(pointer2, { clientX: 60, clientY: 60 });
    fireEvent.mouseMove(pointer2, { clientX: 70, clientY: 70 });
    fireEvent.mouseUp(pointer2, { clientX: 70, clientY: 70 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 40, column: 40 },
    width: 30,
    height: 30,
  });

  /**
   * Resizing the second square using the top-middle pointer.
   * The height should increase by 10 while the width remains unaffected.
   */
  const pointer4 = document.getElementById('pointer-4') as HTMLElement;

  act(() => {
    fireEvent.mouseDown(pointer4, { clientX: 55, clientY: 40 });
    fireEvent.mouseMove(pointer4, { clientX: 70, clientY: 30 });
    fireEvent.mouseUp(pointer4, { clientX: 0, clientY: 30 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 30, column: 40 },
    width: 30,
    height: 40,
  });
});

test('Test roi component with a svg element', async () => {
  const { container } = render(
    <RoiProvider>
      <RoiComponent>
        <svg
          data-testid="svg-id"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          style={{ border: '1px solid black' }}
        />
      </RoiComponent>
    </RoiProvider>,
  );

  await waitFor(() => {
    const element = getByTestId(container, 'svg-id');
    Object.defineProperty(element, 'getBoundingClientRect', {
      value: () => ({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
      }),
    });
  });

  const roiComponent = document.getElementById(
    'container-component',
  ) as HTMLElement;

  /** Drawing the first square */
  act(() => {
    fireEvent.mouseDown(roiComponent, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(roiComponent, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(roiComponent, { clientX: 20, clientY: 20 });
  });

  expect(sharedRois[0].rectangle).toStrictEqual({
    origin: { row: 10, column: 10 },
    width: 10,
    height: 10,
  });

  /** Drawing the second square */
  act(() => {
    fireEvent.mouseDown(roiComponent, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(roiComponent, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(roiComponent, { clientX: 50, clientY: 50 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 30, column: 30 },
    width: 20,
    height: 20,
  });

  expect(sharedRois).toHaveLength(2);

  /**
   * Dragging the second square.
   * The column and row positions of the rectangle should increase by 10.
   */
  const box = document.getElementById(`${sharedRois[1].id}`) as HTMLElement;
  act(() => {
    fireEvent.mouseDown(box, { clientX: 35, clientY: 35 });
    fireEvent.mouseMove(box, { clientX: 45, clientY: 45 });
    fireEvent.mouseUp(box, { clientX: 45, clientY: 45 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 40, column: 40 },
    width: 20,
    height: 20,
  });

  /**
   * Resizing the second square using the bottom-right pointer.
   * The width and height should increase by 10.
   */
  const pointer2 = document.getElementById('pointer-2') as HTMLElement;

  act(() => {
    fireEvent.mouseDown(pointer2, { clientX: 60, clientY: 60 });
    fireEvent.mouseMove(pointer2, { clientX: 70, clientY: 70 });
    fireEvent.mouseUp(pointer2, { clientX: 70, clientY: 70 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 40, column: 40 },
    width: 30,
    height: 30,
  });

  /**
   * Resizing the second square using the top-middle pointer.
   * The height should increase by 10 while the width remains unaffected.
   */
  const pointer4 = document.getElementById('pointer-4') as HTMLElement;

  act(() => {
    fireEvent.mouseDown(pointer4, { clientX: 55, clientY: 40 });
    fireEvent.mouseMove(pointer4, { clientX: 70, clientY: 30 });
    fireEvent.mouseUp(pointer4, { clientX: 0, clientY: 30 });
  });

  expect(sharedRois[1].rectangle).toStrictEqual({
    origin: { row: 30, column: 40 },
    width: 30,
    height: 40,
  });
});
