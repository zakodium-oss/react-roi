import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout(props: LayoutProps) {
  const { children } = props;
  return <div style={{ maxWidth: 300, position: 'relative' }}>{children}</div>;
}
