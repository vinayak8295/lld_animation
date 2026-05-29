import type {
  LldDesignPattern,
  LldDryRun,
  LldEntity,
  LldFlow,
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
