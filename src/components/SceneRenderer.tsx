import type { LldScene } from "../engine/sceneTypes";
import { ClassDiagramCanvas } from "./ClassDiagramCanvas";
import { CodeTypingPanel } from "./CodeTypingPanel";
import { DryRunPanel } from "./DryRunPanel";
import { EndScreen } from "./EndScreen";
import { EntityCards } from "./EntityCards";
import { PatternCard } from "./PatternCard";
import { RequirementCards } from "./RequirementCards";
import { SequenceDiagramCanvas } from "./SequenceDiagramCanvas";

type Props = {
  scene: LldScene;
  progress: number;
};

export function SceneRenderer({ scene, progress }: Props) {
  switch (scene.type) {
    case "title":
      return (
        <div className="title-scene">
          <span>LLD Visualizer Video Studio</span>
          <h1>{scene.titleText}</h1>
          {scene.subtitle && <p>{scene.subtitle}</p>}
        </div>
      );
    case "text":
      return <RequirementCards scene={scene} />;
    case "entities":
      return <EntityCards scene={scene} />;
    case "classDiagram":
    case "relationship":
      return <ClassDiagramCanvas scene={scene} progress={progress} />;
    case "pattern":
      return <PatternCard scene={scene} />;
    case "sequence":
      return <SequenceDiagramCanvas scene={scene} progress={progress} />;
    case "code":
      return <CodeTypingPanel scene={scene} progress={progress} />;
    case "dryRun":
      return <DryRunPanel scene={scene} progress={progress} />;
    case "summary":
      return <EntityCards scene={scene} />;
    case "end":
      return <EndScreen scene={scene} />;
    default:
      return null;
  }
}
