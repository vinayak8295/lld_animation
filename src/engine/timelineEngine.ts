import type { LldScene } from "./sceneTypes";
import { speedMultiplier } from "./timing";
import type { LldCodeFile, LldEntity, LldVideoConfig } from "../topics/topicTypes";

export function generateLldTimeline(config: LldVideoConfig): LldScene[] {
  return generateInterviewTopicTimeline(config);
}

export function generateParkingLotTimeline(config: LldVideoConfig): LldScene[] {
  return generateInterviewTopicTimeline(config);
}

export function generateInterviewTopicTimeline(config: LldVideoConfig): LldScene[] {
  const entities = config.problem.entities;
  const relationships = config.problem.relationships;
  const flows = config.problem.flows;
  const patterns = config.problem.patterns || [];
  const codeFiles = config.problem.codeFiles?.length ? config.problem.codeFiles : generateJavaCodeSnippets(config.title, entities);
  const dryRun = config.problem.dryRuns?.[0];
  const factor = speedMultiplier(config.settings.speed);
  const duration = (ms: number) => Math.round(ms * factor);
  const mainCoordinator = entities.find((entity) => ["singleton", "service"].includes(entity.type)) ?? entities[0];
  const firstFlow = flows[0];
  const secondFlow = flows[1];

  const scenes: LldScene[] = [
    {
      id: "title",
      type: "title",
      title: "Title",
      durationMs: duration(2500),
      titleText: config.title,
      subtitle: "Low Level Design Explained Visually",
      rightPanel: {
        heading: "Goal",
        body: `Design clean classes, responsibilities, relationships, and object interactions for ${config.title}.`
      },
      narration: `Let us design ${config.title} using low-level design principles.`
    },
    {
      id: "problem-statement",
      type: "text",
      title: "Problem Statement",
      durationMs: duration(4200),
      cards: buildProblemStatementCards(config),
      rightPanel: {
        heading: "Problem Statement",
        bullets: buildProblemStatementCards(config),
        interviewNote: "State the scope clearly before drawing classes."
      }
    },
    {
      id: "requirements",
      type: "text",
      title: "Functional Requirements",
      durationMs: duration(5000),
      cards: config.problem.requirements,
      rightPanel: {
        heading: "Functional Requirements",
        bullets: config.problem.requirements.slice(0, 5),
        interviewNote: "Always clarify requirements before jumping into classes."
      },
      narration: "Start by listing the behavior the system must support."
    },
    {
      id: "main-entities",
      type: "entities",
      title: "Main Entities",
      durationMs: duration(5500),
      entities,
      highlightedEntityIds: entities.slice(0, 5).map((entity) => entity.id),
      rightPanel: {
        heading: "Identify Core Entities",
        bullets: entities.slice(0, 6).map((entity) => `${entity.name}: ${entity.responsibility}`),
        interviewNote: "Good LLD starts by separating responsibilities across entities."
      },
      narration: "Now identify the main classes in the system."
    },
    {
      id: "entity-responsibility",
      type: "entities",
      title: "Responsibility Breakdown",
      durationMs: duration(6200),
      entities,
      highlightedEntityIds: entities.slice(2).map((entity) => entity.id),
      rightPanel: {
        heading: "Class Responsibilities",
        bullets: entities.slice(2, 7).map((entity) => `${entity.name} owns ${entity.responsibility.toLowerCase()}.`),
        interviewNote: "A class should have one clear reason to change."
      }
    },
    {
      id: "class-diagram",
      type: "classDiagram",
      title: "Class Diagram",
      durationMs: duration(6500),
      entities,
      relationships,
      highlightedEntityIds: [],
      highlightedRelationshipIndexes: [],
      rightPanel: {
        heading: "Class Diagram",
        bullets: [
          `${mainCoordinator.name} coordinates the main workflow.`,
          `${entities[0]?.name ?? "Core entity"} anchors the model.`,
          "Relationships show ownership, inheritance, and runtime dependencies.",
          "Patterns are isolated to the classes that need flexibility."
        ],
        interviewNote: "Keep the diagram readable; explain details in the side panel."
      }
    }
  ];

  relationships.forEach((relationship, index) => {
    scenes.push({
      id: `relationship-${index + 1}`,
      type: "relationship",
      title: "Relationships",
      durationMs: duration(2800),
      entities,
      relationships,
      activeRelationshipIndex: index,
      rightPanel: {
        heading: `${relationship.from} to ${relationship.to}`,
        bullets: [
          `${relationship.type.replace("-", " ")} relationship`,
          relationship.label || "This connection explains ownership, reuse, or inheritance.",
          "Highlight one relationship at a time to avoid visual noise."
        ],
        interviewNote: "Relationships show how objects collaborate at runtime."
      }
    });
  });

  patterns.forEach((pattern, index) => {
    scenes.push({
      id: `pattern-${index + 1}`,
      type: "pattern",
      title: "Design Pattern",
      durationMs: duration(4200),
      pattern,
      entities,
      highlightedEntityIds: entities.filter((entity) => pattern.usedIn.includes(entity.name)).map((entity) => entity.id),
      rightPanel: {
        heading: pattern.name,
        bullets: [`Used in ${pattern.usedIn}`, pattern.reason],
        interviewNote: "Name a pattern only when it solves a concrete design pressure."
      }
    });
  });

  if (config.settings.showSequenceDiagram) {
    for (const [index, flow] of flows.slice(0, 2).entries()) {
      scenes.push({
        id: `${flow.id || `flow-${index + 1}`}-sequence`,
        type: "sequence",
        title: flow.title,
        durationMs: duration(index === 0 ? 6200 : 5200),
        flow,
        activeStepIndex: 0,
        rightPanel: {
          heading: flow.title,
          bullets: flow.steps.slice(0, 5).map((step) => step.explanation),
          interviewNote: "Sequence flow proves that your classes are usable, not just drawn."
        }
      });
    }
  }

  scenes.push({
    id: "code-structure",
    type: "text",
    title: "Code Structure",
    durationMs: duration(4200),
    cards: codeFiles.map((file) => file.filename),
    rightPanel: {
      heading: "Code Structure",
      bullets: codeFiles.map((file) => file.filename),
      interviewNote: "Split code around responsibilities instead of one large manager class."
    }
  });

  if (config.settings.showCode) {
    for (const file of codeFiles.slice(0, 4)) {
      scenes.push({
        id: `code-${file.filename.replace(/\W+/g, "-").toLowerCase()}`,
        type: "code",
        title: `Code Typing: ${file.filename}`,
        durationMs: duration(7000),
        filename: file.filename,
        language: file.language,
        code: file.code,
        charsPerSecond: 42,
        rightPanel: {
          heading: file.filename,
          bullets: [
            "Show only the core fields and methods.",
            "Keep constructor and behavior close to the entity.",
            "Avoid mixing unrelated responsibilities."
          ],
          interviewNote: "Readable code snippets are better than a full production implementation."
        }
      });
    }
  }

  if (dryRun) {
    scenes.push({
      id: "dry-run",
      type: "dryRun",
      title: "Example Dry Run",
      durationMs: duration(6200),
      dryRun,
      activeStepIndex: 0,
      rightPanel: {
        heading: dryRun.title,
        bullets: dryRun.steps.slice(0, 5),
        interviewNote: "Dry runs catch missing state transitions like freeing a spot."
      }
    });
  }

  scenes.push(
    {
      id: "summary",
      type: "summary",
      title: "Final LLD Summary",
      durationMs: duration(5200),
      entities,
      summaryBullets: [
        "Clear entities with focused responsibilities.",
        "Class diagram explains structure.",
        "Sequence diagrams explain runtime collaboration.",
        "Patterns are applied only where they add flexibility."
      ],
      rightPanel: {
        heading: "Final Summary",
        bullets: [
          `${mainCoordinator.name} coordinates the core use cases.`,
          `${entities.slice(0, 3).map((entity) => entity.name).join(", ")} carry the main state.`,
          firstFlow ? `${firstFlow.title} explains the happy path.` : "The happy path should be shown with a sequence flow.",
          secondFlow ? `${secondFlow.title} covers an important alternate flow.` : "Call out tradeoffs after the basic design."
        ],
        interviewNote: "End with tradeoffs and how the design can scale."
      }
    },
    {
      id: "end",
      type: "end",
      title: "End Screen",
      durationMs: duration(2600),
      text: "LLD Visualizer Video Studio",
      rightPanel: {
        heading: "Next Steps",
        bullets: (config.problem.tradeoffs?.length ? config.problem.tradeoffs : [
          "Add persistence for important state.",
          "Add concurrency controls around shared resources.",
          "Add observability and failure handling."
        ]).slice(0, 3),
        interviewNote: "Discuss extensions after presenting the core design."
      }
    }
  );

  return scenes;
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
