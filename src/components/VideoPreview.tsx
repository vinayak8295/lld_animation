import type { LldScene } from "../engine/sceneTypes";
import { ExplanationPanel } from "./ExplanationPanel";
import { SceneRenderer } from "./SceneRenderer";

type Props = {
  scene?: LldScene;
  orientation: "vertical" | "desktop";
  progress: number;
};

export function VideoPreview({ scene, orientation, progress }: Props) {
  if (!scene) {
    return <div className={`lld-preview ${orientation} empty-preview`}>Generate a timeline to preview the video.</div>;
  }

  return (
    <div className={`lld-preview ${orientation}`} data-testid="video-preview">
      <div className="scene-header">
        <span>{scene.title}</span>
        <small>{Math.round(progress * 100)}%</small>
      </div>
      <div className="preview-content">
        <div className="visual-zone">
          <SceneRenderer scene={scene} progress={progress} />
        </div>
        <ExplanationPanel panel={scene.rightPanel} />
      </div>
    </div>
  );
}
