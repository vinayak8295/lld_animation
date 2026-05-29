import type { LldCodeFile, LldEntity, LldVideoConfig } from "../topics/topicTypes";
import { normalizeLldConfig } from "../topics/normalizeConfig";
import type { LldScene } from "./sceneTypes";
import { speedMultiplier } from "./timing";

export function generateLldTimeline(config: LldVideoConfig): LldScene[] {
  return generateInterviewTopicTimeline(config);
}

export function generateParkingLotTimeline(config: LldVideoConfig): LldScene[] {
  return generateInterviewTopicTimeline(config);
}

export function generateInterviewTopicTimeline(rawConfig: LldVideoConfig): LldScene[] {
  const config = normalizeLldConfig(rawConfig);
  const { problem } = config;
  const entities = problem.entities;
  const relationships = problem.relationships;
  const flows = problem.flows;
  const patterns = problem.patterns || [];
  const codeFiles = problem.codeFiles?.length ? problem.codeFiles : generateJavaCodeSnippets(config.title, entities);
  const dryRun = problem.dryRuns?.[0];
  const factor = speedMultiplier(config.settings.speed);
  const duration = (ms: number) => Math.round(ms * factor);
  const mainCoordinator = entities.find((entity) => ["singleton", "service"].includes(entity.type)) ?? entities[0];
  const fallbackFlow = {
    id: "core-flow",
    title: "Core Flow",
    steps: [{
      actor: "Client",
      target: mainCoordinator?.name ?? "Service",
      method: "execute(request)",
      explanation: "The caller invokes the main use case and receives a domain result."
    }]
  };
  const firstFlow = flows[0] ?? fallbackFlow;
  const secondFlow = flows[1] ?? flows[0] ?? fallbackFlow;
  const primaryPattern = patterns[0];
  const primaryCode = codeFiles[0];

  const scenes: LldScene[] = [
    withNarration({
      id: "title",
      type: "title",
      title: "Title",
      durationMs: duration(3000),
      titleText: config.title,
      subtitle: `${config.difficulty ?? "medium"} LLD Interview Design`,
      rightPanel: {
        heading: "Interview Goal",
        body: `Design clean classes, interfaces, object flows, edge cases, tests, and trade-offs for ${config.title}.`
      }
    }),
    withNarration({
      id: "problem-statement",
      type: "text",
      title: "Problem Statement",
      durationMs: duration(5000),
      cards: buildProblemStatementCards(config),
      rightPanel: {
        heading: "Problem Framing",
        bullets: buildProblemStatementCards(config),
        interviewNote: "State scope, assumptions, and key workflows before drawing classes."
      }
    }),
    withNarration({
      id: "requirements",
      type: "text",
      title: "Functional Requirements",
      durationMs: duration(5000),
      cards: problem.requirements,
      rightPanel: {
        heading: "Functional Requirements",
        bullets: problem.requirements.slice(0, 5),
        interviewNote: "Requirements become methods, state transitions, and tests."
      }
    }),
    withNarration({
      id: "constraints",
      type: "text",
      title: "Constraints and Assumptions",
      durationMs: duration(5000),
      cards: problem.constraints ?? [],
      rightPanel: {
        heading: "Constraints",
        bullets: (problem.constraints ?? []).slice(0, 5),
        interviewNote: "Constraints decide whether the design needs locks, strategies, or repositories."
      }
    }),
    withNarration({
      id: "core-objects",
      type: "entities",
      title: "Core Objects and Classes",
      durationMs: duration(5500),
      entities,
      highlightedEntityIds: entities.slice(0, 6).map((entity) => entity.id),
      rightPanel: {
        heading: "Core Objects",
        bullets: entities.slice(0, 6).map((entity) => `${entity.name}: ${entity.responsibility}`),
        interviewNote: "Good LLD separates object responsibilities before adding methods."
      }
    }),
    withNarration({
      id: "class-diagram",
      type: "classDiagram",
      title: "Class Diagram",
      durationMs: duration(7000),
      entities,
      relationships,
      highlightedEntityIds: [],
      highlightedRelationshipIndexes: [],
      rightPanel: {
        heading: "Class Diagram",
        bullets: [
          `${mainCoordinator.name} coordinates the main workflow.`,
          `${entities[0]?.name ?? "Core entity"} anchors the model.`,
          "Composition owns object lifetime; dependencies express collaboration.",
          "Long explanations stay in the panel so the diagram remains clean."
        ],
        interviewNote: "Use the diagram to prove ownership and collaboration, not to dump text."
      }
    }),
    withNarration({
      id: "interface-design",
      type: "interfaceDesign",
      title: "Interface Design",
      durationMs: duration(5500),
      interfaces: problem.interfaces ?? [],
      rightPanel: {
        heading: "Interface Contracts",
        bullets: (problem.interfaces ?? []).slice(0, 4).map((item) => `${item.name}: ${item.responsibility}`),
        interviewNote: "Use interfaces only where behavior genuinely varies."
      }
    }),
    withNarration({
      id: "method-contracts",
      type: "methodContracts",
      title: "Public Method Contracts",
      durationMs: duration(6200),
      methods: problem.publicMethods ?? [],
      rightPanel: {
        heading: "Public Methods",
        bullets: (problem.publicMethods ?? []).slice(0, 5).map((method) => `${method.owner}.${method.signature}: ${method.purpose}`),
        interviewNote: "Method contracts turn requirements into testable behavior."
      }
    }),
    withNarration({
      id: "object-collaboration",
      type: "objectFlow",
      title: "Object Collaboration Flow",
      durationMs: duration(6000),
      flow: firstFlow,
      rightPanel: {
        heading: firstFlow?.title ?? "Object Collaboration",
        bullets: firstFlow?.steps.slice(0, 5).map((step) => `${step.actor} calls ${step.target}.${step.method}`) ?? [],
        interviewNote: "A collaboration flow proves that the class model is executable."
      }
    }),
    withNarration({
      id: "sequence-flow",
      type: "sequence",
      title: secondFlow?.title ?? "Sequence Diagram",
      durationMs: duration(6200),
      flow: secondFlow,
      activeStepIndex: 0,
      rightPanel: {
        heading: secondFlow?.title ?? "Sequence Flow",
        bullets: secondFlow?.steps.slice(0, 5).map((step) => step.explanation) ?? [],
        interviewNote: "Sequence diagrams expose missing dependencies and invalid state changes."
      }
    }),
    withNarration({
      id: "state-machine",
      type: "stateMachine",
      title: "State Transitions",
      durationMs: duration(6000),
      transitions: problem.stateTransitions ?? [],
      rightPanel: {
        heading: "State Machine",
        bullets: (problem.stateTransitions ?? []).slice(0, 5).map((transition) => `${transition.from} -> ${transition.to}: ${transition.explanation}`),
        interviewNote: "Explicit states prevent invalid operations from slipping into code."
      }
    }),
    withNarration({
      id: "design-pattern",
      type: "pattern",
      title: "Design Pattern Choice",
      durationMs: duration(5000),
      pattern: primaryPattern ?? {
        name: "Composition",
        usedIn: mainCoordinator.name,
        reason: "Keeps ownership and collaboration explicit without unnecessary inheritance."
      },
      entities,
      highlightedEntityIds: primaryPattern
        ? entities.filter((entity) => primaryPattern.usedIn.includes(entity.name)).map((entity) => entity.id)
        : [mainCoordinator.id],
      rightPanel: {
        heading: primaryPattern?.name ?? "Composition",
        bullets: [
          `Used in ${primaryPattern?.usedIn ?? mainCoordinator.name}`,
          primaryPattern?.reason ?? "Composition keeps the design extensible without forcing inheritance."
        ],
        interviewNote: "Name a pattern only when it solves a concrete design pressure."
      }
    }),
    withNarration({
      id: "data-structures",
      type: "dataStructures",
      title: "Data Structures Used",
      durationMs: duration(5000),
      items: problem.dataStructures ?? [],
      rightPanel: {
        heading: "Data Structures",
        bullets: (problem.dataStructures ?? []).slice(0, 5),
        interviewNote: "Data structures should justify time complexity and state ownership."
      }
    }),
    withNarration({
      id: "edge-cases",
      type: "edgeCases",
      title: "Edge Cases",
      durationMs: duration(6000),
      items: problem.edgeCases ?? [],
      rightPanel: {
        heading: "Edge Cases",
        bullets: (problem.edgeCases ?? []).slice(0, 5),
        interviewNote: "Edge cases reveal whether the design is robust or just happy-path."
      }
    }),
    withNarration({
      id: "error-handling",
      type: "errorHandling",
      title: "Error Handling",
      durationMs: duration(5500),
      items: problem.errorHandling ?? [],
      rightPanel: {
        heading: "Error Handling",
        bullets: (problem.errorHandling ?? []).slice(0, 5),
        interviewNote: "Handle failure before mutating shared or persistent state."
      }
    }),
    withNarration({
      id: "concurrency",
      type: "concurrency",
      title: "Concurrency and Thread Safety",
      durationMs: duration(6000),
      items: problem.concurrencyConcerns ?? [],
      rightPanel: {
        heading: "Concurrency",
        bullets: (problem.concurrencyConcerns ?? []).slice(0, 5),
        interviewNote: "Interviewers often push LLD designs with concurrent requests."
      }
    }),
    withNarration({
      id: "code-skeleton",
      type: "code",
      title: `Code Skeleton: ${primaryCode?.filename ?? "CoreService.java"}`,
      durationMs: duration(8000),
      filename: primaryCode?.filename ?? "CoreService.java",
      language: primaryCode?.language ?? config.language,
      code: primaryCode?.code ?? generateJavaCodeSnippets(config.title, entities)[0].code,
      charsPerSecond: 48,
      rightPanel: {
        heading: "Code Skeleton",
        bullets: [
          "Show the core fields and method contracts.",
          "Keep behavior near the object that owns the state.",
          "Avoid turning the coordinator into a catch-all class."
        ],
        interviewNote: "Code skeletons should prove design shape, not become full production code."
      }
    }),
    withNarration({
      id: "test-cases",
      type: "testCases",
      title: "Unit Test Cases",
      durationMs: duration(6000),
      testCases: problem.testCases ?? [],
      rightPanel: {
        heading: "Tests as Design Proof",
        bullets: (problem.testCases ?? []).slice(0, 5).map((test) => test.title),
        interviewNote: "Tests prove the class responsibilities and edge cases are clear."
      }
    }),
    withNarration({
      id: "trade-offs",
      type: "tradeOffs",
      title: "Trade-offs",
      durationMs: duration(5500),
      items: problem.tradeoffs ?? [],
      rightPanel: {
        heading: "Trade-offs",
        bullets: (problem.tradeoffs ?? []).slice(0, 5),
        interviewNote: "Strong candidates explain why they did not over-engineer."
      }
    }),
    withNarration({
      id: "pitfalls",
      type: "pitfalls",
      title: "Interview Pitfalls",
      durationMs: duration(5000),
      items: problem.pitfalls ?? problem.mistakesToAvoid ?? [],
      rightPanel: {
        heading: "Mistakes to Avoid",
        bullets: (problem.pitfalls ?? problem.mistakesToAvoid ?? []).slice(0, 5),
        interviewNote: "Calling out pitfalls shows you understand failure modes."
      }
    }),
    withNarration({
      id: "summary",
      type: "summary",
      title: "Final LLD Summary",
      durationMs: duration(5000),
      entities,
      summaryBullets: [
        "Requirements map to public methods.",
        "Classes own focused state and behavior.",
        "Sequence and state diagrams prove runtime correctness.",
        "Tests and trade-offs close the interview discussion."
      ],
      rightPanel: {
        heading: "Final Summary",
        bullets: [
          `${mainCoordinator.name} coordinates core use cases.`,
          `${entities.slice(0, 3).map((entity) => entity.name).join(", ")} carry primary state.`,
          firstFlow ? `${firstFlow.title} explains object collaboration.` : "The main flow validates the class design.",
          "Edge cases, tests, and trade-offs make the design interview-ready."
        ],
        interviewNote: "End by showing how the design can evolve without changing everything."
      }
    }),
    withNarration({
      id: "end",
      type: "end",
      title: "End Screen",
      durationMs: duration(2600),
      text: "LLD Visualizer Video Studio",
      rightPanel: {
        heading: "Next Steps",
        bullets: [
          "Add persistence and external API boundaries.",
          "Add metrics and operational failure handling.",
          "Revisit trade-offs if requirements change."
        ],
        interviewNote: "A good LLD answer is scoped, testable, and extensible."
      }
    })
  ];

  return scenes;
}

