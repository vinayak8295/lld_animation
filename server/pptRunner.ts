import { mkdir } from "node:fs/promises";
import path from "node:path";
import pptxgenModule from "pptxgenjs";
import type { ExportRequest, ExportStatus } from "../src/export/exportTypes";
import { generateVoiceoverScript } from "../src/export/voiceoverScript";
import type { LldScene } from "../src/engine/sceneTypes";
import { saveProject } from "./projectStore";

type StatusUpdater = (status: Partial<ExportStatus>) => void;

const root = process.cwd();
const PptxGenJS = (pptxgenModule as unknown as { default: typeof pptxgenModule }).default;

export async function runPptExport(exportId: string, request: ExportRequest, updateStatus: StatusUpdater) {
  const exportDir = path.join(root, "exports", exportId);
  await mkdir(exportDir, { recursive: true });

  try {
    updateStatus({ state: "rendering", progress: 10, message: "Creating PPT deck..." });
    await saveProject(exportId, request);
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "LLD Visualizer Video Studio";
    pptx.subject = request.config.title;
    pptx.title = `${request.config.title} | LLD Deck`;
    pptx.company = "LLD Visualizer Video Studio";
    pptx.theme = {
      headFontFace: "Aptos Display",
      bodyFontFace: "Aptos"
    };

    request.scenes.forEach((scene, index) => {
      addSceneSlide(pptx, scene, index + 1, request.scenes.length);
      if (index % 4 === 0) {
        updateStatus({
          progress: Math.min(80, 10 + Math.round((index / request.scenes.length) * 70)),
          message: `Added ${index + 1} of ${request.scenes.length} slides...`
        });
      }
    });

    const notesSlide = pptx.addSlide();
    notesSlide.background = { color: "050705" };
    notesSlide.addText("Voiceover Script", { x: 0.55, y: 0.35, w: 12.2, h: 0.4, color: "00FF66", fontSize: 22, bold: true });
    notesSlide.addText((request.voiceoverScript || generateVoiceoverScript(request.scenes)).slice(0, 2200), {
      x: 0.55,
      y: 0.9,
      w: 12.2,
      h: 6,
      color: "EAFFF1",
      fontSize: 9,
      breakLine: false,
      fit: "shrink"
    });

    const outputPath = path.join(exportDir, "deck.pptx");
    await pptx.writeFile({ fileName: outputPath });

    updateStatus({
      state: "complete",
      progress: 100,
      message: "PPT export complete.",
      downloadUrl: `/api/ppt/${exportId}/download`
    });
  } catch (error) {
    updateStatus({
      state: "failed",
      progress: 100,
      message: "PPT export failed.",
      error: error instanceof Error ? error.message : "Unknown PPT export error."
    });
  }
}

function addSceneSlide(pptx: InstanceType<typeof PptxGenJS>, scene: LldScene, sceneNumber: number, totalScenes: number) {
  const slide = pptx.addSlide();
  slide.background = { color: "050705" };
  slide.addText(`Scene ${sceneNumber}/${totalScenes}`, { x: 0.45, y: 0.25, w: 1.7, h: 0.25, color: "8FBF9F", fontSize: 8, bold: true });
  slide.addText(scene.title, { x: 0.45, y: 0.55, w: 12.4, h: 0.5, color: "EAFFF1", fontSize: 24, bold: true, fit: "shrink" });
  slide.addShape(pptx.ShapeType.line, { x: 0.45, y: 1.15, w: 12.4, h: 0, line: { color: "1F3D2B", width: 1 } });
  slide.addText(scene.rightPanel.heading, { x: 0.55, y: 1.4, w: 4.0, h: 0.35, color: "00FF66", fontSize: 16, bold: true, fit: "shrink" });
  slide.addText(scene.rightPanel.body || bulletsText(scene), {
    x: 0.55,
    y: 1.88,
    w: 4.0,
    h: 1.1,
    color: "8FBF9F",
    fontSize: 11,
    fit: "shrink"
  });
  slide.addText(bulletsText(scene), {
    x: 0.55,
    y: 3.05,
    w: 4.0,
    h: 2.45,
    color: "EAFFF1",
    fontSize: 11,
    bullet: { type: "bullet" },
    fit: "shrink"
  });
  slide.addText(visualSummary(scene), {
    x: 4.9,
    y: 1.42,
    w: 7.75,
    h: 4.9,
    color: "EAFFF1",
    fontSize: 14,
    fit: "shrink",
    valign: "middle",
    margin: 0.16,
    breakLine: false
  });
  slide.addText(scene.rightPanel.interviewNote || "", {
    x: 0.55,
    y: 6.2,
    w: 12.1,
    h: 0.35,
    color: "FFD166",
    fontSize: 10,
    italic: true,
    fit: "shrink"
  });
  (slide as unknown as { addNotes?: (notes: string[]) => void }).addNotes?.([scene.narration || scene.rightPanel.heading]);
}

function bulletsText(scene: LldScene) {
  return scene.rightPanel.bullets?.slice(0, 5).join("\n") || scene.rightPanel.body || scene.narration || "";
}

function visualSummary(scene: LldScene) {
  switch (scene.type) {
    case "entities":
    case "summary":
      return scene.entities.map((entity) => `${entity.name}: ${entity.responsibility}`).join("\n");
    case "classDiagram":
    case "relationship":
      return scene.relationships.map((rel) => `${rel.from} -> ${rel.to} (${rel.type})`).join("\n");
    case "sequence":
    case "objectFlow":
      return scene.flow.steps.map((step, index) => `${index + 1}. ${step.actor} -> ${step.target}: ${step.method}`).join("\n");
    case "interfaceDesign":
      return scene.interfaces.map((item) => `${item.name}\n${item.methods.join(", ")}`).join("\n\n");
    case "methodContracts":
      return scene.methods.map((method) => `${method.owner}.${method.signature}: ${method.purpose}`).join("\n");
    case "stateMachine":
      return scene.transitions.map((transition) => `${transition.from} -> ${transition.to}: ${transition.event}`).join("\n");
    case "testCases":
      return scene.testCases.map((test) => `${test.title}: ${test.expected}`).join("\n");
    case "code":
      return scene.code.slice(0, 1400);
    case "pattern":
      return `${scene.pattern.name}\nUsed in ${scene.pattern.usedIn}\n${scene.pattern.reason}`;
    case "dryRun":
      return scene.dryRun.steps.join("\n");
    case "dataStructures":
    case "edgeCases":
    case "errorHandling":
    case "concurrency":
    case "tradeOffs":
    case "pitfalls":
      return scene.items.join("\n");
    case "title":
      return `${scene.titleText}\n${scene.subtitle ?? ""}`;
    case "text":
      return scene.cards.join("\n");
    case "end":
      return scene.text;
  }
}
