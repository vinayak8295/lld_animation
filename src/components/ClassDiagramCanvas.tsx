import type { LldClassDiagramScene, LldRelationshipScene } from "../engine/sceneTypes";
import { buildClassDiagramLayout, resolveEntityId } from "../engine/layoutEngine";
import { mentionedEntityIds, mentionedRelationshipIndexes } from "../engine/visualSemantics";
import { ClassBox } from "./ClassBox";
import { RelationshipArrow } from "./RelationshipArrow";

type Props = {
  scene: LldClassDiagramScene | LldRelationshipScene;
  progress: number;
};

export function ClassDiagramCanvas({ scene, progress }: Props) {
  const layout = buildClassDiagramLayout(scene.entities);
  const byId = new Map(layout.map((item) => [item.id, item]));
  const highlightedEntities = new Set([
    ...("highlightedEntityIds" in scene ? scene.highlightedEntityIds ?? [] : []),
    ...mentionedEntityIds(scene.narration, scene.entities)
  ]);
  const narratedRelationships = new Set(mentionedRelationshipIndexes(scene.narration, scene.relationships));
  const activeRelationshipIndex =
    scene.type === "relationship"
      ? scene.activeRelationshipIndex
      : Math.min(scene.relationships.length - 1, Math.floor(progress * scene.relationships.length));

  return (
    <div className="diagram-canvas">
      <svg viewBox="0 0 840 690" preserveAspectRatio="xMidYMid meet" className="diagram-arrows">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        {scene.relationships.map((relationship, index) => {
          const fromId = resolveEntityId(scene.entities, relationship.from);
          const toId = resolveEntityId(scene.entities, relationship.to);
          const from = fromId ? byId.get(fromId) : undefined;
          const to = toId ? byId.get(toId) : undefined;
          if (!from || !to) return null;
          return (
            <RelationshipArrow
              key={`${relationship.from}-${relationship.to}-${index}`}
              x1={from.x + from.width / 2}
              y1={from.y + from.height / 2}
              x2={to.x + to.width / 2}
              y2={to.y + to.height / 2}
              relationship={relationship}
              active={index === activeRelationshipIndex || narratedRelationships.has(index)}
            />
          );
        })}
      </svg>
      {layout.map((item) => {
        const entity = scene.entities.find((candidate) => candidate.id === item.id)!;
        const active =
          highlightedEntities.has(entity.id) ||
          scene.relationships[activeRelationshipIndex]?.from === entity.name ||
          scene.relationships[activeRelationshipIndex]?.to === entity.name;
        return (
          <ClassBox
            key={entity.id}
            entity={entity}
            active={active}
            style={{ left: item.x, top: item.y, width: item.width, minHeight: item.height }}
          />
        );
      })}
    </div>
  );
}
