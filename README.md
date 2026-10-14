# react-roi

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

React library to draw, move and resize rectangles.

## Installation

```console
npm i react-roi
```

## Usage

Wrap your component tree in a `RoiProvider`, render a `RoiContainer` around the target (typically an image) and put a `RoiList` inside the container:

```jsx
import { RoiContainer, RoiList, RoiProvider, TargetImage } from 'react-roi';

export function App() {
  return (
    <RoiProvider initialConfig={{ rois: [] }}>
      <RoiContainer target={<TargetImage src="/my-image.jpg" />}>
        <RoiList />
      </RoiContainer>
    </RoiProvider>
  );
}
```

Any component rendered inside the `RoiProvider` can read and update the state with the hooks (`useActions`, `useCommittedRois`, `useRoiState`, ...).

## Which component takes which option?

Each component owns one kind of concern. When looking for an option, start from what it affects:

| Component      | Owns                                                                                                   | Examples                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `RoiProvider`  | The state and the strategies applied to it: initial ROIs, mode, zoom domain, commit and boundary rules | `initialConfig.mode`, `initialConfig.commitRoiBoundaryStrategy`, `onCommit`, `onChange` |
| `RoiContainer` | The viewport and the pointer interactions on it: panning, zooming, unselecting, drawing new ROIs       | `interactions={{ pan: false }}`, `zoomWithoutModifierKey`, `getNewRoiData`              |
| `RoiList`      | How each ROI looks and what the user can do with each ROI                                              | `getStyle`, `renderLabel`, `showGrid`                                                   |

### Allowed interactions

Interactions are what the user does with the pointer: pan, zoom, unselect, select, move, resize, rotate, draw. By default everything is allowed. Restrictions only apply to pointer interactions: the actions API returned by `useActions` is never restricted.

On the container, pass an `interactions` object and set to `false` what should not be allowed:

```jsx
<RoiContainer
  target={<TargetImage src="/my-image.jpg" />}
  interactions={{ pan: false, zoom: false, unselect: false }}
>
  <RoiList />
</RoiContainer>
```

- `pan`: panning the target with alt + drag, the middle / right mouse button, or a plain drag in `select` mode.
- `zoom`: zooming the target with the mouse wheel.
- `unselect`: unselecting the current ROI by clicking on empty space. When `false`, the selection is kept, including when a new draw is cancelled or too small.

Whether the user can draw new ROIs is controlled by the `mode` of the `RoiProvider`.

[npm-image]: https://img.shields.io/npm/v/react-roi.svg
[npm-url]: https://npmjs.org/package/react-roi
[ci-image]: https://github.com/zakodium-oss/react-roi/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/zakodium-oss/react-roi/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/react-roi.svg
[download-url]: https://npmjs.org/package/react-roi
