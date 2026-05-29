import type { LldScene } from "../engine/sceneTypes";

const markerPattern = /^##\s+Scene\s+(\d+):\s+(.+?)\s+\(([\d.]+)s\)\s*$/gm;

export function generateVoiceoverScript(scenes: LldScene[]) {
  return scenes
    .map((scene, index) => {
      const durationSeconds = Math.round(scene.durationMs / 100) / 10;
      return [
        `## Scene ${index + 1}: ${scene.title} (${durationSeconds}s)`,
        scene.narration || narrationFromPanel(scene),
        ""
      ].join("\n");
    })
    .join("\n");
}

export function generateElevenLabsCleanScript(scenesOrScript: LldScene[] | string) {
  const script = typeof scenesOrScript === "string" ? scenesOrScript : generateVoiceoverScript(scenesOrScript);
  return script
    .split("\n")
    .filter((line) => !line.trim().match(/^##\s+Scene\s+\d+:/))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function applyVoiceoverScriptToScenes(scenes: LldScene[], script: string) {
  const matches = Array.from(script.matchAll(markerPattern));
  if (!matches.length) {
    return scenes.map((scene) => ({ ...scene, narration: script.trim() || scene.narration }));
  }

  return scenes.map((scene, index) => {
    const current = matches[index];
    const next = matches[index + 1];
    if (!current?.index && current?.index !== 0) return scene;
    const start = current.index + current[0].length;
    const end = next?.index ?? script.length;
    const narration = script.slice(start, end).trim();
    return {
      ...scene,
      narration: narration || scene.narration
    };
  });
}

function narrationFromPanel(scene: LldScene) {
  return [
    scene.rightPanel.heading,
    scene.rightPanel.body,
    scene.rightPanel.bullets?.join(" "),
    scene.rightPanel.interviewNote
  ]
    .filter(Boolean)
    .join(" ");
}
