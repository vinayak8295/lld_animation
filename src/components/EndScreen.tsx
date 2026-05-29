import type { LldEndScene } from "../engine/sceneTypes";

type Props = {
  scene: LldEndScene;
};

export function EndScreen({ scene }: Props) {
  return (
    <div className="end-screen">
      <span>{scene.text}</span>
      <h2>Design complete</h2>
      <p>Structured classes. Clear flows. Interview-ready explanation.</p>
    </div>
  );
}
