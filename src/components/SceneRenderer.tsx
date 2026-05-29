import type { LldScene } from "../engine/sceneTypes";
import { ClassDiagramCanvas } from "./ClassDiagramCanvas";
import { CodeTypingPanel } from "./CodeTypingPanel";
import { DryRunPanel } from "./DryRunPanel";
import { EndScreen } from "./EndScreen";
import { EntityCards } from "./EntityCards";
import { InterfaceDesignPanel } from "./InterfaceDesignPanel";
import { ListScenePanel } from "./ListScenePanel";
import { MethodContractsPanel } from "./MethodContractsPanel";
import { ObjectFlowPanel } from "./ObjectFlowPanel";
import { PatternCard } from "./PatternCard";
import { RequirementCards } from "./RequirementCards";
import { SequenceDiagramCanvas } from "./SequenceDiagramCanvas";
import { StateMachineCanvas } from "./StateMachineCanvas";
import { TestCasePanel } from "./TestCasePanel";

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
    case "interfaceDesign":
      return <InterfaceDesignPanel scene={scene} />;
    case "methodContracts":
      return <MethodContractsPanel scene={scene} />;
    case "objectFlow":
      return <ObjectFlowPanel scene={scene} />;
    case "stateMachine":
      return <StateMachineCanvas scene={scene} progress={progress} />;
    case "dataStructures":
    case "edgeCases":
    case "errorHandling":
    case "concurrency":
    case "tradeOffs":
    case "pitfalls":
      return <ListScenePanel scene={scene} />;
    case "testCases":
      return <TestCasePanel scene={scene} />;
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
