import type { LldObjectFlowScene } from "../engine/sceneTypes";

type Props = {
  scene: LldObjectFlowScene;
};

export function ObjectFlowPanel({ scene }: Props) {
  return (
    <div className="object-flow">
      {scene.flow?.steps.slice(0, 6).map((step, index) => (
        <div className="object-flow-step" key={`${step.actor}-${step.target}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step.actor}</strong>
          <em>{step.method}</em>
          <strong>{step.target}</strong>
          <p>{step.explanation}</p>
        </div>
      ))}
    </div>
  );
}
