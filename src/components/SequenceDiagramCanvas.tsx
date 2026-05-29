import type { LldSequenceScene } from "../engine/sceneTypes";
import { Lifeline } from "./Lifeline";
import { MessageArrow } from "./MessageArrow";

type Props = {
  scene: LldSequenceScene;
  progress: number;
};

export function SequenceDiagramCanvas({ scene, progress }: Props) {
  const participants = Array.from(new Set(scene.flow.steps.flatMap((step) => [step.actor, step.target])));
  const width = 860;
  const height = 560;
  const gap = width / Math.max(1, participants.length + 1);
  const xByName = new Map(participants.map((name, index) => [name, gap * (index + 1)]));
  const activeStepIndex = Math.min(scene.flow.steps.length - 1, Math.floor(progress * scene.flow.steps.length));

  return (
    <div className="sequence-canvas">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="sequenceArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        {participants.map((participant) => (
          <Lifeline key={participant} name={participant} x={xByName.get(participant)!} height={height} />
        ))}
        {scene.flow.steps.map((step, index) => (
          <MessageArrow
            key={`${step.actor}-${step.target}-${step.method}-${index}`}
            fromX={xByName.get(step.actor)!}
            toX={xByName.get(step.target)!}
            y={116 + index * 70}
            label={step.method}
            active={index === activeStepIndex}
          />
        ))}
      </svg>
      <div className="sequence-step">
        <span>Step {activeStepIndex + 1}</span>
        <p>{scene.flow.steps[activeStepIndex]?.explanation}</p>
      </div>
    </div>
  );
}
