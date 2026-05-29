import { relationshipLabel } from "../engine/layoutEngine";
import type { LldRelationship } from "../topics/topicTypes";

type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  relationship: LldRelationship;
  active?: boolean;
};

export function RelationshipArrow({ x1, y1, x2, y2, relationship, active }: Props) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g className={active ? "relationship-arrow active" : "relationship-arrow"}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd="url(#arrowhead)" />
      <text x={midX} y={midY - 7}>{relationshipLabel(relationship)}</text>
    </g>
  );
}
