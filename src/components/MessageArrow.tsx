type Props = {
  fromX: number;
  toX: number;
  y: number;
  label: string;
  active?: boolean;
};

export function MessageArrow({ fromX, toX, y, label, active }: Props) {
  return (
    <g className={active ? "message-arrow active" : "message-arrow"}>
      <line x1={fromX} y1={y} x2={toX} y2={y} markerEnd="url(#sequenceArrow)" />
      <text x={(fromX + toX) / 2} y={y - 8}>{label}</text>
    </g>
  );
}
