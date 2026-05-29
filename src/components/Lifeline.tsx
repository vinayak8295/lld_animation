type Props = {
  name: string;
  x: number;
  height: number;
};

export function Lifeline({ name, x, height }: Props) {
  return (
    <g className="lifeline">
      <rect x={x - 58} y={24} width={116} height={38} rx={6} />
      <text x={x} y={49}>{name}</text>
      <line x1={x} x2={x} y1={62} y2={height - 30} />
    </g>
  );
}
