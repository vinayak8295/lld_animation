import type { LldEntity, LldRelationship } from "../topics/topicTypes";

export type DiagramNodeLayout = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function buildClassDiagramLayout(entities: LldEntity[]): DiagramNodeLayout[] {
  const columns = entities.length > 6 ? 3 : 2;
  const width = 230;
  const height = 150;
  const gapX = columns === 3 ? 42 : 88;
  const gapY = 44;
  return entities.map((entity, index) => ({
    id: entity.id,
    x: 42 + (index % columns) * (width + gapX),
    y: 42 + Math.floor(index / columns) * (height + gapY),
    width,
    height
  }));
}

export function resolveEntityId(entities: LldEntity[], ref: string) {
  const normalizedRef = normalize(ref);
  return entities.find((entity) => normalize(entity.id) === normalizedRef || normalize(entity.name) === normalizedRef)?.id;
}

export function relationshipLabel(relationship: LldRelationship) {
  if (relationship.label) return relationship.label;
  return relationship.type.replace("-", " ");
}

function normalize(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}
