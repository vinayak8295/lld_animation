import type { LldEntity, LldRelationship } from "../topics/topicTypes";

export function mentionedEntityIds(text: string | undefined, entities: LldEntity[]) {
  if (!text) return [];
  const normalizedText = normalize(text);
  return entities
    .filter((entity) => normalizedText.includes(normalize(entity.name)) || normalizedText.includes(normalize(entity.id)))
    .map((entity) => entity.id);
}

export function mentionedRelationshipIndexes(text: string | undefined, relationships: LldRelationship[]) {
  if (!text) return [];
  const normalizedText = normalize(text);
  return relationships
    .map((relationship, index) => ({ relationship, index }))
    .filter(({ relationship }) => normalizedText.includes(normalize(relationship.from)) && normalizedText.includes(normalize(relationship.to)))
    .map(({ index }) => index);
}

export function mentionedToken(text: string | undefined, token: string) {
  const normalizedToken = normalize(token);
  return Boolean(text && normalizedToken.length > 1 && normalize(text).includes(normalizedToken));
}

function normalize(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}
