import { CSSProperties } from 'react';

/**
 * Get img style properties to ensure proper rendering within react-roi
 * @param style
 */
export function getTargetImageStyle(style?: CSSProperties): CSSProperties {
  return {
    // block display so that the container fits the dimensions of the image
    display: 'block',
    // Pointer events is disabled to prevent the image to be draggable
    pointerEvents: 'none',
    // Revert any global css rules that can influence the width and height of the image
    // e.g. tailwindcss's preflight sets max-width: 100% on any img tag
    // The width and height of the target should be their natural values for react-roi to work as expected
    maxWidth: 'initial',
    maxHeight: 'initial',
    ...style,
  };
}
