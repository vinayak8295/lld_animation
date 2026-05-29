import type { LldScene } from "../engine/sceneTypes";

type Props = {
  scenes: LldScene[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
};

export function SceneTimeline({ scenes, currentSceneIndex, onSelectScene }: Props) {
  return (
    <section className="panel timeline-panel">
      <div className="panel-title-row">
        <h2>Scene Timeline</h2>
        <span>{scenes.length} scenes</span>
      </div>
      <div className="timeline-list">
        {scenes.map((scene, index) => (
          <button
            type="button"
            className={index === currentSceneIndex ? "active" : ""}
            key={scene.id}
            onClick={() => onSelectScene(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{scene.title}</strong>
            <small>{Math.round(scene.durationMs / 100) / 10}s</small>
          </button>
        ))}
      </div>
    </section>
  );
}
