import { Download, FileJson, FileText, Monitor, Presentation, Smartphone, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createExport, createPpt, fetchExportStatus, fetchPptStatus } from "../export/exportApi";
import type { ExportStatus } from "../export/exportTypes";
import { applyVoiceoverScriptToScenes, generateElevenLabsCleanScript, generateVoiceoverScript } from "../export/voiceoverScript";
import { usePlayback } from "../engine/playbackEngine";
import type { LldScene } from "../engine/sceneTypes";
import { generateLldTimeline } from "../engine/timelineEngine";
import { JsonInputPanel } from "../components/JsonInputPanel";
import { PlaybackControls } from "../components/PlaybackControls";
import { SceneTimeline } from "../components/SceneTimeline";
import { VideoPreview } from "../components/VideoPreview";
import { VoiceoverEditor } from "../components/VoiceoverEditor";
import { interviewDemoConfigs, interviewDemoTopicOptions, parkingLotDemoConfig } from "../topics/demoConfigs";
import { normalizeLldConfig } from "../topics/normalizeConfig";
import type { LldVideoConfig } from "../topics/topicTypes";
import { validateLldConfig } from "../topics/validation";

export function StudioPage() {
  const initialConfig = normalizeLldConfig(parkingLotDemoConfig);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initialConfig, null, 2));
  const [config, setConfig] = useState<LldVideoConfig>(initialConfig);
  const [scenes, setScenes] = useState<LldScene[]>(() => generateLldTimeline(initialConfig));
  const [errors, setErrors] = useState<string[]>([]);
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);
  const [pptStatus, setPptStatus] = useState<ExportStatus | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPptExporting, setIsPptExporting] = useState(false);
  const [voiceoverScript, setVoiceoverScript] = useState(() => generateVoiceoverScript(generateLldTimeline(initialConfig)));
  const playback = usePlayback(scenes);
  const scene = scenes[playback.state.currentSceneIndex];
  const orientation = config.settings.orientation;

  const currentDetails = useMemo(() => {
    if (!scene) return "No scene selected.";
    return `${scene.title} - ${Math.round(scene.durationMs / 100) / 10}s - ${scene.type}`;
  }, [scene]);

  function parseCurrentJson() {
    try {
      const parsed = JSON.parse(jsonText) as LldVideoConfig;
      const normalized = normalizeLldConfig(parsed);
      const nextScenes = generateLldTimeline(normalized);
      const validationErrors = validateLldConfig(normalized, nextScenes);
      setErrors(validationErrors);
      if (validationErrors.length === 0) {
        setConfig(normalized);
        setScenes(nextScenes);
        setVoiceoverScript(generateVoiceoverScript(nextScenes));
        playback.restart();
      }
      return { parsed: normalized, nextScenes, validationErrors };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON.";
      setErrors([message]);
      return null;
    }
  }

  function loadDemo(nextDemo: LldVideoConfig = config) {
    const normalizedDemo = normalizeLldConfig(nextDemo);
    const demo = JSON.stringify(normalizedDemo, null, 2);
    setJsonText(demo);
    setConfig(normalizedDemo);
    const nextScenes = generateLldTimeline(normalizedDemo);
    setScenes(nextScenes);
    setVoiceoverScript(generateVoiceoverScript(nextScenes));
    setErrors([]);
    setExportStatus(null);
    setPptStatus(null);
  }

  function updateConfigPatch(patch: Partial<LldVideoConfig["settings"]>) {
    const nextConfig = { ...config, settings: { ...config.settings, ...patch } };
    setConfig(nextConfig);
    setJsonText(JSON.stringify(nextConfig, null, 2));
    const nextScenes = generateLldTimeline(nextConfig);
    setScenes(nextScenes);
    setVoiceoverScript(generateVoiceoverScript(nextScenes));
    setErrors(validateLldConfig(nextConfig, nextScenes));
  }

  function applyScript() {
    const updatedScenes = applyVoiceoverScriptToScenes(scenes, voiceoverScript);
    setScenes(updatedScenes);
    setVoiceoverScript(generateVoiceoverScript(updatedScenes));
  }

  function regenerateScript() {
    const regenerated = generateVoiceoverScript(scenes);
    setVoiceoverScript(regenerated);
  }

  async function exportMp4() {
    const parsed = parseCurrentJson();
    if (!parsed || parsed.validationErrors.length > 0) return;
    setIsExporting(true);
    setExportStatus({
      exportId: "pending",
      state: "queued",
      progress: 0,
      message: "Queued export..."
    });
    try {
      const scriptedScenes = applyVoiceoverScriptToScenes(parsed.nextScenes, voiceoverScript);
      const fullScript = generateVoiceoverScript(scriptedScenes);
      const cleanScript = generateElevenLabsCleanScript(fullScript);
      const { exportId } = await createExport(parsed.parsed, scriptedScenes, fullScript, cleanScript);
      const timer = window.setInterval(async () => {
        const status = await fetchExportStatus(exportId);
        setExportStatus(status);
        if (status.state === "complete" || status.state === "failed") {
          window.clearInterval(timer);
          setIsExporting(false);
        }
      }, 1500);
    } catch (error) {
      setIsExporting(false);
      setExportStatus({
        exportId: "failed",
        state: "failed",
        progress: 0,
        message: "Export failed.",
        error: error instanceof Error ? error.message : "Unknown export error."
      });
    }
  }

  async function exportPpt() {
    const parsed = parseCurrentJson();
    if (!parsed || parsed.validationErrors.length > 0) return;
    setIsPptExporting(true);
    setPptStatus({
      exportId: "pending",
      state: "queued",
      progress: 0,
      message: "Queued PPT export..."
    });
    try {
      const scriptedScenes = applyVoiceoverScriptToScenes(parsed.nextScenes, voiceoverScript);
      const { exportId } = await createPpt(parsed.parsed, scriptedScenes, generateVoiceoverScript(scriptedScenes));
      const timer = window.setInterval(async () => {
        const status = await fetchPptStatus(exportId);
        setPptStatus(status);
        if (status.state === "complete" || status.state === "failed") {
          window.clearInterval(timer);
          setIsPptExporting(false);
        }
      }, 1200);
    } catch (error) {
      setIsPptExporting(false);
      setPptStatus({
        exportId: "failed",
        state: "failed",
        progress: 0,
        message: "PPT export failed.",
        error: error instanceof Error ? error.message : "Unknown PPT export error."
      });
    }
  }

  useEffect(() => {
    setErrors(validateLldConfig(config, scenes));
  }, []);

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div>
          <h1>LLD Visualizer Video Studio</h1>
          <p>Generate animated low-level design videos from JSON.</p>
        </div>
        <div className="header-tagline">Paste an LLD config. Generate an animated OOP design explanation video.</div>
      </header>

      <div className="studio-grid">
        <aside className="left-rail">
          <JsonInputPanel value={jsonText} onChange={setJsonText} errors={errors} />

          <section className="panel controls-panel">
            <div className="button-grid">
              <button type="button" onClick={() => loadDemo(interviewDemoConfigs[config.topic] ?? parkingLotDemoConfig)}>
                <FileJson size={18} />
                <span>Load Demo</span>
              </button>
              <button type="button" onClick={parseCurrentJson}>
                <WandSparkles size={18} />
                <span>Generate Timeline</span>
              </button>
            </div>

            <label>
              Interview Topic
              <select
                value={config.topic}
                onChange={(event) => {
                  const selected = interviewDemoConfigs[event.target.value as keyof typeof interviewDemoConfigs];
                  if (selected) loadDemo(selected);
                }}
              >
                {interviewDemoTopicOptions.map((option) => (
                  <option key={option.topic} value={option.topic}>
                    {option.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Template
              <select
                value={config.template}
                onChange={(event) => {
                  const nextConfig = { ...config, template: event.target.value as LldVideoConfig["template"] };
                  setConfig(nextConfig);
                  setJsonText(JSON.stringify(nextConfig, null, 2));
                }}
              >
                <option value="matrix-lld">Matrix LLD</option>
                <option value="minimal-dark">Minimal Dark</option>
              </select>
            </label>

            <label>
              Language
              <select
                value={config.language}
                onChange={(event) => {
                  const nextConfig = { ...config, language: event.target.value as LldVideoConfig["language"] };
                  setConfig(nextConfig);
                  setJsonText(JSON.stringify(nextConfig, null, 2));
                }}
              >
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            </label>

            <div className="segmented-control" aria-label="Orientation selector">
              <button
                type="button"
                className={orientation === "vertical" ? "active" : ""}
                onClick={() => updateConfigPatch({ orientation: "vertical" })}
              >
                <Smartphone size={17} />
                <span>Vertical</span>
              </button>
              <button
                type="button"
                className={orientation === "desktop" ? "active" : ""}
                onClick={() => updateConfigPatch({ orientation: "desktop" })}
              >
                <Monitor size={17} />
                <span>Desktop</span>
              </button>
            </div>

            <button type="button" className="export-button" onClick={exportMp4} disabled={isExporting || errors.length > 0}>
              <Download size={18} />
              <span>Export MP4</span>
            </button>

            <button type="button" onClick={exportPpt} disabled={isPptExporting || errors.length > 0}>
              <Presentation size={18} />
              <span>Export PPT</span>
            </button>

            {exportStatus && (
              <div className={`export-status ${exportStatus.state}`}>
                <strong>{exportStatus.message}</strong>
                <progress value={exportStatus.progress} max={100} />
                {exportStatus.downloadUrl && <a href={exportStatus.downloadUrl}>Download output.mp4</a>}
                {exportStatus.state === "complete" && (
                  <>
                    <a href={`/api/export/${exportStatus.exportId}/script`}>
                      <FileText size={14} /> Full voiceover script
                    </a>
                    <a href={`/api/export/${exportStatus.exportId}/elevenlabs-script`}>
                      <FileText size={14} /> ElevenLabs-clean script
                    </a>
                  </>
                )}
                {exportStatus.error && <p>{exportStatus.error}</p>}
              </div>
            )}

            {pptStatus && (
              <div className={`export-status ${pptStatus.state}`}>
                <strong>{pptStatus.message}</strong>
                <progress value={pptStatus.progress} max={100} />
                {pptStatus.downloadUrl && <a href={pptStatus.downloadUrl}>Download deck.pptx</a>}
                {pptStatus.error && <p>{pptStatus.error}</p>}
              </div>
            )}
          </section>

          <VoiceoverEditor
            value={voiceoverScript}
            onChange={setVoiceoverScript}
            onApply={applyScript}
            onRegenerate={regenerateScript}
          />
        </aside>

        <section className="right-workspace">
          <section className="panel preview-panel">
            <div className="panel-title-row">
              <h2>Video Preview</h2>
              <span>{currentDetails}</span>
            </div>
            <VideoPreview scene={scene} orientation={orientation} progress={playback.state.progress} />
            <PlaybackControls
              isPlaying={playback.state.isPlaying}
              onPlay={playback.play}
              onPause={playback.pause}
              onRestart={playback.restart}
            />
          </section>
          <SceneTimeline scenes={scenes} currentSceneIndex={playback.state.currentSceneIndex} onSelectScene={playback.jumpToScene} />
        </section>
      </div>
    </main>
  );
}
