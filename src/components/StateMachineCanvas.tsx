import type { LldStateMachineScene } from "../engine/sceneTypes";

type Props = {
  scene: LldStateMachineScene;
  progress: number;
};

export function StateMachineCanvas({ scene, progress }: Props) {
  const activeIndex = Math.min(scene.transitions.length - 1, Math.floor(progress * Math.max(1, scene.transitions.length)));

  return (
    <div className="state-machine">
      {scene.transitions.slice(0, 6).map((transition, index) => (
        <div className={`state-transition ${index === activeIndex ? "active" : ""}`} key={`${transition.from}-${transition.event}-${transition.to}`}>
          <div className="state-node">{transition.from}</div>
          <div className="state-edge">
            <span>{transition.event}</span>
          </div>
          <div className="state-node">{transition.to}</div>
          <p>{transition.explanation}</p>
        </div>
      ))}
    </div>
  );
}
