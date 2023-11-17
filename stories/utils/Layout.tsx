import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 4,
      }}
    >
      {children}
    </div>
  );
}
