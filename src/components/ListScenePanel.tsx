import type { LldListScene } from "../engine/sceneTypes";

type Props = {
  scene: LldListScene;
};

const labels: Record<LldListScene["type"], string> = {
  dataStructures: "Data",
  edgeCases: "Edge",
  errorHandling: "Error",
  concurrency: "Thread",
  tradeOffs: "Trade",
  pitfalls: "Pitfall"
};

export function ListScenePanel({ scene }: Props) {
  return (
    <div className="insight-list">
      {scene.items.slice(0, 6).map((item, index) => (
        <article className="insight-item" key={item}>
          <span>{labels[scene.type]} {index + 1}</span>
          <p>{item}</p>
        </article>
      ))}
    </div>
  );
}