function withNarration<T extends LldScene>(scene: T): T {
  if (scene.narration) return scene;
  const bullets = scene.rightPanel.bullets?.join(" ");
  return {
    ...scene,
    narration: [scene.rightPanel.heading, scene.rightPanel.body, bullets, scene.rightPanel.interviewNote]
      .filter(Boolean)
      .join(" ")
  };
}

function buildProblemStatementCards(config: LldVideoConfig) {
  return [
    `Model ${config.title} with clear domain entities.`,
    `Support ${config.problem.requirements.slice(0, 2).join(" and ").toLowerCase()}.`,
    "Keep the design extensible for new rules, states, and workflows."
  ];
}

function generateJavaCodeSnippets(title: string, entities: LldEntity[]): LldCodeFile[] {
  const snippets: LldCodeFile[] = entities.slice(0, 4).map((entity) => ({
    filename: `${entity.name}.java`,
    language: "java" as const,
    code: `class ${entity.name} {
    ${fieldLines(entity).join("\n    ")}

    public ${entity.name}() {
    }

    ${methodLines(entity).join("\n\n    ")}
}`
  }));

  snippets.push({
    filename: `${title.replace(/[^A-Za-z0-9]/g, "")}Service.java`,
    language: "java" as const,
    code: `class ${title.replace(/[^A-Za-z0-9]/g, "")}Service {
    public void executeCoreFlow() {
        // Coordinate domain objects and keep validation near the workflow.
    }
}`
  });

  return snippets;
}

function fieldLines(entity: LldEntity) {
  const fields = entity.fields?.length ? entity.fields.slice(0, 4) : ["id"];
  return fields.map((field) => `private String ${sanitizeIdentifier(field)};`);
}

function methodLines(entity: LldEntity) {
  const methods = entity.methods?.length ? entity.methods.slice(0, 4) : ["validate()"];
  return methods.map((method) => `public void ${sanitizeMethod(method)} {\n        // ${entity.responsibility}\n    }`);
}

function sanitizeIdentifier(value: string) {
  const cleaned = value.replace(/\(.*\)/, "").replace(/[^A-Za-z0-9_]/g, "");
  return cleaned ? cleaned.charAt(0).toLowerCase() + cleaned.slice(1) : "value";
}

function sanitizeMethod(value: string) {
  const base = value.includes("(") ? value : `${value}()`;
  return base.replace(/[^A-Za-z0-9_(), ]/g, "");
}
