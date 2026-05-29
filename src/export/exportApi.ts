import type { LldScene } from "../engine/sceneTypes";
import type { LldVideoConfig } from "../topics/topicTypes";
import type { ExportStatus, StoredProject } from "./exportTypes";

export async function createExport(config: LldVideoConfig, scenes: LldScene[]) {
  const response = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config, scenes })
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as { exportId: string };
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
