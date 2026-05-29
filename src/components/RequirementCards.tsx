import type { LldTextScene } from "../engine/sceneTypes";

type Props = {
  scene: LldTextScene;
};

export function RequirementCards({ scene }: Props) {
  return (
    <div className="requirement-grid">
      {scene.cards.slice(0, 6).map((card, index) => (
        <div className="requirement-card" key={card}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{card}</p>
        </div>
      ))}
    </div>
  );
}
