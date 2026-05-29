import { getLldDepthProfile } from "./lldDepthProfiles";
import type {
  LldInterfaceDesign,
  LldPublicMethod,
  LldStateTransition,
  LldTestCase,
  LldVideoConfig
} from "./topicTypes";

export function normalizeLldConfig(config: LldVideoConfig): LldVideoConfig {
  const profile = getLldDepthProfile(config.topic);
  const interfaces = config.problem.interfaces?.length ? config.problem.interfaces : deriveInterfaces(config);
  const publicMethods = config.problem.publicMethods?.length ? config.problem.publicMethods : derivePublicMethods(config);
  const stateTransitions = config.problem.stateTransitions?.length ? config.problem.stateTransitions : deriveStateTransitions(profile);
  const testCases = config.problem.testCases?.length ? config.problem.testCases : deriveTestCases(profile);

  return {
    ...config,
    difficulty: config.difficulty ?? "medium",
    problem: {
      ...config.problem,
      constraints: config.problem.constraints?.length ? config.problem.constraints : [
        "Keep the core workflow deterministic and testable.",
        "Keep state changes explicit and easy to validate.",
        "Design should support new rules without rewriting existing classes."
      ],
      interfaces,
      publicMethods,
      dataStructures: config.problem.dataStructures?.length ? config.problem.dataStructures : profile.dataStructures,
      stateTransitions,
      edgeCases: config.problem.edgeCases?.length ? config.problem.edgeCases : profile.validationRules,
      errorHandling: config.problem.errorHandling?.length ? config.problem.errorHandling : profile.errorHandling,
      concurrencyConcerns: config.problem.concurrencyConcerns?.length ? config.problem.concurrencyConcerns : profile.concurrencyConcerns,
      testCases,
      tradeoffs: config.problem.tradeoffs?.length ? config.problem.tradeoffs : profile.tradeoffs,
      pitfalls: config.problem.pitfalls?.length ? config.problem.pitfalls : config.problem.mistakesToAvoid?.length ? config.problem.mistakesToAvoid : profile.interviewPitfalls,
      mistakesToAvoid: config.problem.mistakesToAvoid?.length ? config.problem.mistakesToAvoid : profile.interviewPitfalls
    }
  };
}

function deriveInterfaces(config: LldVideoConfig): LldInterfaceDesign[] {
  const interfaceEntities = config.problem.entities.filter((entity) => entity.type === "interface" || entity.type === "strategy");
  if (interfaceEntities.length) {
    return interfaceEntities.map((entity) => ({
      name: entity.name,
      responsibility: entity.responsibility,
      methods: entity.methods?.length ? entity.methods : ["execute()"],
      implementedBy: config.problem.entities
        .filter((candidate) => candidate.implements?.includes(entity.name))
        .map((candidate) => candidate.name)
    }));
  }

  const variableEntity = config.problem.entities.find((entity) => ["strategy", "service", "factory"].includes(entity.type)) ?? config.problem.entities[0];
  return [{
    name: `${variableEntity?.name ?? "Domain"}Contract`,
    responsibility: `Defines the stable behavior needed by ${config.title}.`,
    methods: variableEntity?.methods?.slice(0, 3) ?? ["execute()"],
    implementedBy: variableEntity ? [variableEntity.name] : []
  }];
}

function derivePublicMethods(config: LldVideoConfig): LldPublicMethod[] {
  const methods = config.problem.entities.flatMap((entity) =>
    (entity.methods ?? []).slice(0, 3).map((method) => ({
      owner: entity.name,
      signature: method,
      purpose: entity.responsibility,
      inputs: method.includes("(") ? [method.slice(method.indexOf("(") + 1, method.indexOf(")")).trim()].filter(Boolean) : [],
      output: method.startsWith("get") || method.startsWith("find") ? "Domain value or null result" : "State change or command result",
      errors: ["Invalid state", "Unsupported input"]
    }))
  );

  return methods.length ? methods.slice(0, 8) : [{
    owner: config.problem.entities[0]?.name ?? "Service",
    signature: "execute(request)",
    purpose: "Runs the main interview use case.",
    inputs: ["request"],
    output: "Domain result",
    errors: ["Validation failed"]
  }];
}

function deriveStateTransitions(profile: ReturnType<typeof getLldDepthProfile>): LldStateTransition[] {
  return profile.stateTransitions.slice(0, 5).map((transition) => {
    const match = transition.match(/(.+?)\s*->\s*(.+?)(?:\s+when\s+|\s+after\s+|\s+on\s+|$)(.*)/i);
    return {
      from: match?.[1]?.trim() || "Start",
      event: match?.[3]?.trim() || "domain event",
      to: match?.[2]?.trim() || "Next",
      explanation: transition
    };
  });
}

function deriveTestCases(profile: ReturnType<typeof getLldDepthProfile>): LldTestCase[] {
  return profile.testCases.slice(0, 5).map((testCase) => ({
    title: testCase,
    scenario: testCase,
    expected: "Expected state and output are produced without unintended side effects."
  }));
}
