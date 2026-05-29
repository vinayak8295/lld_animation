import { Download, FileJson, Monitor, Smartphone, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createExport, fetchExportStatus } from "../export/exportApi";
import type { ExportStatus } from "../export/exportTypes";
import { usePlayback } from "../engine/playbackEngine";
import type { LldScene } from "../engine/sceneTypes";
import { generateLldTimeline } from "../engine/timelineEngine";
import { JsonInputPanel } from "../components/JsonInputPanel";
import { PlaybackControls } from "../components/PlaybackControls";
import { SceneTimeline } from "../components/SceneTimeline";
import { VideoPreview } from "../components/VideoPreview";
import { interviewDemoConfigs, interviewDemoTopicOptions, parkingLotDemoConfig } from "../topics/demoConfigs";
import type { LldVideoConfig } from "../topics/topicTypes";
import { validateLldConfig } from "../topics/validation";

export function StudioPage() {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(parkingLotDemoConfig, null, 2));
  const [config, setConfig] = useState<LldVideoConfig>(parkingLotDemoConfig);
  const [scenes, setScenes] = useState<LldScene[]>(() => generateLldTimeline(parkingLotDemoConfig));
  const [errors, setErrors] = useState<string[]>([]);
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);
  const [isExporting, setIsExporting] = useState(false);
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
      const nextScenes = generateLldTimeline(parsed);
      const validationErrors = validateLldConfig(parsed, nextScenes);
      setErrors(validationErrors);
      if (validationErrors.length === 0) {
        setConfig(parsed);
        setScenes(nextScenes);
        playback.restart();
      }
      return { parsed, nextScenes, validationErrors };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON.";
      setErrors([message]);
      return null;
    }
  }

  function loadDemo(nextDemo: LldVideoConfig = config) {
    const demo = JSON.stringify(nextDemo, null, 2);
    setJsonText(demo);
    setConfig(nextDemo);
    setScenes(generateLldTimeline(nextDemo));
    setErrors([]);
    setExportStatus(null);
  }

  function updateConfigPatch(patch: Partial<LldVideoConfig["settings"]>) {
    const nextConfig = { ...config, settings: { ...config.settings, ...patch } };
    setConfig(nextConfig);
    setJsonText(JSON.stringify(nextConfig, null, 2));
    const nextScenes = generateLldTimeline(nextConfig);
    setScenes(nextScenes);
    setErrors(validateLldConfig(nextConfig, nextScenes));
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
      const { exportId } = await createExport(parsed.parsed, parsed.nextScenes);
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

            {exportStatus && (
              <div className={`export-status ${exportStatus.state}`}>
                <strong>{exportStatus.message}</strong>
                <progress value={exportStatus.progress} max={100} />
                {exportStatus.downloadUrl && <a href={exportStatus.downloadUrl}>Download output.mp4</a>}
                {exportStatus.error && <p>{exportStatus.error}</p>}
              </div>
            )}
          </section>
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
