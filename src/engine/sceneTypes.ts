import type {
  LldDesignPattern,
  LldDryRun,
  LldEntity,
  LldFlow,
  LldInterfaceDesign,
  LldPublicMethod,
  LldRelationship
} from "../topics/topicTypes";

export type LldScene =
  | LldTitleScene
  | LldTextScene
  | LldEntityScene
  | LldClassDiagramScene
  | LldRelationshipScene
  | LldPatternScene
  | LldSequenceScene
  | LldInterfaceScene
  | LldMethodScene
  | LldObjectFlowScene
  | LldStateMachineScene
  | LldListScene
  | LldTestCaseScene
  | LldCodeScene
  | LldDryRunScene
  | LldSummaryScene
  | LldEndScene;

export type BaseLldScene = {
  id: string;
  type: string;
  title: string;
  durationMs: number;
  rightPanel: {
    heading: string;
    body?: string;
    bullets?: string[];
    interviewNote?: string;
  };
  narration?: string;
};

export type LldTitleScene = BaseLldScene & {
  type: "title";
  titleText: string;
  subtitle?: string;
};

export type LldTextScene = BaseLldScene & {
  type: "text";
  cards: string[];
};

export type LldEntityScene = BaseLldScene & {
  type: "entities";
  entities: LldEntity[];
  highlightedEntityIds?: string[];
};

export type LldClassDiagramScene = BaseLldScene & {
  type: "classDiagram";
  entities: LldEntity[];
  relationships: LldRelationship[];
  highlightedEntityIds?: string[];
  highlightedRelationshipIndexes?: number[];
};

export type LldRelationshipScene = BaseLldScene & {
  type: "relationship";
  entities: LldEntity[];
  relationships: LldRelationship[];
  activeRelationshipIndex: number;
};

export type LldPatternScene = BaseLldScene & {
  type: "pattern";
  pattern: LldDesignPattern;
  entities: LldEntity[];
  highlightedEntityIds?: string[];
};

export type LldSequenceScene = BaseLldScene & {
  type: "sequence";
  flow: LldFlow;
  activeStepIndex: number;
};

export type LldInterfaceScene = BaseLldScene & {
  type: "interfaceDesign";
  interfaces: LldInterfaceDesign[];
};

export type LldMethodScene = BaseLldScene & {
  type: "methodContracts";
  methods: LldPublicMethod[];
};

export type LldObjectFlowScene = BaseLldScene & {
  type: "objectFlow";
  flow: LldFlow;
};

export type LldStateMachineScene = BaseLldScene & {
  type: "stateMachine";
  transitions: Array<{
    from: string;
    event: string;
    to: string;
    explanation: string;
  }>;
};

export type LldListScene = BaseLldScene & {
  type: "dataStructures" | "edgeCases" | "errorHandling" | "concurrency" | "tradeOffs" | "pitfalls";
  items: string[];
};

export type LldTestCaseScene = BaseLldScene & {
  type: "testCases";
  testCases: Array<{
    title: string;
    scenario: string;
    expected: string;
  }>;
};

export type LldCodeScene = BaseLldScene & {
  type: "code";
  filename: string;
  language: string;
  code: string;
  charsPerSecond: number;
};

export type LldDryRunScene = BaseLldScene & {
  type: "dryRun";
  dryRun: LldDryRun;
  activeStepIndex?: number;
};

export type LldSummaryScene = BaseLldScene & {
  type: "summary";
  entities: LldEntity[];
  summaryBullets: string[];
};

export type LldEndScene = BaseLldScene & {
  type: "end";
  text: string;
};
