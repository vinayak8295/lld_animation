import type { LldDryRunScene } from "../engine/sceneTypes";

type Props = {
  scene: LldDryRunScene;
  progress: number;
};

export function DryRunPanel({ scene, progress }: Props) {
  const activeStepIndex = Math.min(scene.dryRun.steps.length - 1, Math.floor(progress * scene.dryRun.steps.length));
  return (
    <div className="dry-run-panel">
      <h2>{scene.dryRun.title}</h2>
      {scene.dryRun.steps.map((step, index) => (
        <div className={`dry-run-step ${index <= activeStepIndex ? "active" : ""}`} key={step}>
          <span>{index + 1}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  );
}
