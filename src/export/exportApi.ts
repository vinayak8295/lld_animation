import type { LldScene } from "../engine/sceneTypes";
import type { LldVideoConfig } from "../topics/topicTypes";
import type { ExportStatus, StoredProject } from "./exportTypes";

export async function createExport(config: LldVideoConfig, scenes: LldScene[], voiceoverScript?: string, cleanVoiceoverScript?: string) {
  const response = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config, scenes, voiceoverScript, cleanVoiceoverScript })
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as { exportId: string };
}

export async function createPpt(config: LldVideoConfig, scenes: LldScene[], voiceoverScript?: string) {
  const response = await fetch("/api/ppt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config, scenes, voiceoverScript })
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as { exportId: string };
}

export async function fetchPptStatus(exportId: string) {
  const response = await fetch(`/api/ppt/${exportId}/status`);
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as ExportStatus;
}

export async function fetchExportStatus(exportId: string) {
  const response = await fetch(`/api/export/${exportId}/status`);
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as ExportStatus;
}

export async function fetchProject(exportId: string) {
  const response = await fetch(`/api/projects/${exportId}`);
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as StoredProject;
}
