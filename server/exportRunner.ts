import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { getTotalDuration } from "../src/engine/playbackEngine";
import type { ExportStatus } from "../src/export/exportTypes";
import { generateElevenLabsCleanScript, generateVoiceoverScript } from "../src/export/voiceoverScript";
import type { LldVideoConfig } from "../src/topics/topicTypes";
import { renderFramesToMp4 } from "./ffmpeg";
import { loadProject } from "./projectStore";

type StatusUpdater = (status: Partial<ExportStatus>) => void;

const root = process.cwd();
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

export async function runExport(exportId: string, updateStatus: StatusUpdater) {
  const exportDir = path.join(root, "exports", exportId);
  const framesDir = path.join(exportDir, "frames");
  await mkdir(framesDir, { recursive: true });

  try {
    const project = await loadProject(exportId);
    updateStatus({ state: "rendering", progress: 5, message: "Opening export page..." });

    const viewport = project.config.settings.orientation === "vertical"
      ? { width: 1080, height: 1920 }
      : { width: 1920, height: 1080 };
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport });
    await page.goto(`${frontendOrigin}/export/${exportId}`, { waitUntil: "networkidle" });

    const totalDurationMs = getTotalDuration(project.scenes) + 500;
    const totalFrames = Math.ceil((totalDurationMs / 1000) * 30);
    for (let frame = 0; frame < totalFrames; frame += 1) {
      const framePath = path.join(framesDir, `frame-${String(frame + 1).padStart(6, "0")}.png`);
      await page.screenshot({ path: framePath });
      await page.waitForTimeout(1000 / 30);
      if (frame % 12 === 0) {
        updateStatus({
          progress: Math.min(80, 10 + Math.round((frame / totalFrames) * 70)),
          message: `Captured ${frame + 1} of ${totalFrames} frames...`
        });
      }
    }

    await page.waitForFunction(() => (window as Window & { __LLD_EXPORT_DONE__?: boolean }).__LLD_EXPORT_DONE__ === true, {
      timeout: 5000
    }).catch(() => undefined);
    await browser.close();

    updateStatus({ progress: 84, message: "Rendering MP4 with FFmpeg..." });
    await renderFramesToMp4(path.join(framesDir, "frame-%06d.png"), path.join(exportDir, "output.mp4"));
    await writeExportTextFiles(exportId, project.config, project.scenes, exportDir, project.voiceoverScript, project.cleanVoiceoverScript);
    await rm(framesDir, { recursive: true, force: true });

    updateStatus({
      state: "complete",
      progress: 100,
      message: "Export complete.",
      downloadUrl: `/api/export/${exportId}/download`
    });
  } catch (error) {
    updateStatus({
      state: "failed",
      progress: 100,
      message: "Export failed.",
      error: error instanceof Error ? error.message : "Unknown export error."
    });
  }
}

export async function writeExportTextFiles(
  exportId: string,
  config: LldVideoConfig,
  scenes: Awaited<ReturnType<typeof loadProject>>["scenes"],
  exportDir: string,
  voiceoverScript?: string,
  cleanVoiceoverScript?: string
) {
  const title = `${config.title} | LLD Explained Visually`;
  const topicLabel = config.title.replace(/^Design\s+/i, "");
  const description = `Learn how to design ${topicLabel} using low-level design and object-oriented principles.

Covered:
- Functional requirements
- Core entities
- Class diagram
- Relationships
- Design patterns
- Object collaboration flow
- Sequence flow
- State transitions
- Edge cases
- Unit tests
- Java code structure
- Dry run example
- Interview notes

#LLD #LowLevelDesign #${topicLabel.replace(/[^A-Za-z0-9]/g, "")} #Java #OOP #CodingInterview #SystemDesign
`;
  const tags = `LLD, Low Level Design, ${topicLabel}, Java, OOP, Object Oriented Design, Coding Interview, Machine Coding, System Design`;
  const fullScript = voiceoverScript || generateVoiceoverScript(scenes);
  const cleanScript = cleanVoiceoverScript || generateElevenLabsCleanScript(fullScript);
  await writeFile(path.join(exportDir, "title.txt"), title, "utf8");
  await writeFile(path.join(exportDir, "description.txt"), description, "utf8");
  await writeFile(path.join(exportDir, "tags.txt"), tags, "utf8");
  await writeFile(path.join(exportDir, "voiceover-script.txt"), fullScript, "utf8");
  await writeFile(path.join(exportDir, "elevenlabs-script.txt"), cleanScript, "utf8");
  await writeFile(
    path.join(exportDir, "metadata.json"),
    JSON.stringify({
      exportId,
      title,
      description,
      tags,
      topic: config.topic,
      sceneCount: scenes.length,
      totalDurationMs: getTotalDuration(scenes),
      hasVoiceoverScript: true,
      createdAt: new Date().toISOString()
    }, null, 2),
    "utf8"
  );
}
