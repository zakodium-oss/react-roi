import type { CSSProperties, ReactNode } from 'react';

export function LabelContainer(props: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { className, style, children } = props;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        placeContent: 'center',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden',
        fontSize: 16,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
