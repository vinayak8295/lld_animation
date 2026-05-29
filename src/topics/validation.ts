import type { LldScene } from "../engine/sceneTypes";
import { supportedDemoTopics } from "./demoConfigs";
import type { LldVideoConfig } from "./topicTypes";

const supportedTopics = new Set<string>(supportedDemoTopics);
const supportedLanguages = new Set(["java", "cpp", "typescript", "python"]);

export function validateLldConfig(config: unknown, scenes?: LldScene[]): string[] {
  const errors: string[] = [];
  const typed = config as Partial<LldVideoConfig> | null;

  if (!typed || typeof typed !== "object") {
    return ["Config must be a JSON object."];
  }

  if (!typed.title || typeof typed.title !== "string") errors.push("title is required.");
  if (!typed.topic || !supportedTopics.has(typed.topic)) {
    errors.push(`topic must be supported. Supported demos: ${supportedDemoTopics.join(", ")}.`);
  }
  if (!typed.language || !supportedLanguages.has(typed.language)) errors.push("language must be java, cpp, typescript, or python.");
  if (!typed.settings || !["vertical", "desktop"].includes(typed.settings.orientation)) {
    errors.push("settings.orientation must be vertical or desktop.");
  }

  const entities = typed.problem?.entities ?? [];
  if (!Array.isArray(entities) || entities.length === 0) errors.push("problem.entities cannot be empty.");

  const entityIds = new Set<string>();
  const entityRefs = new Set<string>();
  for (const entity of entities) {
    if (!entity.id) errors.push("Each entity must have an id.");
    if (entity.id && entityIds.has(entity.id)) errors.push(`Duplicate entity id: ${entity.id}.`);
    if (entity.id) entityIds.add(entity.id);
    if (entity.id) entityRefs.add(normalize(entity.id));
    if (entity.name) entityRefs.add(normalize(entity.name));
  }

  for (const relationship of typed.problem?.relationships ?? []) {
    if (!entityRefs.has(normalize(relationship.from))) errors.push(`Relationship from "${relationship.from}" does not reference an entity.`);
    if (!entityRefs.has(normalize(relationship.to))) errors.push(`Relationship to "${relationship.to}" does not reference an entity.`);
  }

  for (const flow of typed.problem?.flows ?? []) {
    for (const [index, step] of flow.steps.entries()) {
      if (!step.actor || !step.target || !step.method || !step.explanation) {
        errors.push(`Flow "${flow.id}" step ${index + 1} must include actor, target, method, and explanation.`);
      }
    }
  }

  if (typed.settings?.showCode && !typed.problem?.codeFiles?.length && typed.language !== "java") {
    errors.push("showCode requires codeFiles unless using the Java Parking Lot defaults.");
  }

  if (typed.settings?.showRightTextPanel && scenes?.some((scene) => !scene.rightPanel)) {
    errors.push("Every scene must have rightPanel when showRightTextPanel is true.");
  }

  return errors;
}

function normalize(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}
