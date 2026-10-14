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

Any component rendered inside the `RoiProvider` can read and update the state with the following hooks:

- `useActions`: various callbacks for mutating the ROIs
- `useCommittedRois`: read the state of committed ROIs (updates only when an ROI is committed)
- `useRoiState`: read live ROI state (updates on every change) and other metadata like the selected ROI

## Which component takes which option?

Each component owns one kind of concern. When looking for an option, start from what it affects:

| Component      | Owns                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| `RoiProvider`  | Global options: initial ROIs, mode, zoom domain, commit and boundary rules                                  |
| `RoiContainer` | The viewport and the pointer interactions on the container: panning, zooming, unselecting, drawing new ROIs |
| `RoiList`      | Individual ROI styles and behaviours                                                                        |

[npm-image]: https://img.shields.io/npm/v/react-roi.svg
[npm-url]: https://npmjs.org/package/react-roi
[ci-image]: https://github.com/zakodium-oss/react-roi/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/zakodium-oss/react-roi/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/react-roi.svg
[download-url]: https://npmjs.org/package/react-roi
