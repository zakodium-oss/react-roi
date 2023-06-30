# react-roi

React library to draw, move and resize rectangles.

## Installation

```console
npm i react-roi
```

## Usage

To use the component with elements:

```js
import { RoiComponent } from 'react-roi';

function MyComponent() {
  return (
    <RoiComponent>
      <div style={{ width: '500px', height: '500px' }} />
    </RoiComponent>
  );
}
```

To use the component with images:

```js
import { RoiComponent } from 'react-roi';

function MyComponent() {
  return <RoiComponent image={image} />;
}
```

To access the state of the component, you need to render the RoiProvider at the top level of the required component. By doing so, any components wrapped within the RoiProvider will have access to the state provided by the context.

```js
import { RoiProvider } from 'react-roi';

export default function App() {
  return (
    <RoiProvider>
      <MyComponent />
    </RoiProvider>
  );
}
```

[npm-image]: https://img.shields.io/npm/v/react-roi.svg
[npm-url]: https://npmjs.org/package/react-roi
[ci-image]: https://github.com/zakodium-oss/react-roi/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/zakodium-oss/react-roi/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/react-roi.svg
[download-url]: https://npmjs.org/package/react-roi
