import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  fit?: boolean;
}

export function Layout(props: LayoutProps) {
  const { children, fit } = props;
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 4,
        width: fit ? 'fit-content' : undefined,
      }}
    >
      {children}
    </div>
  );
}
