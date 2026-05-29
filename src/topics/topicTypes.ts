export type LldVideoConfig = {
  template: "matrix-lld" | "minimal-dark";
  topic:
    | "parking-lot"
    | "snake-and-ladder"
    | "elevator-system"
    | "food-delivery-app"
    | "splitwise"
    | "bookmyshow"
    | "atm-machine"
    | "vending-machine"
    | "chess-game"
    | "tic-tac-toe"
    | "logging-framework"
    | "rate-limiter-lld"
    | "cache-lru"
    | "library-management-system"
    | "car-rental-system"
    | "hotel-management-system";
  title: string;
  difficulty?: "easy" | "medium" | "hard";
  language: "java" | "cpp" | "typescript" | "python";
  settings: {
    orientation: "vertical" | "desktop";
    showRightTextPanel: boolean;
    showCode: boolean;
    showClassDiagram: boolean;
    showSequenceDiagram: boolean;
    speed?: "slow" | "normal" | "fast";
  };
  problem: {
    requirements: string[];
    constraints?: string[];
    entities: LldEntity[];
    interfaces?: LldInterfaceDesign[];
    publicMethods?: LldPublicMethod[];
    relationships: LldRelationship[];
    flows: LldFlow[];
    patterns?: LldDesignPattern[];
    codeFiles?: LldCodeFile[];
    dryRuns?: LldDryRun[];
    dataStructures?: string[];
    stateTransitions?: LldStateTransition[];
    edgeCases?: string[];
    errorHandling?: string[];
    concurrencyConcerns?: string[];
    testCases?: LldTestCase[];
    tradeoffs?: string[];
    mistakesToAvoid?: string[];
    pitfalls?: string[];
  };
};

export type LldEntity = {
  id: string;
  name: string;
  type:
    | "class"
    | "abstract-class"
    | "interface"
    | "enum"
    | "singleton"
    | "service"
    | "repository"
    | "factory"
    | "strategy";
  responsibility: string;
  fields?: string[];
  methods?: string[];
  extends?: string;
  implements?: string[];
};

export type LldRelationship = {
  from: string;
  to: string;
  type: "extends" | "implements" | "has-one" | "has-many" | "uses" | "creates" | "depends-on";
  label?: string;
};

export type LldFlow = {
  id: string;
  title: string;
  steps: LldFlowStep[];
};

export type LldFlowStep = {
  actor: string;
  target: string;
  method: string;
  explanation: string;
};

export type LldInterfaceDesign = {
  name: string;
  responsibility: string;
  methods: string[];
  implementedBy?: string[];
};

export type LldPublicMethod = {
  owner: string;
  signature: string;
  purpose: string;
  inputs?: string[];
  output?: string;
  errors?: string[];
};

export type LldDesignPattern = {
  name: string;
  usedIn: string;
  reason: string;
};

export type LldCodeFile = {
  filename: string;
  language: "java" | "cpp" | "typescript" | "python";
  code: string;
};

export type LldDryRun = {
  title: string;
  steps: string[];
};

export type LldStateTransition = {
  from: string;
  event: string;
  to: string;
  explanation: string;
};

export type LldTestCase = {
  title: string;
  scenario: string;
  expected: string;
};

export type LldDepthProfile = {
  publicMethods: string[];
  classResponsibilities: string[];
  interfaces: string[];
  relationships: string[];
  designPatterns: string[];
  dataStructures: string[];
  objectLifecycle: string[];
  stateTransitions: string[];
  validationRules: string[];
  errorHandling: string[];
  concurrencyConcerns: string[];
  extensibilityPoints: string[];
  testCases: string[];
  tradeoffs: string[];
  interviewPitfalls: string[];
};
