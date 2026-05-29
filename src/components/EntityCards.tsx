import type { LldEntityScene, LldSummaryScene } from "../engine/sceneTypes";

type Props = {
  scene: LldEntityScene | LldSummaryScene;
};

export function EntityCards({ scene }: Props) {
  if (scene.type === "summary") {
    return (
      <div className="summary-scene">
        {scene.summaryBullets.map((bullet) => (
          <div className="summary-item" key={bullet}>{bullet}</div>
        ))}
      </div>
    );
  }

  const highlighted = new Set(scene.highlightedEntityIds ?? []);
  return (
    <div className="entity-grid">
      {scene.entities.slice(0, 8).map((entity) => (
        <article className={`entity-card ${highlighted.has(entity.id) ? "highlighted" : ""}`} key={entity.id}>
          <span>{entity.type}</span>
          <h3>{entity.name}</h3>
          <p>{entity.responsibility}</p>
        </article>
      ))}
    </div>
  );
}
