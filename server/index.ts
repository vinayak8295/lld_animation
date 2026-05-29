import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import type { ExportRequest, ExportStatus } from "../src/export/exportTypes";
import { runExport } from "./exportRunner";
import { runPptExport } from "./pptRunner";
import { ensureProjectDirs, loadProject, saveProject } from "./projectStore";

const app = express();
const port = Number(process.env.PORT || 3001);
const statuses = new Map<string, ExportStatus>();
const pptStatuses = new Map<string, ExportStatus>();

app.use(express.json({ limit: "5mb" }));
app.use((_, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

app.options("*", (_, response) => response.sendStatus(204));

app.post("/api/export", async (request, response) => {
  const exportRequest = request.body as ExportRequest;
  if (!exportRequest?.config || !exportRequest?.scenes?.length) {
    response.status(400).send("config and scenes are required.");
    return;
  }

  const exportId = crypto.randomUUID();
  await saveProject(exportId, exportRequest);
  statuses.set(exportId, {
    exportId,
    state: "queued",
    progress: 0,
    message: "Queued export..."
  });

  void runExport(exportId, (patch) => {
    const previous = statuses.get(exportId);
    statuses.set(exportId, {
      exportId,
      state: previous?.state ?? "queued",
      progress: previous?.progress ?? 0,
      message: previous?.message ?? "Queued export...",
      ...patch
    });
  });

  response.json({ exportId });
});

app.get("/api/export/:exportId/status", (request, response) => {
  const status = statuses.get(request.params.exportId);
  if (!status) {
    response.status(404).send("Unknown export id.");
    return;
  }
  response.json(status);
});

app.get("/api/export/:exportId/download", (request, response) => {
  const outputPath = path.join(process.cwd(), "exports", request.params.exportId, "output.mp4");
  response.download(outputPath);
});

app.get("/api/export/:exportId/script", (request, response) => {
  const outputPath = path.join(process.cwd(), "exports", request.params.exportId, "voiceover-script.txt");
  response.download(outputPath);
});

app.get("/api/export/:exportId/elevenlabs-script", (request, response) => {
  const outputPath = path.join(process.cwd(), "exports", request.params.exportId, "elevenlabs-script.txt");
  response.download(outputPath);
});

app.post("/api/ppt", async (request, response) => {
  const exportRequest = request.body as ExportRequest;
  if (!exportRequest?.config || !exportRequest?.scenes?.length) {
    response.status(400).send("config and scenes are required.");
    return;
  }

  const exportId = crypto.randomUUID();
  pptStatuses.set(exportId, {
    exportId,
    state: "queued",
    progress: 0,
    message: "Queued PPT export..."
  });

  void runPptExport(exportId, exportRequest, (patch) => {
    const previous = pptStatuses.get(exportId);
    pptStatuses.set(exportId, {
      exportId,
      state: previous?.state ?? "queued",
      progress: previous?.progress ?? 0,
      message: previous?.message ?? "Queued PPT export...",
      ...patch
    });
  });

  response.json({ exportId });
});

app.get("/api/ppt/:exportId/status", (request, response) => {
  const status = pptStatuses.get(request.params.exportId);
  if (!status) {
    response.status(404).send("Unknown PPT export id.");
    return;
  }
  response.json(status);
});

app.get("/api/ppt/:exportId/download", (request, response) => {
  const outputPath = path.join(process.cwd(), "exports", request.params.exportId, "deck.pptx");
  response.download(outputPath);
});

app.get("/api/projects/:exportId", async (request, response) => {
  try {
    response.json(await loadProject(request.params.exportId));
  } catch {
    response.status(404).send("Project not found.");
  }
});

await ensureProjectDirs();
app.listen(port, () => {
  console.log(`LLD Visualizer API listening on http://localhost:${port}`);
});
