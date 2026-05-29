import { useEffect, useState } from "react";
import { usePlayback } from "../engine/playbackEngine";
import type { LldScene } from "../engine/sceneTypes";
import { fetchProject } from "../export/exportApi";
import type { LldVideoConfig } from "../topics/topicTypes";
import { VideoPreview } from "../components/VideoPreview";

export function ExportPage() {
  const exportId = window.location.pathname.split("/").filter(Boolean)[1];
  const [config, setConfig] = useState<LldVideoConfig | null>(null);
  const [scenes, setScenes] = useState<LldScene[]>([]);
  const [error, setError] = useState<string | null>(null);

  const playback = usePlayback(scenes, scenes.length > 0, () => {
    window.setTimeout(() => {
      (window as Window & { __LLD_EXPORT_DONE__?: boolean }).__LLD_EXPORT_DONE__ = true;
    }, 200);
  });

  useEffect(() => {
    (window as Window & { __LLD_EXPORT_DONE__?: boolean }).__LLD_EXPORT_DONE__ = false;
    fetchProject(exportId)
      .then((project) => {
        setConfig(project.config);
        setScenes(project.scenes);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "Unable to load export project.");
      });
  }, [exportId]);

  if (error) return <div className="export-page-state">{error}</div>;
  if (!config || !scenes.length) return <div className="export-page-state">Loading export...</div>;

  return (
    <main className="export-page">
      <VideoPreview
        scene={scenes[playback.state.currentSceneIndex]}
        orientation={config.settings.orientation}
        progress={playback.state.progress}
      />
    </main>
  );
}
