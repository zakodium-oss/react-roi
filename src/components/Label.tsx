export function Label({
  label,
  x,
  y,
  width,
}: {
  label: string;
  x: number;
  y: number;
  width: number;
}) {
  return (
    <text
      x={x}
      y={y}
      alignmentBaseline="middle"
      textAnchor="middle"
      stroke="none"
      fill="black"
      style={{
        fontSize: Math.floor(width),
        fontWeight: 'bold',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {label}
    </text>
  );
}
