import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getTotalDuration } from "../src/engine/playbackEngine";
import type { ExportRequest, StoredProject } from "../src/export/exportTypes";

const root = process.cwd();
const projectsDir = path.join(root, "projects");

export async function ensureProjectDirs() {
  await mkdir(projectsDir, { recursive: true });
  await mkdir(path.join(root, "exports"), { recursive: true });
}

export async function saveProject(exportId: string, request: ExportRequest) {
  await ensureProjectDirs();
  const project: StoredProject = {
    exportId,
    createdAt: new Date().toISOString(),
    ...request,
    scriptMetadata: {
      sceneCount: request.scenes.length,
      totalDurationMs: getTotalDuration(request.scenes),
      hasEditedNarration: request.scenes.some((scene) => Boolean(scene.narration))
    }
  };
  await writeFile(path.join(projectsDir, `${exportId}.json`), JSON.stringify(project, null, 2), "utf8");
  return project;
}

export async function loadProject(exportId: string) {
  const content = await readFile(path.join(projectsDir, `${exportId}.json`), "utf8");
  return JSON.parse(content) as StoredProject;
}
