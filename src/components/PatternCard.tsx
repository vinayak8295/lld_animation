import type { LldPatternScene } from "../engine/sceneTypes";

type Props = {
  scene: LldPatternScene;
};

export function PatternCard({ scene }: Props) {
  return (
    <div className="pattern-card">
      <span>Design Pattern</span>
      <h2>{scene.pattern.name}</h2>
      <div>
        <strong>Used in</strong>
        <p>{scene.pattern.usedIn}</p>
      </div>
      <div>
        <strong>Reason</strong>
        <p>{scene.pattern.reason}</p>
      </div>
    </div>
  );
}
