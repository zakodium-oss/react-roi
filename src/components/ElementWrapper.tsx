import { cloneElement, useRef } from 'react';

import { ContainerComponent } from './ContainerComponent';

type ElementWrapperProps = {
  children: JSX.Element;
};

export const ElementWrapper = ({ children }: ElementWrapperProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const element = cloneElement(children, { ref: elementRef });
  return <ContainerComponent element={element} />;
};
